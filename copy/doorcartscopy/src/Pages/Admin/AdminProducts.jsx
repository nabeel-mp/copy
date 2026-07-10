import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Ban, RotateCcw } from 'lucide-react';
import AdminBottomNav from '../../components/AdminBottomNav';
import AdminProductRowSkeleton from '../../components/AdminProductRowSkeleton';
import * as adminService from '../../api/adminService';

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [busyId, setBusyId] = useState(null);

  const loadProducts = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      // Admin sees ALL products (active + deactivated), unlike the public
      // storefront's getProducts(), so deactivated items can be found again.
      const res = await adminService.getAllProducts();
      setProducts(res.products || []);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Could not load products.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleDeactivate = async (product) => {
    if (!window.confirm(`Deactivate "${product.name}"? It will be hidden from the storefront but can be reactivated later.`)) return;
    setBusyId(product._id);
    try {
      await adminService.deactivateProduct(product._id);
      await loadProducts();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Could not deactivate product.');
    } finally {
      setBusyId(null);
    }
  };

  const handleReactivate = async (product) => {
    setBusyId(product._id);
    try {
      await adminService.updateProduct(product._id, { isActive: true });
      await loadProducts();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Could not reactivate product.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[100dvh] bg-[#f9f9fc] pb-24">
      <header className="bg-[#004aad] text-white p-6 rounded-b-[32px] shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-extrabold">Products</h1>
        <button
          onClick={() => navigate('/admin/products/new')}
          aria-label="Add product"
          className="bg-white text-[#004aad] p-2 rounded-xl active:scale-95 transition-transform"
        >
          <Plus size={20} />
        </button>
      </header>

      <main className="px-5 mt-6 space-y-4">
        {errorMessage && (
          <p className="text-sm text-center text-red-600 font-bold p-3 bg-red-50 rounded-lg">{errorMessage}</p>
        )}

        {isLoading ? (
          <div className="space-y-4" aria-busy="true" aria-label="Loading products">
            {Array.from({ length: 4 }).map((_, i) => (
              <AdminProductRowSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 px-4">
            <p className="font-bold text-gray-700">No products yet</p>
            <p className="text-sm text-gray-500 mt-1">Tap the + button to add your first product.</p>
          </div>
        ) : (
          products.map(product => (
            <div key={product._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-800 truncate">{product.name}</p>
                  {!product.isActive && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">Stock: {product.stock} | ₹{product.price}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => navigate(`/admin/products/${product._id}/edit`, { state: { product } })}
                  aria-label={`Edit ${product.name}`}
                  className="text-[#004aad] bg-blue-50 p-2 rounded-lg"
                >
                  <Pencil size={18} />
                </button>
                {product.isActive ? (
                  <button
                    onClick={() => handleDeactivate(product)}
                    disabled={busyId === product._id}
                    aria-label={`Deactivate ${product.name}`}
                    className="text-red-500 bg-red-50 p-2 rounded-lg disabled:opacity-40"
                  >
                    <Ban size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleReactivate(product)}
                    disabled={busyId === product._id}
                    aria-label={`Reactivate ${product.name}`}
                    className="text-green-600 bg-green-50 p-2 rounded-lg disabled:opacity-40"
                  >
                    <RotateCcw size={18} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </main>
      <AdminBottomNav active="products" />
    </div>
  );
}