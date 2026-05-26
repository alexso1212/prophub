import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useGetFirmsOverrides } from "@workspace/api-client-react";

import { FirmCard } from "@/components/FirmCard";
import { type TrophyTier } from "@/components/icons";
import { useColors } from "@/hooks/useColors";
import { firms } from "@/data-firms";

const TIERS: TrophyTier[] = ["gold", "silver", "bronze"];

export default function OffersScreen() {
  const c = useColors();
  const router = useRouter();
  const { data: overrides, isLoading, refetch, isRefetching } = useGetFirmsOverrides();

  const sorted = useMemo(() => {
    return firms
      .map((f) => {
        const ov = overrides?.[f.slug];
        const pct = ov?.discountPercent ?? ov?.promoPercent ?? f.promoPercent;
        return { firm: f, ov, pct };
      })
      .filter((x) => x.pct > 0)
      .sort((a, b) => b.pct - a.pct);
  }, [overrides]);

  if (isLoading && !overrides) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <ActivityIndicator color={c.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: c.background }}
      data={sorted}
      keyExtractor={(x) => x.firm.slug}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: Platform.OS === "web" ? 100 : 120,
        gap: 12,
      }}
      renderItem={({ item, index }) => (
        <FirmCard
          firm={item.firm}
          override={item.ov}
          trophyTier={index < 3 ? TIERS[index] : undefined}
          trophyRank={index < 3 ? index + 1 : undefined}
          onPress={() => router.push(`/firm/${item.firm.slug}`)}
        />
      )}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={c.primary} />
      }
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
