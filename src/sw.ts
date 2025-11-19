/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

// Workbox will inject manifest here
cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

// Cache Google Fonts
registerRoute(
    ({ url }) => url.origin === 'https://fonts.googleapis.com' ||
        url.origin === 'https://fonts.gstatic.com',
    new CacheFirst({
        cacheName: 'google-fonts',
        plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })]
    })
)

// Network-first for API calls (if any)
registerRoute(
    ({ url }) => url.pathname.startsWith('/api/'),
    new NetworkFirst({
        cacheName: 'api-cache',
        networkTimeoutSeconds: 3
    })
)

// Handle fetch events
self.addEventListener('fetch', (_event) => {
    // Let Workbox handle it
})

// Handle message events (for updates)
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting()
    }
})
