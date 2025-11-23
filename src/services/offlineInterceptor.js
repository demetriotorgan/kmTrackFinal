// src/services/offlineInterceptor.js
import api from "../api/api";
import { salvarItem } from "./idbService";
import { v4 as uuidv4 } from "uuid";

export function configurarOfflineInterceptor() {
  api.interceptors.request.use(async (config) => {

    // Se offline → intercepta
    if (!navigator.onLine) {
      console.warn("📴 Offline detectado — salvando operação localmente");

      let safeData = null;

      // clona body com segurança
      if (config.data !== undefined && config.data !== null) {
        try {
          safeData =
            typeof config.data === "string"
              ? JSON.parse(config.data)
              : JSON.parse(JSON.stringify(config.data));
        } catch {
          safeData = config.data;
        }
      }

      const pendente = {
        uuid: uuidv4(),
        url: config.url,
        method: config.method,
        data: safeData,
        timestamp: Date.now(),
      };

      await salvarItem("pendentes", pendente);

      console.log("💾 Operação salva no IndexedDB:", pendente);

      // cancela envio real
      return Promise.reject({ offline: true });
    }

    return config;
  });
}
