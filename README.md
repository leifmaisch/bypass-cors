# cors.rest

**CORS Proxy** — Bypass CORS restrictions. Access any API from your browser—fast, free, no signup.

[Try it live](https://cors.rest)

## Try it

```
https://bypass.cors.rest/proxy?url=
```

```javascript
const res = await fetch(
  'https://bypass.cors.rest/proxy?url=' +
  encodeURIComponent('https://api.github.com/users/torvalds')
)
```

## Host it yourself

**Docker** — Deploy to [Dokploy](https://dokploy.com), [Coolify](https://coolify.io), or [Sliplane](https://sliplane.io):


**Local**

```bash
git clone https://github.com/cors-rest/bypass-cors.git
cd bypass-cors
pnpm install
pnpm build && pnpm start
```

## Examples

**GET**

```bash
curl "http://localhost:3000/proxy?url=https://api.github.com/users/torvalds"
```

**POST**

```bash
curl -X POST http://localhost:3000/proxy \
  -H "Content-Type: application/json" \
  -d '{"url":"https://api.github.com/markdown","text":"**Hello**"}'
```

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `TIMEOUT` | `30000` | Proxy request timeout in milliseconds |
| `ALLOWED_DOMAINS` | all | Comma-separated domains the proxy may fetch. Empty = allow all |
| `ALLOWED_ORIGINS` | all | Comma-separated origins allowed to call the proxy. Empty = allow all |