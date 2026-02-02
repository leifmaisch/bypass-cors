function parseList(env: string | undefined): string[] | null {
  if (!env || env.trim() === "") return null
  return env.split(",").map((d) => d.trim()).filter(Boolean)
}

export const config = {
  port: parseInt(process.env.PORT ?? "3000", 10),
  timeout: parseInt(process.env.TIMEOUT ?? "30000", 10),
  allowedDomains: parseList(process.env.ALLOWED_DOMAINS),
  allowedOrigins: parseList(process.env.ALLOWED_ORIGINS),
}
