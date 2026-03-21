import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, address, serviceType, investment, description } = body

    // Validate required fields
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

    const { error } = await resend.emails.send({
      from: 'Studio Bosko <noreply@bosko.studio>',
      to: 'hello@bosko.studio',
      replyTo: email,
      subject: `New inquiry from ${fullName}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 24px; color: #2d1d17;">
          <p style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #888; margin: 0 0 32px;">
            Studio Bosko — New Inquiry
          </p>

          <h1 style="font-weight: 300; font-size: 28px; margin: 0 0 32px; letter-spacing: -0.02em;">
            ${fullName}
          </h1>

          <table style="width: 100%; border-collapse: collapse; font-size: 15px; margin-bottom: 32px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e0da; color: #888; width: 160px;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e0da;"><a href="mailto:${email}" style="color: #2d1d17;">${email}</a></td>
            </tr>
            ${phone ? `<tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e0da; color: #888;">Phone</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e0da;">${phone}</td>
            </tr>` : ''}
            ${address ? `<tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e0da; color: #888;">Project Address</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e0da;">${address}</td>
            </tr>` : ''}
            ${serviceType ? `<tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e0da; color: #888;">Services</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e0da;">${serviceType}</td>
            </tr>` : ''}
            ${investment ? `<tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e0da; color: #888;">Investment</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e0da;">${investment}</td>
            </tr>` : ''}
          </table>

          ${description ? `
          <div style="margin-bottom: 32px;">
            <p style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #888; margin: 0 0 12px;">About the project</p>
            <p style="font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${description}</p>
          </div>` : ''}

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
