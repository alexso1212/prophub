import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { setBaseUrl } from "@workspace/api-client-react";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useColors } from "@/hooks/useColors";
import { ThemeProvider } from "@/hooks/useTheme";

SplashScreen.preventAutoHideAsync();

if (process.env.EXPO_PUBLIC_DOMAIN) {
  setBaseUrl(`https://${process.env.EXPO_PUBLIC_DOMAIN}`);
}

const queryClient = new QueryClient();

function RootLayoutNav() {
  const c = useColors();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: c.background },
        headerTintColor: c.foreground,
        headerTitleStyle: { color: c.foreground, fontFamily: "Inter_600SemiBold" },
        contentStyle: { backgroundColor: c.background },
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="firm/[slug]" options={{ title: "" }} />
    </Stack>
  );
}

function ThemedGestureRoot({ children }: { children: React.ReactNode }) {
  const c = useColors();
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: c.background }}>
      {children}
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ThemedGestureRoot>
              <KeyboardProvider>
                <RootLayoutNav />
              </KeyboardProvider>
            </ThemedGestureRoot>
          </ThemeProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
