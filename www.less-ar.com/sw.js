// https://qiita.com/yhrym/items/f31669d48688d32155b4
//chatgpt
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');
console.log(`Workbox ${workbox ? 'loaded' : 'failed to load'}`);
workbox.setConfig({
  debug: true
});
//https://developer.chrome.com/docs/workbox/modules/workbox-sw/#convert-code-using-import-statements-to-use-workbox-sw
const {Core,setCacheNameDetails} = workbox.core;
const {registerRoute,setDefaultHandler} = workbox.routing;
const {CacheFirst, StaleWhileRevalidate,NetworkFirst} = workbox.strategies;
const {CacheableResponsePlugin} = workbox.cacheableResponse;
const {precacheAndRoute} = workbox.precaching;
// https://developer.chrome.com/docs/workbox/modules/workbox-core/
setCacheNameDetails({
  prefix: 'usagi_AR',
  suffix: 'v1.2',
  precache: 'install-assets'
});
// Skip over the waiting lifecycle stage.
Core.skipWaiting();
// clientsClaim() allows a service worker to take control of the page immediately.
Core.clientsClaim();

// Use cache-first strategy to cache images
registerRoute(
  new RegExp('../aws.gochiusa.com/.*\\.(?:png|jpg|webp|svg)'),
  CacheFirst({
    cacheName: 'usagi_AR-images',
    plugins: [
      CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Cache pages with cache-first strategy
registerRoute(
  new RegExp('./.*\\.html'),
  CacheFirst({
    cacheName: 'usagi_AR-pages',
    plugins: [
      CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Cache icons with stale-while-revalidate strategy
registerRoute(
  new RegExp('./icons/.*\\.(?:png|ico|xml)'),
  StaleWhileRevalidate({
    cacheName: 'usagi_AR-icons',
  })
);

// Cache manifest with stale-while-revalidate strategy
registerRoute(
  new RegExp('./site/.json'),
  StaleWhileRevalidate({
    cacheName: 'usagi_AR-manifest',
  })
);



// ------------------  precaching the assets ---------------------
precacheAndRoute([
  // css,js
  './css/app.css',
  './css/tutorial_common.css',
  // js
  './js/loader/DDSLoader.js',
  './js/loader/TGALoader.js',
  './js/app_error.js',
  './js/app.js',
  './js/ar.js',
  './js/driver.min.js',
// sound
  './sound/Camera-Film01-1.mp3',
//img
  './img/screen_curve.png',
  './img/loading.gif',
  './img/in-camera-icon-a.png',
  './img/animal_lesserpanda.png',
  './img/262x466.png',
  './img/_sprite_panorama.png',
  './img/_sprite_menu_icons.png',
  './img/_sprite_filter_icon.png',
  './img/_sprite_facepaint_icons.png',
  './img/camera/change-mid.png',
  './img/camera/permission_left.png',
  './img/camera/permission_top.png'
]);

setDefaultHandler(
   NetworkFirst({
    cacheName: 'default',
    plugins: [
    CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);