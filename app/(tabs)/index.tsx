import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FocusSvg from "@/assets/undraw/focus.svg";
import JourneySvg from "@/assets/undraw/journey.svg";
import MeditationSvg from "@/assets/undraw/meditation.svg";
import ReadingSvg from "@/assets/undraw/reading.svg";
import { ThemedText } from "@/components/themed-text";
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
import { useAccountabilityBoard } from "@/lib/accountability-board";
import { useStreakGamification } from "@/lib/streak-gamification";
import {
  formatMonthYear,
  getDaysInMonth,
  isSameCalendarDay,
  startOfMonth,
} from "@/lib/week-calendar";

function greetingForNow(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning.";
  if (h < 17) return "Good afternoon.";
  return "Good evening.";
}

export default function HomeScreen() {
  const { habits, toggleHabit } = useAccountabilityBoard();
  const { loaded: streakLoaded, snapshot: streak } = useStreakGamification();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(new Date()),
  );
  const monthDays = useMemo(
    () => getDaysInMonth(visibleMonth),
    [visibleMonth],
  );

  const [selectedDate, setSelectedDate] = useState(() => new Date());

  useFocusEffect(
    useCallback(() => {
      const now = new Date();
      setVisibleMonth(startOfMonth(now));
      setSelectedDate(now);
    }, []),
  );

  const shiftMonth = (delta: number) => {
    const next = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() + delta,
      1,
    );
    setVisibleMonth(next);
    setSelectedDate(new Date(next.getFullYear(), next.getMonth(), 1));
  };

  const greeting = greetingForNow();
  const morningHabit = habits.find((h) => h.title.includes("Morning"));
  const cardArtWidth = Math.max(96, (width - 40 - 12) / 2 - 36);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.page,
        {
          paddingTop: Math.max(insets.top, 16),
          backgroundColor: BACKGROUND_PAGE,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerSection}>
        <View style={styles.greetingRow}>
          <View style={styles.avatarGreeting}>
            <View style={styles.profileAvatar}>
              <ReadingSvg width={42} height={42} />
            </View>
            <Text style={styles.greeting}>{greeting}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakMain}>
              🔥{" "}
              {streakLoaded
                ? `${streak.currentStreak} day${streak.currentStreak === 1 ? "" : "s"}`
                : "—"}
            </Text>
            <Text style={styles.streakSub}>
              Spark {streakLoaded ? streak.sparkPoints : "—"}
              {streakLoaded && streak.bestStreak > 0
                ? ` · Best ${streak.bestStreak}`
                : ""}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.calendarShell}>
        <View style={styles.monthHeader}>
          <Pressable
            onPress={() => shiftMonth(-1)}
            style={({ pressed }) => [
              styles.monthNavBtn,
              pressed && styles.monthNavBtnPressed,
            ]}
            accessibilityLabel="Previous month"
          >
            <Text style={styles.monthNavGlyph}>‹</Text>
          </Pressable>
          <Text style={styles.monthTitle}>
            {formatMonthYear(visibleMonth)}
          </Text>
          <Pressable
            onPress={() => shiftMonth(1)}
            style={({ pressed }) => [
              styles.monthNavBtn,
              pressed && styles.monthNavBtnPressed,
            ]}
            accessibilityLabel="Next month"
          >
            <Text style={styles.monthNavGlyph}>›</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarStrip}
        >
          {monthDays.map((slot) => {
            const selected = isSameCalendarDay(slot.date, selectedDate);
            return (
              <Pressable
                key={`${slot.date.getFullYear()}-${slot.date.getMonth()}-${slot.date.getDate()}`}
                onPress={() => setSelectedDate(slot.date)}
                style={[
                  styles.dateItem,
                  { minWidth: Math.min(48, (width - 48) / 7) },
                  selected && styles.dateItemSelected,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    selected && styles.dayTextSelected,
                  ]}
                >
                  {slot.weekdayShort}
                </Text>
                <Text
                  style={[
                    styles.dateNum,
                    selected && styles.dateNumSelected,
                  ]}
                >
                  {slot.dayOfMonth}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.cardsRow}>
        <Pressable
          onPress={() => morningHabit && toggleHabit(morningHabit.id)}
          style={[styles.card, styles.cardOutlined]}
        >
          <View style={styles.cardColumn}>
            <View style={styles.cardIllustration}>
              <FocusSvg width={cardArtWidth} height={72} />
            </View>
            <ThemedText style={styles.cardEyebrow}>
              Morning Preparation
            </ThemedText>
            <Text style={[styles.cardHeadline, styles.cardHeadlineGrow]}>
              Ready to take on the day?
            </Text>
            <Pressable
              style={styles.primaryCta}
              onPress={() => morningHabit && toggleHabit(morningHabit.id)}
            >
              <Text style={styles.primaryCtaLabel}>Begin</Text>
            </Pressable>
          </View>
        </Pressable>

        <View style={[styles.card, styles.cardOutlined]}>
          <View style={styles.cardColumn}>
            <View style={styles.cardIllustration}>
              <MeditationSvg width={cardArtWidth} height={72} />
            </View>
            <ThemedText style={styles.cardEyebrow}>Evening complete.</ThemedText>
            <View style={styles.moodRow}>
              <View style={styles.moodPill}>
                <Text style={styles.moodPillText}>😌 Satisfied</Text>
              </View>
              <View style={styles.moodPill}>
                <Text style={styles.moodPillText}>😊 Happy</Text>
              </View>
            </View>
            <View style={styles.cardFlexFill} />
            <Text style={styles.moreHint}>+3More</Text>
          </View>
        </View>
      </View>

      <View style={styles.reflectShell}>
        <View style={styles.reflectTop}>
          <View style={styles.dayPill}>
            <Text style={styles.dayPillText}>Day 5 of 7</Text>
          </View>
        </View>
        <View style={styles.reflectBody}>
          <View style={styles.reflectCopy}>
            <Text style={styles.reflectTitle}>On Glowing reviews.</Text>
            <ThemedText style={styles.reflectSubtitle}>
              Was there a time you could&apos;ve said something nice but
              didn&apos;t?
            </ThemedText>
            <Pressable style={styles.primaryCta}>
              <Text style={styles.primaryCtaLabel}>Reflect</Text>
            </Pressable>
          </View>
          <View style={styles.reflectArt}>
            <JourneySvg width={88} height={72} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 20,
    gap: 20,
    paddingBottom: 140,
  },

  headerSection: {
    marginTop: 4,
  },
  greetingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatarGreeting: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ACCENT_LIME,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  greeting: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    letterSpacing: -0.3,
  },
  streakBadge: {
    backgroundColor: SURFACE_MUTED,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "flex-end",
    gap: 2,
  },
  streakMain: {
    fontSize: 15,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
  },
  streakSub: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
    maxWidth: 160,
    textAlign: "right",
  },

  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  monthNavBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BACKGROUND_PAGE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
  },
  monthNavBtnPressed: {
    opacity: 0.85,
  },
  monthNavGlyph: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    marginTop: -2,
  },
  monthTitle: {
    fontSize: 17,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
    letterSpacing: -0.2,
  },

  calendarShell: {
    backgroundColor: SURFACE_MUTED,
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  calendarStrip: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 4,
  },
  dateItem: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 18,
    backgroundColor: BACKGROUND_PAGE,
  },
  dateItemSelected: {
    backgroundColor: ACCENT_LIME,
  },
  dayText: {
    fontSize: 12,
    fontFamily: Fonts.sans,
    color: TEXT_SECONDARY,
    marginBottom: 4,
  },
  dayTextSelected: {
    color: ACCENT_ON_LIME,
    fontFamily: Fonts.semibold,
  },
  dateNum: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
  },
  dateNumSelected: {
    color: ACCENT_ON_LIME,
  },

  cardsRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "stretch",
  },
  card: {
    flex: 1,
    borderRadius: 28,
    padding: 16,
    minHeight: 220,
  },
  cardColumn: {
    flex: 1,
    gap: 10,
    justifyContent: "flex-start",
  },
  cardOutlined: {
    backgroundColor: BACKGROUND_PAGE,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
  },
  cardIllustration: {
    alignItems: "center",
    marginBottom: 8,
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: "rgba(199, 244, 50, 0.2)",
  },
  cardEyebrow: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginTop: 4,
    marginBottom: 6,
  },
  cardHeadline: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  cardHeadlineGrow: {
    flexGrow: 1,
  },
  cardFlexFill: {
    flexGrow: 1,
    minHeight: 4,
  },
  primaryCta: {
    backgroundColor: ACCENT_LIME,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  primaryCtaLabel: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: ACCENT_ON_LIME,
  },

  moodRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  moodPill: {
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: BACKGROUND_PAGE,
  },
  moodPillText: {
    fontSize: 12,
    fontFamily: Fonts.sans,
    color: TEXT_PRIMARY,
  },
  moreHint: {
    marginTop: 12,
    fontSize: 13,
    fontFamily: Fonts.semibold,
    color: ACCENT_LIME,
  },

  reflectShell: {
    backgroundColor: SURFACE_MUTED,
    borderRadius: 28,
    padding: 18,
    gap: 14,
  },
  reflectTop: {
    flexDirection: "row",
  },
  dayPill: {
    alignSelf: "flex-start",
    backgroundColor: BACKGROUND_PAGE,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
  },
  dayPillText: {
    fontSize: 12,
    fontFamily: Fonts.semibold,
    color: TEXT_SECONDARY,
  },
  reflectBody: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-end",
  },
  reflectCopy: {
    flex: 1,
    gap: 10,
  },
  reflectTitle: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
    letterSpacing: -0.3,
  },
  reflectSubtitle: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 20,
  },
  reflectArt: {
    alignItems: "center",
    justifyContent: "flex-end",
    width: 88,
  },
});
