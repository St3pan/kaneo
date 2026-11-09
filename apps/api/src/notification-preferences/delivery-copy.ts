export type DeliveryContent = {
  title: string;
  body: string;
};

type Text = string | null;

export type DeliveryCopy = {
  soon: string;
  inDays: (days: number) => string;
  inHours: (hours: number) => string;
  inMinutes: (minutes: number) => string;
  taskCreated: (taskTitle: Text) => DeliveryContent;
  workspaceCreated: (workspaceName: Text) => DeliveryContent;
  taskStatusChanged: (
    taskTitle: Text,
    oldStatus: Text,
    newStatus: Text,
  ) => DeliveryContent;
  taskAssigneeChanged: (taskTitle: Text) => DeliveryContent;
  timeEntryCreated: (taskTitle: Text) => DeliveryContent;
  dueDateReminder: (taskTitle: Text, leadTime: string) => DeliveryContent;
  taskOverdue: (taskTitle: Text) => DeliveryContent;
  taskMention: (taskTitle: Text, mentionerName: Text) => DeliveryContent;
  taskComment: (taskTitle: Text, commenterName: Text) => DeliveryContent;
  fallbackTitle: string;
  fallbackBody: string;
};

type DeliveryLocale = "en" | "uk";

const defaultColumnNames: Record<string, string> = {
  "to-do": "To Do",
  "in-progress": "In Progress",
  "in-review": "In Review",
  done: "Done",
};

const ukStatusNames: Record<string, string> = {
  "to-do": "До виконання",
  "in-progress": "В роботі",
  "in-review": "На перевірці",
  done: "Готово",
  archived: "Архівовано",
  planned: "Заплановано",
};

const ukPluralRules = new Intl.PluralRules("uk");

function ukForm(count: number, one: string, few: string, many: string) {
  const rule = ukPluralRules.select(count);
  if (rule === "one") return one;
  if (rule === "few") return few;
  return many;
}

function ukStatus(slug: string) {
  return ukStatusNames[slug] ?? slug;
}

const en: DeliveryCopy = {
  soon: "soon",
  inDays: (days) => `in ${days} ${days === 1 ? "day" : "days"}`,
  inHours: (hours) => `in ${hours} ${hours === 1 ? "hour" : "hours"}`,
  inMinutes: (minutes) => `in ${minutes} minutes`,
  taskCreated: (taskTitle) => ({
    title: "New task created",
    body: taskTitle
      ? `A new task was created: ${taskTitle}`
      : "A new task was created in Kaneo.",
  }),
  workspaceCreated: (workspaceName) => ({
    title: "Workspace created",
    body: workspaceName
      ? `Workspace created: ${workspaceName}`
      : "A new workspace was created in Kaneo.",
  }),
  taskStatusChanged: (taskTitle, oldStatus, newStatus) => ({
    title: "Task status changed",
    body:
      taskTitle && oldStatus && newStatus
        ? `${taskTitle} moved from ${oldStatus} to ${newStatus}.`
        : "A task status changed in Kaneo.",
  }),
  taskAssigneeChanged: (taskTitle) => ({
    title: "Task assigned to you",
    body: taskTitle
      ? `You were assigned to ${taskTitle}.`
      : "A task was assigned to you in Kaneo.",
  }),
  timeEntryCreated: (taskTitle) => ({
    title: "Time entry created",
    body: taskTitle
      ? `A time entry was created for ${taskTitle}.`
      : "A time entry was created in Kaneo.",
  }),
  dueDateReminder: (taskTitle, leadTime) => ({
    title: "Task due soon",
    body: taskTitle
      ? `"${taskTitle}" is due ${leadTime}.`
      : `A task is due ${leadTime}.`,
  }),
  taskOverdue: (taskTitle) => ({
    title: "Task overdue",
    body: taskTitle
      ? `"${taskTitle}" is past its due date.`
      : "A task is past its due date.",
  }),
  taskMention: (taskTitle, mentionerName) => ({
    title: mentionerName
      ? `${mentionerName} mentioned you`
      : "You were mentioned",
    body: taskTitle
      ? `You were mentioned in ${taskTitle}.`
      : "You were mentioned in a Kaneo task.",
  }),
  taskComment: (taskTitle, commenterName) => ({
    title: commenterName
      ? `${commenterName} commented on your task`
      : "New task comment",
    body: taskTitle
      ? `A new comment was added to ${taskTitle}.`
      : "A new comment was added to a Kaneo task.",
  }),
  fallbackTitle: "New Kaneo notification",
  fallbackBody: "You have a new notification in Kaneo.",
};

const uk: DeliveryCopy = {
  soon: "незабаром",
  inDays: (days) => `через ${days} ${ukForm(days, "день", "дні", "днів")}`,
  inHours: (hours) =>
    `через ${hours} ${ukForm(hours, "годину", "години", "годин")}`,
  inMinutes: (minutes) =>
    `через ${minutes} ${ukForm(minutes, "хвилину", "хвилини", "хвилин")}`,
  taskCreated: (taskTitle) => ({
    title: "Створено нове завдання",
    body: taskTitle
      ? `Створено нове завдання «${taskTitle}».`
      : "У Kaneo створено нове завдання.",
  }),
  workspaceCreated: (workspaceName) => ({
    title: "Робочий простір створено",
    body: workspaceName
      ? `Створено робочий простір «${workspaceName}».`
      : "У Kaneo створено новий робочий простір.",
  }),
  taskStatusChanged: (taskTitle, oldStatus, newStatus) => ({
    title: "Статус завдання змінено",
    body:
      taskTitle && oldStatus && newStatus
        ? `Статус завдання «${taskTitle}» змінено з «${ukStatus(oldStatus)}» на «${ukStatus(newStatus)}».`
        : "У Kaneo змінено статус завдання.",
  }),
  taskAssigneeChanged: (taskTitle) => ({
    title: "Завдання призначено вам",
    body: taskTitle
      ? `Вас призначено на завдання «${taskTitle}».`
      : "У Kaneo вам призначено завдання.",
  }),
  timeEntryCreated: (taskTitle) => ({
    title: "Додано запис часу",
    body: taskTitle
      ? `До завдання «${taskTitle}» додано запис часу.`
      : "У Kaneo додано запис часу.",
  }),
  dueDateReminder: (taskTitle, leadTime) => ({
    title: "Наближається термін завдання",
    body: taskTitle
      ? `Термін виконання завдання «${taskTitle}» спливає ${leadTime}.`
      : `Термін виконання завдання спливає ${leadTime}.`,
  }),
  taskOverdue: (taskTitle) => ({
    title: "Завдання прострочено",
    body: taskTitle
      ? `Термін виконання завдання «${taskTitle}» минув.`
      : "Термін виконання завдання минув.",
  }),
  taskMention: (taskTitle, mentionerName) => ({
    title: mentionerName ? `${mentionerName}: згадка про вас` : "Вас згадали",
    body: taskTitle
      ? `Вас згадали в завданні «${taskTitle}».`
      : "Вас згадали в завданні Kaneo.",
  }),
  taskComment: (taskTitle, commenterName) => ({
    title: commenterName
      ? `${commenterName}: коментар до вашого завдання`
      : "Новий коментар до завдання",
    body: taskTitle
      ? `До завдання «${taskTitle}» додано новий коментар.`
      : "До завдання в Kaneo додано новий коментар.",
  }),
  fallbackTitle: "Нове сповіщення Kaneo",
  fallbackBody: "У вас нове сповіщення в Kaneo.",
};

const copies: Record<DeliveryLocale, DeliveryCopy> = { en, uk };

function getDeliveryLocale(locale?: string | null): DeliveryLocale {
  return locale?.toLowerCase().startsWith("uk") ? "uk" : "en";
}

export function getDeliveryCopy(locale?: string | null): DeliveryCopy {
  return copies[getDeliveryLocale(locale)];
}

export function localizeColumnName(
  slug: string,
  name: string,
  locale?: string | null,
) {
  if (getDeliveryLocale(locale) !== "uk") return name;
  if (defaultColumnNames[slug] !== name) return name;
  return ukStatus(slug);
}
