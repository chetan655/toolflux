// Single source of truth for the site's public URL.
// Set NEXT_PUBLIC_SITE_URL in Vercel (e.g. https://toolflux-app.vercel.app),
// and change it once when a custom domain is added.
const raw = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://toolflux.vercel.app'

// Tolerate a value set without a scheme or with a trailing slash.
export const SITE_URL = (raw.startsWith('http') ? raw : `https://${raw}`).replace(/\/+$/, '')
