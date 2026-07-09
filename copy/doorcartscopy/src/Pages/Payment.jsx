import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Lock, CreditCard, Wallet, QrCode,
  Landmark, ShieldAlert, Loader2, CheckCircle2,
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/authContext';
import * as paymentService from '../api/paymentService';

// Load Razorpay Script (skips re-injecting the <script> tag if it's already
// present - e.g. if the user backs out and retries payment without a full
// page reload).
const loadRazorpaySDK = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const UPI_APPS = [
  { label: 'Google Pay', icon: Wallet, color: '#4285F4' },
  { label: 'PhonePe', icon: Wallet, color: '#6739B7' },
  { label: 'Paytm', icon: QrCode, color: '#00BAF2' },
];

const OTHER_METHODS = [
  { label: 'Credit / Debit Cards', icon: CreditCard },
  { label: 'Net Banking', icon: Landmark },
];

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState('Google Pay'); // Default selection
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Cart.jsx creates the internal Order first (POST /api/orders) and hands
  // off its id + total here - Payment only ever pays for an order that
  // already exists server-side, it never invents amounts client-side.
  const { orderId, totalAmount = 0 } = location.state || {};

  // No order to pay for - bounce back to the cart rather than rendering a
  // payment screen for a nonexistent/₹0 order.
  useEffect(() => {
    if (!orderId) {
      navigate('/cart', { replace: true });
    }
  }, [orderId, navigate]);

  const handlePayNow = async () => {
    setStatus('processing');
    setErrorMessage('');

    const sdkReady = await loadRazorpaySDK();
    if (!sdkReady) {
      setErrorMessage('Razorpay SDK failed to load. Check your connection and try again.');
      setStatus('idle');
      return;
    }

    try {
      // Step 1: ask the backend to open a Razorpay order against the
      // internal Order that Cart.jsx already created (POST /api/orders).
      // paymentService uses the shared axios instance (api/axiosConfig.js),
      // so auth is handled the same way as every other request in the app.
      const { razorpayOrderId, amount, currency, keyId } = await paymentService.createRazorpayOrder(orderId);

      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount.toString(),
        currency: currency || 'INR',
        name: 'Doorcarts',
        description: 'Payment for Materials',
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            // Step 2: verify the payment signature server-side and mark
            // the internal Order as paid.
            const order = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            });
            setStatus('success');
            setTimeout(() => navigate('/order-success', { state: { orderId: order._id } }), 1000);
          } catch (err) {
            console.error('Payment verification failed', err);
            setErrorMessage(
              err.response?.data?.message ||
                'Payment verification failed. If an amount was deducted, it will be refunded.'
            );
            setStatus('idle');
          }
        },
        prefill: {
          name: user?.name || '',
          contact: user?.phone || '',
        },
        theme: { color: '#004aad' },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on('payment.failed', function (response) {
        setErrorMessage(`Payment failed: ${response.error.description}`);
        setStatus('idle');
      });
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || 'Could not initiate payment. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto min-h-[100dvh] bg-[#f9f9fc] font-sans pb-44">
      {/* Top App Bar */}
      <header className="w-full sticky top-0 z-50 shadow-md bg-[#004aad] flex justify-between items-center px-4 h-16">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white p-2 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-extrabold text-white">Doorcarts</h1>
        </div>
        <div className="flex items-center gap-1.5 text-white bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
          <Lock size={14} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Secure</span>
        </div>
      </header>

      <main className="w-full px-5 mt-6">
        {/* Payable Amount Banner */}
        <section className={`rounded-[24px] p-6 mb-8 text-white shadow-lg transition-all duration-300 ${status === 'success' ? 'bg-green-600 ring-4 ring-green-400/50' : 'bg-[#004aad]'}`}>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Total Amount Payable</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold">₹{totalAmount.toLocaleString('en-IN')}</span>
            <span className="text-sm opacity-90 font-medium bg-white/20 px-2 py-0.5 rounded">Inc. GST</span>
          </div>
        </section>

        {/* UPI Options */}
        <section className="mb-6">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">UPI Apps</h2>
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
            {UPI_APPS.map((app) => {
              const Icon = app.icon;
              const isActive = selectedMethod === app.label;
              return (
                <div key={app.label} className="border-b border-gray-50 last:border-0">
                  <button
                    onClick={() => setSelectedMethod(app.label)}
                    className={`w-full flex items-center gap-4 p-4 transition-colors ${isActive ? 'bg-[#f8fbff]' : 'hover:bg-gray-50'}`}
                  >
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" 
                      style={{ backgroundColor: `${app.color}15`, color: app.color }}
                    >
                      <Icon size={22} />
                    </div>
                    <span className={`font-bold text-left flex-1 text-lg ${isActive ? 'text-[#004aad]' : 'text-gray-700'}`}>
                      {app.label}
                    </span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isActive ? 'border-[#004aad]' : 'border-gray-300'}`}>
                      {isActive && <div className="w-3 h-3 bg-[#004aad] rounded-full" />}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Other Methods */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">More Methods</h2>
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
            {OTHER_METHODS.map((method) => {
              const Icon = method.icon;
              const isActive = selectedMethod === method.label;
              return (
                <div key={method.label} className="border-b border-gray-50 last:border-0">
                  <button
                    onClick={() => setSelectedMethod(method.label)}
                    className={`w-full flex items-center gap-4 p-4 transition-colors ${isActive ? 'bg-[#f8fbff]' : 'hover:bg-gray-50'}`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center flex-shrink-0">
                      <Icon size={22} />
                    </div>
                    <span className={`font-bold text-left flex-1 text-lg ${isActive ? 'text-[#004aad]' : 'text-gray-700'}`}>
                      {method.label}
                    </span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isActive ? 'border-[#004aad]' : 'border-gray-300'}`}>
                      {isActive && <div className="w-3 h-3 bg-[#004aad] rounded-full" />}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Security Alert Banner */}
        <section className="bg-[#fffdf5] border border-[#ffecb3] p-5 rounded-[24px] flex items-start gap-4 text-sm text-[#856404] mb-4 shadow-sm">
          <ShieldAlert size={24} className="flex-shrink-0 mt-0.5 text-[#d39e00]" />
          <p className="leading-relaxed font-medium">For your security, Doorcarts will <span className="font-bold underline">never</span> call you asking for your OTP, UPI PIN, or bank details.</p>
        </section>

        {errorMessage && (
          <p role="alert" className="text-sm text-center text-red-600 font-bold p-3 bg-red-50 rounded-lg mb-4">
            {errorMessage}
          </p>
        )}

      </main>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-[72px] left-0 w-full max-w-md mx-auto right-0 bg-white/95 backdrop-blur-md shadow-[0_-10px_20px_rgba(0,0,0,0.05)] border-t border-gray-100 px-5 py-4 z-40">
        <div className="flex items-center gap-4">
          <div className="flex flex-col min-w-[100px]">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">To be paid</span>
            <span className="text-xl font-extrabold text-[#004aad]">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <button
            onClick={handlePayNow}
            disabled={status !== 'idle'}
            className={`flex-1 h-14 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg ${
              status === 'success' 
                ? 'bg-green-600 text-white shadow-green-900/20' 
                : 'bg-[#004aad] text-white shadow-blue-900/20 hover:bg-blue-800'
            } disabled:opacity-80`}
          >
            {status === 'idle' && (<><Lock size={18} /> Proceed via {selectedMethod}</>)}
            {status === 'processing' && (<><Loader2 size={18} className="animate-spin" /> Authorizing...</>)}
            {status === 'success' && (<><CheckCircle2 size={18} /> Payment Secured!</>)}
          </button>
        </div>
      </div>

      <BottomNav active="bookings" />
    </div>
  );
}