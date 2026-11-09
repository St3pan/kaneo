import { createHmac } from "node:crypto";
import { sendNotificationEmail } from "@kaneo/email";
import { and, eq } from "drizzle-orm";
import db from "../database";
import {
  notificationTable,
  projectTable,
  taskTable,
  userNotificationPreferenceTable,
  userNotificationWorkspaceRuleTable,
  userTable,
  workspaceTable,
} from "../database/schema";
import { canReceiveResourceNotification } from "../notification/resource-access";
import {
  safeOutboundError,
  sendOutboundRequest,
} from "../utils/outbound-request";
import { withDefaultLocale } from "../utils/default-locale";
import {
  type DeliveryContent,
  type DeliveryCopy,
  getDeliveryCopy,
} from "./delivery-copy";
import { resolveEmailTask } from "./resolve-email-task";
import { decryptSecret } from "./secrets";

type ResolvedNotificationContext = {
  workspaceId: string;
  workspaceName: string;
  projectId: string | null;
  projectName: string | null;
  taskId: string | null;
  taskTitle: string | null;
  taskUrl: string | null;
};

function getClientUrl() {
  return process.env.KANEO_CLIENT_URL || "http://localhost:5173";
}

function buildTaskUrl(workspaceId: string, projectId: string, taskId: string) {
  return `${getClientUrl()}/dashboard/workspace/${workspaceId}/project/${projectId}/task/${taskId}`;
}

function getStringValue(
  data: Record<string, unknown> | null | undefined,
  key: string,
) {
  const value = data?.[key];
  return typeof value === "string" ? value : null;
}

function getNumberValue(
  data: Record<string, unknown> | null | undefined,
  key: string,
) {
  const value = data?.[key];
  return typeof value === "number" ? value : null;
}

function formatLeadTime(copy: DeliveryCopy, minutes: number | null) {
  if (!minutes) return copy.soon;
  if (minutes % 1440 === 0) return copy.inDays(minutes / 1440);
  if (minutes % 60 === 0) return copy.inHours(minutes / 60);
  return copy.inMinutes(minutes);
}

function buildDeliveryContent(
  notification: {
    type: string;
    content: string | null;
    title: string | null;
    eventData: Record<string, unknown> | null;
  },
  locale?: string | null,
): DeliveryContent {
  if (notification.title && notification.content) {
    return {
      title: notification.title,
      body: notification.content,
    };
  }

  const copy = getDeliveryCopy(locale);
  const data = notification.eventData;
  const taskTitle = getStringValue(data, "taskTitle");

  switch (notification.type) {
    case "task_created":
      return copy.taskCreated(taskTitle);
    case "workspace_created":
      return copy.workspaceCreated(getStringValue(data, "workspaceName"));
    case "task_status_changed":
      return copy.taskStatusChanged(
        taskTitle,
        getStringValue(data, "oldStatus"),
        getStringValue(data, "newStatus"),
      );
    case "task_assignee_changed":
      return copy.taskAssigneeChanged(taskTitle);
    case "time_entry_created":
      return copy.timeEntryCreated(taskTitle);
    case "due_date_reminder":
      return copy.dueDateReminder(
        taskTitle,
        formatLeadTime(copy, getNumberValue(data, "leadTimeMinutes")),
      );
    case "task_overdue":
      return copy.taskOverdue(taskTitle);
    case "task_mention":
      return copy.taskMention(taskTitle, getStringValue(data, "mentionerName"));
    case "task_comment":
      return copy.taskComment(taskTitle, getStringValue(data, "commenterName"));
    default:
      return {
        title: notification.title ?? copy.fallbackTitle,
        body: notification.content ?? copy.fallbackBody,
      };
  }
}

async function resolveNotificationContext(notification: {
  resourceType: string | null;
  resourceId: string | null;
}): Promise<ResolvedNotificationContext | null> {
  if (!notification.resourceType || !notification.resourceId) {
    return null;
  }

  if (notification.resourceType === "task") {
    const [task] = await db
      .select({
        taskId: taskTable.id,
        taskTitle: taskTable.title,
        projectId: projectTable.id,
        projectName: projectTable.name,
        workspaceId: workspaceTable.id,
        workspaceName: workspaceTable.name,
      })
      .from(taskTable)
      .innerJoin(projectTable, eq(taskTable.projectId, projectTable.id))
      .innerJoin(
        workspaceTable,
        eq(projectTable.workspaceId, workspaceTable.id),
      )
      .where(eq(taskTable.id, notification.resourceId))
      .limit(1);

    if (!task) {
      return null;
    }

    return {
      workspaceId: task.workspaceId,
      workspaceName: task.workspaceName,
      projectId: task.projectId,
      projectName: task.projectName,
      taskId: task.taskId,
      taskTitle: task.taskTitle,
      taskUrl: buildTaskUrl(task.workspaceId, task.projectId, task.taskId),
    };
  }

  if (notification.resourceType === "workspace") {
    const [workspace] = await db
      .select({
        workspaceId: workspaceTable.id,
        workspaceName: workspaceTable.name,
      })
      .from(workspaceTable)
      .where(eq(workspaceTable.id, notification.resourceId))
      .limit(1);

    if (!workspace) {
      return null;
    }

    return {
      workspaceId: workspace.workspaceId,
      workspaceName: workspace.workspaceName,
      projectId: null,
      projectName: null,
      taskId: null,
      taskTitle: null,
      taskUrl: null,
    };
  }

  return null;
}

async function sendNtfyNotification(input: {
  serverUrl: string;
  topic: string;
  token?: string | null;
  title: string;
  body: string;
  clickUrl?: string | null;
}) {
  await sendOutboundRequest(
    `${input.serverUrl.replace(/\/+$/, "")}/${encodeURIComponent(input.topic)}`,
    {
      headers: {
        ...(input.token ? { Authorization: `Bearer ${input.token}` } : {}),
        ...(input.clickUrl ? { Click: input.clickUrl } : {}),
        // fetch rejects header values outside Latin-1, so send non-ASCII titles RFC 2047 encoded; ntfy decodes them.
        Title: /^[\x20-\x7e]*$/.test(input.title)
          ? input.title
          : `=?UTF-8?B?${Buffer.from(input.title).toString("base64")}?=`,
      },
      body: input.body,
    },
    { publicDestination: true, timeoutMs: 15_000 },
  );
}

async function sendGotifyNotification(input: {
  serverUrl: string;
  token: string;
  title: string;
  body: string;
  clickUrl?: string | null;
}) {
  // Gotify expects the app token in the query string; that can surface in logs, proxies, and browser history, so factor this into Gotify placement and log handling.
  await sendOutboundRequest(
    `${input.serverUrl.replace(/\/+$/, "")}/message?token=${encodeURIComponent(
      input.token,
    )}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: input.title,
        message: input.body,
        priority: 5,
        extras: input.clickUrl
          ? {
              "client::notification": {
                click: {
                  url: input.clickUrl,
                },
              },
              "client::display": {
                contentType: "text/plain",
              },
            }
          : undefined,
      }),
    },
    { publicDestination: true, timeoutMs: 15_000 },
  );
}

async function sendWebhookNotification(input: {
  webhookUrl: string;
  secret?: string | null;
  payload: Record<string, unknown>;
}) {
  const body = JSON.stringify(input.payload);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (input.secret) {
    headers["X-Kaneo-Signature"] = createHmac("sha256", input.secret)
      .update(body)
      .digest("hex");
  }

  await sendOutboundRequest(
    input.webhookUrl,
    { headers, body },
    { publicDestination: true, timeoutMs: 15_000 },
  );
}

export async function deliverNotification(
  notificationId: string,
): Promise<void> {
  const notification = await db.query.notificationTable.findFirst({
    where: eq(notificationTable.id, notificationId),
  });

  if (
    !notification ||
    !(await canReceiveResourceNotification(
      notification.userId,
      notification.resourceId,
      notification.resourceType,
    ))
  ) {
    return;
  }

  const context = await resolveNotificationContext(notification);
  if (!context) {
    console.info("Notification delivery skipped: unresolved context", {
      notificationId,
      notificationTableId: notification.id,
      resourceType: notification.resourceType,
      resourceId: notification.resourceId,
      reason:
        "resolveNotificationContext returned null (missing resource, deleted task, or unsupported resource type)",
    });
    return;
  }

  const [user] = await db
    .select({
      email: userTable.email,
      name: userTable.name,
      locale: userTable.locale,
    })
    .from(userTable)
    .where(eq(userTable.id, notification.userId))
    .limit(1);

  if (!user) {
    return;
  }

  const preference = await db.query.userNotificationPreferenceTable.findFirst({
    where: eq(userNotificationPreferenceTable.userId, notification.userId),
  });

  if (!preference) {
    return;
  }

  const decryptedPreference = {
    ...preference,
    ntfyToken: decryptSecret(preference.ntfyToken),
    gotifyToken: decryptSecret(preference.gotifyToken),
    webhookSecret: decryptSecret(preference.webhookSecret),
  };

  const rule = await db.query.userNotificationWorkspaceRuleTable.findFirst({
    where: and(
      eq(userNotificationWorkspaceRuleTable.userId, notification.userId),
      eq(userNotificationWorkspaceRuleTable.workspaceId, context.workspaceId),
    ),
    with: {
      selectedProjects: true,
    },
  });

  if (!rule?.isActive) {
    return;
  }

  if (
    rule.projectMode === "selected" &&
    (!context.projectId ||
      !rule.selectedProjects.some(
        (project) => project.projectId === context.projectId,
      ))
  ) {
    return;
  }

  const deliverySource = {
    type: notification.type,
    title: notification.title ?? null,
    content: notification.content ?? null,
    eventData:
      notification.eventData && typeof notification.eventData === "object"
        ? (notification.eventData as Record<string, unknown>)
        : null,
  };
  const content = buildDeliveryContent(deliverySource);

  const webhookPayload = {
    notification: {
      id: notification.id,
      type: notification.type,
      title: content.title,
      content: content.body,
      createdAt: notification.createdAt,
      eventData: notification.eventData,
      resourceId: notification.resourceId,
      resourceType: notification.resourceType,
    },
    workspace: {
      id: context.workspaceId,
      name: context.workspaceName,
    },
    project: context.projectId
      ? {
          id: context.projectId,
          name: context.projectName,
        }
      : null,
    task: context.taskId
      ? {
          id: context.taskId,
          title: context.taskTitle,
          url: context.taskUrl,
        }
      : null,
    user: {
      id: notification.userId,
      email: user.email,
      name: user.name,
    },
  };

  const deliveries: Array<Promise<void>> = [];

  if (decryptedPreference.emailEnabled && rule.emailEnabled && user.email) {
    const recipient = user.email;
    const emailLocale = withDefaultLocale(user.locale);
    const emailContent = buildDeliveryContent(deliverySource, emailLocale);
    deliveries.push(
      (async () => {
        const task = context.taskId
          ? await resolveEmailTask(context.taskId, emailLocale)
          : undefined;
        await sendNotificationEmail(recipient, emailContent.title, {
          title: emailContent.title,
          message: emailContent.body,
          actionUrl: context.taskUrl,
          locale: emailLocale,
          breadcrumb: context.projectName
            ? `${context.workspaceName} / ${context.projectName}`
            : context.workspaceName,
          task,
          settingsUrl: `${getClientUrl()}/dashboard/settings/account/notifications`,
        });
      })(),
    );
  }

  if (
    decryptedPreference.ntfyEnabled &&
    decryptedPreference.ntfyServerUrl &&
    decryptedPreference.ntfyTopic &&
    rule.ntfyEnabled
  ) {
    deliveries.push(
      sendNtfyNotification({
        serverUrl: decryptedPreference.ntfyServerUrl,
        topic: decryptedPreference.ntfyTopic,
        token: decryptedPreference.ntfyToken,
        title: content.title,
        body: content.body,
        clickUrl: context.taskUrl,
      }),
    );
  }

  if (
    decryptedPreference.gotifyEnabled &&
    decryptedPreference.gotifyServerUrl &&
    decryptedPreference.gotifyToken &&
    rule.gotifyEnabled
  ) {
    deliveries.push(
      sendGotifyNotification({
        serverUrl: decryptedPreference.gotifyServerUrl,
        token: decryptedPreference.gotifyToken,
        title: content.title,
        body: content.body,
        clickUrl: context.taskUrl,
      }),
    );
  }

  if (
    decryptedPreference.webhookEnabled &&
    decryptedPreference.webhookUrl &&
    rule.webhookEnabled
  ) {
    deliveries.push(
      sendWebhookNotification({
        webhookUrl: decryptedPreference.webhookUrl,
        secret: decryptedPreference.webhookSecret,
        payload: webhookPayload,
      }),
    );
  }

  const results = await Promise.allSettled(deliveries);
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Notification delivery failed", {
        notificationId,
        error: safeOutboundError(result.reason),
      });
    }
  }
}
