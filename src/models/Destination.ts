import type { Accommodation, Activity, Coordinates } from ".";

export interface Destination {
  id?: string;
  placeId: string;
  name: string;
  coordinates: Coordinates;
  startDate: Date;
  endDate: Date;
  notes?: string;
  accommodationsCount?: number;
  accommodations?: Accommodation[];
  activitiesCount?: number;
  activities?: Activity[];
  tripId?: string;
}
