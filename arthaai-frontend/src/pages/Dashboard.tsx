import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { ExpenseService } from '../services/expense.service';
import type { FinancialScore } from '../types/expense.types';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { ShieldCheckIcon, CurrencyRupeeIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [score, setScore] = useState<FinancialScore | null>(null);
  const [dailyTip, setDailyTip] = useState<string>("Keep adding expenses to receive personalized AI insights!");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const data = await ExpenseService.getFinancialScore();
        setScore(data);
        
        // Fetch AI tip silently
        import('../services/ai.service').then(({ AIService }) => {
          AIService.getDailyTip().then(res => setDailyTip(res.tip)).catch(console.error);
        });
      } catch (error) {
        console.error('Failed to fetch score', error);
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, []);

  const getScoreColor = (value: number) => {
    if (value >= 80) return '#10b981'; // success
    if (value >= 60) return '#4f46e5'; // primary
    if (value >= 40) return '#f59e0b'; // warning
    return '#dc2626'; // danger
  };

  const scoreData = score ? [{ name: 'Score', value: score.overallScore, fill: getScoreColor(score.overallScore) }] : [];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary dark:text-text-primary-dark">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="mt-2 text-text-muted dark:text-text-muted-dark">
            Here's an overview of your financial health.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button onClick={() => ExpenseService.calculateFinancialScore().then(setScore)} className="px-4 py-2 bg-surface-2 dark:bg-surface-2-dark text-text-primary dark:text-text-primary-dark rounded-lg hover:bg-border dark:hover:bg-border-dark transition-colors font-medium border border-border dark:border-border-dark">
            Recalculate Score
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-border dark:border-border-dark">
          <div className="flex items-center text-text-muted dark:text-text-muted-dark mb-2">
            <CurrencyRupeeIcon className="h-5 w-5 mr-2" />
            <h3 className="font-medium text-sm">Monthly Savings</h3>
          </div>
          <p className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">₹--</p>
        </div>
        <div className="bg-surface dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-border dark:border-border-dark">
          <div className="flex items-center text-text-muted dark:text-text-muted-dark mb-2">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            <h3 className="font-medium text-sm">Total Debt</h3>
          </div>
          <p className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">₹0.00</p>
        </div>
        <div className="bg-surface dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-border dark:border-border-dark">
          <div className="flex items-center text-text-muted dark:text-text-muted-dark mb-2">
            <ShieldCheckIcon className="h-5 w-5 mr-2" />
            <h3 className="font-medium text-sm">Investment Value</h3>
          </div>
          <p className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">₹0.00</p>
        </div>
        <div className="bg-primary/10 p-6 rounded-2xl border border-primary/20">
          <h3 className="font-medium text-sm text-primary dark:text-primary-dark mb-2">AI Daily Tip</h3>
          <p className="text-sm text-text-primary dark:text-text-primary-dark font-medium">
            {dailyTip}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Score Gauge */}
        <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-border dark:border-border-dark lg:col-span-1 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-2 text-text-primary dark:text-text-primary-dark w-full text-left">Health Score</h2>
          
          {loading ? (
            <div className="h-[250px] flex items-center justify-center text-text-muted">Loading...</div>
          ) : (
            <div className="relative w-full min-w-0 h-[250px] min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" cy="50%" 
                  innerRadius="70%" outerRadius="100%" 
                  barSize={15} data={scoreData} 
                  startAngle={180} endAngle={0}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar background dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                <span className="text-5xl font-extrabold text-text-primary dark:text-text-primary-dark">
                  {score?.overallScore || 0}
                </span>
                <span className="text-sm font-medium text-text-muted dark:text-text-muted-dark mt-1">out of 100</span>
              </div>
            </div>
          )}
        </div>

        {/* Breakdown */}
        <div className="bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-border dark:border-border-dark lg:col-span-2">
           <h2 className="text-xl font-semibold mb-6 text-text-primary dark:text-text-primary-dark">Score Breakdown</h2>
           {score && (
             <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-text-primary dark:text-text-primary-dark">Savings Ratio</span>
                    <span className="text-primary dark:text-primary-dark">{score.savingsRatioScore}/100</span>
                  </div>
                  <div className="w-full bg-surface-2 dark:bg-surface-2-dark rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${score.savingsRatioScore}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-text-primary dark:text-text-primary-dark">Debt-to-Income (DTI)</span>
                    <span className="text-success dark:text-success-dark">{score.debtRatioScore}/100</span>
                  </div>
                  <div className="w-full bg-surface-2 dark:bg-surface-2-dark rounded-full h-2.5">
                    <div className="bg-success h-2.5 rounded-full" style={{ width: `${score.debtRatioScore}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-text-primary dark:text-text-primary-dark">Emergency Fund</span>
                    <span className="text-warning dark:text-warning-dark">{score.emergencyFundScore}/100</span>
                  </div>
                  <div className="w-full bg-surface-2 dark:bg-surface-2-dark rounded-full h-2.5">
                    <div className="bg-warning h-2.5 rounded-full" style={{ width: `${score.emergencyFundScore}%` }}></div>
                  </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
