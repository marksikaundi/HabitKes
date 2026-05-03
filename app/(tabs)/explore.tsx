import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
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
import type { Activity } from "@/lib/accountability-board";
import { useAccountabilityBoard } from "@/lib/accountability-board";

function toneAccent(tone: Activity["tone"]): string {
  if (tone === "positive") return ACCENT_LIME;
  if (tone === "warning") return "#F59E0B";
  return BORDER_SUBTLE;
}

export default function CrewScreen() {
  const insets = useSafeAreaInsets();
  const {
    friends,
    activity,
    connectionLabel,
    connectionState,
    addFriend,
    refreshBoard,
  } = useAccountabilityBoard();
  const [name, setName] = useState("");
  const [focus, setFocus] = useState("Daily consistency");

  const inviteFriend = async () => {
    await addFriend(name, focus);
    setName("");
    setFocus("Daily consistency");
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.page,
        {
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: Math.max(insets.bottom, 28),
          backgroundColor: BACKGROUND_PAGE,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.screenTitle}>Activity</Text>
          <Text style={styles.screenSubtitle}>
            Everything you and your crew log shows up here.
          </Text>
        </View>
        <Pressable
          onPress={() => void refreshBoard()}
          style={({ pressed }) => [
            styles.syncChip,
            pressed && styles.syncChipPressed,
          ]}
        >
          <Text style={styles.syncChipText}>Sync</Text>
        </Pressable>
      </View>

      <View style={styles.statusRow}>
        <View
          style={[
            styles.liveDot,
            connectionState === "live"
              ? styles.liveDotOn
              : styles.liveDotIdle,
          ]}
        />
        <Text style={styles.statusText} numberOfLines={2}>
          {connectionLabel}
        </Text>
      </View>

      <Text style={styles.sectionHeading}>Recent</Text>
      <View style={styles.activityPanel}>
        {activity.length === 0 ? (
          <Text style={styles.emptyText}>
            No activity yet. Tap + to log something.
          </Text>
        ) : (
          activity.map((entry, index) => (
            <View
              key={entry.id}
              style={[
                styles.activityRow,
                index < activity.length - 1 && styles.activityRowBorder,
              ]}
            >
              <View
                style={[
                  styles.toneStrip,
                  { backgroundColor: toneAccent(entry.tone) },
                ]}
              />
              <View style={styles.activityBody}>
                <View style={styles.activityTop}>
                  <Text style={styles.activityTitle} numberOfLines={2}>
                    {entry.title}
                  </Text>
                  <Text style={styles.activityTime}>{entry.time}</Text>
                </View>
                <Text style={styles.activityDetail} numberOfLines={3}>
                  {entry.detail}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <Text style={[styles.sectionHeading, styles.sectionHeadingSpaced]}>
        Crew
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Invite someone</Text>
        <Text style={styles.cardHint}>
          Optional — syncs when Appwrite env is configured.
        </Text>
        <View style={styles.inputStack}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor={TEXT_SECONDARY}
            style={styles.input}
          />
          <TextInput
            value={focus}
            onChangeText={setFocus}
            placeholder="Their focus"
            placeholderTextColor={TEXT_SECONDARY}
            style={styles.input}
          />
          <Pressable
            onPress={() => void inviteFriend()}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>Add to crew</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Members</Text>
        <View style={styles.friendList}>
          {friends.map((friend, index) => (
            <View
              key={friend.id}
              style={[
                styles.friendRow,
                index < friends.length - 1 && styles.friendRowSep,
              ]}
            >
              <View
                style={[
                  styles.avatar,
                  friend.live ? styles.avatarLive : styles.avatarIdle,
                ]}
              >
                <Text style={styles.avatarText}>{friend.avatar}</Text>
              </View>
              <View style={styles.friendCopy}>
                <Text style={styles.friendName}>{friend.name}</Text>
                <Text style={styles.friendMeta}>{friend.focus}</Text>
              </View>
              <View
                style={[
                  styles.presenceDot,
                  friend.live ? styles.presenceOn : styles.presenceOff,
                ]}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.metaCard}>
        <Text style={styles.metaTitle}>Appwrite</Text>
        <Text style={styles.metaCopy}>
          Add Expo public env vars for habits, friends, and activity collections
          to enable cloud sync and realtime updates.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 20,
    gap: 0,
  },

  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: TEXT_PRIMARY,
    letterSpacing: -0.5,
  },
  screenSubtitle: {
    marginTop: 6,
    fontSize: 15,
    color: TEXT_SECONDARY,
    lineHeight: 21,
    maxWidth: 260,
  },
  syncChip: {
    marginTop: 2,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: SURFACE_MUTED,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
  },
  syncChipPressed: {
    opacity: 0.85,
  },
  syncChipText: {
    fontSize: 13,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 22,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: SURFACE_MUTED,
    borderRadius: 16,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  liveDotOn: {
    backgroundColor: ACCENT_LIME,
  },
  liveDotIdle: {
    backgroundColor: TEXT_SECONDARY,
    opacity: 0.5,
  },
  statusText: {
    flex: 1,
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
    lineHeight: 18,
  },

  sectionHeading: {
    fontSize: 13,
    fontFamily: Fonts.semibold,
    color: TEXT_SECONDARY,
    letterSpacing: 0.3,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  sectionHeadingSpaced: {
    marginTop: 28,
  },

  activityPanel: {
    backgroundColor: BACKGROUND_PAGE,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
    overflow: "hidden",
  },
  emptyText: {
    padding: 22,
    fontSize: 15,
    color: TEXT_SECONDARY,
    textAlign: "center",
    lineHeight: 22,
  },
  activityRow: {
    flexDirection: "row",
    minHeight: 72,
  },
  activityRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER_SUBTLE,
  },
  toneStrip: {
    width: 4,
  },
  activityBody: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    paddingLeft: 12,
    gap: 6,
  },
  activityTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  activityTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
    lineHeight: 22,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
  activityDetail: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 20,
  },

  card: {
    marginTop: 12,
    borderRadius: 24,
    padding: 18,
    backgroundColor: BACKGROUND_PAGE,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
  },
  cardTitle: {
    fontSize: 17,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
    marginBottom: 6,
  },
  cardHint: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 19,
    marginBottom: 14,
  },
  inputStack: {
    gap: 10,
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
    backgroundColor: SURFACE_MUTED,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: Fonts.sans,
    color: TEXT_PRIMARY,
  },
  primaryButton: {
    backgroundColor: ACCENT_LIME,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  buttonPressed: {
    opacity: 0.92,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: ACCENT_ON_LIME,
  },

  friendList: {
    gap: 0,
    marginTop: 4,
  },
  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  friendRowSep: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER_SUBTLE,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLive: {
    backgroundColor: "rgba(199, 244, 50, 0.35)",
  },
  avatarIdle: {
    backgroundColor: SURFACE_MUTED,
  },
  avatarText: {
    fontSize: 15,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
  },
  friendCopy: {
    flex: 1,
    gap: 3,
  },
  friendName: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: TEXT_PRIMARY,
  },
  friendMeta: {
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  presenceDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  presenceOn: {
    backgroundColor: ACCENT_LIME,
  },
  presenceOff: {
    backgroundColor: BORDER_SUBTLE,
  },

  metaCard: {
    marginTop: 24,
    padding: 16,
    borderRadius: 20,
    backgroundColor: SURFACE_MUTED,
    borderWidth: 1,
    borderColor: BORDER_SUBTLE,
  },
  metaTitle: {
    fontSize: 12,
    fontFamily: Fonts.semibold,
    color: TEXT_SECONDARY,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  metaCopy: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 19,
  },
});
