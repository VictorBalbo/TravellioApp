import type { Coordinates, Price } from ".";

export interface Activity {
  id?: string;
  name: string;
  placeId: string;
  coordinates: Coordinates;
  address?: string;
  scheduledAt?: Date;
  ticketRequired?: boolean;
  ticketPurchased?: boolean;
  price?: Price;
  website?: string;
  notes?: string;
  type?: ActivityTypes;
  destinationId?: string;
}

export enum ActivityTypes {
  Restaurant,
  Coffee,
  Nightlife,
  Bakery,
  Museum,
  Nature,
  Beach,
  Shopping,
  Tour,
  Activity,
  PhotoSpot,
  Wellness,
}
