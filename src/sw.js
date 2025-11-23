// src/sw.js
// Suprime mensagens de debug do Workbox (principalmente em dev)
self.__WB_DISABLE_DEV_LOGS = true;

// o plugin irá injetar o manifesto de precache em `self.__WB_MANIFEST`
import { precacheAndRoute } from 'workbox-precaching';

// registra os assets gerados no build
precacheAndRoute(self.__WB_MANIFEST || []);

// --- aqui você pode adicionar handlers customizados ---
// exemplo simples de route runtime se quiser:
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

registerRoute(
  ({ request }) => request.destination === 'document',
  new NetworkFirst({
    cacheName: 'pages-cache',
  })
);
