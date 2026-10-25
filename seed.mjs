import { exhibitions } from './src/data/exhibitions.js'

const BASE = 'https://6adc5242fa5e73d4ab2d553a.mockapi.io'

for (const ex of exhibitions) {
  const { id, ...rest } = ex
  const res = await fetch(`${BASE}/Exhibitions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...rest, image: String(rest.image), cover: String(rest.cover) }),
  })
  console.log(ex.id, res.status, await res.text())
}
