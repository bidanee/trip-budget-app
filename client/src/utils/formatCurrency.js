export const formatCurrency = (amount, currency, rates) => {
  const localAmount = Number(amount).toLocaleString();
  if (currency === 'KRW' || !rates || !rates[currency] ){
    return `${localAmount} ${currency}`;
  }
  const krwAmount = Math.round(amount * rates[currency]).toLocaleString();
  return `${localAmount} ${currency} (= ${krwAmount} KRW)`;
};