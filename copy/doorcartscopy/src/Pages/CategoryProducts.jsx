import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import * as productService from '../api/productService';
import * as categoryService from '../api/categoryService';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

export default function CategoryProducts() {
  // The 'slug' parameter holds the category._id
  const { slug } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('Loading...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchCategoryAndProducts = async () => {
      try {
        setIsLoading(true);

        const categories = await categoryService.getCategories();
        const currentCat = categories.find((c) => c._id === slug || c.slug === slug);
        if (!cancelled) setCategoryName(currentCat ? currentCat.name : 'Products');

        const { products: fetchedProducts } = await productService.getProducts({ category: slug });
        if (!cancelled) setProducts(fetchedProducts || []);
      } catch (error) {
        if (!cancelled) {
          console.error('Error fetching category products:', error);
          setCategoryName('Error loading category');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchCategoryAndProducts();
    return () => { cancelled = true; };
  }, [slug]);

  return (
    <div className="relative w-full max-w-md mx-auto min-h-[100dvh] bg-[#f9f9fc] font-sans">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#004aad] shadow-md flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-extrabold text-white truncate max-w-[200px]">
            {categoryName}
          </h1>
        </div>
        <button
          onClick={() => navigate('/cart')}
          aria-label="Go to cart"
          className="text-white p-2 rounded-full hover:bg-white/10 transition-colors relative"
        >
          <ShoppingCart size={22} />
        </button>
      </header>

      {/* Main Content */}
      <main className="p-4 pb-20">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4" aria-busy="true" aria-label="Loading products">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <ShoppingCart size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-semibold text-gray-500">No products found</p>
            <p className="text-sm">Check back later for new stock.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}