import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { onboardingTree, type Leaf } from "@/data/onboardingCopy";
import { useColors } from "@/hooks/useColors";
import { ChevronDownIcon, CloseIcon, ExpandIcon } from "./icons";

const STORAGE_KEY = "pfm.onboarding.collapsed.v3";

interface TreeProps {
  fullscreen: boolean;
  expanded: Set<number>;
  onToggleBranch: (i: number) => void;
  activeTip: string | null;
  onToggleTip: (id: string | null) => void;
}

function Tree({
  fullscreen,
  expanded,
  onToggleBranch,
  activeTip,
  onToggleTip,
}: TreeProps) {
  const c = useColors();
  const rootFs = fullscreen ? 15 : 14;
  const headFs = fullscreen ? 14 : 13.5;
  const leafFs = fullscreen ? 13 : 12.5;
  const tipFs = fullscreen ? 12.5 : 12;

  return (
    <View style={s.mm}>
      {/* Root pill with gradient */}
      <View style={s.rootWrap}>
        <LinearGradient
          colors={["rgba(255,106,61,0.18)", "rgba(168,85,247,0.18)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[s.root, { borderColor: "rgba(255,106,61,0.4)" }]}
        >
          <Text
            style={[
              s.rootText,
              { color: c.foreground, fontSize: rootFs },
            ]}
            numberOfLines={2}
          >
            {onboardingTree.root}
          </Text>
        </LinearGradient>
        <View style={[s.trunk, { backgroundColor: "rgba(255,255,255,0.14)" }]} />
      </View>

      <View style={s.branches}>
        {onboardingTree.branches.map((b, i) => {
          const isOpen = expanded.has(i);
          return (
            <View key={i} style={s.branch}>
              <Pressable
                onPress={() => onToggleBranch(i)}
                style={({ pressed }) => [
                  s.branchHead,
                  {
                    borderColor: isOpen
                      ? "rgba(255,106,61,0.45)"
                      : c.cardBorder,
                    backgroundColor: isOpen
                      ? "rgba(255,106,61,0.10)"
                      : pressed
                      ? "rgba(255,255,255,0.07)"
                      : "rgba(255,255,255,0.04)",
                  },
                ]}
              >
                <Text
                  style={[
                    s.branchLabel,
                    { color: c.foreground, fontSize: headFs },
                  ]}
                >
                  {b.label}
                </Text>
                <View
                  style={{
                    transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
                  }}
                >
                  <ChevronDownIcon
                    size={14}
                    color={isOpen ? c.orange : c.mutedForeground}
                  />
                </View>
              </Pressable>

              {isOpen && (
                <View
                  style={[
                    s.leaves,
                    {
                      borderLeftColor: "rgba(255,255,255,0.08)",
                    },
                  ]}
                >
                  {b.leaves.map((l: Leaf, j) => {
                    const tipId = `${i}-${j}`;
                    const tipOpen = activeTip === tipId;
                    const hasTip = !!l.tip;
                    return (
                      <View key={j} style={{ gap: 6 }}>
                        <Pressable
                          disabled={!hasTip}
                          onPress={() => {
                            if (hasTip)
                              onToggleTip(tipOpen ? null : tipId);
                          }}
                          style={({ pressed }) => [
                            s.leaf,
                            {
                              borderColor: tipOpen
                                ? "rgba(168,85,247,0.45)"
                                : "rgba(255,255,255,0.08)",
                              backgroundColor: tipOpen
                                ? "rgba(168,85,247,0.10)"
                                : pressed && hasTip
                                ? "rgba(255,255,255,0.05)"
                                : "rgba(255,255,255,0.025)",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              s.leafText,
                              {
                                color: tipOpen
                                  ? c.foreground
                                  : c.mutedForeground,
                                fontSize: leafFs,
                              },
                            ]}
                          >
                            {l.text}
                          </Text>
                          {hasTip && (
                            <View
                              style={[
                                s.leafDot,
                                {
                                  backgroundColor: tipOpen
                                    ? c.purple
                                    : c.orange,
                                },
                              ]}
                            />
                          )}
                        </Pressable>
                        {tipOpen && hasTip && (
                          <View
                            style={[
                              s.tip,
                              {
                                backgroundColor: "#221b35",
                                borderColor: "rgba(168,85,247,0.45)",
                              },
                            ]}
                          >
                            <Text
                              style={{
                                color: c.foreground,
                                fontSize: tipFs,
                                lineHeight: tipFs * 1.55,
                              }}
                            >
                              {l.tip}
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

export interface OnboardingProps {
  /** Called when collapsed state changes, so parent can persist UI hints. */
  onCollapsedChange?: (collapsed: boolean) => void;
}

export default function Onboarding(_props: OnboardingProps = {}) {
  const c = useColors();
  const [collapsed, setCollapsed] = useState<boolean | null>(null);
  const [expandedInline, setExpandedInline] = useState<Set<number>>(new Set());
  const [expandedFs, setExpandedFs] = useState<Set<number>>(new Set());
  const [activeTip, setActiveTip] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(STORAGE_KEY);
        setCollapsed(v === "1");
      } catch {
        setCollapsed(false);
      }
    })();
  }, []);

  const setAndStore = useCallback((next: boolean) => {
    setCollapsed(next);
    AsyncStorage.setItem(STORAGE_KEY, next ? "1" : "0").catch(() => {});
  }, []);

  const closeFs = useCallback(() => {
    setFullscreen(false);
    setExpandedFs(new Set());
    setExpandedInline(new Set());
    setActiveTip(null);
  }, []);

  function toggleInline(i: number) {
    setExpandedInline((prev) => {
      const next = new Set<number>();
      if (!prev.has(i)) next.add(i);
      return next;
    });
    setActiveTip(null);
  }

  function toggleFs(i: number) {
    setExpandedFs((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
    setActiveTip(null);
  }

  if (collapsed === null) return null;

  if (collapsed) {
    return (
      <View
        style={[
          s.collapsed,
          { borderColor: c.cardBorder, backgroundColor: "rgba(255,255,255,0.03)" },
        ]}
      >
        <Text style={{ color: c.mutedForeground, fontSize: 12.5 }}>
          再看看怎么运作？
        </Text>
        <Pressable
          onPress={() => setAndStore(false)}
          style={({ pressed }) => [
            s.collapsedBtn,
            {
              backgroundColor: pressed
                ? "rgba(255,255,255,0.1)"
                : "rgba(255,255,255,0.06)",
              borderColor: c.cardBorder,
            },
          ]}
        >
          <Text style={{ color: c.foreground, fontSize: 12, fontWeight: "600" }}>
            展开
          </Text>
          <ChevronDownIcon size={12} color={c.foreground} />
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <View
        style={[
          s.card,
          {
            borderColor: c.cardBorder,
            backgroundColor: "rgba(255,255,255,0.02)",
          },
        ]}
      >
        <View style={s.toolbar}>
          <Pressable
            onPress={() => {
              setFullscreen(true);
              setActiveTip(null);
            }}
            style={({ pressed }) => [
              s.fsBtn,
              {
                backgroundColor: pressed
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(255,255,255,0.04)",
                borderColor: c.cardBorder,
              },
            ]}
          >
            <ExpandIcon size={14} color={c.mutedForeground} />
            <Text style={{ color: c.mutedForeground, fontSize: 12 }}>
              全屏查看
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setAndStore(true)}
            style={({ pressed }) => [
              s.dismiss,
              {
                backgroundColor: pressed
                  ? "rgba(255,255,255,0.08)"
                  : "transparent",
              },
            ]}
            accessibilityLabel="关闭新手引导"
          >
            <CloseIcon size={14} color={c.mutedForeground} />
          </Pressable>
        </View>
        <Tree
          fullscreen={false}
          expanded={expandedInline}
          onToggleBranch={toggleInline}
          activeTip={activeTip}
          onToggleTip={setActiveTip}
        />
      </View>

      <Modal
        visible={fullscreen}
        animationType="fade"
        transparent
        onRequestClose={closeFs}
      >
        <Pressable style={s.overlay} onPress={closeFs}>
          <Pressable
            style={[s.fsCanvas, { borderColor: c.cardBorder }]}
            onPress={() => {}}
          >
            <Pressable
              onPress={closeFs}
              style={({ pressed }) => [
                s.fsClose,
                {
                  borderColor: c.cardBorder,
                  backgroundColor: pressed
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(255,255,255,0.06)",
                },
              ]}
              accessibilityLabel="关闭全屏"
            >
              <CloseIcon size={18} color={c.mutedForeground} />
            </Pressable>
            <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 44 }}>
              <Tree
                fullscreen={true}
                expanded={expandedFs}
                onToggleBranch={toggleFs}
                activeTip={activeTip}
                onToggleTip={setActiveTip}
              />
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

/** Imperative helper for parents to mark the onboarding as collapsed from outside (e.g. on scroll-to-end). */
export async function markOnboardingCollapsed() {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

const s = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  fsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  dismiss: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  collapsed: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  collapsedBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },

  mm: { alignItems: "stretch", gap: 0 },
  rootWrap: { alignItems: "center" },
  root: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: "center",
    maxWidth: "100%",
  },
  rootText: { fontWeight: "700", textAlign: "center" },
  trunk: { width: 1.5, height: 14, marginTop: 2 },

  branches: { gap: 8, marginTop: 6 },
  branch: { flexDirection: "column" },
  branchHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
  },
  branchLabel: { fontWeight: "600" },

  leaves: {
    gap: 6,
    marginTop: 6,
    paddingLeft: 14,
    borderLeftWidth: 2,
  },
  leaf: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  leafText: { flex: 1 },
  leafDot: { width: 6, height: 6, borderRadius: 3 },

  tip: {
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(8,6,16,0.78)",
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  fsCanvas: {
    width: "100%",
    maxWidth: 720,
    maxHeight: "92%",
    backgroundColor: "#100c1a",
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  fsClose: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2,
    width: 32,
    height: 32,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
