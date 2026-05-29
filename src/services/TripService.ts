export class TripService {
  static getPhotoForPlace = (keys?: string[]) => {
    if (keys?.length)
      return `https://itin-dev.sfo2.cdn.digitaloceanspaces.com/freeImageSmall/${keys[0]}`;
    else return "";
  };
  static getMediumPhotoForPlace = (keys?: string[]) => {
    if (keys?.length)
      return `https://itin-dev.sfo2.cdn.digitaloceanspaces.com/freeImageMedium/${keys[0]} 1200w`;
  };
}
