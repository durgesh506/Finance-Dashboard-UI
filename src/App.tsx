import React, { useState, useEffect } from 'react';
import { useFinance } from './FinanceContext';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  Trash2,
  User,
  Shield,
  Eye,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

export default function App() {
  const { transactions, role, setRole, addTransaction, deleteTransaction, stats, insights } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Sidebar / Navigation */}
      <nav className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 hidden lg:block">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Wallet size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">FinanceFlow</h1>
        </div>

        <div className="space-y-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem icon={<ArrowUpRight size={20} />} label="Income" />
          <NavItem icon={<ArrowDownLeft size={20} />} label="Expenses" />
          <NavItem icon={<PieChartIcon size={20} />} label="Analytics" />
        </div>

        <div className="absolute bottom-10 left-6 right-6">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                {role === 'admin' ? <Shield size={16} /> : <Eye size={16} />}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Role</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 capitalize">{role}</p>
              </div>
            </div>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
            >
              <option value="admin">Admin (Full Access)</option>
              <option value="viewer">Viewer (Read Only)</option>
            </select>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 md:p-8 lg:p-10 pb-20">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Welcome back, Alex</h2>
            <p className="text-slate-500 dark:text-slate-400">Here's what's happening with your money today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              {isDarkMode ? <Eye size={20} /> : <Shield size={20} />}
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64 text-slate-800 dark:text-slate-200"
              />
            </div>
            {role === 'admin' && (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAddModalOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Add Transaction</span>
              </motion.button>
            )}
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Balance" 
            value={stats.totalBalance} 
            icon={<Wallet className="text-indigo-600" />} 
            trend="+12.5%"
            trendUp={true}
          />
          <StatCard 
            title="Total Income" 
            value={stats.totalIncome} 
            icon={<ArrowUpRight className="text-emerald-600" />} 
            trend="+8.2%"
            trendUp={true}
            color="emerald"
          />
          <StatCard 
            title="Total Expenses" 
            value={stats.totalExpenses} 
            icon={<ArrowDownLeft className="text-rose-600" />} 
            trend="-2.4%"
            trendUp={false}
            color="rose"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Balance Trend</h3>
              <select className="text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-2 py-1 focus:ring-0 text-slate-600 dark:text-slate-400">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.balanceTrend}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Balance']}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6">Spending Breakdown</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.spendingByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.spendingByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {stats.spendingByCategory.slice(0, 3).map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">${item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights & Transactions */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Insights */}
          <div className="xl:col-span-1 space-y-6">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Quick Insights</h3>
            <InsightCard 
              title="Highest Spending" 
              value={insights.highestSpendingCategory} 
              description="Most of your money goes here."
              icon={<TrendingUp className="text-amber-600" />}
              bg="bg-amber-50 dark:bg-amber-900/10"
            />
            <InsightCard 
              title="Monthly Change" 
              value={`${insights.monthlyComparison > 0 ? '+' : ''}${insights.monthlyComparison.toFixed(1)}%`} 
              description="Compared to last month's expenses."
              icon={insights.monthlyComparison > 0 ? <TrendingUp className="text-rose-600" /> : <TrendingDown className="text-emerald-600" />}
              bg={insights.monthlyComparison > 0 ? "bg-rose-50 dark:bg-rose-900/10" : "bg-emerald-50 dark:bg-emerald-900/10"}
            />
            <div className="p-6 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-200">
              <p className="text-indigo-100 text-sm mb-1">Top Expense</p>
              <h4 className="text-2xl font-bold mb-4">${insights.topExpense.toLocaleString()}</h4>
              <p className="text-xs text-indigo-200 leading-relaxed">
                You're doing great! Try to keep your food expenses under $500 this month to reach your savings goal.
              </p>
            </div>
          </div>

          {/* Transactions List */}
          <div className="xl:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Recent Transactions</h3>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl">
                <FilterButton active={filterType === 'all'} onClick={() => setFilterType('all')}>All</FilterButton>
                <FilterButton active={filterType === 'income'} onClick={() => setFilterType('income')}>Income</FilterButton>
                <FilterButton active={filterType === 'expense'} onClick={() => setFilterType('expense')}>Expenses</FilterButton>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Description</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium text-right">Amount</th>
                    {role === 'admin' && <th className="px-6 py-4 font-medium text-right">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence mode="popLayout">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((t) => (
                        <motion.tr 
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={t.id} 
                          className="hover:bg-slate-50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                t.type === 'income' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                              )}>
                                {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                              </div>
                              <span className="font-medium text-slate-700">{t.description}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                              {t.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-sm">{t.date}</td>
                          <td className={cn(
                            "px-6 py-4 text-right font-bold",
                            t.type === 'income' ? "text-emerald-600" : "text-slate-800"
                          )}>
                            {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                          </td>
                          {role === 'admin' && (
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => deleteTransaction(t.id)}
                                className="p-2 text-slate-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          )}
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={role === 'admin' ? 5 : 4} className="px-6 py-20 text-center text-slate-400">
                          <div className="flex flex-col items-center gap-2">
                            <Search size={48} className="text-slate-200" />
                            <p>No transactions found matching your search.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-6">New Transaction</h3>
              <AddTransactionForm onComplete={() => setIsAddModalOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-around z-40">
        <MobileNavItem icon={<LayoutDashboard size={24} />} active />
        <MobileNavItem icon={<ArrowUpRight size={24} />} />
        <div className="relative -top-6">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-indigo-200"
          >
            <Plus size={28} />
          </button>
        </div>
        <MobileNavItem icon={<ArrowDownLeft size={24} />} />
        <MobileNavItem icon={<User size={24} />} />
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all",
      active ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"
    )}>
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );
}

function MobileNavItem({ icon, active = false }: { icon: React.ReactNode, active?: boolean }) {
  return (
    <div className={cn(
      "p-2 rounded-xl",
      active ? "text-indigo-600" : "text-slate-400"
    )}>
      {icon}
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendUp, color = 'indigo' }: any) {
  const colors: any = {
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    rose: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", colors[color])}>
          {icon}
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg",
          trendUp ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
        )}>
          {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {trend}
        </div>
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100">${value.toLocaleString()}</h4>
    </div>
  );
}

function InsightCard({ title, value, description, icon, bg }: any) {
  return (
    <div className={cn("p-5 rounded-3xl border border-slate-100 dark:border-slate-800", bg)}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{title}</h4>
      </div>
      <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{description}</p>
    </div>
  );
}

function FilterButton({ children, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
        active ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
      )}
    >
      {children}
    </button>
  );
}

function AddTransactionForm({ onComplete }: { onComplete: () => void }) {
  const { addTransaction } = useFinance();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food & Dining',
    type: 'expense' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;
    
    addTransaction({
      ...formData,
      amount: parseFloat(formData.amount),
    });
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
        <input 
          required
          type="text" 
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
          placeholder="e.g. Grocery shopping"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount ($)</label>
          <input 
            required
            type="number" 
            value={formData.amount}
            onChange={e => setFormData({...formData, amount: e.target.value})}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
          <select 
            value={formData.type}
            onChange={e => setFormData({...formData, type: e.target.value as any})}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
        <select 
          value={formData.category}
          onChange={e => setFormData({...formData, category: e.target.value})}
          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
        >
          <option>Food & Dining</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Entertainment</option>
          <option>Utilities</option>
          <option>Salary</option>
          <option>Investments</option>
          <option>Health</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
        <input 
          type="date" 
          value={formData.date}
          onChange={e => setFormData({...formData, date: e.target.value})}
          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
        />
      </div>
      <div className="flex gap-3 pt-4">
        <button 
          type="button"
          onClick={onComplete}
          className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-colors"
        >
          Save
        </button>
      </div>
    </form>
  );
}
