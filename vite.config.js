import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",

      devOptions: {
        enabled: false
      },

      includeAssets: ["favicon.ico", "icon-192.png", "icon-512.png"],

      manifest: {
        name: "Controle de Viagem",
        short_name: "Viagem",
        start_url: "/",
        display: "standalone",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" }
        ]
      },

      // ---------------------------------------------------------
      // 🔥 SILENCIAR LOGS DO WORKBOX
      // ---------------------------------------------------------
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],

        navigateFallback: "index.html",

        // Desativa todos os logs do Workbox
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,

        // isto adiciona no service worker:
        //  self.__WB_DISABLE_DEV_LOGS = true
        // que silencia os logs do workbox
        disableDevLogs: true,

        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "pages-cache"
            }
          },
          {
            urlPattern: ({ request }) =>
              ["style", "script", "worker"].includes(request.destination),
            handler: "StaleWhileRevalidate",
            options: { cacheName: "assets-cache" }
          }
        ]
      },

      // ---------------------------------------------------------
      // 🔥 SILENCIAR WORKBOX NO SERVICE WORKER GERADO
      // ---------------------------------------------------------
      injectRegister: "auto",
      injectManifest: false,
      workboxOptions: {
        // só por precaução adicional
        mode: "production"
      }
    })
  ]
});
