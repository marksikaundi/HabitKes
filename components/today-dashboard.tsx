import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

import {
  ACCENT_LIME,
  ACCENT_ON_LIME,
  BACKGROUND_PAGE,
  BORDER_SUBTLE,
  Fonts,
  SURFACE_MUTED,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from "@/constants/theme";
import type { Habit } from "@/lib/accountability-board";
import type { StreakSnapshot } from "@/lib/streak-gamification";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const DASH_SIZE = 108;
const R = 44;
const CIRC = 2 * Math.PI * R;
const STREAK_MILESTONE = 14;

const isNewArchitecture = Boolean(
  (globalThis as { nativeFabricUIManager?: unknown }).nativeFabricUIManager,
);

if (
  Platform.OS === "android" &&
  !isNewArchitecture &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  habits: Habit[];
  toggleHabit: (habitId: string) => Promise<void>;
  streakLoaded: boolean;
  streak: StreakSnapshot;
};

const MOOD_OPTIONS = ["Calm", "Driven", "Tired", "Distracted"];

export function TodayDashboard({ habits, toggleHabit, streakLoaded, streak }: Props) {
  const [mood, setMood] = useState("Calm");
  const ringProgress = useRef(new Animated.Value(0)).current;
  const sparkLift = useRef(new Animated.Value(0)).current;

  const completed = habits.filter((h) => h.completedToday).length;
  const total = habits.length;
  const remainingHabits = habits.filter((h) => !h.completedToday);
  const progress = total === 0 ? 0 : completed / total;
  const focusScore = total === 0 ? 0 : Math.round((completed / total) * 100);

  const momentum = useMemo(() => {
    if (!streakLoaded) return "Gathering momentum...";
    if (streak.currentStreak >= 14) return "Your momentum is strong this week.";
    if (streak.currentStreak >= 7) return "You're building strong focus rhythm.";
    if (streak.currentStreak >= 3) return "Momentum is starting to compound.";
    return "Small wins today create momentum tomorrow.";
  }, [streakLoaded, streak.currentStreak]);

  const companionState = useMemo(() => {
    if (streak.currentStreak >= 30) return "🌳";
    if (streak.currentStreak >= 14) return "🌿";
    if (streak.currentStreak >= 7) return "🌱";
    return "🪴";
  }, [streak.currentStreak]);

  useEffect(() => {
    Animated.timing(ringProgress, {
      toValue: progress,
      duration: 750,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkLift, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(sparkLift, {
          toValue: 0,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [progress, ringProgress, sparkLift]);

  const dashOffset = ringProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRC, 0],
  });

  const onQuickComplete = async (habitId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await toggleHabit(habitId);
  };

  const streakHint =
    remainingHabits.length === 1
      ? "You're 1 habit away from keeping your streak 🔥"
      : `You're ${remainingHabits.length} habits away from full power today.`;

  return (
    <View style={styles.shell}>
      <View style={styles.topRow}>
        <View style={styles.ringWrap}>
          <Svg width={DASH_SIZE} height={DASH_SIZE}>
            <Circle
              cx={DASH_SIZE / 2}
              cy={DASH_SIZE / 2}
              r={R}
              stroke={BORDER_SUBTLE}
              strokeWidth={9}
              fill="none"
            />
            <AnimatedCircle
              cx={DASH_SIZE / 2}
              cy={DASH_SIZE / 2}
              r={R}
              stroke={ACCENT_LIME}
              strokeWidth={9}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${CIRC} ${CIRC}`}
              strokeDashoffset={dashOffset}
              rotation={-90}
              originX={DASH_SIZE / 2}
              originY={DASH_SIZE / 2}
            />
          </Svg>
          <View style={styles.ringCenter}>
            <Text style={styles.ringMain}>{`${completed}/${total}`}</Text>
            <Text style={styles.ringSub}>today</Text>
          </View>
        </View>

        <View style={styles.energyCard}>
          <Text style={styles.energyLabel}>Life Energy</Text>
          <Text style={styles.energyValue}>Momentum {focusScore}</Text>
          <Text style={styles.energyCaption}>{momentum}</Text>
          <Animated.Text
            style={[
              styles.spark,
              {
                transform: [
                  {
                    translateY: sparkLift.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -6],
                    }),
                  },
                ],
                opacity: sparkLift.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.55, 1],
                }),
              },
            ]}
          >
            ✦ ✧ ✦
          </Animated.Text>
        </View>
      </View>

      <Text style={styles.headline}>What should I do right now?</Text>
      <Text style={styles.subline}>
        {total === 0 ? "Start your first ritual to build momentum." : streakHint}
      </Text>

      <View style={styles.moodRow}>
        <Text style={styles.moodPrompt}>How are you feeling?</Text>
        <View style={styles.moodOptions}>
          {MOOD_OPTIONS.map((option) => (
            <Pressable
              key={option}
              onPress={() => setMood(option)}
              style={({ pressed }) => [
                styles.moodPill,
                mood === option && styles.moodPillActive,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text
                style={[
                  styles.moodPillText,
                  mood === option && styles.moodPillTextActive,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.quickSection}>
        <Text style={styles.quickTitle}>Quick complete</Text>
        {remainingHabits.length === 0 ? (
          <View style={styles.completedAll}>
            <Text style={styles.completedAllText}>All rituals complete. Keep the fire going.</Text>
          </View>
        ) : (
          remainingHabits.slice(0, 3).map((habit) => (
            <Pressable
              key={habit.id}
              onPress={() => onQuickComplete(habit.id)}
              style={({ pressed }) => [
                styles.quickHabit,
                pressed && styles.quickHabitPressed,
              ]}
            >
              <Text style={styles.quickHabitText}>{habit.title}</Text>
              <View style={styles.quickPill}>
                <Text style={styles.quickPillText}>Complete</Text>
              </View>
            </Pressable>
          ))
        )}
      </View>

      <View style={styles.companion}>
        <Text style={styles.companionEmoji}>{companionState}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.companionTitle}>Companion growth</Text>
          <Text style={styles.companionText}>
            Keep your streak to evolve your companion. Next evolution at {STREAK_MILESTONE} days.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: SURFACE_MUTED,
    borderRadius: 28,
    padding: 16,
    gap: 14,
  },
  topRow: {
    flexDirection: "row",
    gap: 12,
  },
  ringWrap: {
    width: DASH_SIZE,
    height: DASH_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  ringCenter: {
    position: "absolute",
    alignItems: "center",
  },
  ringMain: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
  },
  ringSub: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
  },
  energyCard: {
    flex: 1,
    backgroundColor: BACKGROUND_PAGE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
    padding: 12,
    justifyContent: "space-between",
    minHeight: DASH_SIZE,
  },
  energyLabel: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
  },
  energyValue: {
    marginTop: 2,
    fontSize: 18,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
    letterSpacing: -0.3,
  },
  energyCaption: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: Fonts.sans,
    color: TEXT_SECONDARY,
    lineHeight: 16,
  },
  spark: {
    marginTop: 6,
    color: ACCENT_LIME,
    fontFamily: Fonts.semibold,
    fontSize: 14,
  },
  headline: {
    fontSize: 19,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
    letterSpacing: -0.3,
  },
  subline: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
    marginTop: -6,
  },
  moodRow: {
    gap: 8,
  },
  moodPrompt: {
    fontSize: 13,
    color: TEXT_PRIMARY,
    fontFamily: Fonts.semibold,
  },
  moodOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  moodPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
    backgroundColor: BACKGROUND_PAGE,
  },
  moodPillActive: {
    borderColor: ACCENT_LIME,
    backgroundColor: "rgba(199, 244, 50, 0.2)",
  },
  moodPillText: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.medium,
  },
  moodPillTextActive: {
    color: TEXT_PRIMARY,
    fontFamily: Fonts.semibold,
  },
  quickSection: {
    gap: 8,
  },
  quickTitle: {
    fontSize: 13,
    color: TEXT_PRIMARY,
    fontFamily: Fonts.semibold,
  },
  quickHabit: {
    backgroundColor: BACKGROUND_PAGE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quickHabitPressed: {
    opacity: 0.86,
  },
  quickHabitText: {
    color: TEXT_PRIMARY,
    fontFamily: Fonts.medium,
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
  quickPill: {
    backgroundColor: ACCENT_LIME,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  quickPillText: {
    color: ACCENT_ON_LIME,
    fontFamily: Fonts.semibold,
    fontSize: 11,
  },
  completedAll: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
    padding: 12,
    backgroundColor: BACKGROUND_PAGE,
  },
  completedAllText: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.medium,
  },
  companion: {
    borderRadius: 20,
    padding: 12,
    backgroundColor: BACKGROUND_PAGE,
    borderColor: BORDER_SUBTLE,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  companionEmoji: {
    fontSize: 28,
  },
  companionTitle: {
    fontSize: 13,
    color: TEXT_PRIMARY,
    fontFamily: Fonts.semibold,
  },
  companionText: {
    marginTop: 2,
    fontSize: 12,
    color: TEXT_SECONDARY,
    fontFamily: Fonts.sans,
    lineHeight: 16,
  },
});
