export interface Currency {
  code: string;       // ISO 3-letter code, e.g., USD
  name: string;       // Full name, e.g., United States Dollar
  symbol: string;     // Currency symbol, e.g., $
  countryCode: string; // ISO 2-letter country code for flags, e.g., US
}

export interface ConversionResult {
  fromCurrency: Currency;
  toCurrency: Currency;
  amount: number;
  convertedAmount: number;
  rate: number;
  reverseRate: number;
  lastUpdated: string; // Date string or formatted timestamp
}

export interface FrankfurterRatesResponse {
  amount: number;
  base: string;
  date: string;
  rates: { [key: string]: number };
}

export interface FrankfurterCurrenciesResponse {
  [key: string]: string;
}
