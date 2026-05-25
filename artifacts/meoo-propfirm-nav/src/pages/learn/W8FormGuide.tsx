import { LearnLayout, CompareCards } from '../../components/learn';

export default function W8FormGuide() {
  return (
    <LearnLayout
      title="W-8BEN 表格填写指南"
      subtitle="非美国税务居民必填的税务表格"
      category="支付教程"
      accentColor="violet"
    >
      {/* 区块 1: Hero 介绍段落 */}
      <p className="text-lg md:text-xl text-zinc-300 leading-relaxed max-w-3xl mx-auto text-center">
        W-8BEN 是美国国税局（IRS）的税务表格，用于证明你是<span className="text-white font-semibold">非美国税务居民</span>。
        填错或不填，平台会预扣 30% 美国税款。
      </p>

      {/* 区块 2: 为什么要填 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-fuchsia-400 uppercase tracking-widest font-semibold">动机</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">为什么要填 W-8BEN</h2>
        </div>
        <div className="bg-white/5 border border-fuchsia-500/30 rounded-2xl p-8 md:p-10">
          <h3 className="text-fuchsia-300 font-semibold text-base mb-6">3 个理由</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-4 text-zinc-300 text-sm leading-relaxed">
              <span className="text-xl flex-shrink-0">💰</span>
              <span><span className="text-white font-semibold">避免 30% 预扣税</span> — 如不提交，IRS 默认按最高税率扣</span>
            </li>
            <li className="flex items-start gap-4 text-zinc-300 text-sm leading-relaxed">
              <span className="text-xl flex-shrink-0">📜</span>
              <span><span className="text-white font-semibold">符合中美税收协定</span> — 部分收入可免税或减税</span>
            </li>
            <li className="flex items-start gap-4 text-zinc-300 text-sm leading-relaxed">
              <span className="text-xl flex-shrink-0">✅</span>
              <span><span className="text-white font-semibold">出金必经步骤</span> — 平台合规要求</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 区块 3: 3 个 Part 字段对照 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-fuchsia-400 uppercase tracking-widest font-semibold">字段</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">3 个 Part 速查</h2>
        </div>
        <CompareCards
          layout="grid"
          columns={[
            {
              id: 'part1',
              title: 'Part I',
              subtitle: 'Beneficial Owner · 个人信息',
              icon: '🪪',
              accent: 'violet',
              items: [
                { label: 'Name', value: '护照英文姓名' },
                { label: 'Citizenship', value: 'China' },
                { label: 'Residence', value: '中国地址（拼音）' },
                { label: 'U.S. TIN', value: '留空' },
                { label: 'Foreign TIN', value: '身份证号' },
                { label: 'Date of Birth', value: 'MM-DD-YYYY' },
              ],
            },
            {
              id: 'part2',
              title: 'Part II',
              subtitle: 'Tax Treaty · 协定优惠',
              icon: '📜',
              accent: 'violet',
              items: [
                { label: 'Treaty?', value: '勾选 Yes' },
                { label: 'Country', value: 'China' },
                { label: 'Article', value: 'Article 14（独立劳务）' },
              ],
            },
            {
              id: 'part3',
              title: 'Part III',
              subtitle: 'Certification · 签字',
              icon: '✍️',
              accent: 'violet',
              items: [
                { label: 'Signature', value: '手写签名（电子签名也可）' },
                { label: 'Date', value: '填写当天日期' },
                { label: '注意', value: '签字必须本人' },
              ],
            },
          ]}
        />
      </section>

      {/* 区块 4: 提交方式对比 */}
      <section>
        <div className="mt-24 mb-10">
          <span className="text-xs text-fuchsia-400 uppercase tracking-widest font-semibold">提交</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">两种提交方式</h2>
        </div>
        <CompareCards
          layout="side-by-side"
          columns={[
            {
              id: 'digital',
              title: '电子提交',
              subtitle: 'Online · 推荐',
              icon: '💻',
              accent: 'emerald',
              items: [
                { label: '平台支持', value: '大多数平台支持在线填写' },
                { label: '签名', value: '电子签名即可' },
                { label: '速度', value: '即时生效' },
              ],
            },
            {
              id: 'paper',
              title: '纸质提交',
              subtitle: 'PDF · 备用',
              icon: '📄',
              accent: 'violet',
              items: [
                { label: '流程', value: '打印 → 手写签名 → 扫描上传' },
                { label: '签名', value: '必须手写（关键）' },
                { label: '速度', value: '需 1-3 个工作日审核' },
              ],
            },
          ]}
        />
      </section>

      {/* 区块 5: 常见问题 + 注意事项 */}
      <section className="mt-24">
        <div className="mb-10">
          <span className="text-xs text-fuchsia-400 uppercase tracking-widest font-semibold">细节</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight">常见问题与提醒</h2>
        </div>

        {/* 5a: 常见拒绝原因 */}
        <div className="bg-rose-500/5 border border-rose-500/30 rounded-2xl p-6 md:p-8">
          <h3 className="text-rose-300 font-semibold text-base mb-4">⚠️ 常见拒绝原因</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-zinc-300 text-sm leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-rose-400" />
              签名不是手写（纸质提交时）
            </li>
            <li className="flex items-start gap-2 text-zinc-300 text-sm leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-rose-400" />
              信息不完整
            </li>
            <li className="flex items-start gap-2 text-zinc-300 text-sm leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-rose-400" />
              地址格式不正确
            </li>
          </ul>
        </div>

        {/* 5b: 注意事项 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mt-4">
          <h3 className="text-zinc-200 font-semibold text-base mb-4">📌 重要提醒</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-zinc-300 text-sm leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-zinc-400" />
              <span><span className="text-white font-semibold">有效期 3 年</span> — 到期需重新提交</span>
            </li>
            <li className="flex items-start gap-2 text-zinc-300 text-sm leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-zinc-400" />
              <span><span className="text-white font-semibold">如实填写</span> — 虚假信息有法律风险</span>
            </li>
            <li className="flex items-start gap-2 text-zinc-300 text-sm leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-zinc-400" />
              <span><span className="text-white font-semibold">保留副本</span> — 提交记录留存</span>
            </li>
          </ul>
        </div>
      </section>
    </LearnLayout>
  );
}
