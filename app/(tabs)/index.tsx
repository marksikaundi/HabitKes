import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
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

  const [selectedDate, setSelectedDate] = useState(3); // Wednesday (12)
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dates = [9, 10, 11, 12, 13, 14, 15];
  const currentDay = new Date().getDay();

  const morningHabit = habits.find((h) => h.title.includes("Morning"));
  const eveningHabit = habits.find((h) => h.title.includes("Evening"));

  return (
    <ScrollView
      contentContainerStyle={[styles.page, { backgroundColor: "#F5F6FA" }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.greetingRow}>
          <View>
            <ThemedText type="defaultSemiBold" style={styles.greeting}>
              Good afternoon.
            </ThemedText>
          </View>
          <View style={styles.streakBadge}>
            <ThemedText type="defaultSemiBold" style={styles.streakText}>
              🔥 10
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Date Selector */}
      <View style={styles.dateSelector}>
        {days.map((day, index) => (
          <Pressable
            key={index}
            onPress={() => setSelectedDate(index)}
            style={[
              styles.dateItem,
              selectedDate === index && styles.dateItemSelected,
            ]}
          >
            <ThemedText
              style={[
                styles.dayText,
                selectedDate === index && styles.dayTextSelected,
              ]}
            >
              {day}
            </ThemedText>
            <ThemedText
              type="defaultSemiBold"
              style={[
                styles.dateText,
                selectedDate === index && styles.dateTextSelected,
              ]}
            >
              {dates[index]}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      {/* Cards Row */}
      <View style={styles.cardsRow}>
        {/* Morning Card */}
        <Pressable
          onPress={() => morningHabit && toggleHabit(morningHabit.id)}
          style={[styles.card, styles.morningCard]}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardIcon}>
              <ThemedText style={styles.iconEmoji}>🌱</ThemedText>
            </View>
            <ThemedText style={styles.cardLabel}>
              Morning Preparation
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              Ready to take on the day?
            </ThemedText>
            <Pressable
              style={styles.beginButton}
              onPress={() => morningHabit && toggleHabit(morningHabit.id)}
            >
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                Begin
              </ThemedText>
            </Pressable>
          </View>
        </Pressable>

        {/* Evening Card */}
        <Pressable style={[styles.card, styles.eveningCard]}>
          <View style={styles.cardContent}>
            <View style={styles.cardIcon}>
              <ThemedText style={styles.iconEmoji}>🌙</ThemedText>
            </View>
            <ThemedText style={styles.cardLabel}>Evening complete.</ThemedText>
            <View style={styles.moodButtons}>
              <View style={styles.moodOption}>
                <ThemedText style={styles.moodEmoji}>😌</ThemedText>
                <ThemedText style={styles.moodText}>Satisfied</ThemedText>
              </View>
              <View style={styles.moodOption}>
                <ThemedText style={styles.moodEmoji}>😊</ThemedText>
                <ThemedText style={styles.moodText}>Happy</ThemedText>
              </View>
            </View>
            <Pressable style={styles.moreButton}>
              <ThemedText type="defaultSemiBold" style={styles.moreText}>
                +3More
              </ThemedText>
            </Pressable>
          </View>
        </Pressable>
      </View>

      {/* Progress Section */}
      <ThemedView
        style={styles.progressCard}
        lightColor="#FFFFFF"
        darkColor="#15181C"
      >
        <ThemedText style={styles.progressLabel}>Day 5 of 7</ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.progressTitle}>
          On Glowing reviews.
        </ThemedText>
        <ThemedText style={styles.progressSubtitle}>
          Was there a time you could've said something nice but didn&apos;t?
        </ThemedText>
        <Pressable style={styles.reflectButton}>
          <ThemedText type="defaultSemiBold" style={styles.reflectButtonText}>
            Reflect
          </ThemedText>
        </Pressable>
      </ThemedView>
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
    gap: 20,
    backgroundColor: "#F5F6FA",
  },

  // Header Section
  headerSection: {
    marginTop: 8,
  },
  greetingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 28,
    fontFamily: Fonts.semibold,
    color: "#1F2937",
  },
  streakBadge: {
    backgroundColor: "#FFE4B5",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  streakText: {
    fontSize: 16,
    color: "#D97706",
  },

  // Date Selector
  dateSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  dateItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  dateItemSelected: {
    backgroundColor: "#C8FF1A",
  },
  dayText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  dayTextSelected: {
    color: "#1C2011",
  },
  dateText: {
    fontSize: 16,
    color: "#374151",
  },
  dateTextSelected: {
    color: "#1C2011",
  },

  // Cards Row
  cardsRow: {
    flexDirection: "row",
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  morningCard: {
    backgroundColor: "#FFFFFF",
  },
  eveningCard: {
    backgroundColor: "#FFFFFF",
  },
  cardContent: {
    gap: 12,
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  iconEmoji: {
    fontSize: 28,
  },
  cardLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  cardTitle: {
    fontSize: 16,
    color: "#1F2937",
    lineHeight: 22,
  },
  beginButton: {
    backgroundColor: "#C8FF1A",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    color: "#1C2011",
  },

  // Mood Options
  moodButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  moodOption: {
    alignItems: "center",
    gap: 4,
  },
  moodEmoji: {
    fontSize: 28,
  },
  moodText: {
    fontSize: 12,
    color: "#6B7280",
  },
  moreButton: {
    backgroundColor: "#C8FF1A",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  moreText: {
    fontSize: 12,
    color: "#1C2011",
  },

  // Progress Card
  progressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  progressLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: Fonts.semibold,
  },
  progressTitle: {
    fontSize: 18,
    color: "#1F2937",
    fontFamily: Fonts.semibold,
  },
  progressSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  reflectButton: {
    backgroundColor: "#C8FF1A",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  reflectButtonText: {
    fontSize: 16,
    color: "#1C2011",
  },

  // Unused Stats
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
});
