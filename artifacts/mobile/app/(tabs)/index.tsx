import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useGetFirmsOverrides } from "@workspace/api-client-react";

import { FirmCard } from "@/components/FirmCard";
import { InboxIcon, SearchIcon } from "@/components/icons";
import { useColors } from "@/hooks/useColors";
import { firms } from "@/data-firms";

export default function FirmsScreen() {
  const c = useColors();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const { data: overrides, isLoading, refetch, isRefetching } = useGetFirmsOverrides();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return firms;
    return firms.filter((f) => f.name.toLowerCase().includes(q));
  }, [query]);

  const isWeb = Platform.OS === "web";

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={[styles.searchRow, { backgroundColor: c.cardSolid, borderColor: c.cardBorder }]}>
        <SearchIcon size={16} color={c.mutedForeground} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search firms"
          placeholderTextColor={c.textMuted}
          style={[styles.input, { color: c.foreground }]}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      {isLoading && !overrides ? (
        <View style={styles.center}>
          <ActivityIndicator color={c.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(f) => f.slug}
          contentContainerStyle={{
            padding: 16,
            paddingTop: 4,
            paddingBottom: isWeb ? 100 : 120,
            gap: 12,
          }}
          renderItem={({ item }) => (
            <FirmCard
              firm={item}
              override={overrides?.[item.slug]}
              onPress={() => router.push(`/firm/${item.slug}`)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <InboxIcon size={32} color={c.mutedForeground} />
              <Text style={{ color: c.mutedForeground, marginTop: 8 }}>No firms match</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={c.primary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
  },
  input: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  center: { padding: 40, alignItems: "center", justifyContent: "center" },
});
