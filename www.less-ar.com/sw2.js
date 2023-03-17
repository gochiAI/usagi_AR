// https://qiita.com/yhrym/items/f31669d48688d32155b4

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

workbox.core.skipWaiting();

workbox.core.clientsClaim();

workbox.navigationPreload.enable();

// ------------------  runtime caching starts ---------------------

// AR imgages
workbox.routing.registerRoute(
  new RegExp('../../aws.gochiusa.com/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'AR images',
    maxEntries: 50,
  })
);

// icon
workbox.routing.registerRoute(
  new RegExp('../.../icons/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'icons',
    maxEntries: 50,
  })
);
//pages
workbox.routing.registerRoute(
  new RegExp('../*.html'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'pages',
    maxEntries: 20,
  })
);


// manifest
workbox.routing.registerRoute(
  new RegExp('./site.json'),
  new workbox.strategies.StaleWhileRevalidate()
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
  './img/loading.png',
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
