import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: "absolute",
          bottom: 12,
          left: 16,
          right: 16,
          height: 72,
          borderRadius: 36,
          backgroundColor: Colors.light.background,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 36 : 28}
              name="huge-house"
              color={color}
              weight={focused ? "bold" : "regular"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Crew",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 34 : 28}
              name="huge-crew"
              color={color}
              weight={focused ? "bold" : "regular"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
