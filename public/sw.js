const CACHE_NAME = 'vrsa-guide-v3'
const STATIC = [
  '/',
  '/index.html',
  '/offline.html',
  '/brasao-vrsa.png',
  '/icon-192.png',
  '/icon-512.png',
]

// Install
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC))
      .then(() => self.skipWaiting())
  )
})

// Activate — clear old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

// Fetch — Network First for API, Cache First for assets
self.addEventListener('fetch', e => {
  // Ignorar pedidos não-GET (POST, etc.) — Cache API não suporta
  if (e.request.method !== 'GET') return

  const url = new URL(e.request.url)

  // Cache API não suporta esquemas não-http(s) (ex: chrome-extension://)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return

  // Probes de CSP/telemetria do Google Maps — deixar o browser lidar (falham intencionalmente)
  if (url.pathname.includes('gen_204') || url.pathname.includes('QuotaService')) return

  // API calls: network first, fall back to cache
  if (
    url.hostname.includes('open-meteo.com') ||
    url.hostname.includes('marine-api.open-meteo.com') ||
    url.hostname.includes('googleapis.com')
  ) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res && res.status === 200) {
            const clone = res.clone()
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone))
          }
          return res
        })
        // caches.match pode resolver undefined — fallback para Response.error() em vez de rejeitar
        .catch(() => caches.match(e.request).then(r => r || Response.error()))
    )
    return
  }

  // Static assets: cache first
  if (
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('unpkg.com') ||
    url.hostname.includes('images.unsplash.com')
  ) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached
        return fetch(e.request).then(res => {
          if (res && res.status === 200) {
            const clone = res.clone()
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone))
          }
          return res
        })
      })
    )
    return
  }

  // App shell: network first
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res && res.status === 200) {
          const clone = res.clone()
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone))
        }
        return res
      })
      .catch(() =>
        caches.match(e.request).then(cached => {
          if (cached) return cached
          if (e.request.mode === 'navigate') return caches.match('/offline.html').then(r => r || Response.error())
          return Response.error()
        })
      )
  )
})