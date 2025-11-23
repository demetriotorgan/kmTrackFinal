// src/services/useAbastecimentos.js
import { useEffect, useState } from "react";
import db from "./db";

export default function useAbastecimentos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await db.abastecimentos.toArray();
      setItems(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const add = async (abast) => {
    await db.abastecimentos.add(abast);
    load();
  };

  const update = async (id, changes) => {
    await db.abastecimentos.update(id, changes);
    load();
  };

  const remove = async (id) => {
    await db.abastecimentos.delete(id);
    load();
  };

  const clear = async () => {
    await db.abastecimentos.clear();
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return { items, loading, error, add, update, remove, clear, reload: load };
}
