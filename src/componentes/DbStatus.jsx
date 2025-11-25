import React, { useEffect, useState } from 'react'
import api from '../api/api'
import { Database, DatabaseZap } from 'lucide-react'


const DbStatus = () => {
    const [status, setStatus] = useState(false);

    const verificarMongo = async()=>{
        try {
            const {data} = await api.get('/db-status');

            if(data.mongo === 'connected'){
                setStatus(true)
            }else{
                setStatus(false)
            }
        } catch (error) {
            console.log('Api offline ou indisponível')
        }
    };

    useEffect(()=>{
        verificarMongo();
    },[])

  return (
    <div className='db-status'>
        {status ? <Database /> : <DatabaseZap />}
    </div>
  )
}

export default DbStatus