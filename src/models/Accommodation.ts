import type { Place, Price } from ".";

export interface Accommodation {
  id: string;
  name: string;
  placeId: string;
  place: Place;
  imageUrl?: string;
  checkin?: Date;
  checkout?: Date;
  website?: string;
  notes?: string;
  price: Price;
}
