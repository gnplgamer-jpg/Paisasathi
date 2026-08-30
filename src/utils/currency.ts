export const USD_TO_NPR = 133.50;

export function formatCurrency(amount: number, currency: 'NPR' | 'USD'): string {
  const value = currency === 'USD' ? amount / USD_TO_NPR : amount;
  
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: currency === 'USD' ? 2 : 0,
    minimumFractionDigits: currency === 'USD' ? 2 : 0,
  }).format(value);
}
