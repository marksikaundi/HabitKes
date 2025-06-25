import React from "react";
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const handleExportData = async () => {
    Alert.alert(
      "Export Data",
      "Export functionality will be implemented in a future update.",
      [{ text: "OK" }]
    );
  };

  const handleBackup = async () => {
    Alert.alert(
      "Backup Data",
      "Backup functionality will be implemented in a future update.",
      [{ text: "OK" }]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: "Check out this amazing Habit Tracker app! 🚀",
        title: "Habit Tracker App",
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const handleResetData = () => {
    Alert.alert(
      "Reset All Data",
      "This will permanently delete all your habits and progress. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Feature Coming Soon",
              "Reset functionality will be available in a future update."
            );
          },
        },
      ]
    );
  };

  const SettingItem = ({
    title,
    subtitle,
    icon,
    onPress,
    showArrow = true,
    color = colors.text,
    destructive = false,
  }: {
    title: string;
    subtitle?: string;
    icon: string;
    onPress: () => void;
    showArrow?: boolean;
    color?: string;
    destructive?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingContent}>
        <View
          style={[
            styles.settingIcon,
            { backgroundColor: (destructive ? "#FF6B6B" : colors.tint) + "20" },
          ]}
        >
          <IconSymbol
            name={icon as any}
            size={20}
            color={destructive ? "#FF6B6B" : colors.tint}
          />
        </View>
        <View style={styles.settingText}>
          <ThemedText
            style={[
              styles.settingTitle,
              { color: destructive ? "#FF6B6B" : color },
            ]}
          >
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText
              style={[styles.settingSubtitle, { color: colors.tabIconDefault }]}
            >
              {subtitle}
            </ThemedText>
          )}
        </View>
        {showArrow && (
          <IconSymbol
            name="chevron.right"
            size={16}
            color={colors.tabIconDefault}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const SettingSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <View style={styles.settingSection}>
      <ThemedText
        style={[styles.sectionTitle, { color: colors.tabIconDefault }]}
      >
        {title.toUpperCase()}
      </ThemedText>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Settings
        </ThemedText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Info */}
        <ThemedView
          style={[styles.appInfoCard, { backgroundColor: colors.card }]}
        >
          <View style={styles.appInfo}>
            <View
              style={[styles.appIcon, { backgroundColor: colors.tint + "20" }]}
            >
              <IconSymbol
                name="checkmark.circle.fill"
                size={32}
                color={colors.tint}
              />
            </View>
            <View style={styles.appDetails}>
              <ThemedText type="subtitle" style={styles.appName}>
                Habit Tracker
              </ThemedText>
              <ThemedText
                style={[styles.appVersion, { color: colors.tabIconDefault }]}
              >
                Version 1.0.0
              </ThemedText>
              <ThemedText
                style={[
                  styles.appDescription,
                  { color: colors.tabIconDefault },
                ]}
              >
                Build better habits, one day at a time
              </ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* Data & Backup */}
        <SettingSection title="Data & Backup">
          <SettingItem
            title="Export Data"
            subtitle="Export your habits and progress to CSV"
            icon="square.and.arrow.up"
            onPress={handleExportData}
          />
          <SettingItem
            title="Backup to Cloud"
            subtitle="Save your data securely"
            icon="icloud"
            onPress={handleBackup}
          />
        </SettingSection>

        {/* Notifications */}
        <SettingSection title="Notifications">
          <SettingItem
            title="Daily Reminders"
            subtitle="Get reminded to complete your habits"
            icon="bell"
            onPress={() =>
              Alert.alert(
                "Coming Soon",
                "Notification settings will be available in a future update."
              )
            }
          />
          <SettingItem
            title="Achievement Notifications"
            subtitle="Celebrate your streaks and milestones"
            icon="star"
            onPress={() =>
              Alert.alert(
                "Coming Soon",
                "Achievement notifications will be available in a future update."
              )
            }
          />
        </SettingSection>

        {/* About */}
        <SettingSection title="About">
          <SettingItem
            title="Share App"
            subtitle="Tell your friends about this app"
            icon="square.and.arrow.up"
            onPress={handleShare}
          />
          <SettingItem
            title="Rate App"
            subtitle="Help us improve with your feedback"
            icon="heart"
            onPress={() =>
              Alert.alert(
                "Thank You!",
                "App rating functionality will be available when published to app stores."
              )
            }
          />
          <SettingItem
            title="Privacy Policy"
            subtitle="How we handle your data"
            icon="lock"
            onPress={() =>
              Alert.alert(
                "Privacy Policy",
                "Your data is stored locally and never shared without your consent."
              )
            }
          />
        </SettingSection>

        {/* Advanced */}
        <SettingSection title="Advanced">
          <SettingItem
            title="Reset All Data"
            subtitle="Permanently delete all habits and progress"
            icon="trash"
            onPress={handleResetData}
            destructive
          />
        </SettingSection>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText
            style={[styles.footerText, { color: colors.tabIconDefault }]}
          >
            Made with ❤️ for habit building
          </ThemedText>
          <ThemedText
            style={[styles.footerText, { color: colors.tabIconDefault }]}
          >
            © 2025 Habit Tracker
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  appInfoCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  appInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  appDetails: {
    flex: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  appVersion: {
    fontSize: 14,
    marginTop: 2,
  },
  appDescription: {
    fontSize: 14,
    marginTop: 4,
    fontStyle: "italic",
  },
  settingSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: "transparent",
  },
  settingItem: {
    marginHorizontal: 20,
    marginBottom: 1,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 4,
  },
});
