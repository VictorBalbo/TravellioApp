import type { Coordinates, Price } from ".";

export interface Accommodation {
  id?: string;
  name: string;
  placeId: string;
  coordinates: Coordinates;
  address?: string;
  checkIn?: Date;
  checkOut?: Date;
  imageUrl?: string;
  website?: string;
  notes?: string;
  price?: Price;
  destinationId?: string;
}
