// src/services/idbService.js
import { openDB } from "idb";

const DB_NAME = "viagemDB";
const DB_VERSION = 2;

function emitirEventoPendentesAtualizados() {
  window.dispatchEvent(new Event("pendentesAtualizados"));
}

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("pendentes")){
        db.createObjectStore("pendentes", { keyPath: "uuid" });     
      }
       if (!db.objectStoreNames.contains("listaDeTrechosOFF")) {
        db.createObjectStore("listaDeTrechosOFF", { keyPath: "_id" });
      }
    },    
  });
}

export async function salvarItem(store, item) {
  const db = await getDB();
  await db.put(store, item);
  emitirEventoPendentesAtualizados();
}

export async function listarItens(store) {
  const db = await getDB();
  return await db.getAll(store);
}

export async function removerItem(store, key) {
  const db = await getDB();
  await db.delete(store, key);
  emitirEventoPendentesAtualizados();
}
