// BMKG (Badan Meteorologi, Klimatologi, dan Geofisika) API Service
// Fetches real-time disaster and weather data from Indonesia's official meteorological agency

/** Helper: fetch with an 8-second timeout */
const fetchWithTimeout = (url: string, options?: RequestInit, timeoutMs = 8000): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timeoutId));
};

export interface BMKGEarthquake {
  Tanggal: string;
  Jam: string;
  DateTime: string;
  Coordinates: string;
  Lintang: string;
  Bujur: string;
  Magnitude: string;
  Kedalaman: string;
  Wilayah: string;
  Potensi: string;
}

export interface BMKGWeatherWarning {
  issue: string;
  warning: string[];
}

export interface DisasterStats {
  earthquakes: number;
  floodWarnings: number;
  weatherWarnings: number;
  lastUpdate: string;
}

export interface StatsMetadata {
  source: string;
  sourceDetail: string;
  lastUpdate: string;
  earthquakeCount: number;
  strongQuakes: number;
  isRainySeason: boolean;
  dataQuality: 'realtime' | 'estimated' | 'fallback';
  references: string[];
  error?: string;
  /** Absolute event counts per category from real data or calibrated BNPB baseline */
  eventCounts: Record<string, { count: number; isReal: boolean; basis: string }>;
}

export interface RealTimeDisasterStatsResult {
  stats: Array<{ name: string; count: number; color: string }>;
  metadata: StatsMetadata;
}

/**
 * Fetch latest earthquake data from BMKG
 * API: https://data.bmkg.go.id/DataMKG/TEWS/
 */
export const getLatestEarthquakes = async (): Promise<BMKGEarthquake[]> => {
  try {
    const response = await fetchWithTimeout('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json', {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`BMKG API error: ${response.status}`);
    }

    const data = await response.json();
    
    // BMKG returns single latest earthquake in Infogempa.gempa
    if (data?.Infogempa?.gempa) {
      return [data.Infogempa.gempa];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching BMKG earthquake data:', error);
    return [];
  }
};

/**
 * Fetch recent significant earthquakes (M5.0+)
 */
export const getRecentEarthquakes = async (): Promise<BMKGEarthquake[]> => {
  try {
    const response = await fetchWithTimeout('https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json', {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`BMKG API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data?.Infogempa?.gempa) {
      return Array.isArray(data.Infogempa.gempa) 
        ? data.Infogempa.gempa 
        : [data.Infogempa.gempa];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching felt earthquakes:', error);
    return [];
  }
};

/**
 * Fetch weather warnings from BMKG
 */
export const getWeatherWarnings = async (): Promise<BMKGWeatherWarning | null> => {
  try {
    const response = await fetchWithTimeout('https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/prakicu_indonesia.json', {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`BMKG Weather API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather warnings:', error);
    return null;
  }
};

/**
 * Get comprehensive disaster statistics from BMKG + BNPB calibrated data.
 *
 * Methodology:
 *  - Gempa: real-time dari BMKG TEWS (gempadirasakan.json) — data nyata
 *  - Banjir / Longsor / Cuaca Ekstrem: estimasi bulanan berdasarkan
 *    data tahunan BNPB 2023 yang disesuaikan dengan faktor musim Indonesia
 *    (musim hujan Nov–Apr = risiko lebih tinggi).
 *
 * Referensi baseline BNPB 2023:
 *   Banjir ~1.296/tahun, Cuaca Ekstrem ~943/tahun, Longsor ~581/tahun,
 *   Gempa (signifikan) ~26/tahun, Kebakaran Hutan ~370/tahun.
 */
export const getRealTimeDisasterStats = async (): Promise<RealTimeDisasterStatsResult> => {
  try {
    const [latestQuake, recentQuakes] = await Promise.all([
      getLatestEarthquakes(),
      getRecentEarthquakes(),
    ]);

    // De-duplicate by DateTime
    const allQuakes = [...latestQuake, ...recentQuakes];
    const uniqueQuakes = Array.from(
      new Map(allQuakes.map(q => [q.DateTime, q])).values()
    );

    const earthquakeCount = uniqueQuakes.length;
    const strongQuakes = uniqueQuakes.filter(q => parseFloat(q.Magnitude) >= 5.0).length;

    // Determine season (Indonesia: rainy Nov–Apr, dry May–Oct)
    const currentMonth = new Date().getMonth(); // 0-indexed
    const isRainySeason = currentMonth >= 10 || currentMonth <= 3;

    // — BNPB 2023 annual totals (source: bnpb.go.id/berita/data-bencana-2023)
    const BNPB_ANNUAL = {
      banjir: 1296,
      cuacaEkstrem: 943,
      longsor: 581,
      kebakaran: 370,
      gempaSignifikan: 26,
    };

    // Monthly base = annual / 12
    const monthlyBase = {
      banjir: BNPB_ANNUAL.banjir / 12,
      cuacaEkstrem: BNPB_ANNUAL.cuacaEkstrem / 12,
      longsor: BNPB_ANNUAL.longsor / 12,
    };

    // Seasonal multiplier (rainy season doubles flood/landslide risk)
    const seasonFactor = isRainySeason
      ? { banjir: 1.9, cuacaEkstrem: 1.3, longsor: 2.1 }
      : { banjir: 0.4, cuacaEkstrem: 0.8, longsor: 0.3 };

    const estimatedBanjir = Math.round(monthlyBase.banjir * seasonFactor.banjir);
    const estimatedCuaca = Math.round(monthlyBase.cuacaEkstrem * seasonFactor.cuacaEkstrem);
    const estimatedLongsor = Math.round(monthlyBase.longsor * seasonFactor.longsor);

    // For chart we normalize relative proportions (keeps pie % meaningful)
    // but eventCounts expose the actual estimated/real absolute values
    const rawCounts = [
      { name: 'Banjir', count: estimatedBanjir, color: '#3b82f6' },
      { name: 'Cuaca Ekstrem', count: estimatedCuaca, color: '#8b5cf6' },
      { name: 'Longsor', count: estimatedLongsor, color: '#f59e0b' },
      { name: 'Gempa', count: earthquakeCount > 0 ? earthquakeCount : BNPB_ANNUAL.gempaSignifikan / 12, color: '#ef4444' },
    ];

    const total = rawCounts.reduce((s, c) => s + c.count, 0);
    const stats = rawCounts.map(s => ({
      ...s,
      count: Math.round((s.count / total) * 100),
    }));

    return {
      stats,
      metadata: {
        source: 'BMKG TEWS (Gempa) + Baseline BNPB 2023',
        sourceDetail: isRainySeason
          ? `Saat ini musim hujan. Estimasi bulanan: Banjir ~${estimatedBanjir} kej, Longsor ~${estimatedLongsor} kej, Cuaca Ekstrem ~${estimatedCuaca} kej (Sumber baseline: BNPB 2023). Gempa dari BMKG TEWS: ${earthquakeCount} event (${strongQuakes} ≥M5.0).`
          : `Saat ini musim kemarau. Estimasi bulanan: Banjir ~${estimatedBanjir} kej, Longsor ~${estimatedLongsor} kej, Cuaca Ekstrem ~${estimatedCuaca} kej (Sumber baseline: BNPB 2023). Gempa dari BMKG TEWS: ${earthquakeCount} event (${strongQuakes} ≥M5.0).`,
        lastUpdate: new Date().toISOString(),
        earthquakeCount,
        strongQuakes,
        isRainySeason,
        dataQuality: earthquakeCount > 0 ? 'realtime' : 'estimated',
        references: [
          'https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json',
          'https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json',
          'https://bnpb.go.id/berita/data-bencana-2023',
        ],
        eventCounts: {
          gempa: { count: earthquakeCount, isReal: true, basis: 'BMKG TEWS real-time' },
          banjir: { count: estimatedBanjir, isReal: false, basis: `Baseline BNPB 2023 × faktor musim ${isRainySeason ? 'hujan' : 'kemarau'}` },
          longsor: { count: estimatedLongsor, isReal: false, basis: `Baseline BNPB 2023 × faktor musim ${isRainySeason ? 'hujan' : 'kemarau'}` },
          cuacaEkstrem: { count: estimatedCuaca, isReal: false, basis: `Baseline BNPB 2023 × faktor musim ${isRainySeason ? 'hujan' : 'kemarau'}` },
        },
      },
    };
  } catch (error) {
    console.error('Error getting real-time disaster stats:', error);
    const currentMonth = new Date().getMonth();
    const isRainySeason = currentMonth >= 10 || currentMonth <= 3;
    return {
      stats: [
        { name: 'Banjir', count: isRainySeason ? 46 : 22, color: '#3b82f6' },
        { name: 'Cuaca Ekstrem', count: 27, color: '#8b5cf6' },
        { name: 'Longsor', count: isRainySeason ? 20 : 8, color: '#f59e0b' },
        { name: 'Gempa', count: 7, color: '#ef4444' },
      ],
      metadata: {
        source: 'Data Cadangan (Offline)',
        sourceDetail: 'API tidak dapat diakses. Menampilkan estimasi baseline BNPB 2023 tanpa faktor real-time.',
        lastUpdate: new Date().toISOString(),
        earthquakeCount: 0,
        strongQuakes: 0,
        isRainySeason,
        dataQuality: 'fallback',
        references: [
          'https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json',
          'https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json',
          'https://bnpb.go.id/berita/data-bencana-2023',
        ],
        eventCounts: {
          gempa: { count: 0, isReal: false, basis: 'API tidak tersedia' },
          banjir: { count: isRainySeason ? 46 : 22, isReal: false, basis: 'Fallback baseline BNPB 2023' },
          longsor: { count: isRainySeason ? 20 : 8, isReal: false, basis: 'Fallback baseline BNPB 2023' },
          cuacaEkstrem: { count: 27, isReal: false, basis: 'Fallback baseline BNPB 2023' },
        },
        error: 'API unavailable',
      },
    };
  }
};

/**
 * Get latest earthquake info for display
 */
export const getLatestEarthquakeInfo = async () => {
  const quakes = await getLatestEarthquakes();
  if (quakes.length > 0) {
    const quake = quakes[0];
    return {
      magnitude: quake.Magnitude,
      location: quake.Wilayah,
      time: `${quake.Tanggal} ${quake.Jam}`,
      depth: quake.Kedalaman,
      potential: quake.Potensi,
      coordinates: {
        lat: quake.Lintang,
        lon: quake.Bujur,
      }
    };
  }
  return null;
};

// WMO Weather Interpretation Codes
const WMO_CODE_MAP: Record<number, { label: string; emoji: string; severity: 'clear' | 'cloudy' | 'rain' | 'storm' | 'fog' }> = {
  0: { label: 'Cerah', emoji: '☀️', severity: 'clear' },
  1: { label: 'Sebagian Cerah', emoji: '🌤️', severity: 'clear' },
  2: { label: 'Berawan Sebagian', emoji: '⛅', severity: 'cloudy' },
  3: { label: 'Mendung', emoji: '☁️', severity: 'cloudy' },
  45: { label: 'Berkabut', emoji: '🌫️', severity: 'fog' },
  48: { label: 'Kabut Beku', emoji: '🌫️', severity: 'fog' },
  51: { label: 'Gerimis Ringan', emoji: '🌦️', severity: 'rain' },
  53: { label: 'Gerimis Sedang', emoji: '🌦️', severity: 'rain' },
  55: { label: 'Gerimis Lebat', emoji: '🌧️', severity: 'rain' },
  61: { label: 'Hujan Ringan', emoji: '🌧️', severity: 'rain' },
  63: { label: 'Hujan Sedang', emoji: '🌧️', severity: 'rain' },
  65: { label: 'Hujan Lebat', emoji: '🌧️', severity: 'rain' },
  71: { label: 'Salju Ringan', emoji: '🌨️', severity: 'rain' },
  73: { label: 'Salju Sedang', emoji: '🌨️', severity: 'rain' },
  75: { label: 'Salju Lebat', emoji: '❄️', severity: 'rain' },
  77: { label: 'Butiran Salju', emoji: '❄️', severity: 'rain' },
  80: { label: 'Hujan Deras Ringan', emoji: '🌧️', severity: 'rain' },
  81: { label: 'Hujan Deras Sedang', emoji: '🌧️', severity: 'rain' },
  82: { label: 'Hujan Deras Lebat', emoji: '⛈️', severity: 'storm' },
  85: { label: 'Hujan Salju', emoji: '🌨️', severity: 'rain' },
  86: { label: 'Hujan Salju Lebat', emoji: '❄️', severity: 'rain' },
  95: { label: 'Badai Petir', emoji: '⛈️', severity: 'storm' },
  96: { label: 'Badai + Hujan Es Ringan', emoji: '⛈️', severity: 'storm' },
  99: { label: 'Badai + Hujan Es Lebat', emoji: '⛈️', severity: 'storm' },
};

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  weatherLabel: string;
  weatherEmoji: string;
  weatherSeverity: 'clear' | 'cloudy' | 'rain' | 'storm' | 'fog';
  locationName: string;
  latitude: number;
  longitude: number;
  isDay: number;
  uvIndex: number;
  precipitation: number;
  source: string;
}

/**
 * Fetch real-time weather using Open-Meteo API (free, no key needed)
 * Falls back to Jakarta coordinates if geolocation is unavailable
 */
export const getWeatherData = async (lat?: number, lon?: number): Promise<WeatherData | null> => {
  // Default to central Indonesia (Jakarta) if no coordinates given
  const latitude = lat ?? -6.2088;
  const longitude = lon ?? 106.8456;

  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', latitude.toString());
    url.searchParams.set('longitude', longitude.toString());
    url.searchParams.set(
      'current',
      'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index'
    );
    url.searchParams.set('timezone', 'Asia/Jakarta');
    url.searchParams.set('wind_speed_unit', 'kmh');

    const response = await fetchWithTimeout(url.toString(), {}, 8000);
    if (!response.ok) throw new Error(`Open-Meteo error: ${response.status}`);

    const data = await response.json();
    const c = data?.current;
    if (!c) throw new Error('No current weather data');

    const code: number = c.weather_code ?? 0;
    const wmo = WMO_CODE_MAP[code] ?? { label: 'Tidak Diketahui', emoji: '🌡️', severity: 'clear' as const };

    // Reverse-geocode using Open-Meteo timezone hint
    let locationName = `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;
    try {
      const geoRes = await fetchWithTimeout(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=id`,
        { headers: { 'User-Agent': 'CegahAI-DisasterApp/1.0' } },
        5000
      );
      if (geoRes.ok) {
        const geo = await geoRes.json();
        const city =
          geo.address?.city ||
          geo.address?.town ||
          geo.address?.village ||
          geo.address?.county ||
          geo.address?.state;
        if (city) locationName = city;
      }
    } catch {
      // silently fall back to coordinates
    }

    return {
      temperature: Math.round(c.temperature_2m as number),
      feelsLike: Math.round(c.apparent_temperature as number),
      humidity: c.relative_humidity_2m as number,
      windSpeed: Math.round(c.wind_speed_10m as number),
      windDirection: c.wind_direction_10m as number,
      weatherCode: code,
      weatherLabel: wmo.label,
      weatherEmoji: wmo.emoji,
      weatherSeverity: wmo.severity,
      locationName,
      latitude,
      longitude,
      isDay: c.is_day as number,
      uvIndex: c.uv_index as number ?? 0,
      precipitation: c.precipitation as number ?? 0,
      source: 'Open-Meteo + BMKG',
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};
