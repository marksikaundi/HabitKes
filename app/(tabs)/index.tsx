import * as Haptics from "expo-haptics";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useCompleteHabit, useTodayCompletions } from "@/hooks/useCompletions";
import { useHabits } from "@/hooks/useHabits";
import { HabitWithCompletion } from "@/types/habit";
import { formatDate, shouldHabitBeCompletedToday } from "@/utils/dateUtils";

export default function TodayScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const habits = useHabits();
  const todayCompletions = useTodayCompletions();
  const { completeHabit, uncompleteHabit } = useCompleteHabit();

  const today = formatDate(new Date());
  const todayName = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Filter habits that should be completed today
  const todayHabits = React.useMemo(() => {
    if (!habits) return [];

    return habits
      .filter((habit) => shouldHabitBeCompletedToday(habit.frequency))
      .map((habit) => {
        const isCompleted =
          todayCompletions?.some(
            (completion) => completion.habitId === habit._id
          ) || false;

        return {
          ...habit,
          isCompletedToday: isCompleted,
          streak: null, // We'll add this later with another hook if needed
        } as HabitWithCompletion;
      });
  }, [habits, todayCompletions]);

  const completedCount = todayHabits.filter((h) => h.isCompletedToday).length;
  const totalCount = todayHabits.length;
  const completionRate =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggleHabit = async (habit: HabitWithCompletion) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (habit.isCompletedToday) {
        await uncompleteHabit(habit._id, today);
      } else {
        await completeHabit(habit._id, today);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update habit completion");
    }
  };

  const getMotivationalMessage = () => {
    if (completionRate === 100) {
      return "🎉 Perfect day! You've completed all your habits!";
    } else if (completionRate >= 75) {
      return "🔥 Great job! You're almost there!";
    } else if (completionRate >= 50) {
      return "💪 Keep going! You're halfway there!";
    } else if (completionRate > 0) {
      return "🌱 Good start! Every step counts!";
    } else {
      return "☀️ Ready to build some great habits today?";
    }
  };

  if (!habits) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loading}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Today
          </ThemedText>
          <ThemedText
            type="subtitle"
            style={[styles.date, { color: colors.tabIconDefault }]}
          >
            {todayName}
          </ThemedText>
        </View>

        {/* Progress Overview */}
        <ThemedView
          style={[styles.progressCard, { backgroundColor: colors.card }]}
        >
          <View style={styles.progressHeader}>
            <View style={styles.progressStats}>
              <ThemedText type="title" style={styles.progressNumber}>
                {completedCount}/{totalCount}
              </ThemedText>
              <ThemedText
                style={[styles.progressLabel, { color: colors.tabIconDefault }]}
              >
                Habits Completed
              </ThemedText>
            </View>
            <View style={[styles.progressCircle, { borderColor: colors.tint }]}>
              <ThemedText
                style={[styles.progressPercentage, { color: colors.tint }]}
              >
                {completionRate}%
              </ThemedText>
            </View>
          </View>
          <ThemedText
            style={[
              styles.motivationalMessage,
              { color: colors.tabIconDefault },
            ]}
          >
            {getMotivationalMessage()}
          </ThemedText>
        </ThemedView>

        {/* Today's Habits */}
        <View style={styles.habitsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Today&apos;s Habits
          </ThemedText>

          {todayHabits.length === 0 ? (
            <ThemedView
              style={[styles.emptyState, { backgroundColor: colors.card }]}
            >
              <IconSymbol
                name="checkmark.circle"
                size={48}
                color={colors.tabIconDefault}
              />
              <ThemedText
                style={[
                  styles.emptyStateText,
                  { color: colors.tabIconDefault },
                ]}
              >
                No habits scheduled for today
              </ThemedText>
              <ThemedText
                style={[
                  styles.emptyStateSubtext,
                  { color: colors.tabIconDefault },
                ]}
              >
                Create some habits to get started!
              </ThemedText>
            </ThemedView>
          ) : (
            todayHabits.map((habit) => (
              <TouchableOpacity
                key={habit._id}
                style={[
                  styles.habitCard,
                  {
                    backgroundColor: colors.card,
                    borderLeftColor: habit.color,
                  },
                  habit.isCompletedToday && styles.completedHabitCard,
                ]}
                onPress={() => handleToggleHabit(habit)}
                activeOpacity={0.7}
              >
                <View style={styles.habitContent}>
                  <View style={styles.habitInfo}>
                    <View style={styles.habitHeader}>
                      {habit.emoji && (
                        <Text style={styles.habitEmoji}>{habit.emoji}</Text>
                      )}
                      <ThemedText
                        type="defaultSemiBold"
                        style={[
                          styles.habitName,
                          habit.isCompletedToday && styles.completedHabitName,
                        ]}
                      >
                        {habit.name}
                      </ThemedText>
                    </View>
                    {habit.description && (
                      <ThemedText
                        style={[
                          styles.habitDescription,
                          { color: colors.tabIconDefault },
                        ]}
                      >
                        {habit.description}
                      </ThemedText>
                    )}
                  </View>

                  <View style={styles.habitActions}>
                    <View
                      style={[
                        styles.checkButton,
                        {
                          backgroundColor: habit.isCompletedToday
                            ? habit.color
                            : "transparent",
                          borderColor: habit.color,
                        },
                      ]}
                    >
                      {habit.isCompletedToday && (
                        <IconSymbol name="checkmark" size={16} color="white" />
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  header: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  date: {
    fontSize: 16,
    marginTop: 4,
  },
  progressCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressStats: {
    flex: 1,
  },
  progressNumber: {
    fontSize: 28,
    fontWeight: "bold",
  },
  progressLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: "bold",
  },
  motivationalMessage: {
    fontSize: 14,
    fontStyle: "italic",
  },
  habitsSection: {
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
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
  habitCard: {
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completedHabitCard: {
    opacity: 0.8,
  },
  habitContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  habitInfo: {
    flex: 1,
  },
  habitHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  habitEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  habitName: {
    fontSize: 16,
    flex: 1,
  },
  completedHabitName: {
    textDecorationLine: "line-through",
  },
  habitDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  habitActions: {
    marginLeft: 12,
  },
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
