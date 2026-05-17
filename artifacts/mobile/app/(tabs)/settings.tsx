import { Feather } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ThemeToggle } from "@/components/ThemeToggle";
import { useColors } from "@/hooks/useColors";

export default function SettingsScreen() {
  const c = useColors();
  return (
    <ScrollView
      style={{ backgroundColor: c.background }}
      contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 16 }}
    >
      <View
        style={[
          styles.card,
          { backgroundColor: c.cardSolid, borderColor: c.cardBorder },
        ]}
      >
        <View style={styles.titleRow}>
          <Feather name="sun" size={16} color={c.foreground} />
          <Text style={[styles.title, { color: c.foreground }]}>外观</Text>
        </View>
        <Text style={[styles.subtitle, { color: c.mutedForeground }]}>
          选择适合你的配色。「跟随系统」会随手机的浅色 / 深色设置自动切换。
        </Text>
        <ThemeToggle />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 16, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, lineHeight: 19 },
});
