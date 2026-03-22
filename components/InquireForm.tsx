'use client'

import { useState, FormEvent } from 'react'
import { useTranslations } from 'next-intl'

interface FormState {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  serviceType: string
  investment: string
  description: string
}

const INITIAL_STATE: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  serviceType: '',
  investment: '',
  description: '',
}

interface InquireFormProps {
  /** CMS-driven service options — falls back to translation file when undefined */
  serviceOptions?: string[]
  /** CMS-driven budget options — falls back to translation file when undefined */
  budgetOptions?: string[]
}

export default function InquireForm({ serviceOptions: propServiceOptions, budgetOptions: propBudgetOptions }: InquireFormProps = {}) {
  const t = useTranslations('inquire')
  const serviceOptions = propServiceOptions ?? (t.raw('serviceOptions') as string[])
  const budgetOptions  = propBudgetOptions  ?? (t.raw('budgetOptions')  as string[])

  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>

      {/* Row 1 — First Name / Last Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <input
          type="text"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder={`${t('formFirstName')}*`}
          required
          className={inputClass}
          autoComplete="given-name"
        />
        <input
          type="text"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder={`${t('formLastName')}*`}
          required
          className={inputClass}
          autoComplete="family-name"
        />
      </div>

      {/* Row 2 — Email / Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder={`${t('formEmail')}*`}
          required
          className={inputClass}
          autoComplete="email"
        />
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

      {/* Project Address */}
      <input
        type="text"
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder={t('formAddress')}
        className={inputClass}
        autoComplete="street-address"
      />

      {/* Service type dropdown */}
      <div className="relative">
        <select
          name="serviceType"
          value={form.serviceType}
          onChange={handleChange}
          className={`${selectClass} ${!form.serviceType ? 'text-[#ede8e2]/40' : ''}`}
          required
        >
          <option value="" disabled className="bg-[#2d1d17] text-[#ede8e2]">
            {t('serviceLabel')}*
          </option>
          {serviceOptions.map((opt) => (
            <option key={opt} value={opt} className="bg-[#2d1d17] text-[#ede8e2]">
              {opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#ede8e2]/40">
          ↓
        </div>
      </div>

      {/* Investment dropdown */}
      <div className="relative">
        <select
          name="investment"
          value={form.investment}
          onChange={handleChange}
          className={`${selectClass} ${!form.investment ? 'text-[#ede8e2]/40' : ''}`}
          required
        >
          <option value="" disabled className="bg-[#2d1d17] text-[#ede8e2]">
            {t('budgetLabel')}*
          </option>
          {budgetOptions.map((opt) => (
            <option key={opt} value={opt} className="bg-[#2d1d17] text-[#ede8e2]">
              {opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#ede8e2]/40">
          ↓
        </div>
      </div>

      {/* Description */}
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder={t('messageLabel')}
        rows={6}
        className={`${inputClass} resize-none`}
      />

      {/* Submit */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? '…' : t('submitButton')}
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
