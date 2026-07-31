export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getExpiryStatus = (expiryDate) => {
  if (!expiryDate) return { label: 'Unknown', color: 'text-slate-400 bg-slate-900 border-slate-800' };
  const diffDays = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) {
    return { label: 'Expired', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
  } else if (diffDays <= 60) {
    return { label: `Near Expiry (${diffDays}d)`, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
  } else {
    return { label: 'Valid Stock', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
  }
};
