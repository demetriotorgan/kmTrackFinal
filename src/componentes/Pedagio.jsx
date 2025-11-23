import { HandCoins, Save } from 'lucide-react'
import React from 'react'

const Pedagio = () => {
  return (
    <div className='container'>
        <h2>Pedágio <HandCoins /> </h2>
        <label>
            Local
            <input 
                type='text'
            />
        </label>
        <label>
            Valor
            <input 
                type='number'
            />
        </label>
        <label>
            Data
            <input 
                type='date'
            />
        </label>
        <button className='botao-principal'>Salvar <Save /> </button>
    </div>
  )
}

export default Pedagio