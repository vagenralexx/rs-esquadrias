import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    const lead = payload.record

    if (!lead) {
      return new Response(JSON.stringify({ error: 'No record in payload' }), { status: 400 })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: configRow } = await supabase
      .from('site_config')
      .select('value')
      .eq('key', 'notification_email')
      .single()

    const notificationEmail = configRow?.value?.trim()

    if (!notificationEmail) {
      console.log('notification_email not configured, skipping.')
      return new Response(JSON.stringify({ skipped: true }), { status: 200 })
    }

    const resendKey = Deno.env.get('RESEND_API_KEY')!

    const emailBody = `
      <h2>Novo Lead — RS Esquadrias</h2>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
        <tr><td style="padding:8px;font-weight:bold;color:#666;">Nome</td><td style="padding:8px;">${lead.name}</td></tr>
        <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#666;">Telefone</td><td style="padding:8px;">${lead.phone}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;color:#666;">E-mail</td><td style="padding:8px;">${lead.email ?? '—'}</td></tr>
        <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#666;">Serviço</td><td style="padding:8px;">${lead.service}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;color:#666;">Mensagem</td><td style="padding:8px;">${lead.message || '—'}</td></tr>
        <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#666;">Origem</td><td style="padding:8px;">${lead.source}</td></tr>
      </table>
      <p style="margin-top:16px;"><a href="https://rsesquadrias.com.br/admin/leads" style="background:#FF6B00;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">Ver no Painel →</a></p>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'RS Esquadrias <noreply@rsesquadrias.com.br>',
        to: [notificationEmail],
        subject: `Novo lead: ${lead.name} — ${lead.service}`,
        html: emailBody,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend error:', err)
      return new Response(JSON.stringify({ error: err }), { status: 500 })
    }

    return new Response(JSON.stringify({ sent: true }), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
