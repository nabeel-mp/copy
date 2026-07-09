import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.slug}`)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden active:scale-95 transition-transform cursor-pointer flex flex-col"
    >
      {/* Product Image */}
      <div className="h-32 bg-gray-50 flex items-center justify-center p-2 relative">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/150'}
          alt={product.name}
          className="max-h-full max-w-full object-contain mix-blend-multiply"
        />
        {product.discountPrice && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
            SALE
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight mb-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-semibold text-gray-600">
            {product.ratingsAverage ? product.ratingsAverage.toFixed(1) : '4.5'}
          </span>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-[#004aad]">
              ₹{product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-gray-400 line-through font-medium">
                ₹{product.price}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}