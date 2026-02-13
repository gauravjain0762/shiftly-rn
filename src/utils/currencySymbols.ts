export const getCurrencySymbol = (currencyCode: string): string => {
  if (!currencyCode) return '';

  const code = currencyCode.toUpperCase();
  const symbols: {[key: string]: string} = {
    // North America
    USD: '$',
    CAD: 'CA$',
    MXN: 'MX$',

    // Europe
    EUR: '€',
    GBP: '£',
    CHF: 'CHF',
    SEK: 'kr',
    NOK: 'kr',
    DKK: 'kr',
    RUB: '₽',
    TRY: '₺',
    PLN: 'zł',

    // Asia
    JPY: '¥',
    CNY: '¥',
    INR: '₹',
    KRW: '₩',
    SGD: 'S$',
    HKD: 'HK$',
    MYR: 'RM',
    THB: '฿',
    IDR: 'Rp',
    PHP: '₱',
    VND: '₫',
    TWD: 'NT$',
    PKR: 'Rs',
    LKR: 'Rs',
    BDT: '৳',

    // Middle East
    AED: 'د.إ',
    SAR: '﷼',
    QAR: 'QAR',
    KWD: 'KD',
    OMR: 'OMR',
    BHD: 'BD',
    JOD: 'JD',
    ILS: '₪',

    // Oceania
    AUD: 'A$',
    NZD: 'NZ$',

    // South America
    BRL: 'R$',
    ARS: 'ARS$',
    CLP: 'CLP$',
    COP: 'COP$',
    PEN: 'S/',

    // Africa
    ZAR: 'R',
    EGP: 'E£',
    NGN: '₦',
    KES: 'KSh',
    GHS: 'GH₵',
    MAD: 'DH',
  };

  return symbols[code] || code;
};
