'use client'

import { useState, FormEvent } from 'react'
import { useTranslations } from 'next-intl'

interface FormState {
  name: string
  email: string
  phone: string
  budget: string
  timeline: string
  location: string
  description: string
}

const INITIAL_STATE: FormState = {
  name: '',
  email: '',
  phone: '',
  budget: '',
  timeline: '',
  location: '',
  description: '',
}

export default function InquireForm() {
  const t = useTranslations('inquire')
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm(INITIAL_STATE)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="py-16 text-center">
        <p className="font-signifier font-light text-2xl text-[#ede8e2] tracking-tight">
          {t('formSuccess')}
        </p>
      </div>
    )
  }

  const inputClass =
    'w-full bg-transparent border-b border-[#ede8e2]/30 py-3.5 text-base font-cadiz text-[#ede8e2] placeholder:text-[#ede8e2]/40 focus:outline-none focus:border-[#ede8e2] transition-colors duration-200'

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder={t('formName')}
            required
            className={inputClass}
            autoComplete="name"
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder={t('formEmail')}
            required
            className={inputClass}
            autoComplete="email"
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder={t('formPhone')}
            className={inputClass}
            autoComplete="tel"
          />
        </div>
        <div>
          <input
            type="text"
            name="budget"
            value={form.budget}
            onChange={handleChange}
            placeholder={t('formBudget')}
            className={inputClass}
          />
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <input
            type="text"
            name="timeline"
            value={form.timeline}
            onChange={handleChange}
            placeholder={t('formTimeline')}
            className={inputClass}
          />
        </div>
        <div>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder={t('formLocation')}
            className={inputClass}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder={t('formDescriptionPlaceholder')}
          rows={5}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Submit */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? '...' : `${t('formSubmit')} →`}
        </button>
        {status === 'error' && (
          <p className="text-sm font-cadiz text-red-400">{t('formError')}</p>
        )}
      </div>
    </form>
  )
}
