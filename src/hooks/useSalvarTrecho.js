// src/services/useSalvarTrecho.js
import { useState } from "react";
import api from "../api/api";
import { dateToIso, hhmmToIso } from "../util/time";

export function useSalvarTrecho() {
  const trechoInicial = {
    nomeTrecho: "",
    distancia: "",
    inicio: "",
    fim: "",
    data: ""
  };

  const [dadosTrecho, setDadosTrecho] = useState(trechoInicial);
  const [salvando, setSalvando] = useState(false);

  const handleDadosTrecho = (e) => {
    const { name, value } = e.target;
    setDadosTrecho((prev) => ({ ...prev, [name]: value }));
  };

  const criarPayload = () => ({
    nomeTrecho: dadosTrecho.nomeTrecho,
    distancia: Number(dadosTrecho.distancia) || 0,
    inicio: hhmmToIso(dadosTrecho.inicio),
    fim: hhmmToIso(dadosTrecho.fim),
    data: dateToIso(dadosTrecho.data)
  });

  const salvarTrecho = async () => {
    const confirmar = window.confirm("Deseja salvar este trecho?");
    if (!confirmar) return;

    try {
      setSalvando(true);
      const payload = criarPayload();
      console.log("payload:", payload);

      const response = await api.post("/salvar-trecho", payload);
      console.log("API response:", response.data);

      alert("Registro salvo com sucesso!");
      setDadosTrecho(trechoInicial);

    } catch (error) {
      console.error("Erro ao salvar trecho:", error);

    } finally {
      setSalvando(false);
    }
  };

  return {
    dadosTrecho,
    salvando,
    handleDadosTrecho,
    salvarTrecho,
    resetar: () => setDadosTrecho(trechoInicial)
  };
}
