import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { HomeIcon, ChartPieIcon, CurrencyRupeeIcon, DocumentTextIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated()) return null;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Expenses', href: '/expenses', icon: ChartPieIcon },
    { name: 'Investments', href: '/investments', icon: CurrencyRupeeIcon },
    { name: 'Tax Advisor', href: '/tax', icon: DocumentTextIcon },
    { name: 'AI Chat', href: '/ai-chat', icon: ChatBubbleLeftEllipsisIcon },
  ];

  return (
    <div className="flex flex-col w-64 bg-surface dark:bg-surface-dark border-r border-border dark:border-border-dark min-h-screen">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-border dark:border-border-dark">
        <h1 className="text-2xl font-bold text-primary dark:text-primary-dark">ArthaAI</h1>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary dark:text-primary-dark'
                  : 'text-text-muted dark:text-text-muted-dark hover:bg-surface-2 dark:hover:bg-surface-2-dark hover:text-text-primary dark:hover:text-text-primary-dark'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 shrink-0 ${
                  isActive ? 'text-primary dark:text-primary-dark' : 'text-text-muted dark:text-text-muted-dark group-hover:text-text-primary dark:group-hover:text-text-primary-dark'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
