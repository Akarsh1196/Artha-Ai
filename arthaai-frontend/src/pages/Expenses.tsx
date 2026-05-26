import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ExpenseService } from '../services/expense.service';
import type { Expense, ExpenseRequest } from '../types/expense.types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrashIcon } from '@heroicons/react/24/outline';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#dc2626', '#8b5cf6', '#06b6d4', '#ec4899', '#64748b'];
type CategoryDatum = { name: string; value: number };

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ExpenseRequest>();

  const loadExpenses = async () => {
    try {
      const data = await ExpenseService.getAllExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Failed to load expenses', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialExpenses = async () => {
      try {
        const data = await ExpenseService.getAllExpenses();
        if (isMounted) {
          setExpenses(data);
        }
      } catch (error) {
        console.error('Failed to load expenses', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadInitialExpenses();

    return () => {
      isMounted = false;
    };
  }, []);

  const onSubmit = async (data: ExpenseRequest) => {
    try {
      await ExpenseService.addExpense(data);
      reset();
      loadExpenses();
      // Also update score silently in background
      ExpenseService.calculateFinancialScore().catch(console.error);
    } catch (error) {
      console.error('Failed to add expense', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        await ExpenseService.deleteExpense(id);
        loadExpenses();
      } catch (error) {
        console.error('Failed to delete expense', error);
      }
    }
  };

  const categoryData = expenses.reduce<CategoryDatum[]>((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary dark:text-text-primary-dark">Expense Tracker</h1>
        <p className="mt-2 text-text-muted dark:text-text-muted-dark">Manage your monthly spending and view category breakdowns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add Expense Form */}
        <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-border dark:border-border-dark lg:col-span-1">
          <h2 className="text-xl font-semibold mb-6 text-text-primary dark:text-text-primary-dark">Add Expense</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-text-primary dark:text-text-primary-dark">Amount (₹)</label>
              <input 
                type="number" step="0.01" required {...register('amount', { valueAsNumber: true })}
                className="w-full px-4 py-2 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-text-primary dark:text-text-primary-dark">Category</label>
              <select 
                required {...register('category')}
                className="w-full px-4 py-2 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="Food">Food & Dining</option>
                <option value="Travel">Travel & Commute</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Bills">Bills & Utilities</option>
                <option value="Healthcare">Healthcare</option>
                <option value="EMI">EMI</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-text-primary dark:text-text-primary-dark">Date</label>
              <input 
                type="date" required {...register('date')}
                className="w-full px-4 py-2 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-text-primary dark:text-text-primary-dark">Notes (Optional)</label>
              <input 
                type="text" {...register('notes')}
                className="w-full px-4 py-2 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <button 
              type="submit" disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium shadow transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Expense'}
            </button>
          </form>
        </div>

        {/* Charts & List */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Chart */}
          {expenses.length > 0 && (
            <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-border dark:border-border-dark h-[350px] min-w-0">
              <h2 className="text-xl font-semibold mb-4 text-text-primary dark:text-text-primary-dark">Category Breakdown</h2>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Recent Expenses Table */}
          <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-border dark:border-border-dark">
            <h2 className="text-xl font-semibold mb-4 text-text-primary dark:text-text-primary-dark">Recent Expenses</h2>
            {loading ? (
              <p className="text-text-muted dark:text-text-muted-dark">Loading...</p>
            ) : expenses.length === 0 ? (
              <p className="text-text-muted dark:text-text-muted-dark">No expenses found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border dark:border-border-dark text-sm text-text-muted dark:text-text-muted-dark">
                      <th className="py-3 px-4 font-medium">Date</th>
                      <th className="py-3 px-4 font-medium">Category</th>
                      <th className="py-3 px-4 font-medium">Notes</th>
                      <th className="py-3 px-4 font-medium">Amount</th>
                      <th className="py-3 px-4 font-medium w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="border-b border-border dark:border-border-dark hover:bg-surface-2 dark:hover:bg-surface-2-dark transition-colors">
                        <td className="py-3 px-4 text-sm text-text-primary dark:text-text-primary-dark">{expense.date}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary dark:text-primary-dark">
                            {expense.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-text-muted dark:text-text-muted-dark">{expense.notes || '-'}</td>
                        <td className="py-3 px-4 text-sm font-semibold text-text-primary dark:text-text-primary-dark">₹{expense.amount.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <button onClick={() => handleDelete(expense.id)} className="text-danger hover:text-danger-dark transition-colors">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
