import type { Place, Price } from ".";

export interface Activity {
  id: string;
  name: string;
  placeId: string;
  place: Place;
  scheduledAt?: Date;
  price?: Price;
  website?: string;
  notes?: string;
}
