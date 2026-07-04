export interface CurrencyMeta {
  symbol: string;
  countryCode: string; // Lowercase ISO 2-letter country code
}

export const CURRENCY_METADATA_MAP: { [key: string]: CurrencyMeta } = {
  USD: { symbol: '$', countryCode: 'us' },
  EUR: { symbol: '€', countryCode: 'eu' },
  GBP: { symbol: '£', countryCode: 'gb' },
  INR: { symbol: '₹', countryCode: 'in' },
  AUD: { symbol: '$', countryCode: 'au' },
  CAD: { symbol: '$', countryCode: 'ca' },
  JPY: { symbol: '¥', countryCode: 'jp' },
  CNY: { symbol: '¥', countryCode: 'cn' },
  CHF: { symbol: 'CHF', countryCode: 'ch' },
  NZD: { symbol: '$', countryCode: 'nz' },
  SEK: { symbol: 'kr', countryCode: 'se' },
  NOK: { symbol: 'kr', countryCode: 'no' },
  DKK: { symbol: 'kr', countryCode: 'dk' },
  SGD: { symbol: '$', countryCode: 'sg' },
  HKD: { symbol: '$', countryCode: 'hk' },
  KRW: { symbol: '₩', countryCode: 'kr' },
  TRY: { symbol: '₺', countryCode: 'tr' },
  RUB: { symbol: '₽', countryCode: 'ru' },
  BRL: { symbol: 'R$', countryCode: 'br' },
  ZAR: { symbol: 'R', countryCode: 'za' },
  MXN: { symbol: '$', countryCode: 'mx' },
  ILS: { symbol: '₪', countryCode: 'il' },
  PHP: { symbol: '₱', countryCode: 'ph' },
  PLN: { symbol: 'zł', countryCode: 'pl' },
  THB: { symbol: '฿', countryCode: 'th' },
  MYR: { symbol: 'RM', countryCode: 'my' },
  HUF: { symbol: 'Ft', countryCode: 'hu' },
  CZK: { symbol: 'Kč', countryCode: 'cz' },
  ISK: { symbol: 'kr', countryCode: 'is' },
  IDR: { symbol: 'Rp', countryCode: 'id' },
  RON: { symbol: 'lei', countryCode: 'ro' },
  BGN: { symbol: 'лв', countryCode: 'bg' },
  HRK: { symbol: 'kn', countryCode: 'hr' }
};

/**
 * Returns currency symbol, defaulting to code if not found
 */
export function getCurrencySymbol(code: string): string {
  return CURRENCY_METADATA_MAP[code]?.symbol || code;
}

/**
 * Returns country code for flag, defaulting to lowercase of first two letters of currency code
 */
export function getCountryCode(code: string): string {
  return CURRENCY_METADATA_MAP[code]?.countryCode || code.substring(0, 2).toLowerCase();
}
