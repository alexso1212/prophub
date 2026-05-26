import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import { useThemeMode, type ThemeMode } from "@/hooks/useTheme";

const OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: "light", label: "浅色" },
  { value: "dark", label: "深色" },
  { value: "hc", label: "高对比度" },
  { value: "system", label: "跟随系统" },
];

export function ThemeToggle() {
  const c = useColors();
  const { mode, setMode } = useThemeMode();
  return (
    <View
      style={[
        styles.row,
        { backgroundColor: c.surface, borderColor: c.cardBorder },
      ]}
      accessibilityRole="radiogroup"
      accessibilityLabel="主题模式"
    >
      {OPTIONS.map((opt) => {
        const active = mode === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => setMode(opt.value)}
            style={({ pressed }) => [
              styles.btn,
              {
                backgroundColor: active ? c.primary : "transparent",
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={opt.label}
          >
            <Text
              style={{
                color: active ? c.primaryForeground : c.mutedForeground,
                fontFamily: active ? "Inter_600SemiBold" : "Inter_500Medium",
                fontSize: 13,
              }}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 1,
    borderRadius: 16,
    padding: 4,
    gap: 4,
  },
  btn: {
    flexGrow: 1,
    flexBasis: "45%",
    alignItems: "center",
    paddingVertical: 9,
    borderRadius: 12,
  },
});
