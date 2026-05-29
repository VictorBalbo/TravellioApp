import type { Place, Price } from ".";

export interface Transportation {
  id: string;
  originId: string;
  origin: Place;
  destinationId: string;
  destination: Place;
  price?: Price;
  segments: TransportationSegment[];
}

export interface TransportationSegment {
  id: string;
  originTerminalPlaceId: string;
  originTerminal: Place;
  destinationTerminalPlaceId: string;
  destinationTerminal: Place;
  path: string;
  type: TransportTypes;
  startDate?: Date;
  endDate?: Date;
  price?: Price;
  company?: string;
  transportIdentification?: string;
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
