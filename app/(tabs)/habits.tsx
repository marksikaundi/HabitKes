import React, { useState } from "react";
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
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Card } from "@/components/ui/Card";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useCreateHabit, useDeleteHabit, useHabits } from "@/hooks/useHabits";
import { HABIT_COLORS, HABIT_EMOJIS, HabitFrequency } from "@/types/habit";
import { getHabitFrequencyText } from "@/utils/dateUtils";

export default function HabitsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const habits = useHabits();
  const { createHabit } = useCreateHabit();
  const { deleteHabit } = useDeleteHabit();

  const [showCreateModal, setShowCreateModal] = useState(false);
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

  const handleDeleteHabit = (habitId: string, habitName: string) => {
    Alert.alert(
      "Delete Habit",
      `Are you sure you want to delete "${habitName}"? This will remove all associated data.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteHabit({ id: habitId as any });
              Alert.alert("Success", "Habit deleted successfully");
            } catch {
              Alert.alert("Error", "Failed to delete habit");
            }
          },
        },
      ]
    );
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
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          My Habits
        </ThemedText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {habits.length === 0 ? (
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
        ) : (
          habits.map((habit) => (
            <Card key={habit._id} style={styles.habitCard}>
              <View style={styles.habitContent}>
                <View style={styles.habitInfo}>
                  <View style={styles.habitHeader}>
                    {habit.emoji && (
                      <View style={[styles.emojiContainer, { backgroundColor: colors.muted }]}>
                        <Text style={styles.habitEmoji}>{habit.emoji}</Text>
                      </View>
                    )}
                    <View style={styles.habitTextContent}>
                      <ThemedText type="defaultSemiBold" style={styles.habitName}>
                        {habit.name}
                      </ThemedText>
                      {habit.description && (
                        <ThemedText
                          style={[
                            styles.habitDescription,
                            { color: colors.mutedForeground },
                          ]}
                        >
                          {habit.description}
                        </ThemedText>
                      )}
                      <ThemedText
                        style={[
                          styles.habitFrequency,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        {getHabitFrequencyText(habit.frequency)}
                      </ThemedText>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.deleteButton, { backgroundColor: colors.danger }]}
                  onPress={() => handleDeleteHabit(habit._id, habit.name)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <IconSymbol name="trash" size={16} color="white" />
                </TouchableOpacity>
              </View>
              <View style={[styles.colorIndicator, { backgroundColor: habit.color }]} />
            </Card>
          ))
        )}
      </ScrollView>

      <FloatingActionButton onPress={() => setShowCreateModal(true)} />

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
  habitCard: {
    marginBottom: 16,
    position: 'relative',
  },
  habitContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  habitInfo: {
    flex: 1,
  },
  habitHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  habitEmoji: {
    fontSize: 24,
  },
  habitTextContent: {
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  habitDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  habitFrequency: {
    fontSize: 12,
    textTransform: "capitalize",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  colorIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
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
});
