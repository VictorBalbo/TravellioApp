import type { Place, Price } from ".";

export interface Transportation {
  id: string;
  price?: Price;
  arrivalDestinationId: string;
  arrival: Place;
  arrivalTime?: Date;
  departureDestinationId: string;
  departure: Place;
  departureTime: Date;
  legs: Leg[];
}

export interface Leg {
  id: string;
  departurePlaceId: string;
  departurePlace: Place;
  arrivalPlaceId: string;
  arrivalPlace: Place;
  path?: string;
  type: TransportTypes;
  departureTime?: Date;
  arrivalTime?: Date;
  price?: Price;
  company?: string;
  serviceNumber?: string;
  reservation?: string;
  seat?: string;
}

export enum TransportTypes {
  Bus = "Bus",
  Car = "Car",
  Plane = "Plane",
  Ship = "Ship",
  Train = "Train",
}
