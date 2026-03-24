import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/** Fields that are always extracted and displayed in the header of the email. */
const CONTACT_FIELD_IDS = new Set(['firstName', 'lastName', 'email'])

export async function POST(request: NextRequest) {
  try {
    const body: Record<string, string> = await request.json()
    const { firstName, lastName, email } = body

    // Validate required contact fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const fullName = `${firstName} ${lastName}`

    // Build dynamic rows from all submitted fields except the fixed contact ones.
    // This way new CMS-defined questions automatically appear in the email
    // without any code changes.
    const dynamicRows = Object.entries(body)
      .filter(([key, value]) => !CONTACT_FIELD_IDS.has(key) && value)
      .map(([key, value]) => {
        // Convert camelCase fieldId to a readable label (e.g. "serviceType" → "Service Type")
        const label = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (c) => c.toUpperCase())
          .trim()

        // Use <pre> style for multiline textarea values
        const isMultiline = value.includes('\n') || value.length > 120
        const cell = isMultiline
          ? `<td style="padding: 10px 0; border-bottom: 1px solid #e5e0da;"><pre style="font-family: Georgia, serif; font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${escHtml(value)}</pre></td>`
          : `<td style="padding: 10px 0; border-bottom: 1px solid #e5e0da;">${escHtml(value)}</td>`

        return `<tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e0da; color: #888; width: 160px; vertical-align: top;">${escHtml(label)}</td>
          ${cell}
        </tr>`
      })
      .join('\n')

    const { error } = await resend.emails.send({
      from:    'Studio Bosko <noreply@bosko.studio>',
      to:      'hello@bosko.studio',
      replyTo: email,
      subject: `New inquiry from ${fullName}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 24px; color: #2d1d17;">
          <p style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #888; margin: 0 0 32px;">
            Studio Bosko — New Inquiry
          </p>

          <h1 style="font-weight: 300; font-size: 28px; margin: 0 0 32px; letter-spacing: -0.02em;">
            ${escHtml(fullName)}
          </h1>

          <table style="width: 100%; border-collapse: collapse; font-size: 15px; margin-bottom: 32px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e0da; color: #888; width: 160px;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e0da;">
                <a href="mailto:${escHtml(email)}" style="color: #2d1d17;">${escHtml(email)}</a>
              </td>
            </tr>
            ${dynamicRows}
          </table>

          <p style="font-size: 12px; color: #aaa; margin: 0; border-top: 1px solid #e5e0da; padding-top: 24px;">
            Sent from bosko.studio/inquire · ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Inquiry API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/** Minimal HTML escaping to prevent XSS in email content. */
function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
