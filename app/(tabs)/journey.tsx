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
        Each tier pays Spark the first time you reach it in a streak run. Cards
        glow when you&apos;ve unlocked them at least once.
      </Text>

      <View style={styles.milestoneList}>
        {STREAK_MILESTONES.map((m, index) => {
          const unlocked = loaded && snapshot.bestStreak >= m.days;
          const daysToGo =
            loaded && !unlocked
              ? Math.max(0, m.days - snapshot.currentStreak)
              : null;

          return (
            <View
              key={m.days}
              style={[
                styles.bonusCard,
                unlocked ? styles.bonusCardUnlocked : styles.bonusCardLocked,
              ]}
            >
              <View
                style={[
                  styles.bonusAccent,
                  unlocked && styles.bonusAccentOn,
                ]}
              />

              <View style={styles.bonusMain}>
                <View style={styles.bonusTopRow}>
                  <View style={styles.dayPill}>
                    <Text style={styles.dayPillText}>{m.days} days</Text>
                  </View>
                  {unlocked ? (
                    <View style={styles.earnedPill}>
                      <Text style={styles.earnedPillText}>✓ Earned</Text>
                    </View>
                  ) : loaded && daysToGo !== null && daysToGo > 0 ? (
                    <Text style={styles.toGoText}>
                      {daysToGo} day{daysToGo === 1 ? "" : "s"} to go
                    </Text>
                  ) : null}
                </View>

                <Text style={styles.bonusTitle}>{m.title}</Text>
                <Text style={styles.bonusSubtitle}>{m.subtitle}</Text>
              </View>

              <View
                style={[
                  styles.sparkPanel,
                  unlocked ? styles.sparkPanelOn : styles.sparkPanelOff,
                ]}
              >
                <Text
                  style={[
                    styles.sparkAmount,
                    unlocked ? styles.sparkAmountOn : styles.sparkAmountOff,
                  ]}
                >
                  +{m.sparkBonus}
                </Text>
                <Text
                  style={[
                    styles.sparkLabel,
                    unlocked ? styles.sparkLabelOn : styles.sparkLabelOff,
                  ]}
                >
                  Spark
                </Text>
                <Text
                  style={styles.sparkSparkle}
                  importantForAccessibility="no"
                >
                  {index === 3 ? "🏆" : "✨"}
                </Text>
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
    marginBottom: 6,
  },

  milestoneList: {
    gap: 14,
    marginBottom: 28,
  },

  bonusCard: {
    flexDirection: "row",
    borderRadius: 26,
    overflow: "hidden",
    minHeight: 132,
    backgroundColor: BACKGROUND_PAGE,
    borderWidth: 1,
    shadowColor: ACCENT_ON_LIME,
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  bonusCardUnlocked: {
    borderColor: ACCENT_LIME,
    borderWidth: 1.5,
    backgroundColor: "rgba(199, 244, 50, 0.08)",
  },
  bonusCardLocked: {
    borderColor: BORDER_SUBTLE,
    opacity: 0.96,
  },

  bonusAccent: {
    width: 5,
    backgroundColor: BORDER_SUBTLE,
  },
  bonusAccentOn: {
    backgroundColor: ACCENT_LIME,
  },

  bonusMain: {
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 14,
    paddingRight: 10,
    justifyContent: "center",
    gap: 6,
  },
  bonusTopRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 2,
  },
  dayPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: SURFACE_MUTED,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
  },
  dayPillText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    letterSpacing: 0.2,
  },
  earnedPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(199, 244, 50, 0.45)",
    borderWidth: 1,
    borderColor: ACCENT_LIME,
  },
  earnedPillText: {
    fontSize: 11,
    fontFamily: Fonts.semibold,
    color: ACCENT_ON_LIME,
  },
  toGoText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
  },
  bonusTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    letterSpacing: -0.3,
  },
  bonusSubtitle: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 20,
  },

  sparkPanel: {
    width: 108,
    marginVertical: 10,
    marginRight: 10,
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  sparkPanelOn: {
    backgroundColor: ACCENT_LIME,
    borderWidth: 1,
    borderColor: "rgba(28, 32, 17, 0.08)",
  },
  sparkPanelOff: {
    backgroundColor: SURFACE_MUTED,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
  },
  sparkAmount: {
    fontSize: 26,
    fontFamily: Fonts.bold,
    letterSpacing: -0.8,
  },
  sparkAmountOn: {
    color: ACCENT_ON_LIME,
  },
  sparkAmountOff: {
    color: TEXT_PRIMARY,
    opacity: 0.55,
  },
  sparkLabel: {
    fontSize: 12,
    fontFamily: Fonts.semibold,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  sparkLabelOn: {
    color: ACCENT_ON_LIME,
    opacity: 0.85,
  },
  sparkLabelOff: {
    color: TEXT_SECONDARY,
  },
  sparkSparkle: {
    marginTop: 4,
    fontSize: 16,
    opacity: 0.9,
  },
});
