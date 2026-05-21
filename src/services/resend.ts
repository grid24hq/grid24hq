/**
 * resend.ts
 *
 * Resend API calls MUST go through a Cloudflare Worker — never call Resend
 * directly from the browser (your API key would be exposed).
 *
 * Worker endpoint: https://grid24hq.pages.dev/api/email
 * See: /functions/api/email.ts  (Cloudflare Pages Function)
 */

const WORKER_URL = '/api/email'

export interface WelcomeEmailParams {
  to: string
  displayName: string
}

export interface PasswordResetEmailParams {
  to: string
  resetLink: string
}

// ─── Send welcome email after registration ────────────────────────────────────

export async function sendWelcomeEmail(params: WelcomeEmailParams): Promise<void> {
  await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      template:    'welcome',
      to:          params.to,
      displayName: params.displayName,
    }),
  })
  // Fire-and-forget — don't block registration if email fails
}

// ─── Password reset email (backup — Firebase handles this natively) ───────────

export async function sendPasswordResetEmail(
  params: PasswordResetEmailParams,
): Promise<void> {
  await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      template:  'password-reset',
      to:        params.to,
      resetLink: params.resetLink,
    }),
  })
}

/*
─── Cloudflare Pages Function template ───────────────────────────────────────
Create this file: /functions/api/email.ts

import { Resend } from 'resend'

export async function onRequestPost(context) {
  const resend = new Resend(context.env.RESEND_API_KEY)
  const body   = await context.request.json()

  if (body.template === 'welcome') {
    await resend.emails.send({
      from:    'Grid24HQ <noreply@grid24hq.com>',
      to:      body.to,
      subject: '🏁 Welkom bij Grid24HQ!',
      html:    `<h1>Hey ${body.displayName}!</h1><p>Welkom bij The Ultimate Racing Hub.</p>`,
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
─────────────────────────────────────────────────────────────────────────────
*/
