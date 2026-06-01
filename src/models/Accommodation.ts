import type { Place, Price } from ".";

export interface Accommodation {
  id: string;
  name: string;
  placeId: string;
  place?: Place;
  checkIn?: Date;
  checkOut?: Date;
  imageUrl?: string;
  website?: string;
  notes?: string;
  price: Price;
}
