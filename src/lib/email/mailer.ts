import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const { error } = await resend.emails.send({
    // from: 'Anti-Tédio <no-reply@mail.antitedio.com.br>',
    from: 'Anti-Tédio <no-reply@mail.antitedio.com.br>',
    to,
    subject,
    html,
  })

  if (error) throw new Error(`Falha ao enviar e-mail: ${error.message}`)
}