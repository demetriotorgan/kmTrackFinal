// src/hooks/useExcluirTrecho.js
import { useState } from "react";
import api from "../api/api";
import { removerItem } from "../services/idbService";

export function useExcluirTrecho(recarregarLista) {
  const [excluindo, setExcluindo] = useState(false);

  const excluirTrecho = async (item) => {
    const confirmar = confirm("Deseja realmente excluir este registro?");
    if (!confirmar) return { sucesso: false, cancelado: true };

    try {
      setExcluindo(true);

      // 🟢 Excluir no backend
      const response = await api.delete(`/deletar-trecho/${item._id}`);
      console.log("Exclusão online:", response.data);

      // 🟢 Remover também do IndexedDB (lista offline)
      await removerItem("listaDeTrechosOFF", item._id);

      // 🟢 Atualizar lista após exclusão
      if (recarregarLista) recarregarLista();

      return { sucesso: true };
    } catch (error) {
      console.error("Erro ao excluir trecho:", error);
      return { sucesso: false, erro: error.message };
    } finally {
      setExcluindo(false);
    }
  };

  return {
    excluirTrecho,
    excluindo,
  };
}
