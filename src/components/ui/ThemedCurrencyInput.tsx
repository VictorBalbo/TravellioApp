import { baseStyle } from "@/constants";
import { CardView } from "./CardView";
import { ThemedInput } from "./ThemedInput";
import { PickerItemProps, ThemedPicker } from "./ThemedPicker";
import { ThemedView } from "./ThemedView";

const currencyOptions: PickerItemProps[] = [
  { label: "BRL", value: "BRL" },
  { label: "USD", value: "USD" },
];

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
  const handleAmountChange = (text: string) => {
    const digits = text.replace(/\D/g, "");
    if (!digits) {
      onAmountChange("");
      return;
    }
    onAmountChange((parseInt(digits, 10) / 100).toFixed(2));
  };

  const displayAmount = amount ? (parseInt(amount.replace(/\D/g, ""), 10) / 100).toFixed(2) : amount;

  const content = (
    <ThemedView style={baseStyle.inlineSectionGap}>
      <ThemedView style={{ flex: 1 }}>
        <ThemedPicker
          icon="money"
          label={currencyLabel}
          options={currencyOptions}
          value={currency}
          onValueChange={onCurrencyChange}
        />
      </ThemedView>
      <ThemedView style={{ flex: 2 }}>
        <ThemedInput
          label={amountLabel}
          value={displayAmount}
          onChangeText={handleAmountChange}
          keyboardType="decimal-pad"
          placeholder="0.00"
        />
      </ThemedView>
    </ThemedView>
  );

  if (cardContainer) return <CardView>{content}</CardView>;
  return content;
}
