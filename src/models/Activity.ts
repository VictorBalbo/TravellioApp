import type { Place, Price } from ".";

export interface Activity {
  id: string;
  placeId: string;
  place: Place;
  dateTime?: Date;
  price?: Price;
  website?: string;
  notes?: string;
}
