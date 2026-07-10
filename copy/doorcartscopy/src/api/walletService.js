import api from './axiosConfig';

// GET /api/wallet
export const getWallet = async () => {
  const { data } = await api.get('/wallet');
  return data.data.wallet;
};

// POST /api/wallet/topup  { amount }
export const topUpWallet = async (amount) => {
  const { data } = await api.post('/wallet/topup', { amount });
  return data.data.wallet;
};

// POST /api/wallet/withdraw  { amount }
export const withdrawFromWallet = async (amount) => {
  const { data } = await api.post('/wallet/withdraw', { amount });
  return data.data.wallet;
};