import React, { useEffect, useState } from 'react'
import { Wifi, WifiOff } from "lucide-react";
import api from "../api/api"; 
import { salvarItem, limparStore } from "../services/idbService";
import DbStatus from './DbStatus';

const StatusConexao = () => {
  const [online, setOnline] = useState(navigator.onLine);

  // -----------------------------
  // Função para carregar a lista da API e salvar no IndexedDB
  // -----------------------------
  const carregarListaTrechos = async () => {
  if (!navigator.onLine) return;

  try {
    const { data } = await api.get("/listar-trechos");

    if (Array.isArray(data)) {

      // console.log("🔄 Limpando listaDeTrechosOFF...");
      await limparStore("listaDeTrechosOFF");

      // console.log("💾 Salvando lista nova no IndexedDB...");
      for (const trecho of data) {
        await salvarItem("listaDeTrechosOFF", trecho);
      }

      // console.log("✔ Lista OFFLINE atualizada com sucesso");
       // 🔥 Notifica todos os componentes para recarregar do IndexedDB
      window.dispatchEvent(new Event("listaAtualizadaOffline"));
    }

  } catch (err) {
    console.warn("Erro ao carregar lista da API:", err);
  }
};


  // -----------------------------
  // 1️⃣ Executa ao INICIAR a aplicação
  // -----------------------------
  useEffect(() => {
    if (navigator.onLine) {
      carregarListaTrechos();
    }
  }, []); // roda apenas 1x ao montar

  
  // -----------------------------
// 2️⃣ Executa quando mudar o status da conexão
// -----------------------------
useEffect(() => {
  const handleOnline = () => {
    // console.log("🔵 Voltou ONLINE, sincronizando lista...");
    setOnline(true);
    carregarListaTrechos();   // sincroniza ao voltar
  };

  const handleOffline = () => {
    // console.log("🔴 Ficou OFFLINE");
    setOnline(false);
  };

  // Evento disparado quando um trecho offline é sincronizado
  const handleTrechoSincronizado = () => {
    console.log("📡 Evento trechoSincronizadoOffline → recarregando lista...");
    carregarListaTrechos();
  };

  // ADD LISTENERS
  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);
  window.addEventListener("trechoSincronizadoOffline", handleTrechoSincronizado);

  // CLEANUP
  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
    window.removeEventListener("trechoSincronizadoOffline", handleTrechoSincronizado);
  };
}, []);

  return (
    <div
      style={{
        width: "100%",
        padding: "8px 12px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: online ? "#19c37d" : "#d9534f",
        color: "white",
        fontWeight: "bold",
        gap: "8px",
        transition: "0.3s ease",
        position: "sticky",
        top: 0,
        zIndex: 9999,
      }}
    >
      {online ? (
        <>
          <Wifi size={18} />
          Conectado          
        </>
      ) : (
        <>
          <WifiOff size={18} />
          Sem conexão — funcionando offline
        </>
      )}      
      {online ? (<DbStatus />) : ''}
      
    </div>
  );
};

export default StatusConexao;
