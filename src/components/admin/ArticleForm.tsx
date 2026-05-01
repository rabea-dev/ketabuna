'use client'

import { useState } from 'react'

interface ArticleFormData {
  title: string
  summary: string
  author: string
  content: string
  sources: string
  status: 'draft' | 'published'
  category: string
  tags: string
}

interface ArticleFormProps {
  initialData?: Partial<ArticleFormData>
  articleId?: string          // present when editing an existing article
  onSave?: (data: ArticleFormData) => void
}

const categories = ['ثقافة وأدب', 'تراث وتاريخ', 'شعر وأدب', 'لغة وترجمة', 'مجتمع وثقافة', 'شخصيات أدبية', 'قراءات ونقد']

export default function ArticleForm({ initialData, articleId, onSave }: ArticleFormProps) {
  const isEditing = !!articleId
  const [form, setForm] = useState<ArticleFormData>({
    title: initialData?.title || '',
    summary: initialData?.summary || '',
    author: initialData?.author || '',
    content: initialData?.content || '',
    sources: initialData?.sources || '',
    status: initialData?.status || 'draft',
    category: initialData?.category || '',
    tags: initialData?.tags || '',
  })

  const [aiLoading, setAiLoading] = useState<string | null>(null)
  const [copyright, setCopyright] = useState({
    ownsContent: false,
    ownsImage: false,
    isExternal: false,
    sourcesCited: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const simulateAI = (action: string) => {
    setAiLoading(action)
    setTimeout(() => {
      setAiLoading(null)
      if (action === 'summary') {
        setForm(prev => ({ ...prev, summary: 'ملخص تلقائي: ' + prev.content.slice(0, 120) + '...' }))
      }
      if (action === 'title') {
        setForm(prev => ({ ...prev, title: prev.title ? '✦ ' + prev.title : 'عنوان مقترح من الذكاء الاصطناعي' }))
      }
    }, 1500)
  }

  const handleSubmit = (status: 'draft' | 'published') => {
    const data = { ...form, status }
    if (onSave) onSave(data)
    const action = status === 'draft' ? 'حفظ المسودة' : (isEditing ? 'تحديث المقال' : 'نشر المقال')
    alert(`✔ تم ${action} بنجاح`)
  }

  return (
    <div className="space-y-8 max-w-4xl">

      {/* Edit-mode banner */}
      {isEditing && (
        <div className="flex items-center gap-3 bg-navy/8 border border-navy/20 rounded-xl px-5 py-3">
          <svg className="w-5 h-5 text-navy shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <p className="font-naskh text-navy text-sm">
            أنت في <strong>وضع التعديل</strong> — البيانات الموجودة محمّلة في النموذج
          </p>
        </div>
      )}

      {/* Article Fields */}
      <div className="bg-white rounded-xl border border-stone p-6 space-y-5">
        <h2 className="font-plex font-bold text-lg text-ink border-b border-stone pb-3">معلومات المقال</h2>

        <div>
          <label className="block font-naskh text-sm text-ink-light mb-1.5">عنوان المقال *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="أدخل عنوان المقال..."
            className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest text-base"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-naskh text-sm text-ink-light mb-1.5">اسم الكاتب *</label>
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="اسم الكاتب"
              className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest text-sm"
            />
          </div>
          <div>
            <label className="block font-naskh text-sm text-ink-light mb-1.5">التصنيف</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest text-sm bg-white"
            >
              <option value="">اختر تصنيفاً</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-naskh text-sm text-ink-light mb-1.5">ملخص قصير *</label>
          <textarea
            name="summary"
            value={form.summary}
            onChange={handleChange}
            rows={3}
            placeholder="ملخص مختصر يظهر في قائمة المقالات..."
            className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest resize-none text-base leading-relaxed"
          />
        </div>

        <div>
          <label className="block font-naskh text-sm text-ink-light mb-1.5">الصورة الرئيسية</label>
          <div className="border-2 border-dashed border-stone rounded-lg p-6 text-center hover:border-forest/40 transition-colors cursor-pointer">
            <svg className="w-8 h-8 text-ink-faint mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-ink-muted text-sm font-naskh">اسحب الصورة هنا أو انقر للرفع</p>
            <p className="text-ink-faint text-xs font-naskh mt-1">PNG, JPG حتى 5MB</p>
          </div>
        </div>

        <div>
          <label className="block font-naskh text-sm text-ink-light mb-1.5">نص المقال *</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={16}
            placeholder="اكتب محتوى المقال هنا... يمكن استخدام HTML بسيط مثل <p> و <h2>"
            className="w-full border border-stone rounded-lg px-4 py-3 font-naskh text-ink focus:outline-none focus:border-forest resize-y text-base leading-loose"
          />
        </div>

        <div>
          <label className="block font-naskh text-sm text-ink-light mb-1.5">الوسوم (مفصولة بفاصلة)</label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="مثال: ثقافة, أدب, تاريخ"
            className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest text-sm"
          />
        </div>

        <div>
          <label className="block font-naskh text-sm text-ink-light mb-1.5">مصادر المقال</label>
          <textarea
            name="sources"
            value={form.sources}
            onChange={handleChange}
            rows={3}
            placeholder="أدخل المصادر، كل مصدر في سطر..."
            className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest resize-none text-sm"
          />
        </div>
      </div>

      {/* AI Features */}
      <div className="bg-navy/5 border border-navy/15 rounded-xl p-6">
        <h2 className="font-plex font-bold text-lg text-navy mb-1 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          أدوات الذكاء الاصطناعي
        </h2>
        <p className="text-ink-muted text-sm font-naskh mb-5">استخدم الذكاء الاصطناعي لتحسين مقالك</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { key: 'summary', label: 'إنشاء ملخص', icon: '📝' },
            { key: 'points', label: 'استخراج النقاط', icon: '🔑' },
            { key: 'format', label: 'تحسين التنسيق', icon: '✨' },
            { key: 'title', label: 'اقتراح عنوان', icon: '💡' },
            { key: 'translate', label: 'ترجمة المقال', icon: '🌐' },
            { key: 'check', label: 'مراجعة لغوية', icon: '🔍' },
          ].map(action => (
            <button
              key={action.key}
              onClick={() => simulateAI(action.key)}
              disabled={aiLoading === action.key}
              className="flex items-center gap-2 bg-white border border-navy/20 text-navy rounded-lg px-4 py-2.5 text-sm font-naskh hover:bg-navy hover:text-white transition-colors disabled:opacity-60"
            >
              <span>{action.icon}</span>
              {aiLoading === action.key ? 'جارٍ...' : action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Copyright Checklist */}
      <div className="bg-gold-pale border border-gold/30 rounded-xl p-6">
        <h2 className="font-plex font-bold text-base text-gold-dark mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          قائمة حقوق النشر (قبل النشر)
        </h2>
        <div className="space-y-3">
          {[
            { key: 'ownsContent', label: 'هل تملك حقوق نشر هذا المحتوى؟' },
            { key: 'ownsImage', label: 'هل تملك حقوق استخدام الصورة الرئيسية؟' },
            { key: 'isExternal', label: 'هل هذا المحتوى من مصدر خارجي (نقلاً)؟' },
            { key: 'sourcesCited', label: 'هل تم ذكر المصدر الأصلي بوضوح؟' },
          ].map(item => (
            <label key={item.key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={copyright[item.key as keyof typeof copyright]}
                onChange={e => setCopyright(prev => ({ ...prev, [item.key]: e.target.checked }))}
                className="w-4 h-4 accent-gold rounded"
              />
              <span className="font-naskh text-ink-light text-sm">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleSubmit('draft')}
          className="bg-stone text-ink font-plex font-medium px-6 py-2.5 rounded-lg hover:bg-stone-dark transition-colors"
        >
          حفظ كمسودة
        </button>
        <button
          className="bg-navy/10 text-navy font-plex font-medium px-6 py-2.5 rounded-lg hover:bg-navy/20 transition-colors"
        >
          معاينة
        </button>
        <button
          onClick={() => handleSubmit('published')}
          className="bg-forest text-white font-plex font-medium px-6 py-2.5 rounded-lg hover:bg-forest-light transition-colors"
        >
          {isEditing ? 'حفظ التعديلات' : 'نشر المقال'}
        </button>
      </div>
    </div>
  )
}
