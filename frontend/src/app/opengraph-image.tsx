import { ImageResponse } from 'next/og'

export const alt = 'ToolFlux — Free Online Tools'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a1a 0%, #141432 60%, #1e1b4b 100%)',
          color: '#fff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 700, display: 'flex' }}>
          Tool<span style={{ color: '#818cf8' }}>Flux</span>
        </div>
        <div style={{ fontSize: 36, color: '#a5b4fc', marginTop: 24 }}>
          Free online tools — no ads, no sign-up
        </div>
      </div>
    ),
    size,
  )
}
