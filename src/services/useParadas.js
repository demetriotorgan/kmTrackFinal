// src/services/useParadas.js
import { useEffect, useState } from "react";
import db from "./db";

export default function useParadas() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await db.paradas.toArray();
      setItems(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const add = async (parada) => {
    await db.paradas.add(parada);
    load();
  };

  const update = async (id, changes) => {
    await db.paradas.update(id, changes);
    load();
  };

  const remove = async (id) => {
    await db.paradas.delete(id);
    load();
  };

  const clear = async () => {
    await db.paradas.clear();
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return { items, loading, error, add, update, remove, clear, reload: load };
}
