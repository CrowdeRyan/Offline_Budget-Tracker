const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const iconSizes = ["192", "512"];
const iconFiles = iconSizes.map((size) => `/icons/icon-${size}x${size}.png`);

const staticFilesToPreCache = [
  "/",
  "/index.js",
  "/db.js",
  "/index.html",
  "/manifest.webmanifest",
  "/styles.css",
].concat(iconFiles);

// install event
self.addEventListener("install", function (evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Your files were pre-cached successfully!");
      return cache.addAll(staticFilesToPreCache);
    })
  );

  self.skipWaiting();
});

// activate event
self.addEventListener("activate", function (evt) {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// fetch event
self.addEventListener("fetch", function (evt) {
  const { url } = evt.request;
  if (url.includes("/api")) {
    evt.respondWith(
      caches
        .open(DATA_CACHE_NAME)
        .then((cache) => {
          return fetch(evt.request)
            .then((response) => {
              // Check for good response and store clone in the cache.
              if (response.status === 200) {
                cache.put(evt.request, response.clone());
              }

              return response;
            })
            .catch((err) => {
              // If network fails, pull it from the cache.
              return cache.match(evt.request);
            });
        })
        .catch((err) => console.log(err))
    );
  } else {
    // respond from static cache
    evt.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(evt.request).then((response) => {
          return response || fetch(evt.request);
        });
      })
    );
  }
});
