// src/hooks/useListaTrechos.js
import { useEffect, useState } from "react";
import api from "../api/api";
import { listarItens } from "../services/idbService";

export function useListaTrechos() {
    const [listaTrechos, setListaTrechos] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);
    const [listaIndexDB, setListaIndexDB] = useState(false);

    const carregarTrechos = async () => {
        setCarregando(true);
        setErro(null);

        try {
            if (navigator.onLine) {
                const response = await api.get("/listar-trechos");
                setListaTrechos(response.data);
                console.log('Lista carregada da API');
                setListaIndexDB(false);
            } else {
                const dadosOffline = await listarItens("listaDeTrechosOFF");
                if (Array.isArray(dadosOffline)) {
                    setListaTrechos(dadosOffline);
                    console.log('Dados Carregados do indexDB');
                    setListaIndexDB(true);
                } else {
                    setListaTrechos([]);
                }
            }
        } catch (err) {
            console.error("Erro ao carregar trechos:", err);
            setErro(err);
    // fallback extra → tenta carregar do offline
      if (!navigator.onLine) {
        const dadosOffline = await listarItens("listaDeTrechosOFF");
        setListaTrechos(dadosOffline);
        setListaIndexDB(true);
      }
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarTrechos();
    }, []);

    // 🔥 Monitorar conexão retornando online
    useEffect(() => {
        const handleOnline = () => {
            console.log("Conexão restaurada! Recarregando lista…");
            setListaIndexDB(false);
            carregarTrechos();
        };

        const handleOffline = () => {
            console.log("Modo offline ativado");
            setListaIndexDB(true);
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // 🔥 Recarrega lista quando um novo trecho é salvo online
useEffect(() => {
    const handleTrechoSalvo = () => {
        console.log("Novo trecho salvo online → recarregando lista...");
        carregarTrechos();
    };

    window.addEventListener("trechoSalvoOnline", handleTrechoSalvo);

    return () => {
        window.removeEventListener("trechoSalvoOnline", handleTrechoSalvo);
    };
}, []);

    return {
        listaTrechos,
        carregando,
        erro,
        listaIndexDB,
        recarregar: carregarTrechos,
    };
}
