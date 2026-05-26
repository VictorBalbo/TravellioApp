import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const utcDate = (date: Date) => dayjs(date);

export const displayDate = (date: Date, format: string) =>
  dayjs(date).format(format);

export const isSameDay = (date1?: Date, date2?: Date) =>
  date1 && date2 && utcDate(date1).isSame(utcDate(date2), "day");

export const dateDiff = (
  date1: Date,
  date2: Date,
  unit: dayjs.QUnitType = "days",
) => utcDate(date1).diff(utcDate(date2), unit);
