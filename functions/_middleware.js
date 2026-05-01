/**
 * Cloudflare Pages middleware — Borderless Creators
 *
 * Handles two concerns (order matters — staging check MUST come first):
 *
 * 1. STAGING PROTECTION  (staging.borderlesscreators.com)
 *    - Basic Auth gate if STAGING_PASSWORD secret is set (Preview scope)
 *    - Serves blocking robots.txt (Disallow: /) at /robots.txt
 *    - Adds X-Robots-Tag: noindex, nofollow to every response
 *
 * 2. CANONICAL REDIRECT  (all other non-production hostnames)
 *    - www.borderlesscreators.com → borderlesscreators.com (301)
 *    - borderless-creators-site.pages.dev → borderlesscreators.com (301)
 *    - Any other hostname → borderlesscreators.com (301)
 *    - Preserves path + query string
 *
 * Canonical:  https://borderlesscreators.com
 * Staging:    https://staging.borderlesscreators.com  (protected, NOT redirected)
 */

const CANONICAL_HOST = 'borderlesscreators.com';
const STAGING_HOST   = 'staging.borderlesscreators.com';

export async function onRequest(context) {
  const { request, next, env } = context;
  const url      = new URL(request.url);
  const hostname = url.hostname;

  // ── 1. Staging protection ────────────────────────────────────────────────
  // Must come BEFORE the canonical redirect block.
  // If reversed, staging.borderlesscreators.com would match "not canonical"
  // and silently 301 to production, bypassing all protection.
  if (hostname === STAGING_HOST) {

    // Basic Auth gate — set STAGING_PASSWORD as a Pages Secret, Preview scope only.
    // Pages → Settings → Environment Variables → Preview → Add secret: STAGING_PASSWORD
    const password = env.STAGING_PASSWORD;
    if (password) {
      const authHeader = request.headers.get('Authorization') ?? '';
      const expected   = `Basic ${btoa(`leon:${password}`)}`;
      if (authHeader !== expected) {
        return new Response('Staging access requires authentication.', {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Staging — Borderless Creators"',
            'Content-Type':     'text/plain',
          },
        });
      }
    }

    // Blocking robots.txt — catches any crawler that bypasses auth
    if (url.pathname === '/robots.txt') {
      return new Response('User-agent: *\nDisallow: /\n', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    // Pass through, then stamp noindex on every staging response
    const response   = await next();
    const protected_ = new Response(response.body, response);
    protected_.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return protected_;
  }

  // ── 2. Canonical redirect ────────────────────────────────────────────────
  // Redirect any non-canonical hostname (www.*, pages.dev) to the canonical domain.
  if (hostname !== CANONICAL_HOST) {
    url.hostname = CANONICAL_HOST;
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }

  return next();
}
