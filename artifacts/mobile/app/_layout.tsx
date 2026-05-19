import "@stardazed/streams-text-encoding";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { setAuthTokenGetter, setBaseUrl } from "@workspace/api-client-react";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useColors } from "@/hooks/useColors";
import { ThemeProvider } from "@/hooks/useTheme";
import { CommunityChatProvider } from "@/hooks/useCommunityChat";

SplashScreen.preventAutoHideAsync();

if (process.env.EXPO_PUBLIC_DOMAIN) {
  setBaseUrl(`https://${process.env.EXPO_PUBLIC_DOMAIN}`);
}

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const proxyUrl = process.env.EXPO_PUBLIC_CLERK_PROXY_URL || undefined;

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

function ClerkAuthBridge({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  useEffect(() => {
    setAuthTokenGetter(() => getToken());
    return () => setAuthTokenGetter(null);
  }, [getToken]);
  return <>{children}</>;
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

  const inner = (
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

  // Gracefully no-op if Clerk publishable key is not configured —
  // the rest of the app still works; community tab will show a sign-in prompt.
  if (!publishableKey) {
    return inner;
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
      proxyUrl={proxyUrl}
    >
      <ClerkLoaded>
        <ClerkAuthBridge>
          {/* Mounted at root so the chat client + push registration come
              online as soon as the user is signed in, regardless of which
              tab they open first. */}
          <CommunityChatProvider>{inner}</CommunityChatProvider>
        </ClerkAuthBridge>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
