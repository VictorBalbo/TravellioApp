import type { Place, Price } from ".";

export interface Activity {
  id: string;
  name: string;
  placeId: string;
  place?: Place;
  type?: ActivityTypes;
  scheduledAt?: Date;
  price?: Price;
  website?: string;
  notes?: string;
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
