import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Created by Divyansh Tyagi
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Personal Finance Tracker • Manage your money wisely
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
