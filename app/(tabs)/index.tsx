import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { useAccountabilityBoard } from "@/lib/accountability-board";

export default function HomeScreen() {
  const {
    habits,
    friends,
    activity,
    connectionLabel,
    connectionState,
    toggleHabit,
  } = useAccountabilityBoard();

  const summary = useMemo(
    () => ({
      activeHabits: habits.length,
      liveFriends: friends.filter((friend) => friend.live).length,
      streakDays: habits.reduce((total, habit) => total + habit.streak, 0),
    }),
    [friends, habits],
  );

  const topHabit = habits[0];
  return (
    <ScrollView
      contentContainerStyle={[
        styles.page,
        { backgroundColor: Colors.light.background },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroGlow} />
      <View style={styles.heroGlowSecondary} />

      <ThemedView
        style={[styles.heroCard, { backgroundColor: Colors.light.background }]}
        lightColor={Colors.light.background}
        darkColor={Colors.dark.background}
      >
        <View style={styles.pillRow}>
          <View
            style={[
              styles.statusPill,
              connectionState === "live"
                ? { backgroundColor: "rgba(16,185,129,0.14)" }
                : { backgroundColor: "rgba(200,255,26,0.14)" },
            ]}
          >
            <ThemedText type="defaultSemiBold" style={styles.statusText}>
              {connectionState === "live"
                ? "Realtime live"
                : connectionState === "connecting"
                  ? "Syncing"
                  : "Demo mode"}
            </ThemedText>
          </View>
        </View>

        <ThemedText type="title" style={styles.heroTitle}>
          HabitKes keeps your streaks visible.
        </ThemedText>
        <ThemedText style={styles.heroCopy}>
          Track habits, bring friends into the loop, and let Appwrite realtime
          keep everyone honest when a streak changes.
        </ThemedText>

        <View style={styles.heroStatsRow}>
          <StatCard
            label="Habits"
            value={`${summary.activeHabits}`}
            accent={Colors.light.accent}
          />
          <StatCard
            label="Live friends"
            value={`${summary.liveFriends}`}
            accent="#6D7588"
          />
          <StatCard
            label="Total streak"
            value={`${summary.streakDays}`}
            accent={Colors.light.accentDark}
          />
        </View>

        <ThemedText type="defaultSemiBold" style={styles.connectionLabel}>
          {connectionLabel}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.sectionHeader}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Today&apos;s habits
        </ThemedText>
        <ThemedText style={styles.sectionSubtitle}>
          Tap a card to mark it complete and push the update through the board.
        </ThemedText>
      </ThemedView>

      <View style={styles.habitList}>
        {habits.map((habit) => (
          <Pressable
            key={habit.id}
            onPress={() => void toggleHabit(habit.id)}
            style={({ pressed }) => [
              styles.habitCard,
              pressed && styles.cardPressed,
            ]}
          >
            <View style={styles.habitHeader}>
              <View
                style={[styles.accentBar, { backgroundColor: habit.color }]}
              />
              <View style={styles.habitCopy}>
                <View style={styles.habitTitleRow}>
                  <ThemedText type="defaultSemiBold" style={styles.habitTitle}>
                    {habit.title}
                  </ThemedText>
                  <View
                    style={[
                      styles.badge,
                      habit.completedToday
                        ? styles.badgeDone
                        : styles.badgePending,
                    ]}
                  >
                    <ThemedText type="defaultSemiBold" style={styles.badgeText}>
                      {habit.completedToday ? "Done" : "Open"}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.habitMeta}>
                  {habit.cadence} • {habit.streak} day streak • best{" "}
                  {habit.bestStreak}
                </ThemedText>
              </View>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${habit.progress}%`, backgroundColor: habit.color },
                ]}
              />
            </View>

            <View style={styles.habitFooter}>
              <ThemedText style={styles.supporterText}>
                {habit.supporters.join(" · ")} are watching this one.
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.progressText}>
                {habit.progress}%
              </ThemedText>
            </View>
          </Pressable>
        ))}
      </View>

      <ThemedView style={styles.gridRow}>
        <ThemedView
          style={[styles.sideCard, { backgroundColor: "#FFFFFF" }]}
          lightColor="#FFFFFF"
          darkColor="#15181C"
        >
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Accountability crew
          </ThemedText>
          <View style={styles.friendList}>
            {friends.map((friend) => (
              <View key={friend.id} style={styles.friendRow}>
                <View
                  style={[
                    styles.avatar,
                    friend.live ? styles.avatarLive : styles.avatarIdle,
                  ]}
                >
                  <ThemedText type="defaultSemiBold" style={styles.avatarText}>
                    {friend.avatar}
                  </ThemedText>
                </View>
                <View style={styles.friendCopy}>
                  <ThemedText type="defaultSemiBold">{friend.name}</ThemedText>
                  <ThemedText style={styles.friendMeta}>
                    {friend.focus}
                  </ThemedText>
                </View>
                <ThemedText style={styles.friendStatus}>
                  {friend.status}
                </ThemedText>
              </View>
            ))}
          </View>
        </ThemedView>

        <ThemedView
          style={[styles.sideCard, { backgroundColor: "#FFFFFF" }]}
          lightColor="#FFFFFF"
          darkColor="#15181C"
        >
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Live feed
          </ThemedText>
          <View style={styles.activityList}>
            {activity.map((entry) => (
              <View key={entry.id} style={styles.activityRow}>
                <View
                  style={[
                    styles.activityDot,
                    entry.tone === "positive"
                      ? styles.dotPositive
                      : entry.tone === "warning"
                        ? styles.dotWarning
                        : styles.dotNeutral,
                  ]}
                />
                <View style={styles.activityCopy}>
                  <View style={styles.activityHeader}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.activityTitle}
                    >
                      {entry.title}
                    </ThemedText>
                    <ThemedText style={styles.activityTime}>
                      {entry.time}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.activityDetail}>
                    {entry.detail}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        </ThemedView>
      </ThemedView>

      {topHabit ? (
        <ThemedView
          style={styles.footerCard}
          lightColor="#0F172A"
          darkColor="#0F172A"
        >
          <ThemedText type="defaultSemiBold" style={styles.footerLabel}>
            Featured streak
          </ThemedText>
          <ThemedText type="title" style={styles.footerTitle}>
            {topHabit.title}
          </ThemedText>
          <ThemedText style={styles.footerCopy}>
            Keep this moving and the realtime board will notify the whole
            accountability crew.
          </ThemedText>
        </ThemedView>
      ) : null}
    </ScrollView>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statAccent, { backgroundColor: accent }]} />
      <ThemedText type="defaultSemiBold" style={styles.statValue}>
        {value}
      </ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    gap: 16,
    backgroundColor: "#F3F7FB",
  },
  heroGlow: {
    position: "absolute",
    top: 10,
    right: -32,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(249, 115, 22, 0.15)",
  },
  heroGlowSecondary: {
    position: "absolute",
    top: 120,
    left: -38,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(37, 99, 235, 0.13)",
  },
  heroCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    gap: 16,
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  pillRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillLive: {
    backgroundColor: "rgba(16, 185, 129, 0.14)",
  },
  pillDemo: {
    backgroundColor: "rgba(249, 115, 22, 0.14)",
  },
  statusText: {
    fontSize: 12,
  },
  heroTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 34,
    lineHeight: 38,
  },
  heroCopy: {
    color: "#475569",
    fontSize: 16,
    lineHeight: 24,
  },
  heroStatsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "rgba(15, 23, 42, 0.04)",
    padding: 14,
    gap: 4,
  },
  statAccent: {
    width: 40,
    height: 4,
    borderRadius: 999,
  },
  statValue: {
    fontSize: 24,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  connectionLabel: {
    fontSize: 13,
    color: "#334155",
  },
  sectionHeader: {
    gap: 6,
  },
  sectionTitle: {
    fontFamily: Fonts.rounded,
  },
  sectionSubtitle: {
    color: "#64748B",
    lineHeight: 22,
  },
  habitList: {
    gap: 12,
  },
  habitCard: {
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: 16,
    gap: 14,
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.96,
  },
  habitHeader: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  accentBar: {
    width: 10,
    borderRadius: 999,
    minHeight: 56,
  },
  habitCopy: {
    flex: 1,
    gap: 6,
  },
  habitTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  habitTitle: {
    fontSize: 18,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeDone: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
  },
  badgePending: {
    backgroundColor: "rgba(249, 115, 22, 0.12)",
  },
  badgeText: {
    fontSize: 12,
  },
  habitMeta: {
    color: "#64748B",
    fontSize: 13,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#E2E8F0",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  habitFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  supporterText: {
    color: "#64748B",
    flex: 1,
  },
  progressText: {
    color: "#0F172A",
  },
  gridRow: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  sideCard: {
    flex: 1,
    minWidth: 280,
    borderRadius: 24,
    padding: 16,
    gap: 14,
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  friendList: {
    gap: 12,
  },
  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLive: {
    backgroundColor: "rgba(16, 185, 129, 0.16)",
  },
  avatarIdle: {
    backgroundColor: "rgba(100, 116, 139, 0.16)",
  },
  avatarText: {
    fontSize: 15,
  },
  friendCopy: {
    flex: 1,
    gap: 3,
  },
  friendMeta: {
    color: "#64748B",
    fontSize: 12,
  },
  friendStatus: {
    color: "#334155",
    fontSize: 12,
    flexBasis: "34%",
    textAlign: "right",
  },
  activityList: {
    gap: 12,
  },
  activityRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
  },
  dotPositive: {
    backgroundColor: "#10B981",
  },
  dotWarning: {
    backgroundColor: "#F97316",
  },
  dotNeutral: {
    backgroundColor: "#2563EB",
  },
  activityCopy: {
    flex: 1,
    gap: 4,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  activityTitle: {
    flex: 1,
    fontSize: 14,
  },
  activityTime: {
    color: "#94A3B8",
    fontSize: 12,
  },
  activityDetail: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 18,
  },
  footerCard: {
    borderRadius: 28,
    padding: 20,
    gap: 10,
  },
  footerLabel: {
    color: "#93C5FD",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  footerTitle: {
    color: "#FFFFFF",
    fontFamily: Fonts.rounded,
    fontSize: 28,
  },
  footerCopy: {
    color: "#CBD5E1",
    lineHeight: 22,
  },
});
