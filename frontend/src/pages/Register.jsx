import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../utils/validation';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { User, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser({
        full_name: data.full_name,
        username: data.username,
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password,
      });
      toast.success('Account created successfully! Please sign in with your credentials.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      const responseErrors = err.response?.data;
      if (typeof responseErrors === 'object') {
        const firstErrorKey = Object.keys(responseErrors)[0];
        const errorMsg = Array.isArray(responseErrors[firstErrorKey])
          ? responseErrors[firstErrorKey][0]
          : responseErrors[firstErrorKey];
        toast.error(`${firstErrorKey}: ${errorMsg}`);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-[#26160F] dark:text-[#F7EFE8]">
          Create Staff Account
        </h2>
        <p className="text-xs text-[#665349] dark:text-[#C8B7AC]">
          Register a new account to access the hall management system.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <Input
          label="Full Name"
          placeholder="e.g. Anand Kumar"
          leftIcon={User}
          required
          error={errors.full_name?.message}
          {...register('full_name')}
        />

        <Input
          label="Username"
          placeholder="e.g. anand_kumar"
          leftIcon={User}
          required
          error={errors.username?.message}
          {...register('username')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="anand@example.com"
          leftIcon={Mail}
          required
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password (min 8 characters)"
          type="password"
          placeholder="••••••••"
          leftIcon={Lock}
          required
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          leftIcon={Lock}
          required
          error={errors.confirm_password?.message}
          {...register('confirm_password')}
        />

        <Button
          type="submit"
          variant="gold"
          size="lg"
          isLoading={loading}
          className="w-full mt-2"
          rightIcon={ArrowRight}
        >
          Create Account
        </Button>
      </form>

      <div className="text-center pt-2 border-t border-[#EFE8DE] dark:border-[#2A1C15]">
        <p className="text-xs text-[#665349] dark:text-[#C8B7AC]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-[#7B4B32] dark:text-[#D4AF37] hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
