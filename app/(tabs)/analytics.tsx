import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useUserAnalytics, useWeeklyAnalytics } from "@/hooks/useAnalytics";
import { useColorScheme } from "@/hooks/useColorScheme";

const screenWidth = Dimensions.get("window").width;

export default function AnalyticsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "all"
  >("week");

  const userAnalytics = useUserAnalytics();
  const weeklyAnalytics = useWeeklyAnalytics();

  const chartConfig = {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) =>
      `rgba(${colors.tint === "#007AFF" ? "0, 122, 255" : "255, 107, 107"}, ${opacity})`,
    labelColor: (opacity = 1) => colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: colors.tint,
    },
  };

  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    color = colors.tint,
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: string;
    color?: string;
  }) => (
    <ThemedView style={[styles.statCard, { backgroundColor: colors.card }]}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: color + "20" }]}>
          <IconSymbol name={icon as any} size={20} color={color} />
        </View>
        <ThemedText style={[styles.statValue, { color }]}>{value}</ThemedText>
      </View>
      <ThemedText style={styles.statTitle}>{title}</ThemedText>
      {subtitle && (
        <ThemedText
          style={[styles.statSubtitle, { color: colors.tabIconDefault }]}
        >
          {subtitle}
        </ThemedText>
      )}
    </ThemedView>
  );

  const getWeeklyChartData = () => {
    if (!weeklyAnalytics?.dailyStats) {
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            data: [0, 0, 0, 0, 0, 0, 0],
          },
        ],
      };
    }

    const labels = weeklyAnalytics.dailyStats.map((day, index) => {
      const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return dayNames[index] || "";
    });

    const data = weeklyAnalytics.dailyStats.map((day) => day.completionRate);

    return {
      labels,
      datasets: [
        {
          data,
        },
      ],
    };
  };

  if (!userAnalytics) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loading}>
          <ThemedText>Loading analytics...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Analytics
        </ThemedText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {["week", "month", "all"].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodOption,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
                selectedPeriod === period && [
                  styles.selectedPeriodOption,
                  {
                    backgroundColor: colors.tint + "20",
                    borderColor: colors.tint,
                  },
                ],
              ]}
              onPress={() => setSelectedPeriod(period as any)}
            >
              <ThemedText
                style={[
                  styles.periodText,
                  selectedPeriod === period && { color: colors.tint },
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Overview Stats */}
        <View style={styles.statsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Overview
          </ThemedText>

          <View style={styles.statsGrid}>
            <StatCard
              title="Total Habits"
              value={userAnalytics.totalHabits}
              icon="list.bullet"
            />
            <StatCard
              title="Completions"
              value={userAnalytics.totalCompletions}
              icon="checkmark.circle.fill"
              color="#4ECDC4"
            />
            <StatCard
              title="Perfect Days"
              value={userAnalytics.perfectDays}
              subtitle="100% completion"
              icon="star.fill"
              color="#FECA57"
            />
            <StatCard
              title="Longest Streak"
              value={`${userAnalytics.longestOverallStreak} days`}
              icon="flame.fill"
              color="#FF6B6B"
            />
          </View>
        </View>

        {/* Weekly Progress Chart */}
        {selectedPeriod === "week" && weeklyAnalytics && (
          <View style={styles.chartSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              This Week&apos;s Progress
            </ThemedText>

            <ThemedView
              style={[styles.chartContainer, { backgroundColor: colors.card }]}
            >
              <View style={styles.chartHeader}>
                <ThemedText style={styles.chartTitle}>
                  Completion Rate by Day
                </ThemedText>
                <ThemedText
                  style={[
                    styles.chartSubtitle,
                    { color: colors.tabIconDefault },
                  ]}
                >
                  {weeklyAnalytics.overallCompletionRate}% overall
                </ThemedText>
              </View>

              <BarChart
                data={getWeeklyChartData()}
                width={screenWidth - 40}
                height={220}
                yAxisLabel=""
                yAxisSuffix="%"
                chartConfig={chartConfig}
                style={styles.chart}
                fromZero
              />
            </ThemedView>
          </View>
        )}

        {/* Top Habits */}
        <View style={styles.topHabitsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Your Habits
          </ThemedText>

          {userAnalytics.habitsAnalytics.length === 0 ? (
            <ThemedView
              style={[styles.emptyState, { backgroundColor: colors.card }]}
            >
              <IconSymbol
                name="chart.bar"
                size={48}
                color={colors.tabIconDefault}
              />
              <ThemedText
                style={[
                  styles.emptyStateText,
                  { color: colors.tabIconDefault },
                ]}
              >
                No habit data yet
              </ThemedText>
              <ThemedText
                style={[
                  styles.emptyStateSubtext,
                  { color: colors.tabIconDefault },
                ]}
              >
                Complete some habits to see analytics
              </ThemedText>
            </ThemedView>
          ) : (
            userAnalytics.habitsAnalytics
              .sort((a, b) => b.completions - a.completions)
              .map((habit, index) => (
                <ThemedView
                  key={habit.habitId}
                  style={[
                    styles.habitAnalyticCard,
                    { backgroundColor: colors.card },
                  ]}
                >
                  <View style={styles.habitAnalyticHeader}>
                    <View style={styles.habitAnalyticInfo}>
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.habitAnalyticName}
                      >
                        #{index + 1} {habit.habitName}
                      </ThemedText>
                      <ThemedText
                        style={[
                          styles.habitAnalyticStats,
                          { color: colors.tabIconDefault },
                        ]}
                      >
                        {habit.completions} completions • {habit.currentStreak}{" "}
                        day streak
                      </ThemedText>
                    </View>
                    <View style={styles.habitAnalyticBadge}>
                      <ThemedText
                        style={[
                          styles.habitAnalyticBadgeText,
                          { color: colors.tint },
                        ]}
                      >
                        🔥 {habit.longestStreak}
                      </ThemedText>
                    </View>
                  </View>
                </ThemedView>
              ))
          )}
        </View>

        {/* Most Consistent Habit */}
        {userAnalytics.mostConsistentHabit && (
          <View style={styles.achievementSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Achievement
            </ThemedText>

            <ThemedView
              style={[styles.achievementCard, { backgroundColor: colors.card }]}
            >
              <View style={styles.achievementHeader}>
                <View
                  style={[
                    styles.achievementIcon,
                    { backgroundColor: "#FECA57" + "20" },
                  ]}
                >
                  <IconSymbol name="trophy.fill" size={24} color="#FECA57" />
                </View>
                <View style={styles.achievementInfo}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.achievementTitle}
                  >
                    Most Consistent Habit
                  </ThemedText>
                  <ThemedText style={styles.achievementHabitName}>
                    {userAnalytics.mostConsistentHabit.habit.name}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.achievementStats,
                      { color: colors.tabIconDefault },
                    ]}
                  >
                    {Math.round(userAnalytics.mostConsistentHabit.consistency)}%
                    consistency
                  </ThemedText>
                </View>
              </View>
            </ThemedView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  periodSelector: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 8,
  },
  periodOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  selectedPeriodOption: {
    borderWidth: 2,
  },
  periodText: {
    fontSize: 14,
    fontWeight: "500",
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "47%",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  statSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  chartSection: {
    marginBottom: 24,
  },
  chartContainer: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  chartSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  chart: {
    borderRadius: 16,
  },
  topHabitsSection: {
    marginBottom: 24,
  },
  emptyState: {
    padding: 40,
    borderRadius: 16,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  habitAnalyticCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  habitAnalyticHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  habitAnalyticInfo: {
    flex: 1,
  },
  habitAnalyticName: {
    fontSize: 16,
  },
  habitAnalyticStats: {
    fontSize: 14,
    marginTop: 4,
  },
  habitAnalyticBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },
  habitAnalyticBadgeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  achievementSection: {
    marginBottom: 24,
  },
  achievementCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  achievementHabitName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  achievementStats: {
    fontSize: 14,
  },
});
