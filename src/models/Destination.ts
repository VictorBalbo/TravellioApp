import type { Accommodation, Activity, Place } from ".";

export interface Destination {
  id: string;
  placeId: string;
  startDate: Date;
  endDate: Date;
  place: Place;
  notes?: string;
  accommodations?: Accommodation[];
  activities?: Activity[];
}
