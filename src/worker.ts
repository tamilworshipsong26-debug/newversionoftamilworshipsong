/**
 * Cloudflare Edge Worker Entry Point
 * Configured with `run_worker_first: false` in wrangler.jsonc
 * Static assets in `dist/` are served with 0ms Worker CPU overhead.
 */
export interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Health check or edge status endpoint
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Tamil Worship Songs & Sanctuary Bible Suite',
        platform: 'Cloudflare Edge CDN'
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      });
    }

    // Pass all other requests to static assets
    return env.ASSETS.fetch(request);
  }
};
