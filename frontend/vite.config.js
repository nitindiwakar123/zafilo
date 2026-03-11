import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    headers: {
      'Content-Security-Policy': [
        "default-src 'self';",
        "script-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/client;",
        "style-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/style;",
        "connect-src 'self' http://localhost:4000 https://accounts.google.com;",
        "img-src 'self' http://localhost:4000 data:;",
        "frame-src 'self' http://localhost:4000 https://accounts.google.com;",
        "object-src 'none';",
        "base-uri 'self';",
        "frame-ancestors 'none';"
      ].join(' '),
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
    },
  },
})

