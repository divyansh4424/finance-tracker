import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getCategoryBreakdown, getMonthlyData } from '../utils/analytics';
import { CATEGORIES } from '../data/categories';

const Charts = ({ transactions }) => {
  const expenseBreakdown = getCategoryBreakdown(transactions, 'expense');
  const incomeBreakdown = getCategoryBreakdown(transactions, 'income');
  const monthlyData = getMonthlyData(transactions);

  // Get category info for colors
  const getCategoryColor = (categoryId) => {
    const allCategories = [...CATEGORIES.income, ...CATEGORIES.expense];
    const category = allCategories.find(cat => cat.id === categoryId);
    return category ? category.color : '#6b7280';
  };

  // Prepare data for pie charts
  const pieChartData = expenseBreakdown.slice(0, 6).map(item => ({
    name: item.category.charAt(0).toUpperCase() + item.category.slice(1).replace(/_/g, ' '),
    value: item.amount,
    color: getCategoryColor(item.category)
  }));

  // Prepare data for bar chart
  const barChartData = monthlyData.slice(-6).map(item => ({
    month: item.month,
    income: item.income,
    expenses: item.expenses,
    balance: item.balance
  }));

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Expense Breakdown Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Expense Breakdown
        </h3>
        
        {pieChartData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Category Details */}
            <div className="mt-4 space-y-2">
              {expenseBreakdown.slice(0, 6).map((item) => {
                const categoryInfo = CATEGORIES.expense.find(cat => cat.id === item.category);
                return (
                  <div key={item.category} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{categoryInfo?.icon}</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {categoryInfo?.name}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              No expense data available
            </p>
          </div>
        )}
      </motion.div>

      {/* Monthly Trend Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Monthly Trend
        </h3>
        
        {barChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="income" fill="#22c55e" name="Income" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              No monthly data available
            </p>
          </div>
        )}
      </motion.div>

      {/* Income Sources */}
      {incomeBreakdown.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Income Sources
          </h3>
          
          <div className="space-y-3">
            {incomeBreakdown.map((item) => {
              const categoryInfo = CATEGORIES.income.find(cat => cat.id === item.category);
              const percentage = (item.amount / incomeBreakdown.reduce((sum, i) => sum + i.amount, 0)) * 100;
              
              return (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{categoryInfo?.icon}</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {categoryInfo?.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.amount)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-success-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Stats
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
            <p className="text-2xl font-bold text-success-600">
              {transactions.filter(t => t.type === 'income').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Income Transactions
            </p>
          </div>
          
          <div className="text-center p-4 bg-danger-50 dark:bg-danger-900/20 rounded-lg">
            <p className="text-2xl font-bold text-danger-600">
              {transactions.filter(t => t.type === 'expense').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Expense Transactions
            </p>
          </div>
          
          <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <p className="text-2xl font-bold text-primary-600">
              {new Set(transactions.map(t => t.category)).size}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Categories Used
            </p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">
              {transactions.length > 0 
                ? (transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length).toFixed(2)
                : '0.00'
              }
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Average Transaction
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Charts;
