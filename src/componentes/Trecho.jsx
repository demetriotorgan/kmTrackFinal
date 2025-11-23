import { Map, Save } from 'lucide-react'
import React from 'react'

const Trecho = () => {
  return (
    <div className='container'>
        <h2>Novo Trecho <Map /></h2>
        <label>
        Nome do Trecho
            <input
            type='text'
            />
        </label>
        <label>
        Distância
            <input
            type='number'
            />
        </label>
        <label>
        Início
            <input
            type='time'
            />
        </label>
        <label>
        Fim
            <input
            type='time'
            />
        </label>
        <button className='botao-principal'>Salvar <Save /></button>
    </div>
  )
}

export default Trecho