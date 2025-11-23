import React, { useEffect, useState } from 'react'
import { Wifi, WifiOff } from "lucide-react"; // caso use lucide-react

const StatusConexao = () => {
    const [online, setOnline] = useState(navigator.onLine);
    

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  return (
     <div
      style={{
        width: "100%",
        padding: "8px 12px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: online ? "#19c37d" : "#d9534f",
        color: "white",
        fontWeight: "bold",
        gap: "8px",
        transition: "0.3s ease",
        position: "sticky",  // fica no topo
        top: 0,
        zIndex: 9999,
      }}
    >
      {online ? (
        <>
          <Wifi size={18} />
          Conectado  
        </>
      ) : (
        <>
          <WifiOff size={18} />
          Sem conexão — funcionando offline
        </>
      )}
    </div>
  )
}

export default StatusConexao