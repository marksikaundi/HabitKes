import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
import {
  STREAK_MILESTONES,
  useStreakGamification,
} from "@/lib/streak-gamification";

export default function JourneyScreen() {
  const insets = useSafeAreaInsets();
  const { loaded, snapshot } = useStreakGamification();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.page,
        {
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: Math.max(insets.bottom, 120),
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.kicker}>Journey</Text>
      <Text style={styles.headline}>Your streak & rewards</Text>
      <Text style={styles.lede}>
        Open the app once each day to grow your streak. Hit milestones to earn
        Spark points you can treat as bragging rights—or your own rule for what
        they unlock later.
      </Text>

      <View style={styles.statsCard}>
        <View style={styles.statCell}>
          <Text style={styles.statLabel}>Current streak</Text>
          <Text style={styles.statValue}>
            {loaded ? snapshot.currentStreak : "—"}
          </Text>
          <Text style={styles.statHint}>days in a row</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCell}>
          <Text style={styles.statLabel}>Best streak</Text>
          <Text style={styles.statValue}>
            {loaded ? snapshot.bestStreak : "—"}
          </Text>
          <Text style={styles.statHint}>personal record</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCell}>
          <Text style={styles.statLabel}>Spark points</Text>
          <Text style={styles.statValue}>
            {loaded ? snapshot.sparkPoints : "—"}
          </Text>
          <Text style={styles.statHint}>from bonuses</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Milestone bonuses</Text>
      <Text style={styles.sectionCopy}>
        Each tier pays Spark points the first time you reach it in a streak
        run. Miss a day and your streak resets—but you can earn these again on a
        fresh run.
      </Text>

      <View style={styles.milestoneList}>
        {STREAK_MILESTONES.map((m) => {
          const unlocked =
            loaded && snapshot.bestStreak >= m.days ? true : false;
          return (
            <View
              key={m.days}
              style={[styles.milestoneRow, !unlocked && styles.milestoneMuted]}
            >
              <View style={styles.milestoneLeft}>
                <Text style={styles.milestoneDays}>{m.days} days</Text>
                <Text style={styles.milestoneTitle}>{m.title}</Text>
              </View>
              <View style={styles.milestoneRight}>
                <Text
                  style={[
                    styles.milestonePts,
                    unlocked ? styles.milestonePtsOn : styles.milestonePtsOff,
                  ]}
                >
                  +{m.sparkBonus}
                </Text>
                <Text style={styles.milestoneSpark}>Spark</Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: BACKGROUND_PAGE,
  },
  page: {
    paddingHorizontal: 20,
    gap: 12,
  },
  kicker: {
    fontSize: 13,
    fontFamily: Fonts.semibold,
    color: ACCENT_LIME,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  headline: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  lede: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    lineHeight: 22,
    marginBottom: 12,
  },

  statsCard: {
    flexDirection: "row",
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 8,
    backgroundColor: SURFACE_MUTED,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
    marginBottom: 8,
  },
  statCell: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: BORDER_SUBTLE,
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: Fonts.semibold,
    color: TEXT_SECONDARY,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  statValue: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
  },
  statHint: {
    fontSize: 11,
    color: TEXT_SECONDARY,
    textAlign: "center",
  },

  sectionTitle: {
    marginTop: 16,
    fontSize: 17,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
  },
  sectionCopy: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 20,
    marginBottom: 8,
  },

  milestoneList: {
    gap: 10,
    marginBottom: 24,
  },
  milestoneRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    backgroundColor: BACKGROUND_PAGE,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
  },
  milestoneMuted: {
    opacity: 0.72,
  },
  milestoneLeft: {
    flex: 1,
    gap: 4,
    paddingRight: 12,
  },
  milestoneDays: {
    fontSize: 12,
    fontFamily: Fonts.semibold,
    color: ACCENT_LIME,
    letterSpacing: 0.3,
  },
  milestoneTitle: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
  },
  milestoneRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  milestonePts: {
    fontSize: 18,
    fontFamily: Fonts.bold,
  },
  milestonePtsOn: {
    color: ACCENT_ON_LIME,
  },
  milestonePtsOff: {
    color: TEXT_SECONDARY,
  },
  milestoneSpark: {
    fontSize: 11,
    color: TEXT_SECONDARY,
  },
});
