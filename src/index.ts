import Fastify from "fastify"
import cors from "@fastify/cors"
import axios from "axios"
import { config } from "../config.js"

const fastify = Fastify()
await fastify.register(cors, {
  origin: config.allowedOrigins ?? true,
})

function isAllowed(url: URL): boolean {
  if (!config.allowedDomains) return true
  const host = url.hostname.toLowerCase()
  return config.allowedDomains.some(
    (d: string) => host === d.toLowerCase() || host.endsWith(`.${d.toLowerCase()}`)
  )
}

fastify.all("/proxy", async (request, reply) => {
  const query = request.query as { url?: string }
  const body = request.body as Record<string, unknown> | undefined
  const url = query.url ?? (typeof body?.url === "string" ? body.url : undefined)
  if (!url) {
    return reply.status(400).send({ error: "Missing url parameter" })
  }

  let target: URL
  try {
    target = new URL(url)
  } catch {
    return reply.status(400).send({ error: "Invalid url" })
  }

  if (!["http:", "https:"].includes(target.protocol)) {
    return reply.status(400).send({ error: "Only http and https are allowed" })
  }

  if (!isAllowed(target)) {
    return reply.status(403).send({ error: "Domain not allowed" })
  }

  const forwardBody = body && "url" in body
    ? Object.fromEntries(Object.entries(body).filter(([k]) => k !== "url"))
    : request.body

  try {
    const response = await axios({
      method: request.method,
      url: target.toString(),
      timeout: config.timeout,
      headers: {
        ...request.headers,
        host: target.host,
        origin: target.origin,
      },
      data: forwardBody,
      validateStatus: () => true,
    })

    reply.status(response.status)
    Object.entries(response.headers).forEach(([key, value]) => {
      const lower = key.toLowerCase()
      if (lower !== "transfer-encoding" && value) {
        reply.header(key, value)
      }
    })
    return response.data
  } catch (err) {
    return reply.status(502).send({ error: "Proxy request failed" })
  }
})

fastify.listen({ port: config.port, host: "0.0.0.0" }, (err) => {
  if (err) throw err
  console.log(`Proxy running at http://localhost:${config.port}`)
})
