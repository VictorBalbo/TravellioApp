import { OpeningHours } from "@/models";

export type PlaceOpenStatus = {
  isOpen: boolean;
  // When isOpen=true: when it closes. When isOpen=false: when it next opens.
  // null means open 24h (no close).
  nextChange: { day: number; time: string } | null;
};

function toWeekMinutes(day: number, time: string): number {
  const hours = parseInt(time.slice(0, 2), 10);
  const mins = parseInt(time.slice(2, 4), 10);
  return day * 24 * 60 + hours * 60 + mins;
}

export function getOpenStatus(openingHours: OpeningHours): PlaceOpenStatus {
  const now = new Date();
  const currentWeekMins = now.getDay() * 24 * 60 + now.getHours() * 60 + now.getMinutes();

  for (const period of openingHours.periods) {
    if (!period.close) return { isOpen: true, nextChange: null }; // open 24h

    const openMins = toWeekMinutes(period.open.day, period.open.time);
    const closeMins = toWeekMinutes(period.close.day, period.close.time);

    // closeMins < openMins means the period wraps past midnight into the next day
    const inPeriod =
      closeMins > openMins
        ? currentWeekMins >= openMins && currentWeekMins < closeMins
        : currentWeekMins >= openMins || currentWeekMins < closeMins;

    if (inPeriod) return { isOpen: true, nextChange: period.close };
  }

  // Closed — find the soonest upcoming open time, wrapping to next week if needed
  let minMinsUntilOpen = Infinity;
  let nextOpen: { day: number; time: string } | null = null;

  for (const period of openingHours.periods) {
    const openMins = toWeekMinutes(period.open.day, period.open.time);
    const minsUntilOpen =
      openMins > currentWeekMins
        ? openMins - currentWeekMins
        : openMins + 7 * 24 * 60 - currentWeekMins;

    if (minsUntilOpen < minMinsUntilOpen) {
      minMinsUntilOpen = minsUntilOpen;
      nextOpen = period.open;
    }
  }

  return { isOpen: false, nextChange: nextOpen };
}

export function isOpenNow(openingHours: OpeningHours): boolean {
  return getOpenStatus(openingHours).isOpen;
}
