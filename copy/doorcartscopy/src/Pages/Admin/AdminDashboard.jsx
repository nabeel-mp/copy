import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingBag, DollarSign } from 'lucide-react';
import AdminBottomNav from '../../components/AdminBottomNav';
import AdminStatCardSkeleton from '../../components/AdminStatCardSkeleton';
import * as adminService from '../../api/adminService';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadStats = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Could not load dashboard stats.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);

  return (
    <div className="w-full max-w-md mx-auto min-h-[100dvh] bg-[#f9f9fc] pb-24">
      <header className="bg-[#004aad] text-white p-6 rounded-b-[32px] shadow-md">
        <h1 className="text-2xl font-extrabold mb-1">Admin Dashboard</h1>
        <p className="text-sm opacity-80">Overview & Management</p>
      </header>

      <main className="px-5 mt-6 space-y-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4" aria-busy="true" aria-label="Loading dashboard stats">
            {Array.from({ length: 4 }).map((_, i) => (
              <AdminStatCardSkeleton key={i} />
            ))}
          </div>
        ) : errorMessage ? (
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
            <p className="text-red-500 font-bold mb-3">{errorMessage}</p>
            <button onClick={loadStats} className="text-[#004aad] font-bold underline">Try Again</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <DollarSign className="text-green-500 mb-2" size={24} />
              <p className="text-xs text-gray-500 font-bold uppercase">Revenue</p>
              <p className="text-xl font-extrabold text-[#004aad]">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <ShoppingBag className="text-blue-500 mb-2" size={24} />
              <p className="text-xs text-gray-500 font-bold uppercase">Total Orders</p>
              <p className="text-xl font-extrabold text-[#004aad]">{stats.totalOrders}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <Package className="text-orange-500 mb-2" size={24} />
              <p className="text-xs text-gray-500 font-bold uppercase">Products</p>
              <p className="text-xl font-extrabold text-[#004aad]">{stats.totalProducts}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <Users className="text-purple-500 mb-2" size={24} />
              <p className="text-xs text-gray-500 font-bold uppercase">Total Users</p>
              <p className="text-xl font-extrabold text-[#004aad]">{stats.totalUsers}</p>
            </div>
          </div>
        )}
      </main>
      <AdminBottomNav active="dashboard" />
    </div>
  );
}