import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { Transaction, UserRole, DashboardStats } from './types';
import { generateMockTransactions } from './mockData';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO, subMonths } from 'date-fns';

interface FinanceContextType {
  transactions: Transaction[];
  role: UserRole;
  setRole: (role: UserRole) => void;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  stats: DashboardStats;
  insights: {
    highestSpendingCategory: string;
    monthlyComparison: number;
    topExpense: number;
  };
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finance_transactions');
    return saved ? JSON.parse(saved) : generateMockTransactions(30);
  });
  const [role, setRole] = useState<UserRole>('admin');

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    if (role !== 'admin') return;
    const newTransaction = { ...t, id: Math.random().toString(36).substr(2, 9) };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    if (role !== 'admin') return;
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    const spendingByCategoryMap = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const spendingByCategory = Object.entries(spendingByCategoryMap)
      .map(([name, value]) => ({ name, value: value as number }))
      .sort((a, b) => (b.value as number) - (a.value as number));

    // Simple balance trend for the last 7 weeks
    const balanceTrend = Array.from({ length: 7 }).map((_, i) => {
      // Mocking trend data for simplicity
      return {
        date: `Week ${7-i}`,
        balance: totalIncome - totalExpenses + (Math.random() * 1000 - 500)
      };
    }).reverse();

    return {
      totalBalance: totalIncome - totalExpenses,
      totalIncome,
      totalExpenses,
      spendingByCategory,
      balanceTrend,
    };
  }, [transactions]);

  const insights = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const highestSpendingCategory = stats.spendingByCategory[0]?.name || 'N/A';
    
    const currentMonth = new Date();
    const lastMonth = subMonths(currentMonth, 1);
    
    const currentMonthExpenses = expenses
      .filter(t => isWithinInterval(parseISO(t.date), { 
        start: startOfMonth(currentMonth), 
        end: endOfMonth(currentMonth) 
      }))
      .reduce((acc, t) => acc + t.amount, 0);

    const lastMonthExpenses = expenses
      .filter(t => isWithinInterval(parseISO(t.date), { 
        start: startOfMonth(lastMonth), 
        end: endOfMonth(lastMonth) 
      }))
      .reduce((acc, t) => acc + t.amount, 0);

    const monthlyComparison = lastMonthExpenses === 0 ? 0 : ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
    const topExpense = Math.max(...expenses.map(t => t.amount), 0);

    return {
      highestSpendingCategory,
      monthlyComparison,
      topExpense,
    };
  }, [transactions, stats]);

  return (
    <FinanceContext.Provider value={{ 
      transactions, role, setRole, addTransaction, deleteTransaction, stats, insights 
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
};
