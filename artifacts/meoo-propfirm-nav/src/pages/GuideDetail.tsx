import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, ExternalLink, Building2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { guidesData } from '../data/guides';
import { firmsData } from '../data/firms';

export default function GuideDetail() {
  const { slug } = useParams<{ slug: string }>();
  const guide = guidesData.find(g => g.slug === slug);

  if (!guide) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">指南未找到</h1>
          <Link to="/guides" className="text-blue-600 hover:text-blue-700 font-medium">
            返回指南列表
          </Link>
        </div>
      </div>
    );
  }

  const relatedFirms = firmsData.filter(f => guide.relatedFirms.includes(f.id));
  const difficultyColor = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700'
  }[guide.difficulty];

  const categoryLabel = {
    beginner: '新手指南',
    roadmap: '路径指南',
    software: '软件教程',
    payment: '支付教程',
    payout: '出金教程'
  }[guide.category];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          返回指南列表
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {categoryLabel}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColor}`}>
                {guide.difficulty === 'beginner' ? '入门' : guide.difficulty === 'intermediate' ? '进阶' : '高级'}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight mb-4">
              {guide.title}
            </h1>

            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              {guide.summary}
            </p>

            <div className="flex items-center gap-4 mt-6 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>更新于 {guide.lastUpdatedAt}</span>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="prose prose-slate max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ node, ...props }: any) => <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4" {...props} />,
                  h3: ({ node, ...props }: any) => <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3" {...props} />,
                  p: ({ node, ...props }: any) => <p className="text-gray-700 leading-relaxed mb-3" {...props} />,
                  ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 mb-3 space-y-1 text-gray-700" {...props} />,
                  ol: ({ node, ...props }: any) => <ol className="list-decimal pl-6 mb-3 space-y-1 text-gray-700" {...props} />,
                  li: ({ node, ...props }: any) => <li className="text-gray-700" {...props} />,
                  strong: ({ node, ...props }: any) => <strong className="font-semibold text-gray-900" {...props} />,
                  a: ({ node, ...props }: any) => <a className="text-blue-600 hover:text-blue-700 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                  table: ({ node, ...props }: any) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full border-collapse border border-gray-200 text-sm" {...props} />
                    </div>
                  ),
                  thead: ({ node, ...props }: any) => <thead className="bg-gray-50" {...props} />,
                  th: ({ node, ...props }: any) => <th className="border border-gray-200 px-3 py-2 text-left font-medium text-gray-700" {...props} />,
                  td: ({ node, ...props }: any) => <td className="border border-gray-200 px-3 py-2 text-gray-700" {...props} />,
                  code: ({ node, inline, ...props }: any) =>
                    inline
                      ? <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm" {...props} />
                      : <code className="block bg-gray-100 text-gray-800 p-3 rounded text-sm overflow-x-auto" {...props} />,
                }}
              >
                {guide.body}
              </ReactMarkdown>
            </div>
          </div>

          {relatedFirms.length > 0 && (
            <div className="p-6 md:p-8 border-t border-gray-200 bg-slate-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                相关平台
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedFirms.map(firm => (
                  <Link
                    key={firm.id}
                    to={`/firms/${firm.slug}`}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <img src={firm.logoUrl} alt={firm.name} className="w-8 h-8 rounded" />
                    <span className="font-medium text-gray-900">{firm.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {guide.sourceUrls && guide.sourceUrls.length > 0 && (
            <div className="p-6 md:p-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">参考来源</h3>
              <div className="space-y-2">
                {guide.sourceUrls.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="truncate">{url}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
