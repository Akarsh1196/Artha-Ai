import { api } from './api';
import type { Expense, ExpenseRequest, FinancialScore } from '../types/expense.types';

export const ExpenseService = {
  getAllExpenses: async (): Promise<Expense[]> => {
    const response = await api.get('/api/expenses');
    return response.data;
  },
  
  addExpense: async (data: ExpenseRequest): Promise<Expense> => {
    const response = await api.post('/api/expenses', data);
    return response.data;
  },

  deleteExpense: async (id: string): Promise<void> => {
    await api.delete(`/api/expenses/${id}`);
  },

  getFinancialScore: async (): Promise<FinancialScore> => {
    const response = await api.get('/api/financial-score');
    return response.data;
  },

  calculateFinancialScore: async (): Promise<FinancialScore> => {
    const response = await api.post('/api/financial-score/calculate');
    return response.data;
  }
};
