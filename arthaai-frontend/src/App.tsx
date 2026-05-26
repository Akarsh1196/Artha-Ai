import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { useEffect } from 'react';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import AIChat from './pages/AIChat';
import Investments from './pages/Investments';
import TaxAdvisor from './pages/TaxAdvisor';

// Layout
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Router>
      <div className="flex h-screen bg-surface-2 dark:bg-surface-2-dark overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/expenses" 
                element={
                  <PrivateRoute>
                    <Expenses />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/ai-chat" 
                element={
                  <PrivateRoute>
                    <AIChat />
                  </PrivateRoute>
                } 
              />

              <Route
                path="/investments"
                element={
                  <PrivateRoute>
                    <Investments />
                  </PrivateRoute>
                }
              />

              <Route
                path="/tax"
                element={
                  <PrivateRoute>
                    <TaxAdvisor />
                  </PrivateRoute>
                }
              />
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
