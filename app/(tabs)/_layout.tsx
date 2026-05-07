import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { Tabs, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  ACCENT_LIME,
  ACCENT_ON_LIME,
  BACKGROUND_PAGE,
  BORDER_SUBTLE,
  Colors,
  Fonts,
  TEXT_SECONDARY,
} from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const palette = Colors[colorScheme ?? "light"];

  const tabBarHeight = 56 + Math.max(insets.bottom, 12);
  const fabLift = 20;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: palette.tabIconSelected,
        tabBarInactiveTintColor: TEXT_SECONDARY,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: tabBarHeight,
          paddingBottom: Math.max(insets.bottom, 10),
          paddingTop: 10,
          backgroundColor: BACKGROUND_PAGE,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: BORDER_SUBTLE,
          elevation: 8,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -2 },
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily:
            Platform.OS === "web"
              ? undefined
              : (Fonts?.medium as string | undefined),
          color: TEXT_SECONDARY,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="Home" />,
          tabBarIcon: ({ color, focused }) => (
            <TabGlyph focused={focused}>
              <IconSymbol
                size={focused ? 26 : 22}
                name="house.fill"
                color={color}
                weight={focused ? "bold" : "regular"}
              />
            </TabGlyph>
          ),
        }}
      />
      <Tabs.Screen
        name="inspirations"
        options={{
          title: "Inspirations",
          tabBarLabel: ({ focused }) => (
            <TabLabel focused={focused} label="Inspirations" />
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabGlyph focused={focused}>
              <IconSymbol
                size={focused ? 26 : 22}
                name="lightbulb.fill"
                color={color}
                weight={focused ? "bold" : "regular"}
              />
            </TabGlyph>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "",
          tabBarButton: FabTabBarButton,
          tabBarIcon: () => (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: ACCENT_LIME,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: fabLift,
                shadowColor: ACCENT_ON_LIME,
                shadowOpacity: 0.22,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 8 },
                elevation: 10,
              }}
              accessibilityLabel="Add activity"
            >
              <ThemedText
                type="defaultSemiBold"
                style={{
                  fontSize: 28,
                  lineHeight: 32,
                  color: ACCENT_ON_LIME,
                  marginTop: -2,
                }}
              >
                +
              </ThemedText>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarLabel: ({ focused }) => (
            <TabLabel focused={focused} label="Rituals" />
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabGlyph focused={focused}>
              <IconSymbol
                size={focused ? 26 : 22}
                name="safari.fill"
                color={color}
                weight={focused ? "bold" : "regular"}
              />
            </TabGlyph>
          ),
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: "Journey",
          tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="Journey" />,
          tabBarIcon: ({ color, focused }) => (
            <TabGlyph focused={focused}>
              <IconSymbol
                size={focused ? 26 : 22}
                name="book.fill"
                color={color}
                weight={focused ? "bold" : "regular"}
              />
            </TabGlyph>
          ),
        }}
      />
    </Tabs>
  );
}

function TabGlyph({
  children,
  focused,
}: {
  children: React.ReactNode;
  focused: boolean;
}) {
  const scale = useRef(new Animated.Value(focused ? 1 : 0.95)).current;
  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1 : 0.95,
      useNativeDriver: true,
      stiffness: 260,
      damping: 18,
      mass: 0.7,
    }).start();
  }, [focused, scale]);

  return (
    <Animated.View
      style={{
        alignItems: "center",
        opacity: focused ? 1 : 0.85,
        transform: [{ scale }],
        backgroundColor: focused ? "rgba(199, 244, 50, 0.25)" : "transparent",
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}
    >
      {children}
    </Animated.View>
  );
}

function TabLabel({ focused, label }: { focused: boolean; label: string }) {
  return (
    <Text
      style={{
        fontSize: focused ? 11 : 10,
        fontFamily: focused ? Fonts.semibold : Fonts.medium,
        color: focused ? "#202411" : TEXT_SECONDARY,
        marginTop: 1,
      }}
    >
      {label}
    </Text>
  );
}

function FabTabBarButton(props: BottomTabBarButtonProps) {
  const router = useRouter();

  return (
    <PlatformPressable
      {...props}
      accessibilityRole="button"
      accessibilityLabel="Add activity"
      onPress={() => {
        if (process.env.EXPO_OS === "ios") {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        router.push("/add-activity");
      }}
    />
  );
}
