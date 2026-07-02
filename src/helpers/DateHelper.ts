import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getLocales } from "expo-localization";

dayjs.extend(utc);

const locales = getLocales();
const deviceLanguage = locales[0].languageCode ?? "en";

export const utcDate = (date?: Date) => dayjs(date);

export const displayDate = (date: Date, format: string, locale?: string) =>
  dayjs(date)
    .utc()
    .locale(deviceLanguage)
    .format(format)
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const isSameDay = (date1?: Date, date2?: Date) => date1 && date2 && utcDate(date1).isSame(utcDate(date2), "day");

export const dateDiff = (date1: Date, date2: Date, unit: dayjs.QUnitType = "days") =>
  utcDate(date1).diff(utcDate(date2), unit);

export const formatDuration = (totalMinutes: number) => {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};
