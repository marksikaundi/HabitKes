import React, { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CreateStepHabitForm } from "@/components/ui/CreateStepHabitForm";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { HabitSectionCard } from "@/components/ui/HabitSectionCard";
import { HabitSummaryStats } from "@/components/ui/HabitSummaryStats";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { StepHabitDetail } from "@/components/ui/StepHabitDetail";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTodayCompletions } from "@/hooks/useCompletions";
import { useCreateHabit, useDeleteHabit, useHabits } from "@/hooks/useHabits";
import {
  HABIT_COLORS,
  HABIT_EMOJIS,
  HabitFrequency,
  HabitType,
  HabitWithCompletion,
} from "@/types/habit";

export default function HabitsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const habits = useHabits();
  const todayCompletions = useTodayCompletions();
  const { createHabit } = useCreateHabit();
  const { deleteHabit } = useDeleteHabit();

  // Convert habits to HabitWithCompletion objects
  const habitsWithCompletion = React.useMemo(() => {
    if (!habits) return null;

    return habits.map((habit) => {
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

  // Group habits and calculate stats
  const { groupedHabits, stats } = useMemo(() => {
    if (!habitsWithCompletion) {
      return {
        groupedHabits: { completed: [], incomplete: [], stepHabits: [] },
        stats: { totalHabits: 0, completedHabits: 0, completionRate: 0 },
      };
    }

    const completed: HabitWithCompletion[] = [];
    const incomplete: HabitWithCompletion[] = [];
    const stepHabits: HabitWithCompletion[] = [];

    habitsWithCompletion.forEach((habit) => {
      if (habit.type === "steps") {
        stepHabits.push(habit);
      } else if (habit.isCompletedToday) {
        completed.push(habit);
      } else {
        incomplete.push(habit);
      }
    });

    const totalHabits = habitsWithCompletion.length;
    const completedCount = completed.length + stepHabits.filter(h => h.isCompletedToday).length;
    const completionRate = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

    return {
      groupedHabits: { completed, incomplete, stepHabits },
      stats: { totalHabits, completedHabits: completedCount, completionRate },
    };
  }, [habitsWithCompletion]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [showStepHabitDetail, setShowStepHabitDetail] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<any>(null);
  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);
  const [selectedEmoji, setSelectedEmoji] = useState(HABIT_EMOJIS[0]);
  const [selectedFrequency, setSelectedFrequency] =
    useState<HabitFrequency>("daily");

  const handleCreateHabit = async () => {
    if (!habitName.trim()) {
      Alert.alert("Error", "Please enter a habit name");
      return;
    }

    try {
      await createHabit({
        name: habitName.trim(),
        description: habitDescription.trim() || undefined,
        color: selectedColor,
        emoji: selectedEmoji,
        frequency: selectedFrequency,
        type: "boolean" as HabitType, // Default to boolean for regular habits
      });

      // Reset form
      setHabitName("");
      setHabitDescription("");
      setSelectedColor(HABIT_COLORS[0]);
      setSelectedEmoji(HABIT_EMOJIS[0]);
      setSelectedFrequency("daily");
      setShowCreateModal(false);

      Alert.alert("Success", "Habit created successfully!");
    } catch {
      Alert.alert("Error", "Failed to create habit");
    }
  };

  const handleCreateStepHabit = async (habitData: {
    name: string;
    description?: string;
    color: string;
    emoji?: string;
    type: HabitType;
    targetValue: number;
    unit: string;
  }) => {
    try {
      await createHabit({
        ...habitData,
        frequency: "daily" as HabitFrequency, // Step habits are always daily
      });

      setShowStepModal(false);
      Alert.alert("Success", "Movement habit created successfully!");
    } catch {
      Alert.alert("Error", "Failed to create movement habit");
    }
  };

  const handleHabitPress = (habit: HabitWithCompletion) => {
    if (habit.type === "steps" || habit.type === "numeric") {
      setSelectedHabit(habit);
      setShowStepHabitDetail(true);
    } else {
      // Handle regular boolean habits (existing functionality)
      // You can add completion toggle logic here
    }
  };

  const handleDeleteHabit = (habit: HabitWithCompletion) => {
    Alert.alert(
      "Delete Habit",
      `Are you sure you want to delete "${habit.name}"? This will remove all associated data.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteHabit({ id: habit._id });
              Alert.alert("Success", "Habit deleted successfully");
            } catch {
              Alert.alert("Error", "Failed to delete habit");
            }
          },
        },
      ]
    );
  };    if (!habitsWithCompletion) {
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
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          My Habits
        </ThemedText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {habitsWithCompletion && habitsWithCompletion.length === 0 ? (
          <ThemedView
            style={[styles.emptyState, { backgroundColor: colors.card }]}
          >
            <IconSymbol
              name="list.bullet"
              size={48}
              color={colors.tabIconDefault}
            />
            <ThemedText
              style={[styles.emptyStateText, { color: colors.tabIconDefault }]}
            >
              No habits yet
            </ThemedText>
            <ThemedText
              style={[
                styles.emptyStateSubtext,
                { color: colors.tabIconDefault },
              ]}
            >
              Tap the + button to create your first habit
            </ThemedText>
          </ThemedView>
        ) : habitsWithCompletion && habitsWithCompletion.length > 0 ? (
          <>
            {/* Summary Stats */}
            <HabitSummaryStats
              totalHabits={stats.totalHabits}
              completedHabits={stats.completedHabits}
              completionRate={stats.completionRate}
              activeStreak={0} // You can add streak calculation later
            />

            {/* Step Habits Section */}
            {groupedHabits.stepHabits.length > 0 && (
              <HabitSectionCard
                title="Movement & Goals"
                habits={groupedHabits.stepHabits}
                onHabitPress={handleHabitPress}
                onHabitLongPress={handleDeleteHabit}
                emptyMessage=""
                icon="walk"
                accentColor="#FF5722"
              />
            )}

            {/* Incomplete Habits Section */}
            {groupedHabits.incomplete.length > 0 && (
              <HabitSectionCard
                title="To Complete"
                habits={groupedHabits.incomplete}
                onHabitPress={handleHabitPress}
                onHabitLongPress={handleDeleteHabit}
                emptyMessage="All habits completed for today! 🎉"
                icon="hourglass"
                accentColor="#FF9800"
              />
            )}

            {/* Completed Habits Section */}
            {groupedHabits.completed.length > 0 && (
              <HabitSectionCard
                title="Completed Today"
                habits={groupedHabits.completed}
                onHabitPress={handleHabitPress}
                onHabitLongPress={handleDeleteHabit}
                emptyMessage="No habits completed yet today"
                icon="checkmark-circle"
                accentColor="#4CAF50"
              />
            )}

            {/* Instructions for new users */}
            {stats.totalHabits > 0 && stats.totalHabits < 3 && (
              <ThemedView
                style={[styles.tipsCard, { backgroundColor: colors.card }]}
              >
                <ThemedText style={styles.tipsTitle}>💡 Tips</ThemedText>
                <ThemedText style={[styles.tipsText, { color: colors.tabIconDefault }]}>
                  • Tap any habit to mark it complete or update progress{"\n"}
                  • Use the walking icon button to create step-based habits{"\n"}
                  • Long press to delete habits you no longer need
                </ThemedText>
              </ThemedView>
            )}
          </>
        ) : null}
      </ScrollView>

      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.secondaryFab, { backgroundColor: colors.secondary }]}
          onPress={() => setShowStepModal(true)}
        >
          <IconSymbol name="figure.walk" size={20} color="white" />
        </TouchableOpacity>
        <FloatingActionButton onPress={() => setShowCreateModal(true)} />
      </View>

      {/* Create Habit Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowCreateModal(false)}
              style={styles.modalCancelButton}
            >
              <ThemedText style={{ color: colors.tint }}>Cancel</ThemedText>
            </TouchableOpacity>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              Create Habit
            </ThemedText>
            <TouchableOpacity
              onPress={handleCreateHabit}
              style={styles.modalSaveButton}
            >
              <ThemedText style={{ color: colors.tint, fontWeight: "600" }}>
                Save
              </ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Habit Name */}
            <View style={styles.formSection}>
              <ThemedText style={styles.formLabel}>Habit Name</ThemedText>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                value={habitName}
                onChangeText={setHabitName}
                placeholder="e.g., Drink water"
                placeholderTextColor={colors.tabIconDefault}
              />
            </View>

            {/* Description */}
            <View style={styles.formSection}>
              <ThemedText style={styles.formLabel}>
                Description (Optional)
              </ThemedText>
              <TextInput
                style={[
                  styles.textInput,
                  styles.textArea,
                  {
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                value={habitDescription}
                onChangeText={setHabitDescription}
                placeholder="Add a description..."
                placeholderTextColor={colors.tabIconDefault}
                multiline
              />
            </View>

            {/* Color Selection */}
            <View style={styles.formSection}>
              <ThemedText style={styles.formLabel}>Color</ThemedText>
              <View style={styles.colorGrid}>
                {HABIT_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColorOption,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
            </View>

            {/* Emoji Selection */}
            <View style={styles.formSection}>
              <ThemedText style={styles.formLabel}>Emoji</ThemedText>
              <View style={styles.emojiGrid}>
                {HABIT_EMOJIS.map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    style={[
                      styles.emojiOption,
                      { backgroundColor: colors.card },
                      selectedEmoji === emoji && [
                        styles.selectedEmojiOption,
                        { borderColor: colors.tint },
                      ],
                    ]}
                    onPress={() => setSelectedEmoji(emoji)}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Frequency Selection */}
            <View style={styles.formSection}>
              <ThemedText style={styles.formLabel}>Frequency</ThemedText>
              <View style={styles.frequencyOptions}>
                {["daily", "weekly"].map((freq) => (
                  <TouchableOpacity
                    key={freq}
                    style={[
                      styles.frequencyOption,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                      selectedFrequency === freq && [
                        styles.selectedFrequencyOption,
                        {
                          backgroundColor: colors.tint + "20",
                          borderColor: colors.tint,
                        },
                      ],
                    ]}
                    onPress={() => setSelectedFrequency(freq as HabitFrequency)}
                  >
                    <ThemedText
                      style={[
                        styles.frequencyText,
                        selectedFrequency === freq && { color: colors.tint },
                      ]}
                    >
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Step Habit Creation Modal */}
      <Modal
        visible={showStepModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowStepModal(false)}
      >
        <CreateStepHabitForm
          onSubmit={handleCreateStepHabit}
          onCancel={() => setShowStepModal(false)}
        />
      </Modal>

      {/* Step Habit Detail Modal */}
      <StepHabitDetail
        visible={showStepHabitDetail}
        habit={selectedHabit}
        onClose={() => {
          setShowStepHabitDetail(false);
          setSelectedHabit(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
  emptyState: {
    padding: 40,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 40,
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
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  modalCancelButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalSaveButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: "#000",
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  emojiOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedEmojiOption: {
    borderWidth: 2,
  },
  emojiText: {
    fontSize: 20,
  },
  frequencyOptions: {
    flexDirection: "row",
    gap: 12,
  },
  frequencyOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  selectedFrequencyOption: {
    borderWidth: 2,
  },
  frequencyText: {
    fontSize: 16,
    fontWeight: "500",
  },
  fabContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    alignItems: "center",
    gap: 12,
  },
  secondaryFab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tipsCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
