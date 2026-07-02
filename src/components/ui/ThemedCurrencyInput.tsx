import { baseStyle, spacing } from "@/constants";
import { CURRENCY_DATA, getCurrencyName, getCurrencySymbol } from "@/helpers/CurrencyHelper";
import { useThemeColor } from "@/hooks";
import { CardView } from "./CardView";
import { Icon } from "./Icon";
import { ThemedInput } from "./ThemedInput";
import { PickerItemProps, ThemedPicker } from "./ThemedPicker";
import { ThemedView } from "./ThemedView";

const currencyOptions: PickerItemProps[] = Object.entries(CURRENCY_DATA).map(([code, data]) => ({
  label: `${getCurrencyName(code)}`,
  value: code,
}));

export type ThemedCurrencyInputProps = {
  amount: string;
  onAmountChange: (amount: string) => void;
  amountLabel?: string;
  currency: string;
  onCurrencyChange: (currency: string) => void;
  currencyLabel?: string;
  cardContainer?: boolean;
};

export function ThemedCurrencyInput({
  amount,
  onAmountChange,
  amountLabel,
  currency,
  onCurrencyChange,
  currencyLabel,
  cardContainer = false,
}: ThemedCurrencyInputProps) {
  const captionColor = useThemeColor("caption");
  const borderColor = useThemeColor("border");
  const handleAmountChange = (text: string) => {
    const digits = text.replace(/\D/g, "");
    if (!digits) {
      onAmountChange("");
      return;
    }
    onAmountChange((parseInt(digits, 10) / 100).toFixed(2));
  };

  const currencySymbol = getCurrencySymbol(currency);
  const displayAmount = amount
    ? `${currencySymbol} ${(parseInt(amount.replace(/\D/g, ""), 10) / 100).toFixed(2)}`
    : amount;

  const content = (
    <ThemedView style={baseStyle.inlineSectionGap}>
      <Icon name="money" color={captionColor} />
      <ThemedPicker label={currencyLabel} options={currencyOptions} value={currency} onValueChange={onCurrencyChange} />
      <ThemedView
        style={{ flex: 1, minWidth: "20%", borderLeftWidth: 1, borderColor: borderColor, paddingLeft: spacing.small }}
      >
        <ThemedInput
          label={amountLabel}
          value={displayAmount}
          onChangeText={handleAmountChange}
          keyboardType="decimal-pad"
          placeholder={`${currencySymbol} 0.00`}
        />
      </ThemedView>
    </ThemedView>
  );

  if (cardContainer) return <CardView>{content}</CardView>;
  return content;
}
