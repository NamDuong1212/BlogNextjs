export const formatCurrency = (
  amount: number,
  currencyCode: string = 'USD',
  locale: string = 'en-US'
): string => {
  // Handle invalid inputs
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '-';
  }

  try {
    // Special handling for currencies with specific formatting needs
    switch (currencyCode) {
      case 'VND':
        // Vietnamese Dong typically shows no decimal places and uses dot for thousands separator
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount);
        
      case 'JPY':
        // Japanese Yen typically shows no decimal places
        return new Intl.NumberFormat('ja-JP', {
          style: 'currency',
          currency: 'JPY',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount);
        
      case 'CNY':
        // Chinese Yuan with appropriate formatting
        return new Intl.NumberFormat('zh-CN', {
          style: 'currency',
          currency: 'CNY',
          minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
          maximumFractionDigits: 2,
        }).format(amount);
        
      default:
        // Default handling for USD, EUR, GBP, AUD, CAD, CHF
        const localeMap: Record<string, string> = {
          'USD': 'en-US',
          'EUR': 'de-DE',
          'GBP': 'en-GB',
          'AUD': 'en-AU',
          'CAD': 'en-CA',
          'CHF': 'de-CH',
        };
        
        // Use currency-specific locale if available, otherwise use provided locale
        const effectiveLocale = localeMap[currencyCode] || locale;
        
        return new Intl.NumberFormat(effectiveLocale, {
          style: 'currency',
          currency: currencyCode,
          minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
          maximumFractionDigits: 2,
        }).format(amount);
    }
  } catch (error) {
    // Fallback in case of invalid currency code or other errors
    console.error(`Error formatting currency: ${error}`);
    
    // Provide appropriate fallback formatting for specific currencies
    if (currencyCode === 'VND') {
      return `${amount.toLocaleString('vi-VN', {maximumFractionDigits: 0})} ₫`;
    } else if (currencyCode === 'JPY') {
      return `¥${amount.toLocaleString('ja-JP', {maximumFractionDigits: 0})}`;
    } else {
      return `${amount.toFixed(2)} ${currencyCode}`;
    }
  }
};