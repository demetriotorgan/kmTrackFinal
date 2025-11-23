import { Fuel, Save } from 'lucide-react'
import React from 'react'

const Abastecimento = () => {
  return (
    <div className='container'>
        <h2>Abastecimento <Fuel /></h2>
        <label>
            Local
            <input 
                type='text'
            />
        </label>
        <label>
            Tipo
            <select>
                <option>Selecione um tipo</option>
                <option value="inicio">Início</option>
                <option value="reposicao">Reposição</option>
                <option value="fim">Fim</option>
            </select>
        </label>
        <label>
            Data
            <input 
             type='date'
            />
        </label>
        <label>
            Litros
            <input 
                type='number'
            />
        </label>
        <label>
            Valor
            <input 
                type='number'
            />
        </label>
        <label>
            Preço por litro
            <input 
                type='number'
            />
        </label>
        <label>
            Distância Percorrida
            <input 
                type='number'
            />
        </label>
        <label>
            Odometro
            <input 
                type='number'
            />
        </label>
        <button className='botao-principal'>Salvar <Save /></button>
    </div>
  )
}

export default Abastecimento