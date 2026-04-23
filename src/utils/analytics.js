import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';

export const calculateTotals = (transactions) => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const balance = income - expenses;
  
  return { income, expenses, balance };
};

export const getCategoryBreakdown = (transactions, type = 'expense') => {
  const filtered = transactions.filter(t => t.type === type);
  const breakdown = {};
  
  filtered.forEach(transaction => {
    if (!breakdown[transaction.category]) {
      breakdown[transaction.category] = {
        amount: 0,
        count: 0,
        category: transaction.category
      };
    }
    breakdown[transaction.category].amount += parseFloat(transaction.amount);
    breakdown[transaction.category].count += 1;
  });
  
  return Object.values(breakdown).sort((a, b) => b.amount - a.amount);
};

export const getMonthlyData = (transactions, months = 6) => {
  const monthlyData = [];
  const now = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
    });
    
    const totals = calculateTotals(monthTransactions);
    
    monthlyData.push({
      month: format(monthDate, 'MMM yyyy'),
      income: totals.income,
      expenses: totals.expenses,
      balance: totals.balance,
      transactions: monthTransactions.length
    });
  }
  
  return monthlyData;
};

export const getBudgetProgress = (transactions, budgets) => {
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
  });
  
  const categorySpending = {};
  currentMonthTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      if (!categorySpending[t.category]) {
        categorySpending[t.category] = 0;
      }
      categorySpending[t.category] += parseFloat(t.amount);
    });
  
  const budgetProgress = Object.keys(budgets).map(categoryId => {
    const budget = budgets[categoryId] || 0;
    const spent = categorySpending[categoryId] || 0;
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;
    
    return {
      categoryId,
      budget,
      spent,
      percentage: Math.min(percentage, 100),
      overBudget: spent > budget,
      remaining: Math.max(budget - spent, 0)
    };
  });
  
  return budgetProgress.filter(item => item.budget > 0);
};

export const getInsights = (transactions, budgets) => {
  const currentMonth = getMonthlyData(transactions, 2);
  const previousMonth = currentMonth[1];
  const thisMonth = currentMonth[0];
  
  const insights = [];
  
  // Spending comparison
  if (previousMonth && thisMonth) {
    const expenseChange = thisMonth.expenses - previousMonth.expenses;
    const expenseChangePercent = (expenseChange / previousMonth.expenses) * 100;
    
    if (Math.abs(expenseChangePercent) > 10) {
      insights.push({
        type: expenseChange > 0 ? 'warning' : 'success',
        title: expenseChange > 0 ? 'Spending Increased' : 'Spending Decreased',
        message: `You spent ${Math.abs(expenseChangePercent).toFixed(1)}% ${expenseChange > 0 ? 'more' : 'less'} this month compared to last month.`
      });
    }
  }
  
  // Budget alerts
  const budgetProgress = getBudgetProgress(transactions, budgets);
  const overBudgetCategories = budgetProgress.filter(item => item.overBudget);
  
  if (overBudgetCategories.length > 0) {
    insights.push({
      type: 'danger',
      title: 'Over Budget',
      message: `You've exceeded your budget in ${overBudgetCategories.length} categor${overBudgetCategories.length > 1 ? 'ies' : 'y'} this month.`
    });
  }
  
  // Income vs expenses
  const totals = calculateTotals(transactions);
  if (totals.expenses > totals.income) {
    insights.push({
      type: 'danger',
      title: 'Deficit Alert',
      message: `Your expenses exceed your income by $${Math.abs(totals.balance).toFixed(2)}.`
    });
  }
  
  // Savings rate
  if (totals.income > 0) {
    const savingsRate = (totals.balance / totals.income) * 100;
    if (savingsRate < 10) {
      insights.push({
        type: 'warning',
        title: 'Low Savings Rate',
        message: `You're saving only ${savingsRate.toFixed(1)}% of your income. Consider reducing expenses.`
      });
    } else if (savingsRate > 30) {
      insights.push({
        type: 'success',
        title: 'Great Savings!',
        message: `You're saving ${savingsRate.toFixed(1)}% of your income. Keep it up!`
      });
    }
  }
  
  return insights;
};
