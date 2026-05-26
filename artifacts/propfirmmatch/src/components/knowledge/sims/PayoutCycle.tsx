import { useState, useMemo } from "react";
import Slider from "../Slider";
import Cta from "../Cta";

export default function PayoutCycle() {
  const [profit, setProfit] = useState(2000);
  const [split, setSplit] = useState(90);
  const [lockDays, setLockDays] = useState(14);
  const [method, setMethod] = useState<"crypto" | "wire" | "plaid">("crypto");

  const { trader, payoutDate, methodDays } = useMemo(() => {
    const t = profit * (split / 100);
    const mDays = method === "crypto" ? 1 : method === "plaid" ? 2 : 4;
    const total = lockDays + mDays;
    const d = new Date();
    d.setDate(d.getDate() + total);
    return {
      trader: t,
      payoutDate: d.toLocaleDateString("zh-CN"),
      methodDays: mDays,
    };
  }, [profit, split, lockDays, method]);

  return (
    <div className="kg-sim">
      <h2 className="kg-sim-title">💸 出金周期计算</h2>
      <p className="kg-sim-sub">输入盈利金额与出金方式，估算第一笔款什么时候到账。</p>

      <div className="kg-sim-controls">
        <Slider label="盈利金额" min={500} max={20000} step={100} value={profit} onChange={setProfit} format={(v) => `$${v.toLocaleString()}`} />
        <Slider label="分成比例" min={70} max={100} value={split} onChange={setSplit} format={(v) => `${v}%`} />
        <Slider label="出金锁定期" min={7} max={45} value={lockDays} onChange={setLockDays} format={(v) => `${v} 天`} hint="多数公司首笔需等 14–30 天。" />
        <div className="kg-slider">
          <div className="kg-slider-head">
            <span className="kg-slider-label">出金方式</span>
            <span className="kg-slider-value">{method === "crypto" ? "Crypto (~1 天)" : method === "plaid" ? "Plaid (~2 天)" : "电汇 (~4 天)"}</span>
          </div>
          <div className="kg-size-tabs">
            <button className={`kg-chip ${method === "crypto" ? "active" : ""}`} onClick={() => setMethod("crypto")}>Crypto</button>
            <button className={`kg-chip ${method === "plaid" ? "active" : ""}`} onClick={() => setMethod("plaid")}>Plaid</button>
            <button className={`kg-chip ${method === "wire" ? "active" : ""}`} onClick={() => setMethod("wire")}>电汇</button>
          </div>
        </div>
      </div>

      <div className="kg-sim-result">
        <div className="kg-result-row">
          <span>实拿（扣分成后）</span>
          <strong style={{ color: "var(--orange)" }}>${trader.toFixed(2)}</strong>
        </div>
        <div className="kg-result-row">
          <span>到账总天数</span>
          <strong>{lockDays + methodDays} 天（锁定 {lockDays} + 通道 {methodDays}）</strong>
        </div>
        <div className="kg-result-row total">
          <span>预计到账日</span>
          <strong>{payoutDate}</strong>
        </div>
      </div>

      <Cta firmSlug="take-profit-trader" track="payout-cycle" label="去 Take Profit Trader 看快速出金账号 →" />
    </div>
  );
}
