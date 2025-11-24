import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { configurarOfflineInterceptor } from './services/offlineInterceptor.js'
import {iniciarMonitoramento} from './services/syncManager.js'

// ativa interceptador
configurarOfflineInterceptor();

// inicia monitor online/offline
iniciarMonitoramento();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
