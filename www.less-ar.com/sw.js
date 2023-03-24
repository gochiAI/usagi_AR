// https://qiita.com/yhrym/items/f31669d48688d32155b4
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');
console.log(`Workbox ${workbox ? 'loaded' : 'failed to load'}`);
workbox.core.setCacheNameDetails({ prefix: 'usagi_AR' });
workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);
// Skip over the waiting lifecycle stage.
workbox.core.skipWaiting();
// clientsClaim() allows a service worker to take control of the page immediately.
workbox.core.clientsClaim();

// Use cache-first strategy to cache images
workbox.routing.registerRoute(
  /https:\/\/gochiai\.github\.io\/usagi_AR\/aws\.gochiusa\.com\/.*\.(?:png|jpg|webp|svg)/,
  new workbox.strategies.CacheFirst({
    cacheName: 'usagi_AR-images',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Cache pages with cache-first strategy
workbox.routing.registerRoute(
  /https:\/\/gochiai\.github\.io\/usagi_AR\/www\.less-ar\.com\/.*\.(?:html)/,
  new workbox.strategies.CacheFirst({
    cacheName: 'usagi_AR-pages',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Cache icons with stale-while-revalidate strategy
workbox.routing.registerRoute(
  /https:\/\/gochiai\.github\.io\/usagi_AR\/www\.less-ar\.com\/icons\/.*\.(?:png|ico|xml|svg)/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'usagi_AR-icons',
  })
);

// Cache manifest with stale-while-revalidate strategy
workbox.routing.registerRoute(
  /https:\/\/gochiai\.github\.io\/usagi_AR\/www\.less-ar\.com\/site\.json/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'usagi_AR-manifest',
  })
);



// ------------------  precaching the assets ---------------------
workbox.precaching.precacheAndRoute([
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

workbox.routing.setDefaultHandler(
  new workbox.strategies.NetworkFirst({
    cacheName: 'default',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);