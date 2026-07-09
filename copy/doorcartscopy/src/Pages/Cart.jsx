import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Minus, Plus, Trash2, ShoppingCart, Truck, MapPin, Loader2, ArrowRight,
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/authContext';
import * as cartService from '../api/cartService';
import * as orderService from '../api/orderService';

const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

// Mirrors Backend/src/controllers/orderController.js exactly (SHIPPING_FLAT_RATE,
// TAX_RATE) so the preview total shown here matches what the backend will
// actually charge when the order is created. This is a *preview* only - the
// server always recalculates authoritatively on POST /api/orders.
const SHIPPING_FLAT_RATE = 49;
const FREE_SHIPPING_THRESHOLD = 999;
const TAX_RATE = 0.05;

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [pendingItemId, setPendingItemId] = useState(null); // productId currently being updated/removed
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [placeOrderError, setPlaceOrderError] = useState('');

  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  // reloadToken is bumped to re-run the fetch below (used by the "Try again"
  // button). Following the same inline-effect pattern the rest of the app
  // uses (see Home.jsx) rather than a useCallback invoked from the effect.
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const data = await cartService.getCart();
        if (!cancelled) setCart(data);
      } catch (err) {
        if (!cancelled) setErrorMessage(err.response?.data?.message || 'Could not load your cart.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [reloadToken]);

  const items = useMemo(
    () => (cart?.items || []).filter((item) => item.product), // guard against a deleted/deactivated product left in the cart
    [cart]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const shipping = subtotal > 0 ? (subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE) : 0;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  const handleQuantityChange = async (productId, nextQty, stock) => {
    if (nextQty < 1) return;
    if (stock != null && nextQty > stock) return;
    setPendingItemId(productId);
    try {
      const updated = await cartService.updateCartItem(productId, nextQty);
      setCart(updated);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Could not update quantity.');
    } finally {
      setPendingItemId(null);
    }
  };

  const handleRemove = async (productId) => {
    setPendingItemId(productId);
    try {
      const updated = await cartService.removeCartItem(productId);
      setCart(updated);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Could not remove item.');
    } finally {
      setPendingItemId(null);
    }
  };

  const handlePlaceOrder = async () => {
    if (!defaultAddress || items.length === 0) return;
    setIsPlacingOrder(true);
    setPlaceOrderError('');
    try {
      const order = await orderService.createOrder(
        {
          fullName: defaultAddress.fullName,
          phone: defaultAddress.phone,
          line1: defaultAddress.line1,
          line2: defaultAddress.line2,
          city: defaultAddress.city,
          state: defaultAddress.state,
          postalCode: defaultAddress.postalCode,
          country: defaultAddress.country,
        },
        'razorpay'
      );
      navigate('/payment', { state: { orderId: order._id, totalAmount: order.totalPrice } });
    } catch (err) {
      setPlaceOrderError(err.response?.data?.message || 'Could not place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto min-h-[100dvh] bg-[#f9f9fc] font-sans pb-52">
      <header className="w-full sticky top-0 z-50 bg-[#004aad] shadow-md flex items-center gap-3 px-4 h-16">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="text-white p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-extrabold text-white">
          Shopping Cart{items.length > 0 ? ` (${items.length})` : ''}
        </h1>
      </header>

      <main className="w-full px-5 pt-6 space-y-6">
        {isLoading && (
          <div className="space-y-4" aria-busy="true" aria-label="Loading your cart">
            {[0, 1].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 flex gap-4 border border-gray-100 animate-pulse">
                <div className="w-24 h-24 rounded-lg bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3 mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && errorMessage && items.length === 0 && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 text-center">
            {errorMessage}
            <button onClick={() => setReloadToken((t) => t + 1)} className="block mx-auto mt-3 font-bold underline">
              Try again
            </button>
          </div>
        )}

        {!isLoading && !errorMessage && items.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
            <div className="w-20 h-20 rounded-full bg-[#e5edfa] flex items-center justify-center text-[#004aad]">
              <ShoppingCart size={32} />
            </div>
            <div>
              <p className="font-bold text-gray-700 text-lg">Your cart is empty</p>
              <p className="text-sm text-gray-500 mt-1">Browse categories to add materials to your cart.</p>
            </div>
            <button
              onClick={() => navigate('/home')}
              className="mt-2 px-6 py-3 bg-[#004aad] text-white font-bold rounded-xl active:scale-95 transition-transform"
            >
              Browse Products
            </button>
          </div>
        )}

        {items.length > 0 && (
          <>
            <section className="space-y-4" aria-label="Cart items">
              {items.map(({ product, quantity, price }) => {
                const isPending = pendingItemId === product._id;
                const outOfStock = product.stock <= 0;
                return (
                  <div
                    key={product._id}
                    className={`bg-white rounded-xl p-4 flex gap-4 border border-gray-100 shadow-sm transition-opacity ${isPending ? 'opacity-60' : ''}`}
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <button
                          onClick={() => navigate(`/product/${product.slug}`)}
                          className="font-bold text-gray-800 leading-tight text-left hover:text-[#004aad] transition-colors line-clamp-2"
                        >
                          {product.name}
                        </button>
                        {outOfStock && (
                          <p className="text-xs font-bold text-red-500 mt-1">Currently out of stock</p>
                        )}
                      </div>

                      <div className="flex items-end justify-between gap-2 mt-2">
                        <span className="font-extrabold text-[#004aad] text-lg">{formatINR(price)}</span>

                        <div className="flex items-center bg-gray-50 rounded-full border border-gray-200">
                          <button
                            onClick={() => handleQuantityChange(product._id, quantity - 1, product.stock)}
                            disabled={isPending || quantity <= 1}
                            aria-label={`Decrease quantity of ${product.name}`}
                            className="p-2 text-[#004aad] disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-bold text-sm" aria-live="polite">
                            {isPending ? <Loader2 size={14} className="animate-spin mx-auto" /> : quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(product._id, quantity + 1, product.stock)}
                            disabled={isPending || quantity >= product.stock}
                            aria-label={`Increase quantity of ${product.name}`}
                            className="p-2 text-[#004aad] disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(product._id)}
                      disabled={isPending}
                      aria-label={`Remove ${product.name} from cart`}
                      className="self-start text-gray-300 hover:text-red-500 transition-colors p-1 disabled:opacity-30"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </section>

            {/* Delivery Details */}
            <section className="bg-white rounded-2xl p-5 space-y-3 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-[#004aad]">
                <Truck size={20} />
                <h3 className="font-bold text-gray-800">Delivery Details</h3>
              </div>
              {defaultAddress ? (
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {[defaultAddress.line1, defaultAddress.line2, defaultAddress.city, defaultAddress.state]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-amber-600 font-medium">
                  No delivery address on file yet.
                </p>
              )}
              <button
                onClick={() => navigate('/register')}
                className="w-full py-3 border-2 border-[#004aad] text-[#004aad] rounded-xl font-bold hover:bg-[#f0f5ff] transition-colors text-sm"
              >
                {defaultAddress ? 'Change Address' : 'Add Delivery Address'}
              </button>
            </section>

            {/* Price Summary */}
            <section className="bg-white rounded-2xl p-5 space-y-3 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2">Price Details</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal ({items.length} item{items.length > 1 ? 's' : ''})</span>
                <span className="font-bold text-gray-800">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax (5%)</span>
                <span className="font-bold text-gray-800">{formatINR(tax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery Charges</span>
                <span className={`font-bold ${shipping === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                  {shipping === 0 ? 'FREE' : formatINR(shipping)}
                </span>
              </div>
              <div className="pt-3 mt-1 border-t border-dashed border-gray-200 flex justify-between items-center">
                <span className="font-bold text-gray-800">Total Amount</span>
                <span className="text-xl font-extrabold text-[#004aad]">{formatINR(total)}</span>
              </div>
            </section>

            {placeOrderError && (
              <p className="text-sm text-center text-red-600 font-bold p-3 bg-red-50 rounded-lg">
                {placeOrderError}
              </p>
            )}
          </>
        )}
      </main>

      {items.length > 0 && (
        <div className="fixed bottom-[80px] left-0 w-full max-w-md mx-auto right-0 bg-white/95 backdrop-blur-md p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] border-t border-gray-100 z-40">
          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder || !defaultAddress}
            className="w-full h-14 bg-[#004aad] text-white font-bold rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-blue-800 shadow-lg shadow-blue-900/20"
          >
            {isPlacingOrder ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Placing Order...
              </>
            ) : (
              <>
                Place Order <ArrowRight size={18} />
              </>
            )}
          </button>
          {!defaultAddress && (
            <p className="text-xs text-center text-amber-600 font-medium mt-2">
              Add a delivery address above to continue.
            </p>
          )}
        </div>
      )}

      <BottomNav active="services" />
    </div>
  );
}