import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import AdminBottomNav from '../../components/AdminBottomNav';
import * as productService from '../../api/productService';
import * as adminService from '../../api/adminService';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  const loadProducts = () => {
    productService.getProducts().then(res => setProducts(res.data?.products || res.data)).catch(console.error);
  };

  useEffect(() => { loadProducts(); }, []);

  const handleDelete = async (id) => {
    if(window.confirm('Delete this product?')) {
      await adminService.deleteProduct(id);
      loadProducts();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[100dvh] bg-[#f9f9fc] pb-24">
      <header className="bg-[#004aad] text-white p-6 rounded-b-[32px] shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-extrabold">Products</h1>
        <button className="bg-white text-[#004aad] p-2 rounded-xl"><Plus size={20}/></button>
      </header>

      <main className="px-5 mt-6 space-y-4">
        {products.map(product => (
          <div key={product._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-800">{product.name}</p>
              <p className="text-xs text-gray-500">Stock: {product.stock} | ₹{product.price}</p>
            </div>
            <button onClick={() => handleDelete(product._id)} className="text-red-500 bg-red-50 p-2 rounded-lg"><Trash2 size={18} /></button>
          </div>
        ))}
      </main>
      <AdminBottomNav active="products" />
    </div>
  );
}