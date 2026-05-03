import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { useAccountabilityBoard } from "@/lib/accountability-board";

export default function CrewScreen() {
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
        { backgroundColor: Colors.light.background },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <ThemedView style={styles.hero} lightColor="#0F172A" darkColor="#0F172A">
        <ThemedText type="defaultSemiBold" style={styles.heroEyebrow}>
          Social accountability
        </ThemedText>
        <ThemedText type="title" style={styles.heroTitle}>
          Bring friends into the streak.
        </ThemedText>
        <ThemedText style={styles.heroCopy}>
          Appwrite keeps the board synced, so every check-in and nudge shows up
          for the whole crew.
        </ThemedText>

        <View style={styles.setupRow}>
          <View
            style={[
              styles.connectionPill,
              connectionState === "live"
                ? styles.connectionLive
                : styles.connectionDemo,
            ]}
          >
            <ThemedText type="defaultSemiBold" style={styles.connectionText}>
              {connectionLabel}
            </ThemedText>
          </View>
          <Pressable
            onPress={() => void refreshBoard()}
            style={({ pressed }) => [
              styles.refreshButton,
              pressed && styles.refreshPressed,
            ]}
          >
            <ThemedText type="defaultSemiBold" style={styles.refreshText}>
              Refresh board
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>

      <ThemedView style={styles.card} lightColor="#FFFFFF" darkColor="#15181C">
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Invite a friend
        </ThemedText>
        <ThemedText style={styles.sectionCopy}>
          Add someone to the accountability loop. Their invite will also sync to
          the Appwrite database when the env vars are set.
        </ThemedText>

        <View style={styles.inputStack}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Friend name"
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />
          <TextInput
            value={focus}
            onChangeText={setFocus}
            placeholder="Their focus"
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />
          <Pressable
            onPress={() => void inviteFriend()}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <ThemedText type="defaultSemiBold" style={styles.primaryButtonText}>
              Add to crew
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>

      <View style={styles.gridRow}>
        <ThemedView
          style={styles.card}
          lightColor="#FFFFFF"
          darkColor="#15181C"
        >
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Live members
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
                <View
                  style={[
                    styles.liveDot,
                    friend.live ? styles.liveDotOn : styles.liveDotOff,
                  ]}
                />
              </View>
            ))}
          </View>
        </ThemedView>

        <ThemedView
          style={styles.card}
          lightColor="#FFFFFF"
          darkColor="#15181C"
        >
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Realtime notes
          </ThemedText>
          <View style={styles.noteList}>
            {activity.map((entry) => (
              <View key={entry.id} style={styles.noteRow}>
                <ThemedText type="defaultSemiBold" style={styles.noteTitle}>
                  {entry.title}
                </ThemedText>
                <ThemedText style={styles.noteDetail}>
                  {entry.detail}
                </ThemedText>
                <ThemedText style={styles.noteTime}>{entry.time}</ThemedText>
              </View>
            ))}
          </View>
        </ThemedView>
      </View>

      <ThemedView
        style={styles.footerCard}
        lightColor="#F97316"
        darkColor="#F97316"
      >
        <ThemedText type="defaultSemiBold" style={styles.footerLabel}>
          Appwrite setup
        </ThemedText>
        <ThemedText type="title" style={styles.footerTitle}>
          Use database + realtime collections
        </ThemedText>
        <ThemedText style={styles.footerCopy}>
          Set the Expo public env vars for endpoint, project, database, and the
          habits, friends, and activity collection IDs. Once they are in place,
          the board switches from demo mode to live sync.
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    gap: 16,
    backgroundColor: "#F3F7FB",
  },
  hero: {
    borderRadius: 28,
    padding: 22,
    gap: 14,
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    backgroundColor: Colors.light.accentDark,
  },
  heroEyebrow: {
    color: Colors.light.accent,
    textTransform: "uppercase",
    letterSpacing: 1.3,
    fontSize: 12,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontFamily: Fonts.sans,
    fontSize: 32,
  },
  heroCopy: {
    color: "#CBD5E1",
    lineHeight: 22,
  },
  setupRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  connectionPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  connectionLive: {
    backgroundColor: "rgba(16, 185, 129, 0.18)",
  },
  connectionDemo: {
    backgroundColor: "rgba(249, 115, 22, 0.18)",
  },
  connectionText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  refreshButton: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  refreshPressed: {
    opacity: 0.86,
  },
  refreshText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  card: {
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
  sectionTitle: {
    fontFamily: Fonts.semibold,
  },
  sectionCopy: {
    color: "#64748B",
    lineHeight: 22,
  },
  inputStack: {
    gap: 10,
  },
  input: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#0F172A",
  },
  primaryButton: {
    backgroundColor: Colors.light.accent,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: Colors.light.accentDark,
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  footerCard: {
    borderRadius: 28,
    padding: 20,
    gap: 10,
    backgroundColor: Colors.light.background,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  primaryButtonText: {
    color: "#FFFFFF",
  },
  gridRow: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
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
    width: 42,
    height: 42,
    borderRadius: 21,
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
    fontSize: 14,
  },
  friendCopy: {
    flex: 1,
    gap: 4,
  },
  friendMeta: {
    color: "#64748B",
    fontSize: 12,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  liveDotOn: {
    backgroundColor: "#10B981",
  },
  liveDotOff: {
    backgroundColor: "#94A3B8",
  },
  noteList: {
    gap: 12,
  },
  noteRow: {
    gap: 4,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E2E8F0",
  },
  noteTitle: {
    fontSize: 14,
  },
  noteDetail: {
    color: "#64748B",
    lineHeight: 20,
  },
  noteTime: {
    color: "#94A3B8",
    fontSize: 12,
  },
  footerLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  footerTitle: {
    color: "#FFFFFF",
    fontFamily: Fonts.bold,
    fontSize: 28,
    lineHeight: 34,
  },
  footerCopy: {
    color: "rgba(255, 255, 255, 0.92)",
    lineHeight: 22,
    fontSize: 15,
  },
});
