/**
 * Haversine Formula
 * Calculates the great-circle distance between two points on Earth.
 * Returns distance in kilometres.
 *
 * @param {number} lat1  - Latitude of point 1 (degrees)
 * @param {number} lon1  - Longitude of point 1 (degrees)
 * @param {number} lat2  - Latitude of point 2 (degrees)
 * @param {number} lon2  - Longitude of point 2 (degrees)
 * @returns {number}     - Distance in km (rounded to 2 decimal places)
 */
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const EARTH_RADIUS_KM = 6371;

  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(EARTH_RADIUS_KM * c * 100) / 100;
};

module.exports = { haversineDistance };
