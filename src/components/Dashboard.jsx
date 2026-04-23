import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { calculateTotals } from '../utils/analytics';

const Dashboard = ({ transactions, insights = [] }) => {
  const totals = calculateTotals(transactions);

  const summaryCards = [
    {
      title: 'Total Balance',
      value: totals.balance,
      icon: Wallet,
      color: totals.balance >= 0 ? 'success' : 'danger',
      format: 'currency'
    },
    {
      title: 'Total Income',
      value: totals.income,
      icon: TrendingUp,
      color: 'success',
      format: 'currency'
    },
    {
      title: 'Total Expenses',
      value: totals.expenses,
      icon: TrendingDown,
      color: 'danger',
      format: 'currency'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCardColor = (color) => {
    switch (color) {
      case 'success':
        return 'from-success-500 to-success-600';
      case 'danger':
        return 'from-danger-500 to-danger-600';
      default:
        return 'from-primary-500 to-primary-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {card.format === 'currency' 
                      ? formatCurrency(card.value)
                      : card.value
                    }
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${getCardColor(card.color)}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Insights Section */}
      {insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Insights & Tips
          </h3>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'success' 
                    ? 'bg-success-50 dark:bg-success-900/20 border-success-500'
                    : insight.type === 'warning'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                    : 'bg-danger-50 dark:bg-danger-900/20 border-danger-500'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {insight.type === 'success' && (
                      <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
                    )}
                    {insight.type === 'warning' && (
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    )}
                    {insight.type === 'danger' && (
                      <div className="w-2 h-2 bg-danger-500 rounded-full mt-2"></div>
                    )}
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {insight.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
