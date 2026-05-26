import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetFirmsOverrides } from "@workspace/api-client-react";

import {
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
  StarIcon,
} from "@/components/icons";
import { useColors } from "@/hooks/useColors";
import { findFirm } from "@/data-firms";

export default function FirmDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const c = useColors();
  const insets = useSafeAreaInsets();
  const [copied, setCopied] = useState(false);

  const { data: overrides, isLoading } = useGetFirmsOverrides();
  const firm = findFirm(slug ?? "");

  if (!firm) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <Stack.Screen options={{ title: "Not found" }} />
        <Text style={{ color: c.foreground }}>Firm not found</Text>
      </View>
    );
  }

  const ov = overrides?.[firm.slug];
  const promoCode = ov?.promoCode ?? firm.promoCode;
  const promoPercent = ov?.discountPercent ?? ov?.promoPercent ?? firm.promoPercent;
  const affiliateUrl = ov?.affiliateUrl ?? undefined;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(promoCode);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleVisit = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
    const url = affiliateUrl || `https://propfirmmatch.com/firms/${firm.slug}`;
    if (Platform.OS === "web") {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      await WebBrowser.openBrowserAsync(url);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: c.background }}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: insets.bottom + 100,
        gap: 16,
      }}
    >
      <Stack.Screen options={{ title: firm.name }} />

      <View style={[styles.heroCard, { backgroundColor: c.cardSolid, borderColor: c.cardBorder }]}>
        <View style={styles.heroRow}>
          <View style={[styles.logo, { backgroundColor: c.logoBg }]}>
            {firm.logo && (
              <Image source={{ uri: firm.logo }} style={styles.logoImg} contentFit="contain" />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: c.foreground }]}>{firm.name}</Text>
            <View style={styles.metaRow}>
              {firm.rating != null && (
                <View style={styles.metaItem}>
                  <StarIcon size={13} color={c.star} filled />
                  <Text style={[styles.meta, { color: c.mutedForeground }]}>
                    {firm.rating.toFixed(1)} ({firm.reviews})
                  </Text>
                </View>
              )}
              <Text style={[styles.meta, { color: c.textMuted }]}>•</Text>
              <Text style={[styles.meta, { color: c.mutedForeground }]}>
                {firm.country} · {firm.yearsInOperation}y
              </Text>
            </View>
            {firm.ceo && (
              <Text style={[styles.meta, { color: c.textMuted, marginTop: 2 }]}>
                CEO {firm.ceo}
              </Text>
            )}
          </View>
        </View>

        {isLoading ? (
          <View style={{ paddingVertical: 12 }}>
            <ActivityIndicator color={c.primary} />
          </View>
        ) : (
          promoPercent > 0 && (
            <LinearGradient
              colors={[c.orange, c.pink, c.purple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.offerBanner}
            >
              <Text style={styles.offerPct}>{promoPercent}% OFF</Text>
              <Text style={styles.offerText}>
                {firm.offerDescription ?? "Use code at checkout"}
              </Text>
            </LinearGradient>
          )
        )}

        <Pressable
          onPress={handleCopy}
          style={({ pressed }) => [
            styles.codeBox,
            { borderColor: c.cardBorder, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <View>
            <Text style={[styles.codeLabel, { color: c.textMuted }]}>Promo code</Text>
            <Text style={[styles.codeValue, { color: c.foreground }]}>{promoCode}</Text>
          </View>
          <View style={styles.copyBtn}>
            {copied ? (
              <CheckIcon size={16} color={c.green} />
            ) : (
              <CopyIcon size={16} color={c.mutedForeground} />
            )}
            <Text style={{ color: copied ? c.green : c.mutedForeground, fontSize: 12 }}>
              {copied ? "Copied" : "Copy"}
            </Text>
          </View>
        </Pressable>

        <Pressable onPress={handleVisit} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}>
          <LinearGradient
            colors={[c.orange, c.purple]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cta}
          >
            <Text style={styles.ctaText}>Visit {firm.name}</Text>
            <ArrowUpRightIcon size={18} color="#ffffff" />
          </LinearGradient>
        </Pressable>
      </View>

      <View style={[styles.statsCard, { backgroundColor: c.cardSolid, borderColor: c.cardBorder }]}>
        <Stat label="Max Allocation" value={firm.maxAllocation} c={c} />
        <Stat
          label="Assets"
          value={typeof firm.numAssets === "number" ? `${firm.numAssets}` : firm.numAssets}
          c={c}
        />
        <Stat label="Years" value={`${firm.yearsInOperation}`} c={c} />
      </View>

      {firm.aiSummary && (
        <View style={[styles.section, { backgroundColor: c.cardSolid, borderColor: c.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: c.foreground }]}>About</Text>
          <Text style={[styles.body, { color: c.mutedForeground }]}>{firm.aiSummary}</Text>
        </View>
      )}

      {firm.platforms && firm.platforms.length > 0 && (
        <View style={[styles.section, { backgroundColor: c.cardSolid, borderColor: c.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: c.foreground }]}>Platforms</Text>
          <View style={styles.tagWrap}>
            {firm.platforms.map((p) => (
              <View
                key={p.name}
                style={[styles.tag, { backgroundColor: c.muted, borderColor: c.cardBorder }]}
              >
                <Text style={{ color: c.foreground, fontSize: 12 }}>{p.name}</Text>
              </View>
            ))}
            {firm.morePlatforms ? (
              <View style={[styles.tag, { backgroundColor: c.muted, borderColor: c.cardBorder }]}>
                <Text style={{ color: c.mutedForeground, fontSize: 12 }}>
                  +{firm.morePlatforms} more
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      )}

      {firm.challenges && firm.challenges.length > 0 && (
        <View style={[styles.section, { backgroundColor: c.cardSolid, borderColor: c.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: c.foreground }]}>Challenges</Text>
          <View style={{ gap: 8 }}>
            {firm.challenges.slice(0, 6).map((ch, i) => (
              <View
                key={`${ch.name}-${i}`}
                style={[styles.challengeRow, { borderColor: c.cardBorder }]}
              >
                <Text
                  numberOfLines={1}
                  style={{ color: c.foreground, fontSize: 13, flex: 1, marginRight: 8 }}
                >
                  {ch.name}
                </Text>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ color: c.orange, fontFamily: "Inter_600SemiBold" }}>
                    {ch.price}
                  </Text>
                  {ch.original && (
                    <Text
                      style={{ color: c.textMuted, fontSize: 11, textDecorationLine: "line-through" }}
                    >
                      {ch.original}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function Stat({
  label,
  value,
  c,
}: {
  label: string;
  value: string | number;
  c: ReturnType<typeof useColors>;
}) {
  return (
    <View style={{ flex: 1, alignItems: "center", gap: 2 }}>
      <Text style={{ color: c.foreground, fontFamily: "Inter_700Bold", fontSize: 16 }}>
        {value}
      </Text>
      <Text style={{ color: c.textMuted, fontSize: 11 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  heroCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  heroRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logoImg: { width: 50, height: 50 },
  name: { fontSize: 20, fontFamily: "Inter_700Bold" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  meta: { fontSize: 13 },
  offerBanner: { borderRadius: 12, padding: 12, gap: 4 },
  offerPct: { color: "#ffffff", fontFamily: "Inter_700Bold", fontSize: 18 },
  offerText: { color: "#ffffff", fontSize: 12, opacity: 0.9 },
  codeBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 12,
  },
  codeLabel: { fontSize: 11, marginBottom: 2 },
  codeValue: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: 1 },
  copyBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  ctaText: { color: "#ffffff", fontFamily: "Inter_700Bold", fontSize: 15 },
  statsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 14, letterSpacing: 0.3 },
  body: { fontSize: 13, lineHeight: 19 },
  tagWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  challengeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 8,
  },
});
