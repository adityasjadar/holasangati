// Haversine distance in km between two lat/lng points. Returns null if any
// coordinate is missing — callers must NEVER invent a distance when this
// returns null (fall back to district/taluk/village text matching instead).
export function distanceKm(lat1, lon1, lat2, lon2) {
  if ([lat1, lon1, lat2, lon2].some((v) => v === null || v === undefined || Number.isNaN(v))) {
    return null;
  }
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(km, lang) {
  if (km === null || km === undefined) return null;
  const rounded = km < 10 ? km.toFixed(1) : Math.round(km);
  return lang === 'kn' ? `${rounded} ಕಿ.ಮೀ` : `${rounded} km`;
}
