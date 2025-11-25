import { Map, Save, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import api from '../api/api';
import { dateToIso, hhmmToIso } from '../util/time';
import ModalSalvando from './ModalSalvando';
import { useSalvarTrecho } from '../hooks/useSalvarTrecho';
import TrechoPendenteLista from './TrechoPendenteLista';
import '../style/Trecho.css'
import { useListaTrechos } from '../hooks/useListaTrecho';
import ModalCarregandoDados from './ModalCarregandoDados';
import { syncPendentes, iniciarMonitoramento } from '../services/syncManager';
import { removerItem } from '../services/idbService';
import { useExcluirTrecho } from '../hooks/useExcluirTrecho';

const Trecho = () => {
    const [pendentes, setPendentes] = useState([]);    
    
   const {dadosTrecho, salvando, handleDadosTrecho, salvarTrecho} = useSalvarTrecho();
   const {listaTrechos, carregando, erro, listaIndexDB, recarregar} = useListaTrechos();
    const { excluirTrecho, excluindo } = useExcluirTrecho(recarregar);   

  return (
    <>
    {(salvando || excluindo) && (<ModalSalvando />)}
    <TrechoPendenteLista
    pendentes={pendentes}
    setPendentes={setPendentes}
    />  
    
    <div className='container'>
        <h2>Novo Trecho <Map /></h2>
        <label>
        Nome do Trecho
            <input
            name='nomeTrecho'
            type='text'
            value={dadosTrecho.nomeTrecho}
            onChange={handleDadosTrecho}
            />
        </label>
        <label>
        Distância
            <input
            name='distancia'
            type='number'
            value={dadosTrecho.distancia}
            onChange={handleDadosTrecho}
            />
        </label>
        <label>
        Início
            <input
            name='inicio'
            type='time'
            value={dadosTrecho.inicio}
            onChange={handleDadosTrecho}
            />
        </label>
        <label>
        Fim
            <input
            name='fim'
            type='time'
            value={dadosTrecho.fim}
            onChange={handleDadosTrecho}
            />
        </label>
        <label>
        Data
            <input
            name='data'
            type='date'
            value={dadosTrecho.data}
            onChange={handleDadosTrecho}
            />
        </label>
        <button className='botao-principal' onClick={salvarTrecho}>Salvar <Save /></button>
    </div>
     {listaIndexDB && (
  <div className='lista-off'>
    <small>Lista Offline</small>
  </div>
)}
    <div className="container">
        {carregando && (<ModalCarregandoDados />)}
      <h2>Trechos Salvos</h2>
      {Array.isArray(listaTrechos) && listaTrechos.map((item, index) => (
        <div className="card-trecho" key={index}>
          <p className="titulo-trecho">{item.nomeTrecho}</p>
          <p><strong>Distância:</strong> {item.distancia} km</p>
          <p><strong>Início:</strong> {item.inicio}</p>
          <p><strong>Fim:</strong> {item.fim}</p>
          <button className='botao-atencao' onClick={()=> excluirTrecho(item)}>Excluir <Trash2 /></button>
        </div>    
      ))}
    </div>
    </>
  )
}

export default Trecho