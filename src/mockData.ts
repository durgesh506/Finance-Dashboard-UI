import { Transaction } from './types';
import { subDays, format } from 'date-fns';

const CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Shopping',
  'Entertainment',
  'Utilities',
  'Salary',
  'Investments',
  'Health',
];

export const generateMockTransactions = (count: number = 20): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const type: 'income' | 'expense' = Math.random() > 0.8 ? 'income' : 'expense';
    const category = type === 'income' 
      ? (Math.random() > 0.5 ? 'Salary' : 'Investments')
      : CATEGORIES[Math.floor(Math.random() * (CATEGORIES.length - 2))];
    
    transactions.push({
      id: Math.random().toString(36).substr(2, 9),
      date: format(subDays(now, Math.floor(Math.random() * 30)), 'yyyy-MM-dd'),
      amount: type === 'income' 
        ? Math.floor(Math.random() * 5000) + 1000 
        : Math.floor(Math.random() * 200) + 10,
      category,
      type,
      description: `${category} payment`,
    });
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
