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

  // Validação antes do salvamento
  // -----------------------------
  const validarCampos = () => {
    const erros = [];

    if (!dadosTrecho.nomeTrecho.trim()) erros.push("Nome do trecho");
    if (!dadosTrecho.distancia.trim()) erros.push("Distância");
    if (!dadosTrecho.inicio.trim()) erros.push("Horário de início");
    if (!dadosTrecho.fim.trim()) erros.push("Horário de fim");
    if (!dadosTrecho.data.trim()) erros.push("Data");

    if (erros.length > 0) {
      alert(
        "Preencha os seguintes campos obrigatórios:\n\n" +
        erros.map((e) => `• ${e}`).join("\n")
      );
      return false;
    }

    return true;
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
     // 1️⃣ Impede salvar se faltar algo
    if (!validarCampos()) return;
    
    const confirmar = window.confirm("Deseja salvar este trecho?");
    if (!confirmar) return;

    const payload = criarPayload();

    try {
      setSalvando(true);
      const response = await api.post("/salvar-trecho", payload);
      console.log(response.data);

      alert("Trecho salvo com sucesso!");
      window.dispatchEvent(new Event("trechoSalvoOnline"));
      
    } catch (error) {
      console.warn("Erro ao salvar trecho:", error);

  // --------------------------
  // 1️⃣ Erro Offline
  // --------------------------
  if (error.offline) {
    alert("Sem internet. O trecho foi salvo offline e será sincronizado depois.");
    window.dispatchEvent(new Event("pendentesAtualizados"));
    return;
  }

  // --------------------------
  // 2️⃣ Erros vindos da API
  // --------------------------
  if (error.response) {
    const status = error.response.status;

    // 🔥 Trecho duplicado
    if (status === 400) {
      const mensagem = error.response.data?.mensagem ?? "Este trecho já está cadastrado.";
      alert("⚠ Atenção:\n\n" + mensagem);
      return;
    }

    // Erro de servidor
    if (status >= 500) {
      alert("Erro no servidor. Tente novamente em instantes.");
      return;
    }
  }

  // --------------------------
  // 3️⃣ Erro genérico
  // --------------------------
  alert("Erro inesperado ao salvar o trecho.");
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
