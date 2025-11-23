// src/services/syncManager.js
import api from "../api/api";
import { listarItens, removerItem } from "./idbService";

export async function syncPendentes() {
  const pendentes = await listarItens("pendentes");

  if (pendentes.length === 0) {
    console.log("✨ Nenhum item pendente para sincronizar");
    return;
  }

  console.log("⏳ Iniciando sincronização...", pendentes);

  for (const item of pendentes) {
    try {
      await api({
        url: item.url,
        method: item.method,
        data: item.data,
      });

      await removerItem("pendentes", item.uuid);

      console.log("✔ Sincronizado:", item.url);

    } catch (err) {
      console.error("❌ Erro ao sincronizar:", item.url, err);
      return; // evita looping
    }
  }

  console.warn("🎉 Todos os itens pendentes foram sincronizados!");
}

export function iniciarMonitoramento() {
  window.addEventListener("online", () => {
    console.log("🌐 Voltou a ficar online — sincronizando pendentes...");
    syncPendentes();
  });
}
