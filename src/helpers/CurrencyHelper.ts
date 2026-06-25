const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", // US Dollar
  EUR: "€", // Euro
  GBP: "£", // British Pound
  JPY: "JP¥", // Japanese Yen
  CNY: "CN¥", // Chinese Yuan
  KRW: "₩", // South Korean Won
  INR: "₹", // Indian Rupee
  BRL: "R$", // Brazilian Real
  CAD: "CA$", // Canadian Dollar
  AUD: "A$", // Australian Dollar
  CHF: "CHF",
  MXN: "MX$", // Mexican Peso
  SGD: "S$", // Singapore Dollar
  HKD: "HK$", // Hong Kong Dollar
  NOK: "NOK", // Norwegian Krone
  SEK: "SEK", // Swedish Krona
  DKK: "DKK", // Danish Krone
  PLN: "zł", // Polish Złoty
  THB: "฿", // Thai Baht
  AED: "AED", // UAE Dirham
  SAR: "SAR", // Saudi Riyal
  ZAR: "ZAR", // South African Rand
  TRY: "₺", // Turkish Lira
  RUB: "₽", // Russian Ruble
  ARS: "ARS $", // Argentine Peso
};

export const getCurrencySymbol = (currencyCode: string): string =>
  CURRENCY_SYMBOLS[currencyCode.toUpperCase()] ?? currencyCode;
