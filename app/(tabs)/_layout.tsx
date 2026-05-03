import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: "#9CA3AF",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: "absolute",
          bottom: 16,
          left: 16,
          right: 16,
          height: 70,
          borderRadius: 999,
          backgroundColor: "#FFFFFF",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 8 },
          borderTopWidth: 0,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: "center" }}>
              <IconSymbol
                size={focused ? 28 : 24}
                name="house.fill"
                color={color}
                weight={focused ? "bold" : "regular"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="inspirations"
        options={{
          title: "Inspirations",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: "center" }}>
              <IconSymbol
                size={focused ? 28 : 24}
                name="lightbulb.fill"
                color={color}
                weight={focused ? "bold" : "regular"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "#C8FF1A",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
                shadowColor: "#1C2011",
                shadowOpacity: 0.2,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
              }}
            >
              <ThemedText
                type="defaultSemiBold"
                style={{ fontSize: 32, color: "#1C2011" }}
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
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: "center" }}>
              <IconSymbol
                size={focused ? 28 : 24}
                name="books.vertical.fill"
                color={color}
                weight={focused ? "bold" : "regular"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: "Journey",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: "center" }}>
              <IconSymbol
                size={focused ? 28 : 24}
                name="leaf.fill"
                color={color}
                weight={focused ? "bold" : "regular"}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
