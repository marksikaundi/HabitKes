/** Calendar helpers — real local dates for any month. */

export type CalendarDaySlot = {
  weekdayShort: string;
  dayOfMonth: number;
  /** Calendar day at local midnight */
  date: Date;
};

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Every day in `reference`'s month (1 … last day), with correct weekday labels. */
export function getDaysInMonth(reference: Date): CalendarDaySlot[] {
  const y = reference.getFullYear();
  const m = reference.getMonth();
  const lastDay = new Date(y, m + 1, 0).getDate();
  const days: CalendarDaySlot[] = [];

  for (let d = 1; d <= lastDay; d++) {
    const date = new Date(y, m, d);
    days.push({
      weekdayShort: WEEKDAY_LABELS[date.getDay()],
      dayOfMonth: d,
      date: new Date(y, m, d),
    });
  }

  return days;
}

/** First day of the month containing `reference`. */
export function startOfMonth(reference: Date): Date {
  return new Date(reference.getFullYear(), reference.getMonth(), 1);
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatMonthYear(reference: Date, locale?: string): string {
  return reference.toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });
}
