import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Charts from './components/Charts';
import Budget from './components/Budget';
import Footer from './components/Footer';
import { useTransactions } from './hooks/useTransactions';
import { useDarkMode } from './hooks/useDarkMode';
import { getInsights } from './utils/analytics';
import { storage } from './utils/storage';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);
  const [insights, setInsights] = useState([]);
  
  const { transactions, loading, addTransaction, deleteTransaction } = useTransactions();
  const { darkMode, toggleDarkMode } = useDarkMode();

  // Generate insights when transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      const budgets = storage.getBudgets();
      const newInsights = getInsights(transactions, budgets);
      setInsights(newInsights.slice(0, 3)); // Show top 3 insights
    } else {
      setInsights([]);
    }
  }, [transactions]);

  const handleAddTransaction = (transaction) => {
    addTransaction(transaction);
  };

  const handleDeleteTransaction = (id) => {
    deleteTransaction(id);
  };

  const renderActiveTab = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} insights={insights} />;
      case 'transactions':
        return (
          <TransactionList
            transactions={transactions}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      case 'charts':
        return <Charts transactions={transactions} />;
      case 'budget':
        return <Budget transactions={transactions} />;
      default:
        return <Dashboard transactions={transactions} insights={insights} />;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderActiveTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {showAddForm && (
          <TransactionForm
            onAddTransaction={handleAddTransaction}
            onClose={() => setShowAddForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
