export interface Expense {
  id: string;
  amount: number;
  category: string;
  subCategory?: string;
  date: string;
  paymentMode?: string;
  notes?: string;
  isRecurring: boolean;
  createdAt: string;
}

export interface ExpenseRequest {
  amount: number;
  category: string;
  subCategory?: string;
  date: string;
  paymentMode?: string;
  notes?: string;
  isRecurring?: boolean;
}

export interface FinancialScore {
  id: string;
  overallScore: number;
  savingsRatioScore: number;
  debtRatioScore: number;
  emergencyFundScore: number;
  investmentScore: number;
  insuranceScore: number;
  aiCommentary: string;
  calculatedAt: string;
}
