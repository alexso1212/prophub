import { useState, useMemo } from "react";
import Slider from "../Slider";
import Cta from "../Cta";

export default function DrawdownSim() {
  const [balance, setBalance] = useState(100000);
  const [maxDD, setMaxDD] = useState(3000);
  const [seriesLen, setSeriesLen] = useState(8);
  const [lossPerDay, setLossPerDay] = useState(400);

  const { points, blewUp, blewAtIdx } = useMemo(() => {
    let cur = balance;
    let peak = balance;
    const pts: { x: number; y: number }[] = [{ x: 0, y: cur }];
    let blewAt = -1;
    for (let i = 1; i <= seriesLen; i++) {
      cur -= lossPerDay;
      if (cur > peak) peak = cur;
      pts.push({ x: i, y: cur });
      if (peak - cur >= maxDD && blewAt === -1) blewAt = i;
    }
    return { points: pts, blewUp: blewAt !== -1, blewAtIdx: blewAt };
  }, [balance, maxDD, seriesLen, lossPerDay]);

  const w = 360;
  const h = 140;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minY = Math.min(...ys, balance - maxDD - 200);
  const maxY = Math.max(...ys, balance + 200);
  const sx = (x: number) => (x / Math.max(...xs)) * (w - 20) + 10;
  const sy = (y: number) => h - ((y - minY) / (maxY - minY)) * (h - 20) - 10;
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.x)},${sy(p.y)}`).join(" ");
  const ddLineY = sy(balance - maxDD);

  return (
    <div className="kg-sim">
      <h2 className="kg-sim-title">📉 回撤风险沙盘</h2>
      <p className="kg-sim-sub">模拟连续亏损序列，看看你的账号何时会触发爆仓规则。</p>

      <div className="kg-sim-controls">
        <Slider label="账号本金" min={25000} max={150000} step={5000} value={balance} onChange={setBalance} format={(v) => `$${(v / 1000).toFixed(0)}K`} />
        <Slider label="最大回撤上限" min={1500} max={9000} step={250} value={maxDD} onChange={setMaxDD} format={(v) => `$${v.toLocaleString()}`} />
        <Slider label="连续亏损天数" min={3} max={15} value={seriesLen} onChange={setSeriesLen} format={(v) => `${v} 天`} />
        <Slider label="日均亏损" min={50} max={1500} step={50} value={lossPerDay} onChange={setLossPerDay} format={(v) => `$${v}`} />
      </div>

      <div className="kg-sim-chart">
        <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
          <line x1="0" x2={w} y1={ddLineY} y2={ddLineY} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity="0.6" />
          <text x={w - 4} y={ddLineY - 4} fill="#ef4444" fontSize="10" textAnchor="end">爆仓线</text>
          <path d={path} fill="none" stroke="#a855f7" strokeWidth="2" />
          {points.map((p, i) => (
            <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={i === blewAtIdx ? 5 : 2.5} fill={i === blewAtIdx ? "#ef4444" : "#a855f7"} />
          ))}
        </svg>
      </div>

      <div className="kg-sim-result">
        <div className="kg-result-row total">
          <span>结果</span>
          <strong style={{ color: blewUp ? "#ef4444" : "var(--green)" }}>
            {blewUp ? `第 ${blewAtIdx} 天爆仓 ❌` : "本序列内安全 ✅"}
          </strong>
        </div>
      </div>

      <Cta firmSlug="my-funded-futures" track="drawdown-sim" label="去 MyFundedFutures 看零回撤账号 →" />
    </div>
  );
}
