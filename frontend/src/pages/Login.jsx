import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../utils/validation';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { User, Lock, ArrowRight, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
      toast.success('Welcome back! Login successful.');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        'Invalid username or password. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fillDevCredentials = () => {
    setValue('username', 'admin');
    setValue('password', 'Function@2026');
    toast.info('Filled development credentials');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-[#26160F] dark:text-[#F7EFE8]">
          Owner / Admin Login
        </h2>
        <p className="text-xs text-[#665349] dark:text-[#C8B7AC]">
          Enter your credentials to manage hall bookings and accounts.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Username or Email"
          placeholder="admin"
          leftIcon={User}
          required
          error={errors.username?.message}
          {...register('username')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={Lock}
          required
          error={errors.password?.message}
          {...register('password')}
        />

        <Button
          type="submit"
          variant="gold"
          size="lg"
          isLoading={loading}
          className="w-full mt-2"
          rightIcon={ArrowRight}
        >
          Sign In
        </Button>
      </form>

      {/* Development Quick Fill Hint */}
      <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#251812] border border-[#E3D9CC] dark:border-[#38251C] text-xs">
        <div className="flex items-center gap-2 font-bold text-[#7B4B32] dark:text-[#D4AF37] mb-1">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Development Admin Account</span>
        </div>
        <p className="text-[11px] text-[#665349] dark:text-[#C8B7AC] mb-2 leading-relaxed">
          Quickly populate default development credentials into the login fields.
        </p>
        <button
          type="button"
          onClick={fillDevCredentials}
          className="text-[11px] font-bold text-[#7B4B32] dark:text-[#D4AF37] hover:underline cursor-pointer"
        >
          Click to auto-fill dev credentials
        </button>
      </div>

      <div className="text-center pt-2 border-t border-[#EFE8DE] dark:border-[#2A1C15]">
        <p className="text-xs text-[#665349] dark:text-[#C8B7AC]">
          Need an account?{' '}
          <Link
            to="/register"
            className="font-bold text-[#7B4B32] dark:text-[#D4AF37] hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};
