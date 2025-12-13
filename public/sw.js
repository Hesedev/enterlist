// const CACHE_NAME = 'enterlist-cache-v1';
// const ASSETS = [
//     '/index.html',
//     '/src/app.js',
//     '/src/styles/main.css',
//     '/src/styles/dashboard.css',
//     '/src/styles/lists.css',
//     '/src/styles/settings.css',
//     '/src/styles/swiper-bundle.min.css',
//     'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css',
//     'https://cdn.jsdelivr.net/npm/toastify-js',
//     '/manifest.json',
//     '/assets/favicons/favicon-96x96.png',
//     'https://enterlist.web.app/assets/img/profile-default-background.jpg',
// ];

// // Instalar el Service Worker y cachear los recursos
// self.addEventListener('install', event => {
//     event.waitUntil(
//         caches.open(CACHE_NAME).then(cache => {
//             console.log('Caching app shell');
//             return cache.addAll(ASSETS).catch(error => {
//                 console.error('Error caching assets during installation:', error);
//             });
//         })
//     );
// });

// // Activar el Service Worker y limpiar cachés antiguas
// self.addEventListener('activate', event => {
//     event.waitUntil(
//         caches.keys().then(cacheNames => {
//             return Promise.all(
//                 cacheNames
//                     .filter(cacheName => cacheName !== CACHE_NAME)
//                     .map(cacheName => caches.delete(cacheName))
//             );
//         })
//     );
// });

// // Interceptar solicitudes de red
// self.addEventListener('fetch', event => {
//     const { request } = event;

//     // Siempre responder con `index.html` para rutas no reconocidas (SPA)
//     if (request.mode === 'navigate') {
//         event.respondWith(
//             caches.match('/index.html').then(cachedResponse => {
//                 return (
//                     cachedResponse ||
//                     fetch(request).catch(() => caches.match('/index.html'))
//                 );
//             })
//         );
//         return;
//     }

//     // Verificar si la solicitud es GET antes de manejarla
//     if (request.method !== 'GET') {
//         return; // Ignorar solicitudes que no sean GET
//     }

//     // Intentar obtener recursos del caché, luego de la red
//     event.respondWith(
//         caches.match(request).then(cachedResponse => {
//             return (
//                 cachedResponse ||
//                 fetch(request).then(networkResponse => {
//                     return caches.open(CACHE_NAME).then(cache => {
//                         // Guardar solo respuestas de solicitudes GET en el caché
//                         cache.put(request, networkResponse.clone());
//                         return networkResponse;
//                     });
//                 }).catch(error => {
//                     console.error('Network request failed, returning fallback:', error);
//                     // Aquí puedes devolver un recurso de fallback si es necesario
//                     return caches.match('/assets/fallback-image.png'); // Asegúrate de tener una imagen de fallback
//                 })
//             );
//         })
//     );
// });

// // Manejar notificaciones push (opcional, si usas esta funcionalidad)
// self.addEventListener('push', event => {
//     const data = event.data ? event.data.json() : {};
//     const title = data.title || 'Notificación';
//     const options = {
//         body: data.body || '¡Tienes una nueva notificación!',
//         icon: '/assets/favicons/favicon-96x96.png',
//     };
//     event.waitUntil(self.registration.showNotification(title, options));
// });
