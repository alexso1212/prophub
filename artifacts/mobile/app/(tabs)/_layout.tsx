import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { BriefcaseIcon, GiftIcon, MessageCircleIcon } from "@/components/icons";
import { useColors } from "@/hooks/useColors";
import { useThemeMode } from "@/hooks/useTheme";

export default function TabLayout() {
  const colors = useColors();
  const { resolved } = useThemeMode();
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.foreground,
        headerTitleStyle: { color: colors.foreground, fontFamily: "Inter_700Bold" },
        sceneStyle: { backgroundColor: colors.background },
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={100}
              tint={resolved === "light" ? "light" : "dark"}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} />
          ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Firms",
          headerTitle: "Prop Firm Match",
          tabBarIcon: ({ color }) => <BriefcaseIcon size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="offers"
        options={{
          title: "Offers",
          headerTitle: "Best Offers",
          tabBarIcon: ({ color }) => <GiftIcon size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "社区",
          headerTitle: "社区",
          tabBarIcon: ({ color }) => <MessageCircleIcon size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "设置",
          headerTitle: "设置",
          tabBarIcon: ({ color }) => <Feather name="settings" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
