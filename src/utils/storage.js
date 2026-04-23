const STORAGE_KEYS = {
  TRANSACTIONS: 'finance-tracker-transactions',
  BUDGETS: 'finance-tracker-budgets',
  SETTINGS: 'finance-tracker-settings',
};

export const storage = {
  // Transactions
  getTransactions: () => {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  },
  
  setTransactions: (transactions) => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },
  
  addTransaction: (transaction) => {
    const transactions = storage.getTransactions();
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    transactions.push(newTransaction);
    storage.setTransactions(transactions);
    return newTransaction;
  },
  
  deleteTransaction: (id) => {
    const transactions = storage.getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    storage.setTransactions(filtered);
    return filtered;
  },
  
  // Budgets
  getBudgets: () => {
    const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return data ? JSON.parse(data) : {};
  },
  
  setBudgets: (budgets) => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  },
  
  updateBudget: (categoryId, amount) => {
    const budgets = storage.getBudgets();
    budgets[categoryId] = amount;
    storage.setBudgets(budgets);
  },
  
  // Settings
  getSettings: () => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : { darkMode: false };
  },
  
  setSettings: (settings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },
  
  toggleDarkMode: () => {
    const settings = storage.getSettings();
    settings.darkMode = !settings.darkMode;
    storage.setSettings(settings);
    return settings.darkMode;
  },
};
