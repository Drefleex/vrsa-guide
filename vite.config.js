import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      // Precache all built assets automatically (JS, CSS, HTML, images)
      workbox: {
        // Precache only app shell (JS/CSS/HTML/icons) — NOT the heavy /images/ folder
        globPatterns: ['**/*.{js,css,html,ico,woff2}', '*.png', '*.svg'],
        globIgnores: ['**/images/**'],
        // Runtime caching rules (replaces the old manual sw.js logic)
        runtimeCaching: [
          // Weather API — network first, fall back to cache (5 min)
          {
            urlPattern: /^https:\/\/(api|marine-api)\.open-meteo\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'weather-api',
              expiration: { maxAgeSeconds: 300 },
            },
          },
          // Google Maps tiles & API — network first, 1 day cache
          {
            urlPattern: /^https:\/\/.*googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'gmaps-api',
              expiration: { maxAgeSeconds: 86400 },
            },
          },
          // Google Fonts stylesheets
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-css',
              expiration: { maxAgeSeconds: 31536000, maxEntries: 10 },
            },
          },
          // Google Fonts files
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-files',
              expiration: { maxAgeSeconds: 31536000, maxEntries: 30 },
            },
          },
          // Local /images/ — CacheFirst, cached on first view, kept 30 days
          {
            urlPattern: /\/images\/.+\.webp$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'local-images',
              expiration: { maxAgeSeconds: 2592000, maxEntries: 80 },
            },
          },
          // Unsplash & external images
          {
            urlPattern: /^https:\/\/(images\.unsplash\.com|commons\.wikimedia\.org)\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'ext-images',
              expiration: { maxAgeSeconds: 604800, maxEntries: 60 },
            },
          },
        ],
        // Show offline.html when navigation fails and no cache hit
        navigateFallback: '/offline.html',
        navigateFallbackDenylist: [/^\/api\//],
      },
      // Web App Manifest
      manifest: {
        name: 'VRSA Guide',
        short_name: 'VRSA',
        description: 'Guia turístico de Vila Real de Santo António',
        theme_color: '#0F2444',
        background_color: '#0F2444',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
