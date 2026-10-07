// server.js — arranque para Plesk/Passenger (Application startup file).
// Passenger define PORT; en producción se sirve el build de `next build`.
const { createServer } = require("http")
const next = require("next")

const port = Number(process.env.PORT) || 3000
const app = next({ dev: false })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`HINS front listo en el puerto ${port}`)
  })
})
