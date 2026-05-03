import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { StreakRewardModal } from "@/components/streak-reward-modal";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AccountabilityBoardProvider } from "@/lib/accountability-board";
import { StreakGamificationProvider } from "@/lib/streak-gamification";
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  useFonts,
} from "@expo-google-fonts/outfit";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StreakGamificationProvider>
        <AccountabilityBoardProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="add-activity"
              options={{
                presentation: "modal",
                title: "Add activity",
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
        </AccountabilityBoardProvider>
        <StreakRewardModal />
      </StreakGamificationProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
