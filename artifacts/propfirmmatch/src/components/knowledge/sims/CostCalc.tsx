import { useState, useMemo } from "react";
import Slider from "../Slider";
import Cta from "../Cta";

const SIZES = [
  { label: "25K", base: 167 },
  { label: "50K", base: 270 },
  { label: "100K", base: 540 },
  { label: "150K", base: 810 },
];

export default function CostCalc() {
  const [sizeIdx, setSizeIdx] = useState(2);
  const [discount, setDiscount] = useState(30);
  const [resetCount, setResetCount] = useState(0);

  const size = SIZES[sizeIdx];
  const { discounted, resetFee, total } = useMemo(() => {
    const dc = size.base * (1 - discount / 100);
    const rf = size.base * 0.2 * (1 - discount / 100);
    return { discounted: dc, resetFee: rf, total: dc + rf * resetCount };
  }, [size, discount, resetCount]);

  return (
    <div className="kg-sim">
      <h2 className="kg-sim-title">🧮 考核成本计算器</h2>
      <p className="kg-sim-sub">
        拖动滑块，立即估算考核到底要花多少钱。
      </p>

      <div className="kg-sim-controls">
        <div className="kg-size-tabs">
          {SIZES.map((s, i) => (
            <button
              key={s.label}
              className={`kg-chip ${i === sizeIdx ? "active" : ""}`}
              onClick={() => setSizeIdx(i)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <Slider
          label="当前折扣"
          min={0}
          max={70}
          value={discount}
          onChange={setDiscount}
          format={(v) => `${v}%`}
          hint="多数公司常年 20–50%；大促可到 70%。"
        />
        <Slider
          label="预估重置次数"
          min={0}
          max={5}
          value={resetCount}
          onChange={setResetCount}
          format={(v) => `${v} 次`}
          hint="新手平均失败 1–2 次；老手通常 0 次。"
        />
      </div>

      <div className="kg-sim-result">
        <div className="kg-result-row">
          <span>账号尺寸</span>
          <strong>{size.label}（原价 ${size.base}）</strong>
        </div>
        <div className="kg-result-row">
          <span>折扣后单价</span>
          <strong style={{ color: "var(--orange)" }}>${discounted.toFixed(2)}</strong>
        </div>
        <div className="kg-result-row">
          <span>{resetCount} 次重置费</span>
          <strong>${(resetFee * resetCount).toFixed(2)}</strong>
        </div>
        <div className="kg-result-row total">
          <span>实际总花费</span>
          <strong>${total.toFixed(2)}</strong>
        </div>
      </div>

      <Cta firmSlug="apex-trader-funding" track="cost-calc" label="去 Apex 用同等折扣下单 →" />
    </div>
  );
}
