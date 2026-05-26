import { api } from './api';
import type { ChatMessage } from '../types/ai.types';

export const AIService = {
  getHistory: async (): Promise<ChatMessage[]> => {
    const response = await api.get('/api/ai/chat/history');
    return response.data;
  },

  clearHistory: async (): Promise<void> => {
    await api.delete('/api/ai/chat/history');
  },

  getDailyTip: async (): Promise<{ tip: string }> => {
    const response = await api.get('/api/ai/advice/daily');
    return response.data;
  }
};
