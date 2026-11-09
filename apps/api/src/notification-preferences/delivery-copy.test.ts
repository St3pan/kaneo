import { describe, expect, it } from "vite-plus/test";
import { getDeliveryCopy, localizeColumnName } from "./delivery-copy";

describe("getDeliveryCopy", () => {
  it("keeps English for unknown or missing locales", () => {
    expect(getDeliveryCopy(null).taskOverdue("Launch").title).toBe(
      "Task overdue",
    );
    expect(getDeliveryCopy("fr-FR").inDays(2)).toBe("in 2 days");
  });

  it("uses Ukrainian plural forms for reminder lead times", () => {
    const copy = getDeliveryCopy("uk-UA");
    expect(copy.inDays(1)).toBe("через 1 день");
    expect(copy.inDays(3)).toBe("через 3 дні");
    expect(copy.inDays(5)).toBe("через 5 днів");
    expect(copy.inDays(21)).toBe("через 21 день");
    expect(copy.inHours(2)).toBe("через 2 години");
    expect(copy.inMinutes(11)).toBe("через 11 хвилин");
  });

  it("translates default status slugs in Ukrainian status changes", () => {
    expect(
      getDeliveryCopy("uk").taskStatusChanged("Звіт", "to-do", "in-review")
        .body,
    ).toBe(
      "Статус завдання «Звіт» змінено з «До виконання» на «На перевірці».",
    );
  });

  it("names people without gendered verbs", () => {
    const copy = getDeliveryCopy("uk-UA");
    expect(copy.taskComment("Звіт", "Олена").title).toBe(
      "Олена: коментар до вашого завдання",
    );
    expect(copy.taskMention("Звіт", "Олена").title).toBe(
      "Олена: згадка про вас",
    );
  });
});

describe("localizeColumnName", () => {
  it("translates default columns that still have their default name", () => {
    expect(localizeColumnName("in-progress", "In Progress", "uk-UA")).toBe(
      "В роботі",
    );
  });

  it("keeps renamed columns and other locales as they are", () => {
    expect(localizeColumnName("in-progress", "Розробка", "uk-UA")).toBe(
      "Розробка",
    );
    expect(localizeColumnName("in-progress", "In Progress", "en-US")).toBe(
      "In Progress",
    );
  });
});
