const CACHE_NAME = 'vrsa-guide-v3'
const STATIC = [
  '/',
  '/index.html',
  '/offline.html',
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

  // API calls: network first, fall back to cache
  if (
    url.hostname.includes('open-meteo.com') ||
    url.hostname.includes('marine-api.open-meteo.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('maps.googleapis.com')
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
        .catch(() => caches.match(e.request))
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
        caches.match(e.request).then(cached => cached || (e.request.mode === 'navigate' ? caches.match('/offline.html') : caches.match('/index.html')))
      )
  )
})