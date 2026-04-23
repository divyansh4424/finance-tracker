import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = storage.getTransactions();
    setTransactions(data);
    setLoading(false);
  }, []);

  const addTransaction = (transaction) => {
    const newTransaction = storage.addTransaction(transaction);
    setTransactions(prev => [...prev, newTransaction]);
    return newTransaction;
  };

  const deleteTransaction = (id) => {
    const updated = storage.deleteTransaction(id);
    setTransactions(updated);
    return updated;
  };

  const refreshTransactions = () => {
    const data = storage.getTransactions();
    setTransactions(data);
  };

  return {
    transactions,
    loading,
    addTransaction,
    deleteTransaction,
    refreshTransactions
  };
};
