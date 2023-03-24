// https://qiita.com/yhrym/items/f31669d48688d32155b4

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');
console.log(`Workbox ${workbox ? 'loaded' : 'failed to load'}`);
workbox.core.skipWaiting();

workbox.core.clientsClaim();

workbox.navigationPreload.enable();

// ------------------  runtime caching starts ---------------------
//workbox-strategies
// AR imgages
// support by chatgpt
workbox.routing.registerRoute(
  // 画像ファイルを取得するパスを指定
  /https:\/\/gochiai\.github\.io\/usagi_AR\/aws\.gochiusa\.com\/.*\.(?:png|jpg|webp|svg)/,  // キャッシュストラテジーを指定
  new workbox.strategies.CacheFirst({
    cacheName: 'AR images', // キャッシュ名を指定
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      })]
    }));


// icon
workbox.routing.registerRoute(
  /https:\/\/gochiai\.github\.io\/usagi_AR\/www\.less-ar\.com\/icons\/.*\.(?:png|ico|xml|svg)/,  // キャッシュストラテジーを指定
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'icons',
  })
);
//pages
workbox.routing.registerRoute(
  /https:\/\/gochiai\.github\.io\/usagi_AR\/www\.less-ar\.com\/.*\.(?:html)/,  // キャッシュストラテジーを指定
  new workbox.strategies.CacheFirst({
    cacheName: 'pages', // キャッシュ名を指定
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      })]})
);


// manifest
workbox.routing.registerRoute(
  /https:\/\/gochiai\.github\.io\/usagi_AR\/www\.less-ar\.com\/site\.json/,  // キャッシュストラテジーを指定
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
