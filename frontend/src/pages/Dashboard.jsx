import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { StatCard } from '../components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { formatCurrency, formatNumber } from '../utils/formatters';
import {
  CalendarDays,
  CalendarPlus,
  Receipt,
  FileBarChart2,
  Search,
  CheckCircle,
  Clock,
  Ban,
  TrendingUp,
  CreditCard,
  DollarSign,
  Wallet,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from 'recharts';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { stats, loading, error, refresh } = useDashboard();

  if (loading) {
    return <LoadingState message="Loading dashboard metrics and statistics..." />;
  }

  if (error || !stats) {
    return (
      <ErrorState
        title="Unable to load dashboard"
        message={error || 'Failed to fetch financial and booking statistics'}
        onRetry={refresh}
      />
    );
  }

  const PIE_COLORS = ['#B91C1C', '#D97706', '#15803D', '#3B82F6', '#6B7280'];

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3D9CC] dark:border-[#38251C]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#26160F] dark:text-[#F7EFE8] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#665349] dark:text-[#C8B7AC] mt-0.5">
            Real-time function hall operations, bookings, and financial performance
          </p>
        </div>

        {/* Quick Actions Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="gold"
            size="sm"
            onClick={() => navigate('/bookings/new')}
            leftIcon={CalendarPlus}
          >
            New Booking
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/bookings')}
            leftIcon={CalendarDays}
          >
            Booked List
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/expenses')}
            leftIcon={Receipt}
          >
            Expenses
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/reports')}
            leftIcon={FileBarChart2}
          >
            Reports
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/search')}
            leftIcon={Search}
          >
            Search
          </Button>
        </div>
      </div>

      {/* 2. Top Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Bookings"
          value={formatNumber(stats.total_bookings)}
          subtitle={`${stats.today_bookings || 0} today, ${stats.upcoming_bookings || 0} upcoming`}
          icon={CalendarDays}
          variant="gold"
        />

        <StatCard
          title="Fully Paid Bookings"
          value={formatNumber(stats.fully_paid)}
          subtitle="Zero outstanding balance"
          icon={CheckCircle}
          variant="emerald"
        />

        <StatCard
          title="Pending Payments"
          value={formatNumber(stats.pending_payment)}
          subtitle="Partial or unpaid reservations"
          icon={Clock}
          variant="amber"
        />

        <StatCard
          title="Cancelled Bookings"
          value={formatNumber(stats.cancelled_bookings)}
          subtitle="Freed hall slots"
          icon={Ban}
          variant="rose"
        />
      </div>

      {/* 3. Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Revenue */}
        <Card className="bg-linear-to-br from-emerald-500/10 via-white to-white dark:from-emerald-950/30 dark:via-[#1E140F] dark:to-[#1E140F] border-emerald-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                Total Revenue Collected
              </p>
              <div className="text-2xl sm:text-3xl font-black text-[#26160F] dark:text-[#F7EFE8] mt-1">
                {formatCurrency(stats.revenue)}
              </div>
              <p className="text-[11px] text-[#665349] dark:text-[#C8B7AC] mt-1">
                Total Billed: {formatCurrency(stats.total_billed)} (Bal: {formatCurrency(stats.outstanding_balance)})
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Expenses */}
        <Card className="bg-linear-to-br from-rose-500/10 via-white to-white dark:from-rose-950/30 dark:via-[#1E140F] dark:to-[#1E140F] border-rose-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-rose-700 dark:text-rose-400 tracking-wider">
                Operational Expenses
              </p>
              <div className="text-2xl sm:text-3xl font-black text-[#26160F] dark:text-[#F7EFE8] mt-1">
                {formatCurrency(stats.expenses)}
              </div>
              <p className="text-[11px] text-[#665349] dark:text-[#C8B7AC] mt-1">
                Maintenance, staff, and cleaning costs
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400">
              <Receipt className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Net Amount */}
        <Card className="bg-linear-to-br from-[#C5A059]/15 via-white to-white dark:from-[#D4AF37]/20 dark:via-[#1E140F] dark:to-[#1E140F] border-[#C5A059]/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-[#8A6A23] dark:text-[#F3D370] tracking-wider">
                Net Profit Amount
              </p>
              <div className="text-2xl sm:text-3xl font-black text-[#7B4B32] dark:text-[#D4AF37] mt-1">
                {formatCurrency(stats.net_amount)}
              </div>
              <p className="text-[11px] text-[#665349] dark:text-[#C8B7AC] mt-1">
                Net = Revenue ({formatCurrency(stats.revenue)}) − Expenses ({formatCurrency(stats.expenses)})
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#C5A059]/20 text-[#7B4B32] dark:text-[#D4AF37]">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* 4. Charts Section (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Bookings Trend (2 cols on large screen) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Daily Bookings Trend</CardTitle>
              <p className="text-xs text-[#665349] dark:text-[#C8B7AC] mt-0.5">
                Active hall reservations across the past 30 days
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#C5A059]" />
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.daily_bookings || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(str) => str.slice(8)} // Show day
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis allowDecimals={false} fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E140F',
                      borderColor: '#38251C',
                      borderRadius: '8px',
                      color: '#F7EFE8',
                      fontSize: '12px',
                    }}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Bar
                    dataKey="bookings"
                    name="Active Bookings"
                    fill="#C5A059"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Payment Distribution Chart */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Payment Status Distribution</CardTitle>
              <p className="text-xs text-[#665349] dark:text-[#C8B7AC] mt-0.5">
                Collection split by payment status
              </p>
            </div>
            <DollarSign className="w-5 h-5 text-[#C5A059]" />
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.payment_distribution || []}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    paddingAngle={3}
                  >
                    {(stats.payment_distribution || []).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E140F',
                      borderColor: '#38251C',
                      borderRadius: '8px',
                      color: '#F7EFE8',
                      fontSize: '12px',
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
