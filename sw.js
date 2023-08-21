// https://qiita.com/yhrym/items/f31669d48688d32155b4
//chatgpt
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');
console.log(`Workbox ${workbox ? 'loaded' : 'failed to load'}`);
workbox.setConfig({
  debug: false
});
//https://developer.chrome.com/docs/workbox/modules/workbox-sw/#convert-code-using-import-statements-to-use-workbox-sw
const {core,setCacheNameDetails,clientsClaim} = workbox.core;
const {registerRoute,setDefaultHandler} = workbox.routing;
const {CacheFirst,StaleWhileRevalidate,NetworkFirst} = workbox.strategies;
const {CacheableResponsePlugin} = workbox.cacheableResponse;
const {precacheAndRoute} = workbox.precaching;
const {ExpirationPlugin} = workbox.expiration;

// https://developer.chrome.com/docs/workbox/modules/workbox-core/
setCacheNameDetails({
  prefix: 'usagi_AR',
  suffix: 'v2.',
  precache: 'assets',
  maxAgeSeconds: 7 * 24 * 60 * 60
});
// Skip over the waiting lifecycle stage.
skipWaiting();
// clientsClaim() allows a service worker to take control of the page immediately.
clientsClaim();

// Use cache-first strategy to cache images
registerRoute(
  new RegExp('../aws.gochiusa.com/*/.*\\.(?:png|jpg|webp|svg)'),
  new CacheFirst({
    cacheName: 'usagi_AR-images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
      })
    ],
  })
);

// Cache pages with cache-first strategy
registerRoute(
  new RegExp('./*/.*\\.html'),
  new CacheFirst({
    cacheName: 'usagi_AR-pages',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
      })

    ],
  })
);


// ------------------  precaching the assets ---------------------
precacheAndRoute([
  './www.less-ar.com/index.html',
  './2.0/index.html',
  // css,js
  './www.less-ar.com/css/app.css',
  './www.less-ar.com/css/tutorial_common.css',
  './2.0/main.css',
  './2.0/appjs/app.min.css',
  // js
  './www.less-ar.com/js/loader/DDSLoader.js',
  './www.less-ar.com/js/loader/TGALoader.js',
  './www.less-ar.com/js/app_error.js',
  './www.less-ar.com/js/app.js',
  './www.less-ar.com/js/ar.js',
  './www.less-ar.com/js/driver.min.js',
  './2.0/appjs/app.min.js',
  './2.0/dex.js',
  './2.0/html2canvas.min.js',
  './2.0/list.js'
]);

setDefaultHandler(
  new NetworkFirst({
    cacheName: 'default',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
      })

    ]
  })
);