// This script injects environment variables at runtime
// It runs before the Angular app loads and makes them available via window.__env__
(function (window) {
  window.__env__ = {
    FIREBASE_API_KEY: window.env?.FIREBASE_API_KEY || "",
    FIREBASE_AUTH_DOMAIN: window.env?.FIREBASE_AUTH_DOMAIN || "",
    FIREBASE_PROJECT_ID: window.env?.FIREBASE_PROJECT_ID || "",
    FIREBASE_STORAGE_BUCKET: window.env?.FIREBASE_STORAGE_BUCKET || "",
    FIREBASE_MESSAGING_SENDER_ID:
      window.env?.FIREBASE_MESSAGING_SENDER_ID || "",
    FIREBASE_APP_ID: window.env?.FIREBASE_APP_ID || "",
  };
})(this);
