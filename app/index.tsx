import { Redirect } from "expo-router";

/**
 * Initial route. Use `"/(tabs)"` to open the home tab bar first, or `"/onboarding"`
 * to show the intake flow first.
 */
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
