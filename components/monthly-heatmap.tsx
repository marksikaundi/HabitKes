import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  BACKGROUND_PAGE,
  BORDER_SUBTLE,
  Fonts,
  SURFACE_MUTED,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from "@/constants/theme";
import { buildMonthlyHeatmap, type MonthHeatmapCell } from "@/lib/daily-checkin-history";

const WEEK = ["S", "M", "T", "W", "T", "F", "S"];
const LEVEL_COLORS = ["#E5E7EB", "#D9F99D", "#BEF264", "#84CC16", "#65A30D"];

export function MonthlyHeatmap() {
  const [month, setMonth] = useState(() => new Date());
  const [cells, setCells] = useState<MonthHeatmapCell[]>([]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const next = await buildMonthlyHeatmap(month);
      if (!cancelled) setCells(next);
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [month]);

  const monthLabel = month.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const strongestDay = useMemo(() => {
    const data = cells.filter((c) => c.inMonth && c.level > 0);
    if (data.length === 0) return null;
    return data.reduce((max, c) => (c.completed > max.completed ? c : max));
  }, [cells]);

  const shiftMonth = (delta: number) => {
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  };

  return (
    <View style={styles.shell}>
      <View style={styles.header}>
        <Text style={styles.title}>Consistency heatmap</Text>
        <View style={styles.navRow}>
          <Pressable onPress={() => shiftMonth(-1)} style={styles.navBtn}>
            <Text style={styles.navBtnText}>‹</Text>
          </Pressable>
          <Text style={styles.month}>{monthLabel}</Text>
          <Pressable onPress={() => shiftMonth(1)} style={styles.navBtn}>
            <Text style={styles.navBtnText}>›</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.weekHeader}>
        {WEEK.map((d, idx) => (
          <Text key={`${d}-${idx}`} style={styles.weekLabel}>
            {d}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((cell) => (
          <View
            key={cell.id}
            style={[
              styles.box,
              {
                backgroundColor: cell.inMonth ? LEVEL_COLORS[cell.level] : "transparent",
                borderColor: cell.isToday ? TEXT_PRIMARY : BORDER_SUBTLE,
                borderWidth: cell.isToday ? 1.5 : 1,
                opacity: cell.inMonth ? 1 : 0.2,
              },
            ]}
          />
        ))}
      </View>
      <Text style={styles.caption}>
        {strongestDay
          ? `Strongest day: ${strongestDay.date?.toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })} (${strongestDay.completed}/${strongestDay.total})`
          : "Complete habits to start your monthly pattern."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: SURFACE_MUTED,
    borderRadius: 24,
    padding: 16,
    gap: 10,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 17,
    color: TEXT_PRIMARY,
    fontFamily: Fonts.semibold,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BACKGROUND_PAGE,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
  },
  navBtnText: {
    color: TEXT_PRIMARY,
    fontSize: 18,
    fontFamily: Fonts.bold,
  },
  month: {
    color: TEXT_PRIMARY,
    fontSize: 14,
    fontFamily: Fonts.semibold,
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  weekLabel: {
    width: 20,
    textAlign: "center",
    color: TEXT_SECONDARY,
    fontSize: 10,
    fontFamily: Fonts.medium,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  caption: {
    color: TEXT_SECONDARY,
    fontSize: 12,
    fontFamily: Fonts.medium,
    lineHeight: 17,
  },
});
