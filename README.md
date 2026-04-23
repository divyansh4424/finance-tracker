# Finance Tracker - Personal Finance Management

A modern, responsive personal finance tracker web application built with React, Vite, and Tailwind CSS. Track your income, expenses, budgets, and gain insights into your spending habits with beautiful charts and analytics.

## 🌟 Features

### Core Functionality
- **Dashboard**: Overview of total balance, income, and expenses with smart insights
- **Transaction Management**: Add, view, search, and delete transactions
- **Interactive Charts**: Visual breakdown of expenses by category and monthly trends
- **Budget Tracking**: Set and monitor budgets for different categories
- **Data Persistence**: All data saved to localStorage

### Advanced Features
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Smart Insights**: AI-powered tips based on your spending patterns
- **Budget Alerts**: Visual warnings when approaching or exceeding budget limits
- **Monthly Analytics**: Compare spending across months
- **Category Management**: Predefined categories with custom icons and colors
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom components
- **Animations**: Framer Motion for smooth transitions
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React Hooks
- **Storage**: Browser localStorage

## 📱 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/1f2937/ffffff?text=Finance+Tracker+Dashboard)

### Transaction Management
![Transactions](https://via.placeholder.com/800x400/1f2937/ffffff?text=Transaction+List)

### Charts & Analytics
![Charts](https://via.placeholder.com/800x400/1f2937/ffffff?text=Expense+Charts)

### Budget Tracking
![Budget](https://via.placeholder.com/800x400/1f2937/ffffff?text=Budget+Progress)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd finance-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The build files will be in the `dist` directory.

## 📊 Features Overview

### Dashboard
- **Summary Cards**: Total balance, income, and expenses with visual indicators
- **Smart Insights**: Automated tips based on spending patterns
- **Quick Stats**: Transaction counts and averages
- **Monthly Overview**: Recent financial activity

### Transaction Management
- **Add Transactions**: Income and expense with categories
- **Search & Filter**: Find transactions quickly
- **Sort Options**: By date, amount, or category
- **Delete Function**: Remove unwanted transactions

### Categories
- **Income Categories**: Salary, Freelance, Investment, Business, Other
- **Expense Categories**: Food, Transport, Shopping, Bills, Entertainment, Health, Education, Travel, Other
- **Color-Coded**: Visual distinction with icons
- **Customizable**: Easy to modify and extend

### Budget Tracking
- **Set Budgets**: Define limits per category
- **Progress Visualization**: See spending vs. budget
- **Alerts**: Warnings for overspending
- **Monthly Reset**: Automatic tracking per month

### Charts & Analytics
- **Pie Charts**: Expense breakdown by category
- **Bar Charts**: Monthly income vs. expenses
- **Progress Bars**: Budget utilization
- **Trend Analysis**: Spending patterns over time

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#22c55e)
- **Danger**: Red (#ef4444)
- **Warning**: Yellow (#f59e0b)
- **Dark Mode**: Full dark theme support

### Typography
- **Font Family**: Inter
- **Weights**: 300, 400, 500, 600, 700

### Animations
- **Page Transitions**: Smooth fade and slide effects
- **Micro-interactions**: Hover states and button animations
- **Loading States**: Skeleton loaders and spinners

## 📁 Project Structure

```
finance-tracker/
├── public/
├── src/
│   ├── components/
│   │   ├── App.jsx
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Dashboard.jsx
│   │   ├── TransactionForm.jsx
│   │   ├── TransactionList.jsx
│   │   ├── Charts.jsx
│   │   └── Budget.jsx
│   ├── hooks/
│   │   ├── useTransactions.js
│   │   └── useDarkMode.js
│   ├── utils/
│   │   ├── storage.js
│   │   └── analytics.js
│   ├── data/
│   │   └── categories.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## 📊 Data Storage

All data is stored in the browser's localStorage:

- **Transactions**: Complete transaction history
- **Budgets**: Category budget limits
- **Settings**: User preferences (dark mode, etc.)

### Data Structure

```javascript
// Transaction
{
  id: "timestamp",
  type: "income|expense",
  amount: 123.45,
  category: "category_id",
  description: "Transaction description",
  date: "YYYY-MM-DD"
}

// Budget
{
  category_id: 500.00
}
```

## 🌍 Deployment

This project can be deployed to any static hosting service:

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
1. Run `npm run build`
2. Upload the `dist` folder to Netlify

### GitHub Pages
1. Build the project
2. Deploy to GitHub Pages using GitHub Actions

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase init
firebase deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📝 Customization

### Adding New Categories
Edit `src/data/categories.js`:

```javascript
export const CATEGORIES = {
  expense: [
    // Add new category
    { id: 'new_category', name: 'New Category', color: '#color', icon: '🎯' },
  ]
};
```

### Modifying Budgets
Default budgets are in `src/data/categories.js`. Users can override these in the app.

### Custom Themes
Modify `tailwind.config.js` to add new color schemes or update existing ones.

## 🔒 Privacy & Security

- **Local Storage**: All data stays on your device
- **No Server**: No data is sent to external servers
- **Privacy-First**: Your financial information remains private

## 📱 Browser Support

- Chrome/Chromium 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 🐛 Troubleshooting

### Common Issues

1. **Data Not Persisting**: Check if localStorage is enabled in your browser
2. **Charts Not Displaying**: Ensure all dependencies are installed correctly
3. **Dark Mode Issues**: Clear browser cache and refresh

### Getting Help

- Check the browser console for errors
- Ensure all dependencies are installed
- Verify localStorage is available

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Recharts](https://recharts.org/) - Chart library
- [Lucide React](https://lucide.dev/) - Icon library

---

**Created with ❤️ by Divyansh Tyagi**

A modern approach to personal finance management. Track, analyze, and optimize your spending habits with beautiful visualizations and smart insights.
