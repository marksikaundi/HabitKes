/** Local week strip (Sun → Sat) containing each calendar day for the week that includes `reference`. */

export type WeekDaySlot = {
  /** Short label e.g. Sun, Mon */
  weekdayShort: string;
  /** Calendar date 1–31 */
  dayOfMonth: number;
  /** Start of that calendar day (local), noon used to reduce DST edge cases */
  date: Date;
};

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function getWeekContaining(reference: Date): WeekDaySlot[] {
  const ref = new Date(reference);
  ref.setHours(12, 0, 0, 0);

  const sunday = new Date(ref);
  sunday.setDate(ref.getDate() - ref.getDay());
  sunday.setHours(12, 0, 0, 0);

  const days: WeekDaySlot[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    days.push({
      weekdayShort: WEEKDAY_LABELS[d.getDay()],
      dayOfMonth: d.getDate(),
      date: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
    });
  }

  return days;
}
