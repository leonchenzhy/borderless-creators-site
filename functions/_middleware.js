/**
 * Cloudflare Pages middleware — Borderless Creators
 *
 * Handles two concerns (order matters — staging check MUST come first):
 *
 * 1. STAGING PROTECTION  (staging.borderlesscreators.com)
 *    - Protected by Cloudflare Zero Trust / Access (configured in CF dashboard)
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
 * Staging:    https://staging.borderlesscreators.com  (protected via CF Zero Trust)
 */

const CANONICAL_HOST = 'borderlesscreators.com';
const STAGING_HOST   = 'staging.borderlesscreators.com';

export async function onRequest(context) {
  const { request, next } = context;
  const url      = new URL(request.url);
  const hostname = url.hostname;

  // ── 1. Staging protection ────────────────────────────────────────────────
  // Must come BEFORE the canonical redirect block.
  // Auth is handled by Cloudflare Zero Trust — middleware only adds noindex
  // headers and serves a blocking robots.txt as an extra safety layer.
  if (hostname === STAGING_HOST) {

    // Blocking robots.txt — prevents crawlers that bypass Zero Trust
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
