import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, budget, timeline, location, description } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    /*
     * TODO: Connect to your preferred email service.
     * Options:
     *   - Resend (resend.com) — recommended
     *   - SendGrid
     *   - Postmark
     *
     * Example with Resend:
     *
     * import { Resend } from 'resend'
     * const resend = new Resend(process.env.RESEND_API_KEY)
     * await resend.emails.send({
     *   from: 'noreply@bosko.studio',
     *   to: 'studio@bosko.studio',
     *   subject: `New inquiry from ${name}`,
     *   html: `...`,
     * })
     */

    // Log for now (replace with email sending)
    console.log('Inquiry received:', {
      name,
      email,
      phone,
      budget,
      timeline,
      location,
      description,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Inquiry API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
