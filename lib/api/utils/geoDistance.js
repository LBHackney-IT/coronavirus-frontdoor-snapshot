/**
 * GeoDistance between two geographical points, in Miles.
 *
 * @param {*} lat1 latitude for point 1
 * @param {*} lon1 longitude for point 1
 * @param {*} lat2 latitude for point 2
 * @param {*} lon2 longitude for point 2
 */
export default function geoDistance(lat1, lon1, lat2, lon2) {
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  return dist.toFixed(2);
}

// copied from the internet
