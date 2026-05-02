// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolViewProps } from "expo-symbols";
import { House, PlusCircle, Users } from "phosphor-react-native";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<
  SymbolViewProps["name"],
  ComponentProps<typeof MaterialIcons>["name"]
>;
type IconSymbolName =
  | keyof typeof MAPPING
  | "huge-house"
  | "huge-crew"
  | "huge-add";

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = "duotone",
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
}) {
  const colorStr = String(color);

  if (name === "huge-house") {
    return <House color={colorStr} size={size} weight={weight} style={style} />;
  }
  if (name === "huge-crew") {
    return <Users color={colorStr} size={size} weight={weight} style={style} />;
  }
  if (name === "huge-add") {
    return (
      <PlusCircle color={colorStr} size={size} weight={weight} style={style} />
    );
  }

  // Fallback to Material Icons for other names. weight is ignored for fallback.
  return (
    <MaterialIcons
      color={colorStr}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
