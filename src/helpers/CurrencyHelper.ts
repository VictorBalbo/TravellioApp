import i18n from "@/i18n";

export interface CurrencyData {
  symbol: string;
  name: string;
}

export const CURRENCY_DATA: Record<string, CurrencyData> = {
  USD: { symbol: "$", name: "US Dollar" },
  EUR: { symbol: "€", name: "Euro" },
  GBP: { symbol: "£", name: "British Pound" },
  JPY: { symbol: "JP¥", name: "Japanese Yen" },
  CNY: { symbol: "CN¥", name: "Chinese Yuan" },
  BRL: { symbol: "R$", name: "Brazilian Real" },
  KRW: { symbol: "₩", name: "South Korean Won" },
  INR: { symbol: "₹", name: "Indian Rupee" },
  CAD: { symbol: "CA$", name: "Canadian Dollar" },
  AUD: { symbol: "A$", name: "Australian Dollar" },
  CHF: { symbol: "CHF", name: "Swiss Franc" },
  MXN: { symbol: "MX$", name: "Mexican Peso" },
  SGD: { symbol: "S$", name: "Singapore Dollar" },
  HKD: { symbol: "HK$", name: "Hong Kong Dollar" },
  NOK: { symbol: "NOK", name: "Norwegian Krone" },
  SEK: { symbol: "SEK", name: "Swedish Krona" },
  DKK: { symbol: "DKK", name: "Danish Krone" },
  PLN: { symbol: "zł", name: "Polish Złoty" },
  THB: { symbol: "฿", name: "Thai Baht" },
  AED: { symbol: "AED", name: "UAE Dirham" },
  SAR: { symbol: "SAR", name: "Saudi Riyal" },
  ZAR: { symbol: "ZAR", name: "South African Rand" },
  TRY: { symbol: "₺", name: "Turkish Lira" },
  RUB: { symbol: "₽", name: "Russian Ruble" },
  ARS: { symbol: "ARS $", name: "Argentine Peso" },
};

export const getCurrencySymbol = (currencyCode: string): string =>
  CURRENCY_DATA[currencyCode.toUpperCase()]?.symbol ?? currencyCode;

// `name` above is the English fallback; the actual localized display name
// lives in the `currencyNames.<code>` locale key so it can be translated.
export const getCurrencyName = (currencyCode: string): string => {
  const code = currencyCode.toUpperCase();
  return i18n.t(`currencyNames.${code}`, CURRENCY_DATA[code]?.name ?? code);
};
