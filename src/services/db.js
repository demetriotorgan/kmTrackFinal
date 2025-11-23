// src/services/db.js
import Dexie from "dexie";

export const db = new Dexie("viagemDB");

// Versão inicial do banco com as 4 tabelas necessárias
db.version(1).stores({
  trechos: "++id, nomeTrecho, distancia, inicio, fim",
  paradas: "++id, local, tipo, inicio, fim, obs",
  pedagios: "++id, local, valor, data",
  abastecimentos: "++id, local, tipo, data, litros, valor, precoLitro, distanciaPercorrida, odometro"
});

// Exemplo de dados default de teste (opcional)
// db.on('populate', () => {
//   db.trechos.add({ origem: "Teste", destino: "Teste", dataInicio: new Date() });
// });

export default db;
