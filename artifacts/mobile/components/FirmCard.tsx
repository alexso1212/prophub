import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import {
  StarIcon,
  TrophyIcon,
  TROPHY_TINTS,
  type TrophyTier,
} from "@/components/icons";
import { useColors } from "@/hooks/useColors";
import type { Firm } from "@/data-firms";
import type { FirmOverride } from "@workspace/api-client-react";

type Props = {
  firm: Firm;
  override?: FirmOverride;
  onPress: () => void;
  trophyTier?: TrophyTier;
  trophyRank?: number;
};

export function FirmCard({ firm, override, onPress, trophyTier, trophyRank }: Props) {
  const c = useColors();
  const promoCode = override?.promoCode ?? firm.promoCode;
  const promoPercent =
    override?.discountPercent ?? override?.promoPercent ?? firm.promoPercent;
  const tint = trophyTier ? TROPHY_TINTS[trophyTier] : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: c.cardSolid, borderColor: c.cardBorder, opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <View style={styles.row}>
        <View style={[styles.logo, { backgroundColor: "#ffffff10" }]}>
          {firm.logo ? (
            <Image source={{ uri: firm.logo }} style={styles.logoImg} contentFit="contain" />
          ) : (
            <Text style={{ color: c.foreground, fontFamily: "Inter_700Bold" }}>
              {firm.name.slice(0, 1)}
            </Text>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Text numberOfLines={1} style={[styles.name, { color: c.foreground }]}>
              {firm.name}
            </Text>
            {tint && (
              <View
                style={[
                  styles.trophyPill,
                  { backgroundColor: tint.bg, borderColor: tint.border },
                ]}
              >
                <TrophyIcon size={11} color={tint.text} />
                <Text style={[styles.trophyText, { color: tint.text }]}>
                  {trophyRank ?? ""}
                </Text>
              </View>
            )}
            {firm.isNew && (
              <View style={[styles.newBadge, { backgroundColor: c.green }]}>
                <Text style={styles.newText}>NEW</Text>
              </View>
            )}
          </View>
          <View style={styles.metaRow}>
            {firm.rating != null && (
              <View style={styles.metaItem}>
                <StarIcon size={12} color={c.star} filled />
                <Text style={[styles.meta, { color: c.mutedForeground }]}>
                  {firm.rating.toFixed(1)} ({firm.reviews})
                </Text>
              </View>
            )}
            <Text style={[styles.meta, { color: c.textMuted }]}>•</Text>
            <Text style={[styles.meta, { color: c.mutedForeground }]}>
              {firm.country}
            </Text>
            <Text style={[styles.meta, { color: c.textMuted }]}>•</Text>
            <Text style={[styles.meta, { color: c.mutedForeground }]}>
              {firm.yearsInOperation}y
            </Text>
          </View>
        </View>
      </View>

      {promoPercent > 0 && (
        <LinearGradient
          colors={[c.orange, c.pink, c.purple]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.promo}
        >
          <Text style={styles.promoPct}>{promoPercent}% OFF</Text>
          <View style={styles.codePill}>
            <Text style={styles.codeText}>{promoCode}</Text>
          </View>
        </LinearGradient>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  row: { flexDirection: "row", gap: 12, alignItems: "center" },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logoImg: { width: 40, height: 40 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: { fontSize: 16, fontFamily: "Inter_600SemiBold", flexShrink: 1 },
  newBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  newText: { color: "#0b0a14", fontSize: 9, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  trophyPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
  },
  trophyText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  meta: { fontSize: 12, fontFamily: "Inter_400Regular" },
  promo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  promoPct: { color: "#ffffff", fontFamily: "Inter_700Bold", fontSize: 13, letterSpacing: 0.5 },
  codePill: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  codeText: { color: "#0b0a14", fontFamily: "Inter_700Bold", fontSize: 12 },
});
