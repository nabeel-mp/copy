import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingBag, DollarSign, Loader2 } from 'lucide-react';
import AdminBottomNav from '../../components/AdminBottomNav';
import * as adminService from '../../api/adminService';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminService.getDashboardStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-[#004aad]" /></div>;

  return (
    <div className="w-full max-w-md mx-auto min-h-[100dvh] bg-[#f9f9fc] pb-24">
      <header className="bg-[#004aad] text-white p-6 rounded-b-[32px] shadow-md">
        <h1 className="text-2xl font-extrabold mb-1">Admin Dashboard</h1>
        <p className="text-sm opacity-80">Overview & Management</p>
      </header>

      <main className="px-5 mt-6 space-y-4">
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
      </main>
      <AdminBottomNav active="dashboard" />
    </div>
  );
}