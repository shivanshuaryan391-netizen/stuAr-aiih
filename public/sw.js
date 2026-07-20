/* StuAr AI service worker — offline app shell + smart caching */
const VERSION = 'stuar-v1'
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)

  // Never cache AI/API calls
  if (url.hostname.includes('openrouter.ai') || url.hostname.includes('supabase')) return

  // Navigations: network-first, fall back to app shell (SPA offline support)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(VERSION).then((c) => c.put('/index.html', copy))
          return res
        })
        .catch(() => caches.match('/index.html')),
    )
    return
  }

  // Hashed build assets + fonts: cache-first
  if (url.pathname.startsWith('/assets/') || url.hostname.includes('fonts.g')) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            if (res.ok) {
              const copy = res.clone()
              caches.open(VERSION).then((c) => c.put(request, copy))
            }
            return res
          }),
      ),
    )
    return
  }

  // Everything else: network with cache fallback
  event.respondWith(fetch(request).catch(() => caches.match(request)))
})
