import { Destination, Transportation } from ".";

export interface Trip {
  id?: string;
  name: string;
  startDate: Date;
  endDate: Date;
  homePlaceId?: string;
  destinations?: Destination[];
  transportations?: Transportation[];
}
