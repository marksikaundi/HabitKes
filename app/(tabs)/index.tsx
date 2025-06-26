import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ProgressCard } from "@/components/ui/Card";
import { HabitCard } from "@/components/ui/HabitCard";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { StepTracker } from "@/components/ui/StepTracker";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useCompleteHabit, useTodayCompletions } from "@/hooks/useCompletions";
import { useHabits } from "@/hooks/useHabits";
import { HabitWithCompletion } from "@/types/habit";
import { formatDate, shouldHabitBeCompletedToday } from "@/utils/dateUtils";

export default function TodayScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [demoSteps, setDemoSteps] = useState(0);

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
        await completeHabit({
          habitId: habit._id,
          date: today,
        });
      }
    } catch {
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
        <LoadingSpinner fullScreen />
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
        <ProgressCard
          current={completedCount}
          total={totalCount}
          title="Habits Completed"
          subtitle={getMotivationalMessage()}
          style={styles.progressCard}
        />

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
              <HabitCard
                key={habit._id}
                habit={habit}
                onPress={() => handleToggleHabit(habit)}
                style={styles.habitCard}
              />
            ))
          )}
        </View>

        {/* Step Tracker Demo Widget */}
        <View style={styles.stepTrackerSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Step Tracker Demo
          </ThemedText>
          <StepTracker
            targetSteps={10000}
            onStepsUpdate={setDemoSteps}
            currentSteps={demoSteps}
          />
          <ThemedText style={[styles.demoNote, { color: colors.tabIconDefault }]}>
            💡 Create a step habit in the Habits tab to track your daily steps automatically!
          </ThemedText>
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
    marginBottom: 30,
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
    marginBottom: 12,
  },
  stepTrackerSection: {
    paddingBottom: 30,
  },
  demoNote: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});
