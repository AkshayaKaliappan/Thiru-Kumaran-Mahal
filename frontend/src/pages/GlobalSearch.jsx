import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import {
  formatCurrency,
  formatDate,
  formatTime,
  getFunctionTypeLabel,
  getPaymentStatusBadge,
  getBookingStatusBadge,
} from '../utils/formatters';

import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';

import { Search, Eye, Sparkles, User, Phone, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export const GlobalSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const data = await bookingService.globalSearch(cleanQuery);
      if (Array.isArray(data.results)) {
        setResults(data.results);
      } else if (Array.isArray(data)) {
        setResults(data);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      toast.error('Failed to execute search query');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Header */}
      <div className="pb-4 border-b border-[#E3D9CC] dark:border-[#38251C]">
        <h1 className="text-2xl sm:text-3xl font-black text-[#26160F] dark:text-[#F7EFE8] tracking-tight">
          Global Booking Search
        </h1>
        <p className="text-xs sm:text-sm text-[#665349] dark:text-[#C8B7AC] mt-0.5">
          Find bookings instantly across all dates by party name, booking number, or phone number
        </p>
      </div>

      {/* 2. Search Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1E140F] border border-[#E3D9CC] dark:border-[#38251C] shadow-md">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Enter customer name, booking # (e.g. FH-2026-0001), or mobile number..."
              leftIcon={Search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          <Button type="submit" variant="gold" size="md" isLoading={loading}>
            Search Bookings
          </Button>
        </form>

        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-[#948074] dark:text-[#8F7C71]">
          <span>Quick hints:</span>
          <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] dark:bg-[#251812] border border-[#E3D9CC] dark:border-[#38251C]">
            Party: "Ramesh"
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] dark:bg-[#251812] border border-[#E3D9CC] dark:border-[#38251C]">
            Ref: "FH-2026"
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] dark:bg-[#251812] border border-[#E3D9CC] dark:border-[#38251C]">
            Phone: "98765"
          </span>
        </div>
      </div>

      {/* 3. Results Section */}
      {loading ? (
        <LoadingState message="Searching records in database..." />
      ) : hasSearched && results.length === 0 ? (
        <EmptyState
          icon={Search}
          title={`No bookings found for "${query}"`}
          description="Try checking for typos or searching by phone number or booking number."
        />
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#26160F] dark:text-[#F7EFE8]">
              Search Results ({results.length} found)
            </h3>
          </div>

          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Booking #</TableHead>
                <TableHead>Party / Customer</TableHead>
                <TableHead>Function</TableHead>
                <TableHead>Dates & Timing</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((booking) => {
                const payBadge = getPaymentStatusBadge(booking.payment_status);
                const bookBadge = getBookingStatusBadge(booking.booking_status);

                return (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <Link
                        to={`/bookings/${booking.id}`}
                        className="font-bold text-[#7B4B32] dark:text-[#D4AF37] hover:underline"
                      >
                        {booking.booking_number}
                      </Link>
                    </TableCell>

                    <TableCell>
                      <div className="font-bold text-[#26160F] dark:text-[#F7EFE8]">
                        {booking.party_name}
                      </div>
                      <div className="text-[11px] text-[#665349] dark:text-[#C8B7AC]">
                        📞 {booking.contact_number}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="default" size="sm">
                        {booking.function_type_display || getFunctionTypeLabel(booking.function_type)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs font-semibold">
                        {formatDate(booking.start_date)}
                        {booking.start_date !== booking.end_date && ` → ${formatDate(booking.end_date)}`}
                      </div>
                      <div className="text-[11px] text-[#665349] dark:text-[#C8B7AC]">
                        ⏰ {formatTime(booking.from_time)} – {formatTime(booking.end_time)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs font-bold text-[#26160F] dark:text-[#F7EFE8]">
                        {formatCurrency(booking.total_payment)}
                      </div>
                      <div className="text-[11px] text-[#665349] dark:text-[#C8B7AC]">
                        Bal: {formatCurrency(booking.balance)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${payBadge.bg}`}>
                          {booking.payment_status_display || payBadge.label}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${bookBadge.bg}`}>
                          {booking.booking_status_display || bookBadge.label}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/bookings/${booking.id}`)}
                        leftIcon={Eye}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  );
};
