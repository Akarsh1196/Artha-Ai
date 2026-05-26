import ThemeToggle from './ThemeToggle';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated()) return null;

  return (
    <header className="bg-surface dark:bg-surface-dark border-b border-border dark:border-border-dark h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1"></div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
