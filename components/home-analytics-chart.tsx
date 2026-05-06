import { useMemo } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Svg, { Circle, Line, Rect } from "react-native-svg";

import {
  ACCENT_LIME,
  BORDER_SUBTLE,
  Fonts,
  SURFACE_MUTED,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from "@/constants/theme";
import type { CheckInChartDay } from "@/lib/daily-checkin-history";
import type { Habit } from "@/lib/accountability-board";

const BAR_CHART_HEIGHT = 112;
const LINE_CHART_HEIGHT = 118;
const Y_AXIS_W = 30;
const PAD = { top: 6, right: 8, bottom: 4 };
const GRID_PCTS = [100, 66, 33, 0];
const LINE_PAD_X = 10;
const LINE_GRID_COUNT = 3;

type Props = {
  habits: Habit[];
  weekCheckInSeries: CheckInChartDay[];
  weekCheckInSeriesLoaded: boolean;
};

function shortTitle(title: string, max = 10): string {
  const t = title.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function lineLayout(
  week: CheckInChartDay[],
  habits: Habit[],
  innerW: number,
) {
  const innerH = LINE_CHART_HEIGHT - PAD.top - PAD.bottom;
  const baselineY = PAD.top + innerH;
  const count = Math.max(week.length, 1);
  const xAt = (i: number) =>
    LINE_PAD_X +
    (Math.max(0, innerW - 2 * LINE_PAD_X) *
      (count <= 1 ? 0.5 : i / (count - 1)));

  const withData = week.filter((d) => d.hasSnapshot);
  const maxC = withData.length
    ? Math.max(...withData.map((d) => d.completed))
    : 0;
  const maxT = withData.length
    ? Math.max(...withData.map((d) => d.total))
    : 0;
  const yMax = Math.max(1, habits.length, maxC, maxT);

  const yAt = (completed: number) =>
    baselineY - (Math.min(completed, yMax) / yMax) * innerH;

  const yTicks = [0, Math.ceil(yMax / 2), yMax].filter(
    (v, i, a) => a.indexOf(v) === i,
  );

  return { innerH, xAt, yAt, yMax, yTicks };
}

export function HomeAnalyticsChart({
  habits,
  weekCheckInSeries,
  weekCheckInSeriesLoaded,
}: Props) {
  const { width: screenW } = useWindowDimensions();
  const outerW = Math.max(0, screenW - 40);

  const barLayout = useMemo(() => {
    const innerW = outerW - Y_AXIS_W - PAD.right;
    const innerH = BAR_CHART_HEIGHT - PAD.top - PAD.bottom;
    const baselineY = PAD.top + innerH;
    const n = Math.max(habits.length, 1);
    const barGap = 6;
    const slotW = (innerW - barGap * (n - 1)) / n;

    return {
      innerW,
      innerH,
      baselineY,
      slotW,
      barGap,
      series: habits.map((h) => ({
        id: h.id,
        title: h.title,
        progress: Math.min(100, Math.max(0, h.progress)),
        color: h.color,
      })),
    };
  }, [habits, outerW]);

  const lineMemo = useMemo(() => {
    const innerW = outerW - Y_AXIS_W - PAD.right;
    return lineLayout(weekCheckInSeries, habits, innerW);
  }, [weekCheckInSeries, habits, outerW]);

  if (habits.length === 0) {
    return (
      <View style={styles.shell} accessibilityRole="summary">
        <Text style={styles.title}>Calendar</Text>
        <Text style={styles.subtitle}>Habit progress</Text>
        <Text style={styles.empty}>Add habits to see your chart.</Text>
      </View>
    );
  }

  const { innerW, innerH, baselineY, slotW, barGap, series } = barLayout;
  const { xAt, yAt, yMax, yTicks, innerH: lineInnerH } = lineMemo;

  const anyWeekData = weekCheckInSeries.some((d) => d.hasSnapshot);

  return (
    <View style={styles.shell} accessibilityRole="summary">
      <View style={styles.headerBlock}>
        <Text style={styles.title}>Calendar</Text>
        <Text style={styles.subtitle}>Habit progress this period</Text>
      </View>

      <View style={styles.chartRow}>
        <View style={[styles.yAxis, { height: BAR_CHART_HEIGHT }]}>
          {GRID_PCTS.map((pct) => {
            const top = PAD.top + innerH * (1 - pct / 100) - 7;
            return (
              <Text key={pct} style={[styles.yLabel, { top }]}>
                {pct}
              </Text>
            );
          })}
        </View>

        <View>
          <Svg
            width={innerW}
            height={BAR_CHART_HEIGHT}
            accessibilityLabel="Bar chart of habit progress percentages"
          >
            {GRID_PCTS.map((pct, i) => {
              const y = PAD.top + innerH * (1 - pct / 100);
              return (
                <Line
                  key={`g-${pct}`}
                  x1={0}
                  y1={y}
                  x2={innerW}
                  y2={y}
                  stroke={BORDER_SUBTLE}
                  strokeWidth={1}
                  strokeDasharray={i === 0 ? undefined : "4 6"}
                />
              );
            })}

            {series.map((item, i) => {
              const barW = Math.max(8, slotW * 0.72);
              const x = i * (slotW + barGap) + (slotW - barW) / 2;
              const h = innerH * (item.progress / 100);
              const y = baselineY - h;
              return (
                <Rect
                  key={item.id}
                  x={x}
                  y={y}
                  width={barW}
                  height={Math.max(h, 2)}
                  rx={6}
                  ry={6}
                  fill={item.color}
                  opacity={0.92}
                />
              );
            })}
          </Svg>

          <View style={[styles.labelsRow, { width: innerW }]}>
            {series.map((item, i) => (
              <View
                key={item.id}
                style={{
                  width: slotW,
                  marginRight: i < series.length - 1 ? barGap : 0,
                }}
              >
                <Text style={styles.barCaption} numberOfLines={1}>
                  {shortTitle(item.title, 9)}
                </Text>
                <Text style={styles.pct}>{item.progress}%</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.lineHeader}>
        <Text style={styles.lineSectionTitle}>Last 7 days</Text>
        <Text style={styles.lineSectionSubtitle}>
          Habits completed per day (saved on this device)
        </Text>
      </View>

      {!weekCheckInSeriesLoaded ? (
        <Text style={styles.lineLoading}>Loading trend…</Text>
      ) : (
        <View style={styles.chartRow}>
          <View style={[styles.yAxis, { height: LINE_CHART_HEIGHT }]}>
            {yTicks
              .slice()
              .reverse()
              .map((tick) => {
                const top =
                  PAD.top + lineInnerH * (1 - tick / yMax) - 7;
                return (
                  <Text key={tick} style={[styles.yLabel, { top }]}>
                    {tick}
                  </Text>
                );
              })}
          </View>

          <View>
            <Svg
              width={innerW}
              height={LINE_CHART_HEIGHT}
              accessibilityLabel="Line chart of daily habit completions for the last week"
            >
              {Array.from({ length: LINE_GRID_COUNT + 1 }, (_, g) => {
                const frac = g / LINE_GRID_COUNT;
                const y = PAD.top + lineInnerH * (1 - frac);
                return (
                  <Line
                    key={`lg-${g}`}
                    x1={0}
                    y1={y}
                    x2={innerW}
                    y2={y}
                    stroke={BORDER_SUBTLE}
                    strokeWidth={1}
                    strokeDasharray={g === 0 ? undefined : "4 6"}
                  />
                );
              })}

              {weekCheckInSeries.map((day, i) => {
                if (i === 0) return null;
                const prev = weekCheckInSeries[i - 1];
                if (!prev?.hasSnapshot || !day.hasSnapshot) {
                  return null;
                }
                return (
                  <Line
                    key={`seg-${day.dateKey}`}
                    x1={xAt(i - 1)}
                    y1={yAt(prev.completed)}
                    x2={xAt(i)}
                    y2={yAt(day.completed)}
                    stroke={ACCENT_LIME}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                );
              })}

              {weekCheckInSeries.map((day, i) => {
                if (!day.hasSnapshot) return null;
                return (
                  <Circle
                    key={`dot-${day.dateKey}`}
                    cx={xAt(i)}
                    cy={yAt(day.completed)}
                    r={5}
                    fill={ACCENT_LIME}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                );
              })}
            </Svg>

            <View style={[styles.weekdayRow, { width: innerW }]}>
              {weekCheckInSeries.map((day) => (
                <View key={day.dateKey} style={styles.weekdayCell}>
                  <Text
                    style={[
                      styles.weekdayLabel,
                      !day.hasSnapshot && styles.weekdayMuted,
                    ]}
                  >
                    {day.weekdayShort}
                  </Text>
                </View>
              ))}
            </View>

            {!anyWeekData ? (
              <Text style={styles.lineHint}>
                Check in on habits to start your 7-day trend.
              </Text>
            ) : null}
          </View>
        </View>
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
  headerBlock: {
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
  empty: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: Fonts.sans,
    color: TEXT_SECONDARY,
    paddingHorizontal: 4,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  yAxis: {
    width: Y_AXIS_W,
    position: "relative",
    marginRight: 2,
  },
  yLabel: {
    position: "absolute",
    right: 0,
    fontSize: 10,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
    width: 26,
    textAlign: "right",
  },
  labelsRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  barCaption: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
    textAlign: "center",
  },
  pct: {
    fontSize: 12,
    fontFamily: Fonts.semibold,
    color: ACCENT_LIME,
    marginTop: 2,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: BORDER_SUBTLE,
    marginTop: 16,
    marginBottom: 12,
    marginHorizontal: 4,
  },
  lineHeader: {
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  lineSectionTitle: {
    fontSize: 15,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
    letterSpacing: -0.2,
  },
  lineSectionSubtitle: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
    marginTop: 3,
    lineHeight: 15,
  },
  lineLoading: {
    marginLeft: Y_AXIS_W + 6,
    fontSize: 13,
    fontFamily: Fonts.sans,
    color: TEXT_SECONDARY,
  },
  weekdayRow: {
    flexDirection: "row",
    marginTop: 6,
    paddingHorizontal: 2,
  },
  weekdayCell: {
    flex: 1,
    minWidth: 0,
  },
  weekdayLabel: {
    fontSize: 10,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
    textAlign: "center",
  },
  weekdayMuted: {
    color: TEXT_SECONDARY,
    fontFamily: Fonts.medium,
  },
  lineHint: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: Fonts.sans,
    color: TEXT_SECONDARY,
    paddingHorizontal: 2,
  },
});
