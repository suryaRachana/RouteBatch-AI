import { GeocodingResult } from '../types';

const geocodeCache = new Map<string, GeocodingResult>();

/**
 * Geocodes an address string using OpenStreetMap Nominatim service.
 * Respects usage policy with custom User-Agent and caching.
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult> {
  const normalizedQuery = address.trim().toLowerCase();

  if (geocodeCache.has(normalizedQuery)) {
    return geocodeCache.get(normalizedQuery)!;
  }

  const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}&limit=1`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        'User-Agent': 'RouteBatch-AI/1.0 (Hackathon Field App - contact@routebatch.ai)',
        'Accept-Language': 'en',
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoding server error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error(`Address not found: "${address}". Please enter a valid city, street, or landmark.`);
    }

    const firstMatch = data[0];
    const latitude = parseFloat(firstMatch.lat);
    const longitude = parseFloat(firstMatch.lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error('Invalid geographic coordinates received for this address.');
    }

    const result: GeocodingResult = {
      latitude,
      longitude,
      formattedAddress: firstMatch.display_name || address,
    };

    geocodeCache.set(normalizedQuery, result);
    return result;
  } catch (error: any) {
    console.error('Nominatim Geocoding Error:', error);
    throw new Error(error.message || 'Geocoding service unavailable. Check address and internet connection.');
  }
}
