import React, { useEffect, useState } from 'react'
import { listarItens } from '../services/idbService'
import { isoToDate, isoToHHMM } from '../util/time';
import '../style/TrechoPendenteLista.css'
import { ClockAlert } from "lucide-react";

const TrechoPendenteLista = ({pendentes,setPendentes}) => {    
     
    async function carregarPendentes() {
        const itens = await listarItens("pendentes");
        // console.log(itens);
        setPendentes(itens);
  }

    useEffect(()=>{
        // carregar ao iniciar
    carregarPendentes();

    // escutar eventos de atualização
    const handler = () => carregarPendentes();
    window.addEventListener("pendentesAtualizados", handler);

    return () => {
      window.removeEventListener("pendentesAtualizados", handler);
    };
    },[]);

  // ⛔ Se não houver pendentes → não renderiza nada
  if (pendentes.length === 0) {
    return null;  
  }

  return (
    <div className='container'>
  <h3>Itens pendentes</h3>

  {pendentes.length === 0 ? (    
    ''
  ) : (
    pendentes.map((item) => (
      <div key={item.uuid} className='card-pendente'>
        
        <ClockAlert className="icone" size={20} />

        <p className="titulo">Trecho pendente</p>

        <p><strong>Trecho:</strong> {item.data.nomeTrecho}</p>
        <p><strong>Distância:</strong> {item.data.distancia} km</p>
        <p><strong>Início:</strong> {isoToHHMM(item.data.inicio)}</p>
        <p><strong>Fim:</strong> {isoToHHMM(item.data.fim)}</p>
        <p><strong>Data:</strong> {isoToDate(item.data.data)}</p>
      </div>
    ))
  )}
</div>
  )
}

export default TrechoPendenteLista