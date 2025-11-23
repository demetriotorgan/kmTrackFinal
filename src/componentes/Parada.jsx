import { Car, Save } from 'lucide-react'
import React from 'react'

const Parada = () => {
  return (
    <div className='container'>
        <h2>Nova Parada <Car /></h2>
        <label>
            Local
            <input 
                type='text'
            />
        </label>
        <label>
            Tipo
            <select>
                <option value="">Selecione um tipo</option>
                <option value="descanso">Descanso</option>
                <option value="abastecimento">Abastecimento</option>
                <option value="atrativo">Atrativo</option>
                <option value="imprevisto">Imprevisto</option>
                <option value="outro">Outro</option>
            </select>
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
        <label>
            Obs:
            <textarea>                
            </textarea>
        </label>
        <button className='botao-principal'>Salvar <Save /></button>
    </div>
  )
}

export default Parada