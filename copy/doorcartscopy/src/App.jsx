import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/authContext';

import Login from '../../../Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import CategoryProducts from './Pages/CategoryProducts';
import ProductDetails from './Pages/ProductDetails';
import Cart from './Pages/Cart';
import Payment from './Pages/Payment';
import OrderHistory from './Pages/OrderHistory';
import OrderStatus from './Pages/OrderStatus';
import Wallet from './Pages/Wallet';
import Support from './Pages/Support';
import Account from './Pages/Account';
import OrderSuccess from './Pages/OrderSuccess';
import Settings from './Pages/Settings'; // New Settings

// Admin Imports
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminProducts from './Pages/Admin/AdminProducts';
import AdminOrders from './Pages/Admin/AdminOrders';
import AdminProductForm from './Pages/Admin/AdminProductForm';


const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// Admin Protection Wrapper
const AdminRoute = ({ isAuthenticated, user, children }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/home" replace />;
  return children;
};

function AppRoutes() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center font-sans text-[#004AAD]">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? (user?.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/home" replace />) : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Register /> : <Navigate to="/login" replace />} />

        {/* User Routes */}
        <Route path="/home" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Home /></ProtectedRoute>} />
        <Route path="/category/:slug" element={<ProtectedRoute isAuthenticated={isAuthenticated}><CategoryProducts /></ProtectedRoute>} />
        <Route path="/product/:slug" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ProductDetails /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Cart /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Payment /></ProtectedRoute>} />
        <Route path="/order-history" element={<ProtectedRoute isAuthenticated={isAuthenticated}><OrderHistory /></ProtectedRoute>} />
        <Route path="/order-status" element={<ProtectedRoute isAuthenticated={isAuthenticated}><OrderStatus /></ProtectedRoute>} />
        <Route path="/order-status/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><OrderStatus /></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute isAuthenticated={isAuthenticated}><OrderSuccess /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Wallet /></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Support /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Account /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Settings /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminRoute isAuthenticated={isAuthenticated} user={user}><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute isAuthenticated={isAuthenticated} user={user}><AdminProducts /></AdminRoute>} />
        <Route path="/admin/products/new" element={<AdminRoute isAuthenticated={isAuthenticated} user={user}><AdminProductForm /></AdminRoute>} />
        <Route path="/admin/products/:id/edit" element={<AdminRoute isAuthenticated={isAuthenticated} user={user}><AdminProductForm /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute isAuthenticated={isAuthenticated} user={user}><AdminOrders /></AdminRoute>} />

        <Route path="*" element={<Navigate to={isAuthenticated ? '/home' : '/login'} replace />} />
      </Routes>
    </Router>
  );
}

// AuthProvider is mounted once, in main.jsx (which wraps <App /> directly).
// It used to also be wrapped here, which meant two independent providers -
// two parallel `/auth/me` calls on every load, and this outer provider's
// state was never actually used, since AppRoutes reads from the nearest
// (main.jsx) provider via context.
export default function App() {
  return <AppRoutes />;
}