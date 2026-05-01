'use client'

import { useState } from 'react'

interface BookFormData {
  title: string
  author: string
  summary: string
  publishYear: string
  pageCount: string
  language: string
  category: string
  downloadAllowed: boolean
  status: 'draft' | 'published'
}

interface BookFormProps {
  initialData?: Partial<BookFormData>
  onSave?: (data: BookFormData) => void
}

const categories = ['رواية عربية', 'تراث وأدب شعبي', 'فلسفة وتاريخ', 'شعر وفلسفة', 'تاريخ إسلامي', 'رواية اجتماعية', 'سيرة ذاتية']
const languages = ['عربي', 'عربي (ترجمة من الإنجليزية)', 'عربي (ترجمة من الفارسية)', 'عربي (ترجمة من الفرنسية)']

export default function BookForm({ initialData, onSave }: BookFormProps) {
  const [form, setForm] = useState<BookFormData>({
    title: initialData?.title || '',
    author: initialData?.author || '',
    summary: initialData?.summary || '',
    publishYear: initialData?.publishYear || '',
    pageCount: initialData?.pageCount || '',
    language: initialData?.language || 'عربي',
    category: initialData?.category || '',
    downloadAllowed: initialData?.downloadAllowed ?? false,
    status: initialData?.status || 'draft',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = (status: 'draft' | 'published') => {
    const data = { ...form, status }
    if (onSave) onSave(data)
    alert(`تم ${status === 'draft' ? 'حفظ المسودة' : 'نشر الكتاب'} بنجاح`)
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="bg-white rounded-xl border border-stone p-6 space-y-5">
        <h2 className="font-plex font-bold text-lg text-ink border-b border-stone pb-3">معلومات الكتاب</h2>

        <div>
          <label className="block font-naskh text-sm text-ink-light mb-1.5">عنوان الكتاب *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="أدخل عنوان الكتاب..."
            className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-navy text-base"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-naskh text-sm text-ink-light mb-1.5">اسم المؤلف *</label>
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="اسم المؤلف"
              className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-navy text-sm"
            />
          </div>
          <div>
            <label className="block font-naskh text-sm text-ink-light mb-1.5">التصنيف</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-navy text-sm bg-white"
            >
              <option value="">اختر تصنيفاً</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-naskh text-sm text-ink-light mb-1.5">سنة النشر</label>
            <input
              name="publishYear"
              type="number"
              value={form.publishYear}
              onChange={handleChange}
              placeholder="1980"
              className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-navy text-sm"
            />
          </div>
          <div>
            <label className="block font-naskh text-sm text-ink-light mb-1.5">عدد الصفحات</label>
            <input
              name="pageCount"
              type="number"
              value={form.pageCount}
              onChange={handleChange}
              placeholder="350"
              className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-navy text-sm"
            />
          </div>
          <div>
            <label className="block font-naskh text-sm text-ink-light mb-1.5">اللغة</label>
            <select
              name="language"
              value={form.language}
              onChange={handleChange}
              className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-navy text-sm bg-white"
            >
              {languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-naskh text-sm text-ink-light mb-1.5">ملخص الكتاب *</label>
          <textarea
            name="summary"
            value={form.summary}
            onChange={handleChange}
            rows={4}
            placeholder="أدخل ملخصاً وصفياً للكتاب..."
            className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-navy resize-none text-base leading-relaxed"
          />
        </div>

        <div>
          <label className="block font-naskh text-sm text-ink-light mb-1.5">صورة غلاف الكتاب</label>
          <div className="border-2 border-dashed border-stone rounded-lg p-6 text-center hover:border-navy/40 transition-colors cursor-pointer">
            <svg className="w-10 h-14 text-ink-faint mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-ink-muted text-sm font-naskh">ارفع صورة غلاف الكتاب</p>
            <p className="text-ink-faint text-xs font-naskh mt-1">نسبة 2:3 مفضلة · PNG, JPG</p>
          </div>
        </div>

        <div>
          <label className="block font-naskh text-sm text-ink-light mb-1.5">ملف PDF (اختياري)</label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".pdf"
              className="block w-full text-sm text-ink-muted file:ml-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-navy/10 file:text-navy file:font-plex file:text-sm hover:file:bg-navy/20 cursor-pointer"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="downloadAllowed"
            checked={form.downloadAllowed}
            onChange={handleChange}
            className="w-4 h-4 accent-navy rounded"
          />
          <span className="font-naskh text-ink-light text-sm">السماح بتحميل الكتاب مجاناً</span>
        </label>
      </div>

      {/* Copyright notice */}
      <div className="bg-gold-pale border border-gold/30 rounded-xl p-5">
        <h3 className="font-plex font-semibold text-gold-dark text-sm mb-2">تنبيه حقوق النشر</h3>
        <p className="text-ink-muted text-sm font-naskh leading-relaxed">
          يُرجى التأكد من امتلاكك حقوق نشر هذا الكتاب أو الحصول على إذن صريح من دار النشر أو المؤلف قبل الرفع.
          موقع كتابنا لا يتحمل أي مسؤولية قانونية عن مخالفات حقوق الملكية الفكرية.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleSubmit('draft')}
          className="bg-stone text-ink font-plex font-medium px-6 py-2.5 rounded-lg hover:bg-stone-dark transition-colors"
        >
          حفظ كمسودة
        </button>
        <button
          onClick={() => handleSubmit('published')}
          className="bg-navy text-white font-plex font-medium px-6 py-2.5 rounded-lg hover:bg-navy-light transition-colors"
        >
          نشر الكتاب
        </button>
      </div>
    </div>
  )
}
