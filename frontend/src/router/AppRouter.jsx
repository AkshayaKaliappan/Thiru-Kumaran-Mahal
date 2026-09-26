import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Pages
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Dashboard } from '../pages/Dashboard';
import { BookedList } from '../pages/BookedList';
import { BookingDetails } from '../pages/BookingDetails';
import { NewBooking } from '../pages/NewBooking';
import { EditBooking } from '../pages/EditBooking';
import { Expenses } from '../pages/Expenses';
import { Reports } from '../pages/Reports';
import { GlobalSearch } from '../pages/GlobalSearch';
import { NotFound } from '../pages/NotFound';

export const AppRouter = () => {
  return (
    <Routes>
      {/* Auth Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Management Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/bookings" element={<BookedList />} />
        <Route path="/bookings/new" element={<NewBooking />} />
        <Route path="/bookings/:id" element={<BookingDetails />} />
        <Route path="/bookings/:id/edit" element={<EditBooking />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/search" element={<GlobalSearch />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
