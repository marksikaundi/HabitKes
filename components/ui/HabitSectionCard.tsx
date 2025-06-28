import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { HabitWithCompletion } from "@/types/habit";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HabitSectionCardProps {
  title: string;
  habits: HabitWithCompletion[];
  onHabitPress: (habit: HabitWithCompletion) => void;
  onHabitLongPress?: (habit: HabitWithCompletion) => void;
  onHabitDelete?: (habit: HabitWithCompletion) => void;
  emptyMessage: string;
  icon: string;
  accentColor: string;
}

export const HabitSectionCard: React.FC<HabitSectionCardProps> = ({
  title,
  habits,
  onHabitPress,
  onHabitLongPress,
  onHabitDelete,
  emptyMessage,
  icon,
  accentColor,
}) => {
  console.log(
    `HabitSectionCard "${title}" rendering with ${habits.length} habits`
  );
  console.log("onHabitDelete function exists:", !!onHabitDelete);

  const textColor = useThemeColor({}, "text");
  const cardColor = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "border");

  return (
    <ThemedView
      style={[styles.sectionCard, { backgroundColor: cardColor, borderColor }]}
    >
      <View style={styles.sectionHeader}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: accentColor + "20" },
          ]}
        >
          <Ionicons name={icon as any} size={20} color={accentColor} />
        </View>
        <View style={styles.headerText}>
          <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
          <ThemedText style={[styles.count, { color: textColor + "80" }]}>
            {habits.length} {habits.length === 1 ? "habit" : "habits"}
          </ThemedText>
        </View>
      </View>

      {habits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={[styles.emptyText, { color: textColor + "60" }]}>
            {emptyMessage}
          </ThemedText>
        </View>
      ) : (
        <View style={styles.habitsContainer}>
          {habits.map((habit, index) => (
            <TouchableOpacity
              key={habit._id}
              style={[
                styles.habitItem,
                { borderBottomColor: borderColor },
                index === habits.length - 1 && styles.lastHabitItem,
              ]}
              onPress={() => onHabitPress(habit)}
              onLongPress={() => onHabitLongPress?.(habit)}
              activeOpacity={0.7}
            >
              <View style={styles.habitContent}>
                <View style={styles.habitLeft}>
                  {habit.emoji && (
                    <Text style={styles.habitEmoji}>{habit.emoji}</Text>
                  )}
                  <View style={styles.habitTextContainer}>
                    <ThemedText
                      style={[
                        styles.habitName,
                        habit.isCompletedToday && styles.completedHabitName,
                        {
                          color: habit.isCompletedToday
                            ? textColor + "60"
                            : textColor,
                        },
                      ]}
                    >
                      {habit.name}
                    </ThemedText>
                    {habit.description && (
                      <ThemedText
                        style={[
                          styles.habitDescription,
                          { color: textColor + "60" },
                        ]}
                      >
                        {habit.description}
                      </ThemedText>
                    )}
                    {(habit.type === "numeric" || habit.type === "steps") &&
                      habit.targetValue && (
                        <ThemedText
                          style={[
                            styles.habitTarget,
                            { color: textColor + "50" },
                          ]}
                        >
                          Goal: {habit.targetValue} {habit.unit}
                        </ThemedText>
                      )}
                  </View>
                </View>
                <View style={styles.habitRight}>
                  {/* Debug: Always show a test button */}
                  <TouchableOpacity
                    style={[
                      styles.deleteButton,
                      {
                        backgroundColor: onHabitDelete ? "#FF5252" : "#CCCCCC",
                      },
                    ]}
                    onPress={() => {
                      console.log(
                        "Delete button pressed for habit:",
                        habit.name
                      );
                      console.log("onHabitDelete exists:", !!onHabitDelete);
                      console.log("Habit ID:", habit._id);
                      if (onHabitDelete) {
                        onHabitDelete(habit);
                      } else {
                        console.log("onHabitDelete is not defined");
                      }
                    }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="trash" size={18} color="white" />
                  </TouchableOpacity>

                  {/* Status Indicator */}
                  {habit.isCompletedToday ? (
                    <View
                      style={[
                        styles.statusIndicator,
                        { backgroundColor: "#4CAF50" },
                      ]}
                    >
                      <Ionicons name="checkmark" size={16} color="white" />
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.statusIndicator,
                        {
                          backgroundColor: "transparent",
                          borderColor: textColor + "30",
                        },
                      ]}
                    >
                      <View style={styles.incompleteIndicator} />
                    </View>
                  )}

                  {/* Color Stripe */}
                  <View
                    style={[
                      styles.colorStripe,
                      { backgroundColor: habit.color },
                    ]}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  count: {
    fontSize: 14,
    marginTop: 2,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  habitsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  habitItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  lastHabitItem: {
    borderBottomWidth: 0,
  },
  habitContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  habitLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  habitEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  habitTextContainer: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "500",
  },
  completedHabitName: {
    textDecorationLine: "line-through",
  },
  habitDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  habitTarget: {
    fontSize: 12,
    marginTop: 2,
  },
  habitRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statusIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  incompleteIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "transparent",
  },
  colorStripe: {
    width: 4,
    height: 32,
    borderRadius: 2,
  },
});
