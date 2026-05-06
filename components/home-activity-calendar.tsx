import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  ACCENT_LIME,
  ACCENT_ON_LIME,
  BACKGROUND_PAGE,
  BORDER_SUBTLE,
  Fonts,
  SURFACE_MUTED,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from "@/constants/theme";
import type { Activity } from "@/lib/accountability-board";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type CalendarCell = {
  date: Date | null;
  key: string;
};

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function monthCells(reference: Date): CalendarCell[] {
  const year = reference.getFullYear();
  const month = reference.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const cells: CalendarCell[] = [];

  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push({ date: null, key: `pad-start-${i}` });
  }
  for (let day = 1; day <= lastDay; day += 1) {
    cells.push({ date: new Date(year, month, day), key: `day-${day}` });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ date: null, key: `pad-end-${cells.length}` });
  }
  return cells;
}

function formatMonthYear(reference: Date) {
  return reference.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

type Props = {
  activity: Activity[];
};

export function HomeActivityCalendar({ activity }: Props) {
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const cells = useMemo(() => monthCells(visibleMonth), [visibleMonth]);
  const selectedActivities = useMemo(() => {
    return activity.filter((item) => sameDay(new Date(item.createdAtISO), selectedDate));
  }, [activity, selectedDate]);

  const activityCountByDate = useMemo(() => {
    const map = new Map<string, number>();
    activity.forEach((item) => {
      const d = new Date(item.createdAtISO);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return map;
  }, [activity]);

  const shiftMonth = (delta: number) => {
    const next = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() + delta,
      1
    );
    setVisibleMonth(next);
    setSelectedDate(new Date(next.getFullYear(), next.getMonth(), 1));
  };

  return (
    <View style={styles.shell}>
      <View style={styles.monthHeader}>
        <Pressable
          onPress={() => shiftMonth(-1)}
          style={({ pressed }) => [styles.monthNavBtn, pressed && styles.monthNavBtnPressed]}
        >
          <Text style={styles.monthNavGlyph}>‹</Text>
        </Pressable>
        <Text style={styles.monthTitle}>Calendar</Text>
        <Pressable
          onPress={() => shiftMonth(1)}
          style={({ pressed }) => [styles.monthNavBtn, pressed && styles.monthNavBtnPressed]}
        >
          <Text style={styles.monthNavGlyph}>›</Text>
        </Pressable>
      </View>
      <Text style={styles.monthSubTitle}>{formatMonthYear(visibleMonth)}</Text>

      <View style={styles.weekdaysRow}>
        {WEEKDAY_LABELS.map((weekday) => (
          <Text key={weekday} style={styles.weekdayLabel}>
            {weekday}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((cell) => {
          if (!cell.date) {
            return <View key={cell.key} style={styles.emptyCell} />;
          }
          const selected = sameDay(cell.date, selectedDate);
          const key = `${cell.date.getFullYear()}-${cell.date.getMonth()}-${cell.date.getDate()}`;
          const count = activityCountByDate.get(key) ?? 0;
          return (
            <Pressable
              key={cell.key}
              onPress={() => setSelectedDate(cell.date as Date)}
              style={[styles.dayCell, selected && styles.dayCellSelected]}
            >
              <Text style={[styles.dayNumber, selected && styles.dayNumberSelected]}>
                {cell.date.getDate()}
              </Text>
              {count > 0 ? <View style={[styles.dot, selected && styles.dotSelected]} /> : null}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.selectedHeader}>
        <Text style={styles.selectedTitle}>
          Activities on{" "}
          {selectedDate.toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </Text>
      </View>

      {selectedActivities.length === 0 ? (
        <Text style={styles.emptyText}>No activities recorded for this date.</Text>
      ) : (
        selectedActivities.map((item) => (
          <View key={item.id} style={styles.activityItem}>
            <Text style={styles.activityTitle}>{item.title}</Text>
            <Text style={styles.activityDetail}>{item.detail}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: SURFACE_MUTED,
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  monthNavBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: BACKGROUND_PAGE,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
    alignItems: "center",
    justifyContent: "center",
  },
  monthNavBtnPressed: {
    opacity: 0.85,
  },
  monthNavGlyph: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginTop: -2,
  },
  monthTitle: {
    fontSize: 17,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
  },
  monthSubTitle: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
  },
  weekdaysRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  emptyCell: {
    width: "14.2857%",
    height: 44,
  },
  dayCell: {
    width: "14.2857%",
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  dayCellSelected: {
    backgroundColor: ACCENT_LIME,
  },
  dayNumber: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
  },
  dayNumberSelected: {
    color: ACCENT_ON_LIME,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ACCENT_LIME,
    marginTop: 4,
  },
  dotSelected: {
    backgroundColor: ACCENT_ON_LIME,
  },
  selectedHeader: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER_SUBTLE,
  },
  selectedTitle: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    fontFamily: Fonts.sans,
    color: TEXT_SECONDARY,
  },
  activityItem: {
    marginTop: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: BACKGROUND_PAGE,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
  },
  activityDetail: {
    marginTop: 3,
    fontSize: 12,
    fontFamily: Fonts.sans,
    color: TEXT_SECONDARY,
  },
});
