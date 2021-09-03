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
