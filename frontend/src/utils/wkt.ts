export function parsePolygonWkt(wkt: string): [number, number][] {
  const cleaned = wkt
    .replace("POLYGON((", "")
    .replace("))", "")
    .trim();

  return cleaned.split(",").map((pair) => {
    const [lng, lat] = pair.trim().split(/\s+/).map(Number);
    return [lat, lng];
  });
}