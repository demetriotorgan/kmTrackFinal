// src/services/offlineInterceptor.js
import api from "../api/api";
import { salvarItem } from "./idbService";
import { v4 as uuidv4 } from "uuid";

export function configurarOfflineInterceptor() {
    // console.log("🛡️ [offlineInterceptor] Interceptor carregado!");

  api.interceptors.request.use(async (config) => {
    // console.log("➡️ [offlineInterceptor] Nova requisição capturada:");
    // console.log("URL:", config.url);
    // console.log("Method:", config.method);
    // console.log("Data enviada:", config.data);

    // Se offline → intercepta
    if (!navigator.onLine) {
      console.warn("📴 Offline detectado — salvando operação localmente");

      let safeData = null;

      try {
        safeData = config.data
          ? JSON.parse(JSON.stringify(config.data))
          : null;
      } catch (err) {
        console.error("⚠️ Erro ao clonar data:", err);
        safeData = config.data;
      }


      const pendente = {
        uuid: uuidv4(),
        url: config.url,
        method: config.method,
        data: safeData ?? {},        
        timestamp: Date.now(),
      };

      console.log("💾 [offlineInterceptor] Salvando pendência no IndexedDB:");
      console.log(pendente);
      await salvarItem("pendentes", pendente);

      console.log("💾 Operação salva no IndexedDB:", pendente);

      // cancela envio real
      console.log("❌ [offlineInterceptor] Cancelando envio real da requisição (offline)");
      return Promise.reject({ offline: true });
    }
    // console.log("🌐 [offlineInterceptor] ONLINE — requisição segue normalmente");
    return config;
  });
}
