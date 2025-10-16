export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    // The path after your worker URL is the target URL
    // Example: https://your-worker.workers.dev/https://leetcode.com/graphql/
    const target = url.pathname.slice(1) + (url.search || '')
    if (!target.startsWith('http')) {
      return new Response('Target must start with http(s) in the path', { status: 400 })
    }

    const init = {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow'
    }

    // Remove Host header to avoid conflicts
    init.headers = new Headers(request.headers)
    init.headers.delete('host')

    const resp = await fetch(target, init)
    const headers = new Headers(resp.headers)

    // Overwrite CORS headers
    headers.set('access-control-allow-origin', '*')
    headers.set('access-control-allow-methods', 'GET,HEAD,POST,PUT,DELETE,OPTIONS')
    headers.set('access-control-allow-headers', '*')

    const body = await resp.arrayBuffer()
    return new Response(body, { status: resp.status, statusText: resp.statusText, headers })
  }
}
