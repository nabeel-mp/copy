import { useState, useEffect } from 'react';
import {
  Menu, Search, Banknote, PlusCircle, CheckCircle2, Clock,
  Wallet as WalletIcon, ArrowDownToLine, X, Loader2,
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import WalletSkeleton from '../components/WalletSkeleton';
import * as walletService from '../api/walletService';

const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const STATUS_STYLE = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-orange-100 text-orange-700',
  failed: 'bg-red-100 text-red-700',
};

// Only 'topup' and 'withdrawal' reasons are ever created by the backend
// today (see Backend/src/controllers/walletController.js). Any other reason
// string still renders sensibly via the default fallback below.
const REASON_UI = {
  topup: { label: 'Wallet Top-up', icon: PlusCircle, iconBg: '#d9e2ff', iconColor: '#004aad' },
  withdrawal: { label: 'Withdrawal', icon: ArrowDownToLine, iconBg: '#ffdad6', iconColor: '#ba1a1a' },
  default: { label: 'Transaction', icon: WalletIcon, iconBg: '#dfe0e0', iconColor: '#5d5f5f' },
};

function AmountModal({ title, onConfirm, onClose, isSubmitting, error }) {
  const [amount, setAmount] = useState('');
  const numericAmount = Number(amount);
  const isValid = numericAmount > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={isSubmitting ? undefined : onClose} />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} disabled={isSubmitting} aria-label="Close" className="text-gray-400 hover:text-gray-600 disabled:opacity-40">
            <X size={20} />
          </button>
        </div>

        <label htmlFor="wallet-amount" className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
          Amount (₹)
        </label>
        <input
          id="wallet-amount"
          type="number"
          min="1"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-lg font-bold text-gray-800 focus:outline-none focus:border-[#004aad] mb-4"
        />

        {error && <p className="text-sm text-red-600 font-semibold mb-4">{error}</p>}

        <button
          onClick={() => isValid && onConfirm(numericAmount)}
          disabled={!isValid || isSubmitting}
          className="w-full h-14 bg-[#004aad] text-white font-bold rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : `Confirm ${title}`}
        </button>
      </div>
    </div>
  );
}

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeModal, setActiveModal] = useState(null); // 'topup' | 'withdraw' | null
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');

  const loadWallet = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await walletService.getWallet();
      setWallet(data);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Could not load your wallet.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  const transactions = wallet?.transactions || [];

  // Stats derived directly from real transaction data - nothing invented.
  const totalCredited = transactions
    .filter((t) => t.type === 'credit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalDebited = transactions
    .filter((t) => t.type === 'debit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingTotal = transactions
    .filter((t) => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleAction = async (amount) => {
    setIsSubmitting(true);
    setActionError('');
    try {
      const updated = activeModal === 'topup'
        ? await walletService.topUpWallet(amount)
        : await walletService.withdrawFromWallet(amount);
      setWallet(updated);
      setActiveModal(null);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto min-h-[100dvh] bg-[#f9f9fc] font-sans pb-28">
      <header className="w-full sticky top-0 bg-[#004aad] text-white shadow-md flex justify-between items-center px-6 h-16 z-50">
        <div className="flex items-center gap-3">
          <button aria-label="Open menu" className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-extrabold">Doorcarts</h1>
        </div>
        <button aria-label="Search" className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <Search size={20} />
        </button>
      </header>

      {isLoading ? (
        <div className="mt-2">
          <WalletSkeleton />
        </div>
      ) : errorMessage ? (
        <div className="max-w-md mx-auto px-4 mt-8">
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
            <p className="text-red-500 font-bold mb-3">{errorMessage}</p>
            <button onClick={loadWallet} className="text-[#004aad] font-bold underline">Try Again</button>
          </div>
        </div>
      ) : (
        <main className="max-w-md mx-auto px-4 relative">
          {/* Hero Balance */}
          <section className="mt-5 bg-[#004aad] rounded-3xl p-6 text-white shadow-xl overflow-hidden relative">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <p className="text-xs opacity-80 mb-1">Available Balance</p>
              <h2 className="text-3xl font-extrabold mb-8">{formatINR(wallet?.balance)}</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveModal('withdraw')}
                  className="flex-1 bg-white text-[#004aad] font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <Banknote size={18} />
                  Withdraw
                </button>
                <button
                  onClick={() => setActiveModal('topup')}
                  className="flex-1 bg-white/10 border border-white/20 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <PlusCircle size={18} />
                  Add Money
                </button>
              </div>
            </div>
          </section>

          {/* Summary (derived from real transactions only) */}
          <section className="mt-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3 px-1">Summary</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#d9e2ff] rounded-3xl p-4">
                <p className="text-[10px] font-semibold text-[#004aad]/70 uppercase tracking-wider mb-1">Total Credited</p>
                <p className="font-bold text-[#004aad]">{formatINR(totalCredited)}</p>
              </div>
              <div className="bg-gray-100 rounded-3xl p-4">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Debited</p>
                <p className="font-bold text-gray-800">{formatINR(totalDebited)}</p>
              </div>
              {pendingTotal > 0 && (
                <div className="col-span-2 bg-orange-50 rounded-3xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-orange-600 flex-shrink-0">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-orange-600/70 uppercase tracking-wider">Pending</p>
                    <p className="font-bold text-sm text-orange-700">{formatINR(pendingTotal)}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Transactions */}
          <section className="mt-8 pb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3 px-1">Transactions</h3>
            {transactions.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#004aad]">
                  <WalletIcon size={28} />
                </div>
                <p className="font-bold text-gray-700">No transactions yet</p>
                <p className="text-sm text-gray-500 mt-1">Top up your wallet or complete an order to see activity here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => {
                  const ui = REASON_UI[tx.reason] || REASON_UI.default;
                  const Icon = ui.icon;
                  const isCredit = tx.type === 'credit';
                  const date = tx.createdAt
                    ? new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '';

                  return (
                    <div key={tx._id} className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: ui.iconBg, color: ui.iconColor }}
                        >
                          <Icon size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-800 truncate">{tx.description || ui.label}</p>
                          <p className="text-xs text-gray-500 truncate">{date}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className={`font-bold ${isCredit ? 'text-[#004aad]' : 'text-gray-800'}`}>
                          {isCredit ? '+' : '-'}{formatINR(tx.amount)}
                        </p>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${STATUS_STYLE[tx.status] || STATUS_STYLE.completed}`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      )}

      {activeModal && (
        <AmountModal
          title={activeModal === 'topup' ? 'Add Money' : 'Withdraw'}
          onConfirm={handleAction}
          onClose={() => { setActiveModal(null); setActionError(''); }}
          isSubmitting={isSubmitting}
          error={actionError}
        />
      )}

      <BottomNav active="account" />
    </div>
  );
}