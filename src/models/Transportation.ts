import type { Coordinates, Destination, Price } from ".";

export interface Transportation {
  id?: string;
  price?: Price;
  legs: Leg[];
  arrivalDestinationId?: string;
  departureDestinationId?: string;
  departureTime?: Date;
  arrivalTime?: Date;
  arrival?: Destination;
  departure?: Destination;
}

export interface Leg {
  id?: string;
  departurePlaceId: string;
  departurePlaceShortName: string;
  departurePlaceDescription: string;
  departurePlaceCoordinates: Coordinates;
  arrivalPlaceId: string;
  arrivalPlaceShortName: string;
  arrivalPlaceDescription: string;
  arrivalPlaceCoordinates: Coordinates;
  type: TransportTypes;
  departureTime?: Date;
  arrivalTime?: Date;
  price?: Price;
  company?: string;
  serviceNumber?: string;
  reservation?: string;
  seat?: string;
  tripId?: string;
}

export enum TransportTypes {
  Bus = "Bus",
  Car = "Car",
  Plane = "Plane",
  Ship = "Ship",
  Train = "Train",
}
