// src/services/syncManager.js
import api from "../api/api";
import { listarItens, removerItem } from "./idbService";

// ---------------------------------------------
// Função para derivar um nome amigável do item
// ---------------------------------------------
function getNomeRecurso(item) {
  if (!item?.url) return "Registro";

  if (item.url.includes("trecho")) return "Trecho";
  if (item.url.includes("parada")) return "Parada";
  if (item.url.includes("abastecimento")) return "Abastecimento";
  if (item.url.includes("pedagio")) return "Pedágio";
  if (item.url.includes("viagem")) return "Viagem";

  return "Registro";
}

// ---------------------------------------------
// Sincronização dos itens pendentes
// ---------------------------------------------
export async function syncPendentes() {
  const pendentes = await listarItens("pendentes");

  if (pendentes.length === 0) {
    console.log("✨ Nenhum item pendente para sincronizar");
    return;
  }

  console.log("⏳ Iniciando sincronização offline...", pendentes);

  for (const item of pendentes) {
    const nome = getNomeRecurso(item);

    try {
      console.log(`📤 Enviando ${nome} pendente para API...`, item);

      await api({
        url: item.url,
        method: item.method,
        data: item.data,
      });

      // removendo do IndexedDB
      await removerItem("pendentes", item.uuid);

      console.log(`✔ Sincronizado com sucesso: ${nome}`);

      // 👉 Mensagem amigável para o usuário
      alert(`✓ ${nome} sincronizado com sucesso!`);

    } catch (err) {
      console.error(`❌ Erro ao sincronizar ${nome}:`, err);
      return; // evita looping infinito se continuar falhando
    }
  }

  console.warn("🎉 Todos os itens pendentes foram sincronizados!");
}

// ------------------------------------------------------
// Monitoramento automático quando reconectar na internet
// ------------------------------------------------------
export function iniciarMonitoramento() {
  window.addEventListener("online", () => {
    console.log("🌐 Conexão restaurada — iniciando sincronização offline...");
    syncPendentes();
  });
}
