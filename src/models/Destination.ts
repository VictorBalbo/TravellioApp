import type { Accommodation, Activity, Place } from ".";

export interface Destination {
  id: string;
  startDate: Date;
  endDate: Date;
  placeId: string;
  place: Place;
  accommodations?: Accommodation[];
  activities?: Activity[];
  notes?: string;
}
