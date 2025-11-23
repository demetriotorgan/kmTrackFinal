import { Map, Save } from 'lucide-react'
import React, { useState } from 'react'
import api from '../api/api';
import { dateToIso, hhmmToIso } from '../util/time';
import ModalSalvando from './ModalSalvando';
import { useSalvarTrecho } from '../hooks/useSalvarTrecho';
import TrechoPendenteLista from './TrechoPendenteLista';

const Trecho = () => {
    const [pendentes, setPendentes] = useState([]);
   const {dadosTrecho, salvando, handleDadosTrecho, salvarTrecho} = useSalvarTrecho();

  return (
    <>
    {salvando && (<ModalSalvando />)}
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
    </>
  )
}

export default Trecho