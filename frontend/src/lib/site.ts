// Single source of truth for the site's public URL.
// Set NEXT_PUBLIC_SITE_URL in Vercel (e.g. https://toolflux.vercel.app),
// and change it once when a custom domain is added.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://toolflux.vercel.app'
