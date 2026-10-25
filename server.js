import { createServer } from 'node:http'
import process from 'node:process'

const port = Number(process.env.PORT || 3001)
const telegramToken = process.env.TELEGRAM_BOT_TOKEN?.trim()
const telegramChatId = process.env.TELEGRAM_CHAT_ID?.trim()

if (!telegramToken || !telegramChatId) {
  console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in .env')
  process.exit(1)
}

const escapeHtml = value => String(value ?? '')
  .slice(0, 500)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')

const sendJson = (response, status, payload) => {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(payload))
}

const requestsByAddress = new Map()
const requestLimit = 10
const requestWindowMs = 60_000

const server = createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)
  if (url.pathname !== '/api/telegram/booking') {
    sendJson(response, 404, { error: 'Not found' })
    return
  }
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Method not allowed' })
    return
  }

  const address = request.socket.remoteAddress || 'unknown'
  const now = Date.now()
  const recentRequests = (requestsByAddress.get(address) || []).filter(time => now - time < requestWindowMs)
  if (recentRequests.length >= requestLimit) {
    sendJson(response, 429, { error: 'Too many requests' })
    return
  }
  recentRequests.push(now)
  requestsByAddress.set(address, recentRequests)

  try {
    let rawBody = ''
    for await (const chunk of request) {
      rawBody += chunk
      if (rawBody.length > 16_384) {
        sendJson(response, 413, { error: 'Request body too large' })
        return
      }
    }

    const booking = JSON.parse(rawBody)
    if (!booking || typeof booking !== 'object' || !booking.name || !booking.email || !booking.date || !booking.time) {
      sendJson(response, 400, { error: 'Invalid booking' })
      return
    }

    const ticketLines = Object.entries(booking.tickets || {})
      .filter(([, count]) => Number(count) > 0)
      .map(([type, count]) => `${escapeHtml(type)}: ${Number(count)}`)
    const message = [
      '<b>Новая бронь музея</b>',
      '',
      `<b>Номер:</b> ${escapeHtml(booking.id || 'не указан')}`,
      `<b>Имя:</b> ${escapeHtml(booking.name)}`,
      `<b>Email:</b> ${escapeHtml(booking.email)}`,
      `<b>Телефон:</b> ${escapeHtml(booking.phone || 'не указан')}`,
      `<b>Дата:</b> ${escapeHtml(booking.date)}`,
      `<b>Время:</b> ${escapeHtml(booking.time)}`,
      `<b>Билеты:</b> ${ticketLines.length ? ticketLines.join(', ') : 'не указаны'}`,
      `<b>Сумма:</b> ${Number(booking.totalPrice) || 0} KGS`,
    ].join('\n')

    const telegramResponse = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: telegramChatId, text: message, parse_mode: 'HTML' }),
    })

    if (!telegramResponse.ok) {
      console.error('Telegram rejected a booking notification with status:', telegramResponse.status)
      sendJson(response, 502, { error: 'Telegram notification failed' })
      return
    }

    sendJson(response, 200, { sent: true })
  } catch (error) {
    console.error('Could not process Telegram booking notification:', error.message)
    sendJson(response, 400, { error: 'Invalid request' })
  }
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Telegram booking API listening on http://127.0.0.1:${port}`)
})
