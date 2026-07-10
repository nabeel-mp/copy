import React, { useState, useEffect } from 'react';
import AdminBottomNav from '../../components/AdminBottomNav';
import AdminOrderRowSkeleton from '../../components/AdminOrderRowSkeleton';
import * as adminService from '../../api/adminService';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const loadOrders = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await adminService.getAllOrders();
      setOrders(data.orders || []);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Could not load orders.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const updateStatus = async (id, status) => {
    setBusyId(id);
    setActionError('');
    try {
      await adminService.updateOrderStatus(id, status);
      await loadOrders();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not update order status.');
    } finally {
      setBusyId(null);
    }
  };

  const confirmOrder = async (id) => {
    setBusyId(id);
    setActionError('');
    try {
      await adminService.confirmOrder(id);
      await loadOrders();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error confirming order.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[100dvh] bg-[#f9f9fc] pb-24">
      <header className="bg-[#004aad] text-white p-6 rounded-b-[32px] shadow-md">
        <h1 className="text-2xl font-extrabold">Manage Orders</h1>
      </header>
      <main className="px-5 mt-6 space-y-4">
        {actionError && (
          <p className="text-sm text-center text-red-600 font-bold p-3 bg-red-50 rounded-lg">{actionError}</p>
        )}

        {isLoading ? (
          <div className="space-y-4" aria-busy="true" aria-label="Loading orders">
            {Array.from({ length: 4 }).map((_, i) => (
              <AdminOrderRowSkeleton key={i} />
            ))}
          </div>
        ) : errorMessage ? (
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
            <p className="text-red-500 font-bold mb-3">{errorMessage}</p>
            <button onClick={loadOrders} className="text-[#004aad] font-bold underline">Try Again</button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 px-4">
            <p className="font-bold text-gray-700">No orders yet</p>
            <p className="text-sm text-gray-500 mt-1">Orders placed by users will appear here.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
              <div className="flex justify-between">
                <p className="font-bold">#DC-{order._id.slice(-6).toUpperCase()}</p>
                <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded-md uppercase">{order.orderStatus}</span>
              </div>
              <p className="text-sm text-gray-600">User: {order.user?.name || 'Guest'} | ₹{order.totalPrice}</p>
              <div className="flex gap-2">
                {order.orderStatus === 'pending' && (
                  <button
                    onClick={() => confirmOrder(order._id)}
                    disabled={busyId === order._id}
                    className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50"
                  >
                    Confirm
                  </button>
                )}
                {order.orderStatus === 'confirmed' && (
                  <button
                    onClick={() => updateStatus(order._id, 'shipped')}
                    disabled={busyId === order._id}
                    className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50"
                  >
                    Mark Shipped
                  </button>
                )}
                {order.orderStatus === 'shipped' && (
                  <button
                    onClick={() => updateStatus(order._id, 'delivered')}
                    disabled={busyId === order._id}
                    className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50"
                  >
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </main>
      <AdminBottomNav active="orders" />
    </div>
  );
}