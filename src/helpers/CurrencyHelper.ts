const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", // US Dollar
  EUR: "€", // Euro
  GBP: "£", // British Pound
  JPY: "¥", // Japanese Yen
  CNY: "¥", // Chinese Yuan
  KRW: "₩", // South Korean Won
  INR: "₹", // Indian Rupee
  BRL: "R$", // Brazilian Real
  CAD: "CA$", // Canadian Dollar
  AUD: "A$", // Australian Dollar
  CHF: "Fr", // Swiss Franc
  MXN: "MX$", // Mexican Peso
  SGD: "S$", // Singapore Dollar
  HKD: "HK$", // Hong Kong Dollar
  NOK: "kr", // Norwegian Krone
  SEK: "kr", // Swedish Krona
  DKK: "kr", // Danish Krone
  PLN: "zł", // Polish Złoty
  THB: "฿", // Thai Baht
  AED: "د.إ", // UAE Dirham
  SAR: "﷼", // Saudi Riyal
  ZAR: "R", // South African Rand
  TRY: "₺", // Turkish Lira
  RUB: "₽", // Russian Ruble
  ARG: "$", // Argentine Peso
};

export const getCurrencySymbol = (currencyCode: string): string =>
  CURRENCY_SYMBOLS[currencyCode.toUpperCase()] ?? currencyCode;
