import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'content-knowledge-base');
const rawDir = path.join(outDir, 'raw-page-text');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function write(file, content) {
  fs.writeFileSync(path.join(outDir, file), content);
}

function loadDataModule(file, exportNames) {
  let source = read(file);
  source = source
    .replace(/^import[\s\S]*?;\n/gm, '')
    .replace(/export const (\w+)\s*:\s*[^=]+=/g, 'const $1 =')
    .replace(/export const (\w+)\s*=/g, 'const $1 =');
  const body = `${source}\nreturn { ${exportNames.join(', ')} };`;
  return new Function(body)();
}

function cleanText(value) {
  return String(value)
    .replace(/\s+/g, ' ')
    .replace(/\\n/g, '\n')
    .trim();
}

function hasUsefulText(value) {
  return /[\u4e00-\u9fff]/.test(value) || /\b(Prop|Firm|Tradovate|Rithmic|Wise|Rise|W-?8|KYC|EOD|TDD|ProjectX|NinjaTrader|Quantower|ATAS)\b/i.test(value);
}

function extractTextFromTsx(file) {
  const source = read(file);
  const items = [];
  const add = (value) => {
    const text = cleanText(value);
    if (text && hasUsefulText(text) && !items.includes(text)) items.push(text);
  };

  for (const match of source.matchAll(/>([^<>{}][^<>{}]*)</g)) add(match[1]);
  for (const match of source.matchAll(/['"`]([^'"`]*[\u4e00-\u9fff][^'"`]*)['"`]/g)) add(match[1]);
  for (const match of source.matchAll(/['"`]([^'"`]*(?:Prop|Firm|Tradovate|Rithmic|Wise|Rise|W-?8|KYC|EOD|TDD|ProjectX|NinjaTrader|Quantower|ATAS)[^'"`]*)['"`]/gi)) add(match[1]);

  return items;
}

function money(value) {
  if (value === undefined || value === null) return '-';
  return `$${Number(value).toLocaleString()}`;
}

function firmStatus(status) {
  return {
    supported: '支持中国用户',
    restricted: '限制或需谨慎',
    unknown: '状态未知',
  }[status] || status;
}

function riskLabel(level) {
  return { low: '低', medium: '中', high: '高' }[level] || level;
}

function feeTypeLabel(type) {
  return {
    'one-time': '一次性费用',
    monthly: '月费订阅',
    activation: '激活费/直通类费用',
  }[type] || type;
}

function drawdownLabel(type) {
  return {
    eod: 'EOD 日终回撤',
    tdd: 'TDD 实时追踪回撤',
    static: '静态回撤',
    trailing: '追踪回撤',
  }[type] || type;
}

function firmToMarkdown(firm) {
  const accounts = firm.accountTypes.map((a) => [
    `### ${a.name}`,
    `- 账户规模：${money(a.accountSize)}`,
    `- 费用：${money(a.fee)}（${feeTypeLabel(a.feeType)}）`,
    `- 利润目标：${money(a.profitTarget)}`,
    `- 最大回撤：${money(a.maxDrawdown)}`,
    `- 日损：${a.dailyLossLimit ? money(a.dailyLossLimit) : '未标注'}`,
    `- 回撤类型：${drawdownLabel(a.drawdownType)}`,
    `- 最小交易日：${a.minTradingDays}`,
    `- 一致性规则：${a.consistencyRule ? '有' : '无'}`,
    `- 激活费：${a.activationFee ? money(a.activationFee) : '未标注'}`,
    `- 分成比例：${a.payoutSplit}%`,
    `- 最低出金：${money(a.payoutMinimum)}`,
    `- 单次出金上限：${a.payoutCap ? money(a.payoutCap) : '未标注'}`,
    `- 活跃要求：${a.activeRequirement || '未标注'}`,
  ].join('\n')).join('\n\n');

  return [
    `## ${firm.name}`,
    '',
    `- Slug：${firm.slug}`,
    `- 官网：${firm.officialUrl}`,
    `- 返佣链接：${firm.affiliateUrl || '未配置'}`,
    `- 优惠码：${firm.couponCode || '未配置'}`,
    `- 中国用户状态：${firmStatus(firm.cnUserStatus)}`,
    `- 评分：${firm.rating}/5`,
    `- 风险等级：${riskLabel(firm.riskLevel)}`,
    `- 支持软件：${firm.supportedPlatforms.join('、')}`,
    `- 支付方式：${firm.paymentMethods.join('、')}`,
    `- KYC 要求：${firm.kycRequirements}`,
    `- 最后核验：${firm.lastVerifiedAt}`,
    `- 来源：${firm.sourceUrls.join('；') || '未配置'}`,
    '',
    `简介：${firm.summary}`,
    '',
    '## 账户类型',
    '',
    accounts,
    '',
  ].join('\n');
}

function guideToMarkdown(guide) {
  return [
    `# ${guide.title}`,
    '',
    `- Slug：${guide.slug}`,
    `- 分类：${guide.category}`,
    `- 难度：${guide.difficulty}`,
    `- 摘要：${guide.summary}`,
    `- 相关平台 ID：${guide.relatedFirms.join('、') || '无'}`,
    `- 来源：${guide.sourceUrls.join('；') || '未配置'}`,
    `- 更新时间：${guide.lastUpdatedAt}`,
    '',
    guide.body.trim(),
    '',
  ].join('\n');
}

ensureDir(outDir);
ensureDir(rawDir);

const { firmsData, platforms, drawdownTypes, feeTypes } = loadDataModule('src/data/firms.ts', [
  'firmsData',
  'platforms',
  'drawdownTypes',
  'feeTypes',
]);
const { guidesData, softwareList } = loadDataModule('src/data/guides.ts', ['guidesData', 'softwareList']);

const pageFiles = [
  ...fs.readdirSync(path.join(root, 'src/pages')).filter((f) => f.endsWith('.tsx')).map((f) => `src/pages/${f}`),
  ...fs.readdirSync(path.join(root, 'src/pages/learn')).filter((f) => f.endsWith('.tsx')).map((f) => `src/pages/learn/${f}`),
  ...fs.readdirSync(path.join(root, 'src/components')).filter((f) => f.endsWith('.tsx')).map((f) => `src/components/${f}`),
];

const pageText = pageFiles.map((file) => ({
  file,
  items: extractTextFromTsx(file),
}));

for (const page of pageText) {
  const name = page.file.replace(/^src\//, '').replace(/[\/]/g, '__').replace(/\.tsx$/, '.md');
  fs.writeFileSync(
    path.join(rawDir, name),
    [`# ${page.file}`, '', ...page.items.map((item) => `- ${item}`), ''].join('\n'),
  );
}

write(
  '00_INDEX.md',
  [
    '# Prop Firm 导航站内容知识库',
    '',
    '这个目录是从 Meoo 导出的 React 项目中抽取出来的纯内容资料，方便迁移到新网站、CMS、Obsidian 或其他知识库。',
    '',
    '## 文件说明',
    '',
    '- `01_site-logic.md`：整站逻辑、页面结构、用户路径。',
    '- `02_platforms.md`：平台库和账户规则。',
    '- `03_guides.md`：指南长文与攻略内容。',
    '- `04_software-payout-flows.md`：软件、出金、新手路径等交互页文字。',
    '- `05_raw-page-text.md`：从所有页面组件里抽取的原始文字索引。',
    '- `knowledge-base.json`：机器可读的结构化数据。',
    '- `raw-page-text/`：按页面拆分的文字抽取结果。',
    '',
    '## 内容边界',
    '',
    '- 这里保留的是当前项目里已有的文字和结构。',
    '- 平台规则、官网链接、费用、地区限制必须上线前重新核验。',
    '- 内容不应承诺收益、包过、稳定出金或规避监管。',
    '',
  ].join('\n'),
);

write(
  '01_site-logic.md',
  [
    '# 整站逻辑结构',
    '',
    '## 核心定位',
    '',
    '中文 Futures Prop Firm 导航、规则对比、入门攻略、软件配置、出金流程与风险披露知识库。',
    '',
    '## 页面结构',
    '',
    '- 首页/心智地图：按“我是新手、我要选平台、我要学规则、我要配软件、我要出金”分流。',
    '- 平台库：筛选平台，进入平台详情。',
    '- 平台详情：平台概览、账户类型、支付方式、KYC、风险提示、官方来源。',
    '- 规则对比：横向比较账户规模、费用、利润目标、回撤、日损、一致性、分成和出金门槛。',
    '- 知识树：规则概念入口，连接到指南详情页。',
    '- 指南库：新手指南、路径指南、软件教程、支付教程、出金教程。',
    '- 软件配置：Tradovate、Rithmic、NinjaTrader 等配置流程。',
    '- 出金流程：Wise、Rise、加密货币等出金方式。',
    '- 免责声明：投资风险、返佣披露、数据准确性、地区限制。',
    '',
    '## 用户路径',
    '',
    '1. 新手路径：首页 → 我是新手 → 基础概念 → 规则学习 → 平台选择。',
    '2. 平台选择路径：首页 → 我要选平台 → 问卷筛选 → 推荐平台 → 平台详情。',
    '3. 规则路径：首页 → 我要学规则 → 知识树 → 指南详情 → 相关平台。',
    '4. 软件路径：首页 → 我要配软件 → 软件配置步骤。',
    '5. 出金路径：首页 → 我要出金 → 出金方式 → 操作步骤/材料/优缺点。',
    '',
    '## 数据字典',
    '',
    `- 支持软件：${platforms.join('、')}`,
    `- 回撤类型：${drawdownTypes.map((x) => `${x.label}(${x.value})`).join('、')}`,
    `- 费用类型：${feeTypes.map((x) => `${x.label}(${x.value})`).join('、')}`,
    '',
  ].join('\n'),
);

write('02_platforms.md', ['# 平台库与账户规则', '', ...firmsData.map(firmToMarkdown)].join('\n'));
write('03_guides.md', ['# 指南与攻略内容', '', ...guidesData.map(guideToMarkdown)].join('\n'));

const pageFlowSections = pageText
  .filter((page) => !page.file.includes('FirmDetail') && !page.file.includes('FirmsList') && page.items.length)
  .map((page) => [`## ${page.file}`, '', ...page.items.map((item) => `- ${item}`), ''].join('\n'));

write('04_software-payout-flows.md', ['# 软件、出金、新手路径与交互页内容', '', ...pageFlowSections].join('\n'));

write(
  '05_raw-page-text.md',
  [
    '# 全页面文字索引',
    '',
    ...pageText.map((page) => [
      `## ${page.file}`,
      '',
      ...page.items.map((item) => `- ${item}`),
      '',
    ].join('\n')),
  ].join('\n'),
);

fs.writeFileSync(
  path.join(outDir, 'knowledge-base.json'),
  JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      sourceProject: root,
      siteLogic: {
        positioning: '中文 Futures Prop Firm 导航、规则对比、入门攻略、软件配置、出金流程与风险披露知识库。',
        primaryPaths: ['新手路径', '平台选择路径', '规则学习路径', '软件配置路径', '出金路径'],
        compliance: ['不承诺收益', '不承诺包过', '不提供喊单带单代操', '所有规则以上游官网为准', '返佣必须披露'],
      },
      firmsData,
      guidesData,
      softwareList,
      platforms,
      drawdownTypes,
      feeTypes,
      pageText,
    },
    null,
    2,
  ),
);

console.log(`Exported knowledge base to ${outDir}`);
console.log(`Firms: ${firmsData.length}`);
console.log(`Guides: ${guidesData.length}`);
console.log(`Pages: ${pageText.length}`);
