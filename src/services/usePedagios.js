// src/services/usePedagios.js
import { useEffect, useState } from "react";
import db from "./db";

export default function usePedagios() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await db.pedagios.toArray();
      setItems(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const add = async (pedagio) => {
    await db.pedagios.add(pedagio);
    load();
  };

  const update = async (id, changes) => {
    await db.pedagios.update(id, changes);
    load();
  };

  const remove = async (id) => {
    await db.pedagios.delete(id);
    load();
  };

  const clear = async () => {
    await db.pedagios.clear();
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return { items, loading, error, add, update, remove, clear, reload: load };
}
