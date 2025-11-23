// src/hooks/useSalvarTrecho.js
import { useState } from "react";
import api from "../api/api";
import { dateToIso, hhmmToIso } from "../util/time";

export function useSalvarTrecho() {
  const trechoInicial = {
    nomeTrecho: "",
    distancia: "",
    inicio: "",
    fim: "",
    data: "",
  };

  const [dadosTrecho, setDadosTrecho] = useState(trechoInicial);
  const [salvando, setSalvando] = useState(false);

  // -----------------------------
  // Atualiza campos do formulário
  // -----------------------------
  const handleDadosTrecho = (e) => {
    const { name, value } = e.target;
    setDadosTrecho((prev) => ({ ...prev, [name]: value }));
  };

  // -----------------------------
  // Criação do payload
  // -----------------------------
  const criarPayload = () => ({
    nomeTrecho: dadosTrecho.nomeTrecho,
    distancia: Number(dadosTrecho.distancia) || 0,
    inicio: hhmmToIso(dadosTrecho.inicio),
    fim: hhmmToIso(dadosTrecho.fim),
    data: dateToIso(dadosTrecho.data),
  });

  // -----------------------------
  // SALVAR TRECHO (online/offline)
  // -----------------------------
  const salvarTrecho = async () => {
    const confirmar = window.confirm("Deseja salvar este trecho?");
    if (!confirmar) return;

    const payload = criarPayload();

    try {
      setSalvando(true);
      const response = await api.post("/salvar-trecho", payload);
      console.log(response.data);

      alert("Trecho salvo com sucesso!");
    } catch (error) {
      console.warn("Erro ao salvar trecho:", error);

      // Caso offline → o interceptor já salvou no IndexedDB
      if (error.offline) {
        alert("Sem internet. O trecho foi salvo offline e será sincronizado depois.");
        window.dispatchEvent(new Event("pendentesAtualizados"));
        
      } else {
        alert("Erro inesperado ao salvar.");
      }
    } finally {
      setSalvando(false);
      setDadosTrecho(prev => ({...trechoInicial}));
    }
  };

  return {
    dadosTrecho,
    salvando,
    handleDadosTrecho,
    salvarTrecho,
    resetar: () => setDadosTrecho(trechoInicial),
  };
}
