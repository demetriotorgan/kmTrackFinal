import React, { useEffect, useState } from 'react'
import { Wifi, WifiOff } from "lucide-react";
import api from "../api/api"; 
import { salvarItem } from "../services/idbService";
import DbStatus from './DbStatus';

const StatusConexao = () => {
  const [online, setOnline] = useState(navigator.onLine);

  // -----------------------------
  // Função para carregar a lista da API e salvar no IndexedDB
  // -----------------------------
  const carregarListaTrechos = async () => {
    if (!navigator.onLine) return; // segurança extra

    try {
      const { data } = await api.get("/listar-trechos");

      if (Array.isArray(data)) {
        // salva cada item usando o keyPath "_id"
        for (const trecho of data) {
          await salvarItem("listaDeTrechosOFF", trecho);
        }
        console.log("Lista carregada e salva no IndexedDB.");
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
  // 2️⃣ Executa quando voltar a ficar online
  // -----------------------------
  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      carregarListaTrechos(); // sincroniza quando voltar online
    };

    const handleOffline = () => setOnline(false);

    window.addEventListener("online",  handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
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
