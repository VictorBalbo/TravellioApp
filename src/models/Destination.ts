import type { Accommodation, Activity, Coordinates, Place } from ".";

export interface Destination {
  id?: string;
  placeId: string;
  name: string;
  coordinates: Coordinates;
  startDate: Date;
  endDate: Date;
  notes?: string;
  place?: Place;
  accommodationsCount?: number;
  accommodations?: Accommodation[];
  activitiesCount?: number;
  activities?: Activity[];
}
