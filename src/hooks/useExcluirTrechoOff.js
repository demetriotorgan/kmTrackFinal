// src/hooks/useExcluirTrechoOff.js
import { useState } from "react";
import { salvarItem, removerItem } from "../services/idbService";
import { v4 as uuidv4 } from "uuid";

/**
 * Exclusão OFFLINE:
 * - cria pendência em 'pendentes' para DELETE /deletar-trecho/:id
 * - remove o item do cache 'listaDeTrechosOFF' para refletir imediatamente na UI
 */
export function useExcluirTrechoOff({setListaTrechos}) {
  const [excluindoOff, setExcluindoOff] = useState(false);
  const [erro, setErro] = useState(null);

  const excluirOffline = async (id) => {
     console.log("📌 [useExcluirTrechoOff] Iniciando exclusão OFFLINE para ID:", id);

    try {
      setExcluindoOff(true);
      setErro(null);

      if (!id) {
         console.error("❌ ID inválido recebido em excluirOffline:", id);
        throw new Error("ID inválido para exclusão offline");
      }

      const url = `/deletar-trecho/${id}`;
         console.log("📌 Montando pendência DELETE:", url);

      // 1) salva pendência para sincronizar DELETE quando online
      const pendente = {
        uuid: uuidv4(),
        url,
        method: "delete",
        data: null,
        timestamp: Date.now(),
      };
      console.log("💾 Salvando pendência em IndexedDB:", pendente);
      await salvarItem("pendentes", pendente);
      

      // 2) remove do cache local 'listaDeTrechosOFF' para atualizar UI
       console.log("🗂️ Removendo item do cache listaDeTrechosOFF:", id);
      await removerItem("listaDeTrechosOFF", id);

      // opcional: emitir evento para atualizar componentes que escutam pendentes / cache
    //   window.dispatchEvent(new Event("pendentesAtualizados"));
    //   window.dispatchEvent(new Event("trechosCacheAtualizado"));

      alert("Registro marcado para exclusão (offline). Será sincronizado quando voltar online.");
      setListaTrechos((prev) => prev.filter(t => t._id !== id));
      // 🔥 Mantém cache OFFLINE atualizado
      await removerItem("listaDeTrechosOFF", id);

      return { sucesso: true };

    } catch (err) {
      console.error("Erro ao excluir trecho OFFLINE:", err);
      setErro(err);
      return { sucesso: false, erro: err.message || String(err) };
    } finally {
      setExcluindoOff(false);
       console.log("🏁 Finalizou excluirOffline()");
    }
  };

  return {
    excluirOffline,
    excluindoOff,
    erro,
  };
}
