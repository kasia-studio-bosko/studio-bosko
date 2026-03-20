'use client'

import { useState, FormEvent } from 'react'

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

const SERVICE_OPTIONS = [
  'Renovating & Furnishing',
  'Furnishing & Art Curation',
]

const INVESTMENT_OPTIONS = [
  'Under 50K \u20ac',
  '50\u2013100K \u20ac',
  '100\u2013150K \u20ac',
  '150\u2013250K \u20ac',
  '250K \u20ac +',
  'Let\u2019s discuss',
]

export default function InquireForm() {
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
          Thank you — we&apos;ll be in touch shortly.
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
          placeholder="First Name*"
          required
          className={inputClass}
          autoComplete="given-name"
        />
        <input
          type="text"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last Name*"
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
          placeholder="Email*"
          required
          className={inputClass}
          autoComplete="email"
        />
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
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
        placeholder="Project Address"
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
            What type of Studio Bosko services are you interested in?*
          </option>
          {SERVICE_OPTIONS.map((opt) => (
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
            What is your planned interior investment to achieve your goals?*
          </option>
          {INVESTMENT_OPTIONS.map((opt) => (
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
        placeholder="Tell us about your project"
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
          {status === 'loading' ? '...' : 'Send Inquiry \u2192'}
        </button>
        {status === 'error' && (
          <p className="text-sm font-cadiz text-red-400">
            Something went wrong. Please try again or email us directly.
          </p>
        )}
      </div>

    </form>
  )
}
