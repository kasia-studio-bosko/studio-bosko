'use client'

import { useState, FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import type { FormQuestion } from '@/lib/sanity/queries'

/**
 * Hardcoded fallback questions — rendered only when Sanity is unreachable
 * and no CMS questions are provided.  Mirrors the original static form.
 */
const FALLBACK_QUESTIONS: FormQuestion[] = [
  { fieldId: 'phone',       fieldType: 'tel',      label: '',  required: false, options: [] },
  { fieldId: 'address',     fieldType: 'text',     label: '',  required: false, options: [] },
  { fieldId: 'serviceType', fieldType: 'select',   label: '',  required: true,  options: [] },
  { fieldId: 'investment',  fieldType: 'select',   label: '',  required: true,  options: [] },
  { fieldId: 'description', fieldType: 'textarea', label: '',  required: false, options: [] },
]

interface InquireFormProps {
  /** Dynamic questions from the CMS.  undefined = CMS unavailable; [] = intentionally empty. */
  formQuestions?: FormQuestion[]
  /** Override labels for the fixed contact fields */
  labelFirstName?: string
  labelLastName?: string
  labelEmail?: string
  labelSubmit?: string
  /** @deprecated Legacy fallback — only used when formQuestions is undefined */
  serviceOptions?: string[]
  /** @deprecated Legacy fallback — only used when formQuestions is undefined */
  budgetOptions?: string[]
}

export default function InquireForm({
  formQuestions,
  labelFirstName,
  labelLastName,
  labelEmail,
  labelSubmit,
  serviceOptions: legacyServiceOptions,
  budgetOptions:  legacyBudgetOptions,
}: InquireFormProps = {}) {
  const t = useTranslations('inquire')

  const [firstName,     setFirstName]     = useState('')
  const [lastName,      setLastName]      = useState('')
  const [email,         setEmail]         = useState('')
  const [dynamicFields, setDynamicFields] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const setField = (fieldId: string, value: string) =>
    setDynamicFields((prev) => ({ ...prev, [fieldId]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, ...dynamicFields }),
      })
      if (res.ok) {
        setStatus('success')
        setFirstName('')
        setLastName('')
        setEmail('')
        setDynamicFields({})
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="py-16">
        <p className="font-signifier font-light text-2xl text-[#ede8e2] tracking-tight">
          {t('formSuccess')}
        </p>
      </div>
    )
  }

  const inputClass =
    'w-full bg-transparent border-b border-[#ede8e2]/25 py-3.5 text-[15px] font-cadiz text-[#ede8e2] placeholder:text-[#ede8e2]/40 focus:outline-none focus:border-[#ede8e2]/70 transition-colors duration-200'

  const selectClass =
    'w-full bg-transparent border-b border-[#ede8e2]/25 py-3.5 text-[15px] font-cadiz text-[#ede8e2] focus:outline-none focus:border-[#ede8e2]/70 transition-colors duration-200 appearance-none cursor-pointer'

  // Decide which questions to render
  // formQuestions === undefined → CMS unavailable → use legacy fallback
  // formQuestions === []        → CMS says: no extra questions
  // formQuestions.length > 0   → render CMS questions
  const useLegacy = formQuestions === undefined

  const questions: FormQuestion[] = useLegacy
    ? FALLBACK_QUESTIONS.map((q) => {
        // Hydrate labels + options from translation keys for the legacy fallback
        if (q.fieldId === 'phone')       return { ...q, label: t('formPhone') }
        if (q.fieldId === 'address')     return { ...q, label: t('formAddress') }
        if (q.fieldId === 'serviceType') return {
          ...q,
          label:   t('serviceLabel'),
          options: (legacyServiceOptions ?? (t.raw('serviceOptions') as string[])).map((l) => ({ label: l })),
        }
        if (q.fieldId === 'investment')  return {
          ...q,
          label:   t('budgetLabel'),
          options: (legacyBudgetOptions ?? (t.raw('budgetOptions') as string[])).map((l) => ({ label: l })),
        }
        if (q.fieldId === 'description') return { ...q, label: t('messageLabel') }
        return q
      })
    : formQuestions

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>

      {/* ── Fixed contact fields ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <input
          type="text"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder={`${labelFirstName ?? t('formFirstName')}*`}
          required
          className={inputClass}
          autoComplete="given-name"
        />
        <input
          type="text"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder={`${labelLastName ?? t('formLastName')}*`}
          required
          className={inputClass}
          autoComplete="family-name"
        />
      </div>

      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={`${labelEmail ?? t('formEmail')}*`}
        required
        className={inputClass}
        autoComplete="email"
      />

      {/* ── Dynamic questions from CMS ── */}
      {questions.map((q) => {
        const value       = dynamicFields[q.fieldId] ?? ''
        const placeholder = q.required ? `${q.label}*` : q.label

        if (q.fieldType === 'textarea') {
          return (
            <textarea
              key={q.fieldId}
              name={q.fieldId}
              value={value}
              onChange={(e) => setField(q.fieldId, e.target.value)}
              placeholder={placeholder}
              required={q.required}
              rows={6}
              className={`${inputClass} resize-none`}
            />
          )
        }

        if (q.fieldType === 'select') {
          const opts = q.options ?? []
          return (
            <div key={q.fieldId} className="relative">
              <select
                name={q.fieldId}
                value={value}
                onChange={(e) => setField(q.fieldId, e.target.value)}
                required={q.required}
                className={`${selectClass} ${!value ? 'text-[#ede8e2]/40' : ''}`}
              >
                <option value="" disabled className="bg-[#2d1d17] text-[#ede8e2]">
                  {placeholder}
                </option>
                {opts.map((opt) => (
                  <option key={opt.label} value={opt.label} className="bg-[#2d1d17] text-[#ede8e2]">
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#ede8e2]/40">
                ↓
              </div>
            </div>
          )
        }

        // text | tel
        return (
          <input
            key={q.fieldId}
            type={q.fieldType}
            name={q.fieldId}
            value={value}
            onChange={(e) => setField(q.fieldId, e.target.value)}
            placeholder={placeholder}
            required={q.required}
            className={inputClass}
            autoComplete={q.fieldType === 'tel' ? 'tel' : undefined}
          />
        )
      })}

      {/* ── Submit ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? '…' : (labelSubmit ?? t('submitButton'))}
        </button>
        {status === 'error' && (
          <p className="text-sm font-cadiz text-red-400">
            {t('formError')}
          </p>
        )}
      </div>

    </form>
  )
}
