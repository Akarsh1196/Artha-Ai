import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AuthService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import { AxiosError } from 'axios';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);
      const response = await AuthService.login(data);
      login(response.user, response.accessToken);
      navigate('/dashboard');
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-2 dark:bg-surface-2-dark">
      <div className="w-full max-w-md p-8 space-y-8 bg-surface dark:bg-surface-dark rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-primary dark:text-primary-dark">ArthaAI</h2>
          <p className="mt-2 text-text-muted dark:text-text-muted-dark">Sign in to your account</p>
        </div>

        {error && (
          <div className="p-4 text-sm text-danger dark:text-danger-dark bg-danger/10 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark">Email address</label>
            <input
              type="email"
              {...register('email')}
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-danger">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark">Password</label>
            <input
              type="password"
              {...register('password')}
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-sm text-danger">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted dark:text-text-muted-dark">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
