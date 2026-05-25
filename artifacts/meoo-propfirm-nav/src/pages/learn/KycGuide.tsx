import { LearnLayout, CompareCards, FlowSteps } from '../../components/learn';

export default function KycGuide() {
  return (
    <LearnLayout
      title="KYC 流程指南"
      subtitle="身份验证全流程 + 中国用户特别提示"
      category="流程指南"
      accentColor="violet"
    >
      {/* 区块 1: Hero */}
      <p className="text-lg md:text-xl text-zinc-300 leading-relaxed max-w-3xl mx-auto text-center">
        KYC（Know Your Customer）是<span className="text-white font-semibold">出金前的必要步骤</span>。提前准备好材料，能避免出金时被卡。
      </p>

      {/* 区块 2: 3 类必备材料 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-cyan-400 uppercase tracking-widest font-semibold">材料清单</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">3 类必备材料</h2>
        </div>
        <CompareCards
          layout="grid"
          columns={[
            {
              id: 'id',
              title: '身份证明',
              subtitle: 'Government ID',
              icon: '🪪',
              accent: 'violet',
              items: [
                { label: '可选证件', value: '护照（推荐）/ 身份证' },
                { label: '清晰度', value: '姓名、照片、有效期可读' },
                { label: '注意', value: '不要遮挡、不要反光、不要过期' },
              ],
            },
            {
              id: 'address',
              title: '地址证明',
              subtitle: 'Proof of Address',
              icon: '🏠',
              accent: 'violet',
              items: [
                { label: '可接受', value: '水电账单 / 银行对账单' },
                { label: '时效', value: '3 个月内开具' },
                { label: '要素', value: '需显示姓名和完整地址' },
              ],
            },
            {
              id: 'payment',
              title: '支付验证',
              subtitle: 'Payment Method',
              icon: '💳',
              accent: 'violet',
              items: [
                { label: '何时需要', value: '部分平台要求' },
                { label: '材料', value: '信用卡 / 银行账户对账单' },
                { label: '一致性', value: '持卡人姓名与 KYC 一致' },
              ],
            },
          ]}
        />
      </section>

      {/* 区块 3: 中国用户特别提示 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-amber-400 uppercase tracking-widest font-semibold">本地化</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">中国用户特别提示</h2>
        </div>
        <div className="bg-amber-500/5 border border-amber-500/30 rounded-2xl p-8 md:p-10">
          <p className="text-zinc-400 text-sm mb-6">中国用户在 KYC 过程中遇到的高频问题</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 卡 A */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-amber-300 font-semibold text-sm mb-3">证件选择</h3>
              <ul className="space-y-2">
                {[
                  '护照通常比身份证更容易通过',
                  '所有信息清晰可读',
                  '拼音与平台注册一致',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-zinc-300 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-amber-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* 卡 B */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-amber-300 font-semibold text-sm mb-3">地址证明</h3>
              <ul className="space-y-2">
                {[
                  '信用卡账单（如有）',
                  '水电费电子账单',
                  '部分平台接受中文文件',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-zinc-300 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-amber-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* 卡 C */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-amber-300 font-semibold text-sm mb-3">常见拒绝原因</h3>
              <ul className="space-y-2">
                {[
                  '姓名拼音不一致',
                  '地址翻译问题',
                  '文件格式不符合要求（建议 PDF/JPG）',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-zinc-300 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-amber-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 区块 4: 最佳实践 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-cyan-400 uppercase tracking-widest font-semibold">实战</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">3 个最佳实践</h2>
        </div>
        <FlowSteps
          steps={[
            {
              id: 'prepare',
              title: '提前准备',
              description: '注册时就准备好所有文件',
              detail: ['不要等到出金时才扫描', '一次性准备 ID + 地址 + 支付'],
              accent: 'violet',
            },
            {
              id: 'scan',
              title: '高清扫描',
              description: '确保文件清晰、完整、无遮挡',
              detail: ['手机拍照分辨率 ≥ 1080P', '避开反光，正面平铺拍摄', 'PDF 格式优于截图'],
              accent: 'violet',
            },
            {
              id: 'respond',
              title: '及时响应',
              description: '平台要求补充材料时尽快处理',
              detail: ['24 小时内回复', '问题不清楚要主动问 support', '保留邮件记录'],
              accent: 'violet',
            },
          ]}
        />
      </section>
    </LearnLayout>
  );
}
