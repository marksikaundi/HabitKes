import { Colors } from "@/constants/Colors";
import { Design, createTextStyle } from "@/constants/Design";
import { useColorScheme } from "@/hooks/useColorScheme";
import { HabitWithCompletion } from "@/types/habit";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { IconSymbol } from "./IconSymbol";

interface HabitCardProps {
  habit: HabitWithCompletion;
  onPress: () => void;
  style?: ViewStyle;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onPress,
  style,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const cardStyles = [
    styles.card,
    {
      backgroundColor: colors.surface,
      borderColor: habit.isCompletedToday ? habit.color : colors.border,
      borderLeftColor: habit.color,
    },
    habit.isCompletedToday && {
      backgroundColor: colors.surfaceSecondary,
      transform: [{ scale: 0.98 }],
    },
    style,
  ];

  return (
    <TouchableOpacity style={cardStyles} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.leftContent}>
          {habit.emoji && (
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>{habit.emoji}</Text>
            </View>
          )}

          <View style={styles.textContent}>
            <Text
              style={[
                createTextStyle("lg", "semibold"),
                {
                  color: colors.text,
                  textDecorationLine: habit.isCompletedToday
                    ? "line-through"
                    : "none",
                  opacity: habit.isCompletedToday ? 0.7 : 1,
                },
              ]}
            >
              {habit.name}
            </Text>

            {habit.description && (
              <Text
                style={[
                  createTextStyle("sm"),
                  {
                    color: colors.mutedForeground,
                    marginTop: Design.spacing.xs,
                  },
                ]}
              >
                {habit.description}
              </Text>
            )}

            {/* Show progress for numeric/steps habits */}
            {(habit.type === 'numeric' || habit.type === 'steps') && habit.targetValue && (
              <Text
                style={[
                  createTextStyle("sm"),
                  {
                    color: colors.mutedForeground,
                    marginTop: Design.spacing.xs,
                  },
                ]}
              >
                Target: {habit.targetValue} {habit.unit}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.rightContent}>
          {(habit.type === 'boolean' || !habit.type) ? (
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
              {habit.isCompletedToday ? (
                <IconSymbol name="checkmark" size={20} color="white" />
              ) : (
                <View style={styles.checkButtonInner} />
              )}
            </View>
          ) : (
            <View style={styles.numericIndicator}>
              <Text style={[createTextStyle("xs"), { color: colors.mutedForeground }]}>
                {habit.type === 'steps' ? '👟' : '📊'}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Design.borderRadius.xl,
    borderWidth: 1,
    borderLeftWidth: 4,
    marginBottom: Design.spacing.md,
    ...Design.shadow.sm,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: Design.spacing.lg,
  },
  leftContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: Design.borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Design.spacing.md,
  },
  emoji: {
    fontSize: 24,
  },
  textContent: {
    flex: 1,
  },
  rightContent: {
    marginLeft: Design.spacing.md,
  },
  checkButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "transparent",
  },
  numericIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
