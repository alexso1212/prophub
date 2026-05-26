import { useState, useMemo } from "react";
import Slider from "../Slider";
import Cta from "../Cta";

export default function PnLDays() {
  const [target, setTarget] = useState(6000);
  const [avgPnl, setAvgPnl] = useState(150);
  const [winRate, setWinRate] = useState(55);

  const { days, weeks, dailyExpected } = useMemo(() => {
    // 简化期望模型：盈/亏单的金额对称（avgPnl），盈亏比 1:1。
    // 期望 = avgPnl × p − avgPnl × (1−p) = avgPnl × (2p − 1)。
    // 因此胜率 50% 时期望为 0；> 50% 才为正。
    const p = winRate / 100;
    const exp = avgPnl * (2 * p - 1);
    if (exp <= 0) return { days: Infinity, weeks: Infinity, dailyExpected: exp };
    const d = Math.ceil(target / exp);
    return { days: d, weeks: Math.ceil(d / 5), dailyExpected: exp };
  }, [target, avgPnl, winRate]);

  return (
    <div className="kg-sim">
      <h2 className="kg-sim-title">📈 盈利/亏损天数模拟</h2>
      <p className="kg-sim-sub">设定你的盈利目标和日均水准，预测多久能通过考核。</p>

      <div className="kg-sim-controls">
        <Slider
          label="盈利目标"
          min={1500}
          max={15000}
          step={500}
          value={target}
          onChange={setTarget}
          format={(v) => `$${v.toLocaleString()}`}
          hint="100K 账号常见目标 $6000；150K 是 $9000。"
        />
        <Slider
          label="日均盈亏（毛）"
          min={20}
          max={1000}
          step={10}
          value={avgPnl}
          onChange={setAvgPnl}
          format={(v) => `$${v}`}
        />
        <Slider
          label="胜率"
          min={30}
          max={80}
          value={winRate}
          onChange={setWinRate}
          format={(v) => `${v}%`}
          hint="低于 50% 时长期为负，几乎不可能通过。"
        />
      </div>

      <div className="kg-sim-result">
        <div className="kg-result-row">
          <span>预计通过所需</span>
          <strong style={{ color: "var(--orange)" }}>
            {Number.isFinite(days) ? `${days} 个交易日` : "无法通过"}
          </strong>
        </div>
        <div className="kg-result-row">
          <span>约合自然时长</span>
          <strong>{Number.isFinite(weeks) ? `${weeks} 周` : "—"}</strong>
        </div>
        <div className="kg-result-row">
          <span>日均期望收益</span>
          <strong>${dailyExpected.toFixed(0)}</strong>
        </div>
        <div className="kg-result-hint">
          假设盈/亏单金额对称、盈亏比 1:1。胜率 ≤ 50% 时长期为负收益，
          模拟器视为无法通过。请考虑提高入场质量或拉大盈亏比。
        </div>
      </div>

      <Cta firmSlug="topstep" track="pnl-days" label="去 Topstep 开同等目标账号 →" />
    </div>
  );
}
