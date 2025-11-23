// src/services/useTrechos.js
import { useEffect, useState } from "react";
import db from "./db";

export default function useTrechos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carrega trechos do banco
  const load = async () => {
    try {
      setLoading(true);
      const data = await db.trechos.toArray();
      setItems(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const add = async (trecho) => {
    await db.trechos.add(trecho);
    load();
  };

  const update = async (id, changes) => {
    await db.trechos.update(id, changes);
    load();
  };

  const remove = async (id) => {
    await db.trechos.delete(id);
    load();
  };

  const clear = async () => {
    await db.trechos.clear();
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return { items, loading, error, add, update, remove, clear, reload: load };
}
