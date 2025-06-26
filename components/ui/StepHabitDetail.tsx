import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { NumericHabitInput } from "@/components/ui/NumericHabitInput";
import { StepTracker } from "@/components/ui/StepTracker";
import { useCompleteHabit } from "@/hooks/useCompletions";
import { useStepCounter } from "@/hooks/useStepCounter";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Habit, HabitCompletion } from "@/types/habit";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface StepHabitDetailProps {
  visible: boolean;
  habit: Habit | null;
  onClose: () => void;
  completion?: HabitCompletion;
}

export const StepHabitDetail: React.FC<StepHabitDetailProps> = ({
  visible,
  habit,
  onClose,
  completion,
}) => {
  const [currentValue, setCurrentValue] = useState(completion?.value || 0);
  const { getTodaySteps } = useStepCounter();
  const { completeHabit } = useCompleteHabit();

  const primaryColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const refreshSteps = useCallback(async () => {
    if (habit?.type === "steps") {
      try {
        const todaySteps = await getTodaySteps();
        setCurrentValue(todaySteps);
      } catch (err) {
        console.error("Error getting steps:", err);
      }
    }
  }, [habit?.type, getTodaySteps]);

  useEffect(() => {
    if (visible && habit?.type === "steps") {
      // Auto-refresh steps when modal opens
      refreshSteps();
    }
  }, [visible, habit?.type, refreshSteps]);

  const handleSave = async () => {
    if (!habit) return;

    try {
      const today = new Date().toISOString().split("T")[0];
      await completeHabit({
        habitId: habit._id,
        date: today,
        value: currentValue,
      });

      Alert.alert(
        "Success",
        `${habit.name} updated with ${currentValue} ${habit.unit}!`,
        [{ text: "OK", onPress: onClose }]
      );
    } catch (err) {
      console.error("Error saving habit completion:", err);
      Alert.alert("Error", "Failed to save progress");
    }
  };

  const handleStepsUpdate = (steps: number) => {
    setCurrentValue(steps);
  };

  if (!habit) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={textColor} />
          </TouchableOpacity>
          <ThemedText style={styles.title}>
            {habit.emoji} {habit.name}
          </ThemedText>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.saveButton, { backgroundColor: primaryColor }]}
          >
            <ThemedText style={styles.saveButtonText}>Save</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {habit.description && (
            <ThemedView style={styles.descriptionCard}>
              <ThemedText style={styles.description}>
                {habit.description}
              </ThemedText>
            </ThemedView>
          )}

          {habit.type === "steps" ? (
            <StepTracker
              targetSteps={habit.targetValue || 10000}
              onStepsUpdate={handleStepsUpdate}
              currentSteps={currentValue}
            />
          ) : (
            <NumericHabitInput
              habitName={habit.name}
              unit={habit.unit || "units"}
              targetValue={habit.targetValue || 1}
              currentValue={currentValue}
              onValueChange={setCurrentValue}
              onSave={handleSave}
              emoji={habit.emoji}
            />
          )}

          <View style={styles.tipsCard}>
            <ThemedText style={styles.tipsTitle}>💡 Tips</ThemedText>
            {habit.type === "steps" ? (
              <View>
                <ThemedText style={styles.tipText}>
                  • Take the stairs instead of elevators
                </ThemedText>
                <ThemedText style={styles.tipText}>
                  • Park farther away from entrances
                </ThemedText>
                <ThemedText style={styles.tipText}>
                  • Take walking breaks during work
                </ThemedText>
                <ThemedText style={styles.tipText}>
                  • Walk while talking on the phone
                </ThemedText>
              </View>
            ) : (
              <View>
                <ThemedText style={styles.tipText}>
                  • Set reminders throughout the day
                </ThemedText>
                <ThemedText style={styles.tipText}>
                  • Track progress consistently
                </ThemedText>
                <ThemedText style={styles.tipText}>
                  • Start small and build up gradually
                </ThemedText>
                <ThemedText style={styles.tipText}>
                  • Celebrate small wins
                </ThemedText>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  descriptionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  tipsCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    backgroundColor: "#F5F5F5",
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
    opacity: 0.8,
  },
});
