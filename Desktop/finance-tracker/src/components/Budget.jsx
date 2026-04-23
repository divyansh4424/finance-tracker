import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { getBudgetProgress, getInsights } from '../utils/analytics';
import { storage } from '../utils/storage';
import { CATEGORIES, DEFAULT_BUDGETS } from '../data/categories';

const Budget = ({ transactions }) => {
  const [budgets, setBudgets] = useState({});
  const [editingBudget, setEditingBudget] = useState(null);
  const [tempBudget, setTempBudget] = useState('');

  useEffect(() => {
    const savedBudgets = storage.getBudgets();
    setBudgets(savedBudgets);
  }, []);

  const budgetProgress = getBudgetProgress(transactions, budgets);

  const handleEditBudget = (categoryId) => {
    setEditingBudget(categoryId);
    setTempBudget(budgets[categoryId]?.toString() || DEFAULT_BUDGETS[categoryId]?.toString() || '0');
  };

  const handleSaveBudget = (categoryId) => {
    const amount = parseFloat(tempBudget);
    if (amount >= 0) {
      storage.updateBudget(categoryId, amount);
      setBudgets(prev => ({ ...prev, [categoryId]: amount }));
    }
    setEditingBudget(null);
    setTempBudget('');
  };

  const handleCancelEdit = () => {
    setEditingBudget(null);
    setTempBudget('');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'danger';
    if (percentage >= 80) return 'warning';
    return 'success';
  };

  const getProgressIcon = (percentage) => {
    if (percentage >= 100) return AlertTriangle;
    if (percentage >= 80) return TrendingUp;
    return CheckCircle;
  };

  const getCategoryInfo = (categoryId) => {
    const category = CATEGORIES.expense.find(cat => cat.id === categoryId);
    return category || { name: 'Unknown', icon: '❓', color: '#6b7280' };
  };

  const totalBudget = Object.values(budgets).reduce((sum, budget) => sum + budget, 0);
  const totalSpent = budgetProgress.reduce((sum, item) => sum + item.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Budget Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalBudget)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Budget
            </p>
          </div>
          
          <div className="text-center p-4 bg-danger-50 dark:bg-danger-900/20 rounded-lg">
            <p className="text-2xl font-bold text-danger-600">
              {formatCurrency(totalSpent)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Spent
            </p>
          </div>
          
          <div className="text-center p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
            <p className="text-2xl font-bold text-success-600">
              {formatCurrency(totalRemaining)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Remaining
            </p>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                totalSpent > totalBudget ? 'bg-danger-500' : 
                totalSpent / totalBudget > 0.8 ? 'bg-yellow-500' : 'bg-success-500'
              }`}
              style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Category Budgets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Category Budgets
        </h3>
        
        <div className="space-y-4">
          {Object.entries(DEFAULT_BUDGETS).map(([categoryId, defaultBudget]) => {
            const categoryInfo = getCategoryInfo(categoryId);
            const budget = budgets[categoryId] || defaultBudget;
            const progress = budgetProgress.find(item => item.categoryId === categoryId);
            const spent = progress?.spent || 0;
            const percentage = budget > 0 ? (spent / budget) * 100 : 0;
            const remaining = budget - spent;
            const isEditing = editingBudget === categoryId;
            const ProgressIcon = getProgressIcon(percentage);
            
            return (
              <motion.div
                key={categoryId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{categoryInfo.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {categoryInfo.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(spent)} of {formatCurrency(budget)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ProgressIcon className={`w-5 h-5 ${
                      percentage >= 100 ? 'text-danger-600' :
                      percentage >= 80 ? 'text-yellow-600' : 'text-success-600'
                    }`} />
                    
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={tempBudget}
                          onChange={(e) => setTempBudget(e.target.value)}
                          className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                          placeholder="Budget"
                        />
                        <button
                          onClick={() => handleSaveBudget(categoryId)}
                          className="text-success-600 hover:text-success-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-danger-600 hover:text-danger-700"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditBudget(categoryId)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <Target className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">
                      {percentage.toFixed(1)}% used
                    </span>
                    <span className={`font-medium ${
                      remaining < 0 ? 'text-danger-600' : 'text-gray-900 dark:text-white'
                    }`}>
                      {formatCurrency(remaining)} {remaining < 0 ? 'over' : 'remaining'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        percentage >= 100 ? 'bg-danger-500' :
                        percentage >= 80 ? 'bg-yellow-500' : 'bg-success-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Budget Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Budget Tips
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Track Your Spending
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Regular logging helps you stay within budget and identify spending patterns.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Review Monthly
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Adjust budgets based on your actual spending habits and financial goals.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Set Realistic Goals
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Start with conservative budgets and gradually optimize as you learn your patterns.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Budget;
