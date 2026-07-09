import React, { useState, useEffect } from 'react';
import AdminBottomNav from '../../components/AdminBottomNav';
import * as adminService from '../../api/adminService';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    adminService.getAllOrders().then(data => setOrders(data.orders || [])).catch(console.error);
  };

  useEffect(() => { loadOrders(); }, []);

  const updateStatus = async (id, status) => {
    await adminService.updateOrderStatus(id, status);
    loadOrders();
  };

  const confirmOrder = async (id) => {
    try {
      await adminService.confirmOrder(id);
      loadOrders();
    } catch(err) { alert(err.response?.data?.message || 'Error confirming order'); }
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[100dvh] bg-[#f9f9fc] pb-24">
      <header className="bg-[#004aad] text-white p-6 rounded-b-[32px] shadow-md">
        <h1 className="text-2xl font-extrabold">Manage Orders</h1>
      </header>
      <main className="px-5 mt-6 space-y-4">
        {orders.map(order => (
          <div key={order._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
            <div className="flex justify-between">
              <p className="font-bold">#DC-{order._id.slice(-6).toUpperCase()}</p>
              <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded-md uppercase">{order.orderStatus}</span>
            </div>
            <p className="text-sm text-gray-600">User: {order.user?.name || 'Guest'} | ₹{order.totalPrice}</p>
            <div className="flex gap-2">
              {order.orderStatus === 'pending' && (
                <button onClick={() => confirmOrder(order._id)} className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold">Confirm</button>
              )}
              {order.orderStatus === 'confirmed' && (
                <button onClick={() => updateStatus(order._id, 'shipped')} className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold">Mark Shipped</button>
              )}
              {order.orderStatus === 'shipped' && (
                <button onClick={() => updateStatus(order._id, 'delivered')} className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold">Mark Delivered</button>
              )}
            </div>
          </div>
        ))}
      </main>
      <AdminBottomNav active="orders" />
    </div>
  );
}