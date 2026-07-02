import { HeroView } from "@/components";
import {
  ButtonType,
  CardView,
  HorizontalDivider,
  IconCaptionText,
  TextType,
  ThemedButton,
  ThemedCurrencyInput,
  ThemedDatePicker,
  ThemedInput,
  ThemedText,
  ThemedView,
} from "@/components/ui";
import { baseStyle } from "@/constants";
import { utcDate } from "@/helpers";
import { useTripContext } from "@/hooks/useTrip";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

export default function AddAccommodation() {
  const { t } = useTranslation();
  const { destinationId } = useLocalSearchParams();
  const { destinations } = useTripContext();
  const destination = useMemo(() => destinations?.find((d) => d.id === destinationId), [destinationId, destinations]);

  const [name, setName] = useState("");
  const [checkInDate, setCheckInDate] = useState<Date>(() => utcDate(destination?.startDate).toDate());
  const [checkOutDate, setCheckOutDate] = useState(() => utcDate(destination?.endDate).toDate());
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [priceValue, setPriceValue] = useState("");
  const [priceCurrency, setPriceCurrency] = useState("USD");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    // TODO: wire to trip context
  };

  return (
    <HeroView headerImageAsset={require("@/assets/images/placeholders/newAccommodation.png")}>
      <ThemedView style={baseStyle.viewHeader}>
        <ThemedText type={TextType.Display}>{t("newAccommodation")}</ThemedText>
      </ThemedView>

      <ThemedView style={baseStyle.viewBody}>
        <ThemedInput
          icon="building"
          label={t("newAccommodation")}
          value={name}
          onChangeText={setName}
          placeholder={t("accommodation")}
          cardContainer
        />

        <ThemedView style={baseStyle.titleSectionGap}>
          <IconCaptionText text={t("yourTrip")} icon="pin" textType={TextType.Title} />
          <CardView style={baseStyle.smallGap}>
            <ThemedDatePicker
              icon="personArrive"
              label={t("checkIn")}
              selection={checkInDate}
              onDateChange={setCheckInDate}
            />
            <HorizontalDivider />
            <ThemedDatePicker
              icon="personDeparture"
              label={t("checkOut")}
              selection={checkOutDate}
              onDateChange={setCheckOutDate}
            />
            <HorizontalDivider />
            <ThemedInput
              icon="map"
              label={t("address")}
              value={address}
              onChangeText={setAddress}
              placeholder={t("address")}
            />
            <HorizontalDivider />
            <ThemedCurrencyInput
              amount={priceValue}
              onAmountChange={setPriceValue}
              amountLabel={t("price")}
              currency={priceCurrency}
              onCurrencyChange={setPriceCurrency}
              currencyLabel={t("currency")}
            />
          </CardView>
        </ThemedView>

        <ThemedView style={baseStyle.titleSectionGap}>
          <IconCaptionText icon="globe" text={t("website")} textType={TextType.Title} />
          <ThemedInput
            icon="globe"
            value={website}
            onChangeText={setWebsite}
            placeholder="https://"
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
            cardContainer
          />
        </ThemedView>

        <ThemedView style={baseStyle.titleSectionGap}>
          <IconCaptionText icon="book" text={t("notes")} textType={TextType.Title} />
          <ThemedInput
            value={notes}
            onChangeText={setNotes}
            placeholder={t("notes")}
            multiline
            textAlignVertical="top"
            cardContainer
            style={styles.notesInput}
          />
        </ThemedView>

        <ThemedButton title={t("save")} type={ButtonType.Primary} onPress={handleSave} />
      </ThemedView>
    </HeroView>
  );
}

const styles = StyleSheet.create({
  notesInput: {
    minHeight: 80,
  },
});
