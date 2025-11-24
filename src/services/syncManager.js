// src/services/syncManager.js
import api from "../api/api";
import { listarItens, removerItem } from "./idbService";

// ---------------------------------------------
// Nome amigável do recurso
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
// SINCRONIZAR ITENS PENDENTES
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

      // Remover item da fila
      await removerItem("pendentes", item.uuid);
      console.log(`✔ Sincronizado: ${nome}`);

      alert(`✓ ${nome} sincronizado com sucesso!`);

    } catch (err) {
      console.error(`❌ Erro ao sincronizar ${nome}:`, err);

      // ---------------------------
      // 🔥 TRATAMENTO DE ERROS DA API
      // ---------------------------
      if (err.response) {
        const status = err.response.status;

        // ⚠ 400 — Registro duplicado
        if (status === 400) {
          const mensagem = err.response.data?.mensagem ?? "Registro já existe na API.";

          alert(`⚠ Atenção\n\n${mensagem}`);

          // O item deve ser removido da fila porque nunca será aceito pela API
          await removerItem("pendentes", item.uuid);

          // Continua sincronizando os próximos itens
          continue;
        }

        // ❗ Erros de servidor 500+
        if (status >= 500) {
          alert("Erro no servidor ao sincronizar. Tente novamente mais tarde.");
          return; // Para aqui pois provavelmente está instável
        }
      }

      // Erro genérico (timeout / rede / etc.)
      alert("Erro inesperado ao sincronizar itens offline.");
      return;
    }
  }

  console.warn("🎉 Todos os itens pendentes foram sincronizados!");
}

// ------------------------------------------------------
// Monitoramento automático quando reconectar
// ------------------------------------------------------
export function iniciarMonitoramento() {
  window.addEventListener("online", () => {
    console.log("🌐 Conexão restaurada — iniciando sincronização offline...");
    syncPendentes();
  });
}
