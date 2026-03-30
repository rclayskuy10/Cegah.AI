import React, { useEffect, useState } from 'react';
import { MapPin, Wind, Droplets, Thermometer, Eye, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { getWeatherData, WeatherData } from '../services/bmkg';

const WindDirectionLabel = ({ deg }: { deg: number }) => {
  const dirs = ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL'];
  const idx = Math.round(deg / 45) % 8;
  return <span>{dirs[idx]}</span>;
};

const WeatherBg: Record<string, string> = {
  clear: 'from-slate-700 via-slate-800 to-sky-900',
  cloudy: 'from-slate-600 via-slate-700 to-slate-800',
  rain: 'from-slate-700 via-slate-800 to-blue-900',
  storm: 'from-slate-800 via-gray-900 to-zinc-950',
  fog: 'from-slate-600 via-stone-700 to-slate-800',
};

const UvLabel = (uv: number) => {
  if (uv <= 2) return { label: 'Rendah', color: 'text-green-400' };
  if (uv <= 5) return { label: 'Sedang', color: 'text-yellow-400' };
  if (uv <= 7) return { label: 'Tinggi', color: 'text-orange-400' };
  return { label: 'Sangat Tinggi', color: 'text-red-400' };
};

interface WeatherWidgetProps {
  className?: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ className = '' }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'asking' | 'granted' | 'denied'>('idle');
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchWeather = async (lat?: number, lon?: number) => {
    setLoading(true);
    setError(null);
    const data = await getWeatherData(lat, lon);
    if (data) {
      setWeather(data);
      setLastFetch(new Date());
    } else {
      setError('Data cuaca tidak tersedia saat ini.');
    }
    setLoading(false);
  };

  const requestLocation = () => {
    setGeoStatus('asking');
    if (!navigator.geolocation) {
      setGeoStatus('denied');
      fetchWeather();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoStatus('granted');
        fetchWeather(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setGeoStatus('denied');
        fetchWeather();
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  };

  useEffect(() => {
    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bgGradient = WeatherBg[weather?.weatherSeverity ?? 'clear'];
  const uvInfo = UvLabel(weather?.uvIndex ?? 0);

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-3xl p-5 shadow-lg ${className}`}>
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="w-5 h-5 animate-spin" />
          <div>
            <p className="font-semibold text-sm">Memuat data cuaca...</p>
            {geoStatus === 'asking' && (
              <p className="text-xs text-white/70">Mendeteksi lokasi Anda...</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className={`bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 ${className}`}>
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Data cuaca tidak tersedia</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Cek{' '}
              <a
                href="https://www.bmkg.go.id/cuaca/prakiraan-cuaca.bmkg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                BMKG
              </a>{' '}
              untuk info resmi.
            </p>
          </div>
          <button
            onClick={() => geoStatus === 'granted' ? fetchWeather(weather?.latitude, weather?.longitude) : requestLocation()}
            className="p-2 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 transition-colors"
            title="Muat ulang"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>
    );
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${bgGradient} rounded-3xl shadow-lg border border-white/5 ${className}`}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <div className="absolute top-0 right-0 w-48 h-48 bg-sky-400 rounded-full -translate-y-1/3 translate-x-1/3 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-400 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl"></div>
      </div>

      <div className="relative z-10 p-5 md:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs font-medium truncate max-w-[160px]">{weather.locationName}</span>
            {geoStatus === 'denied' && (
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">Default</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60">{timeStr} WIB</span>
            <button
              onClick={requestLocation}
              className="p-1.5 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
              title="Perbarui lokasi"
            >
              <RefreshCw className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>

        {/* Main weather display */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-end gap-2">
              <span className="text-6xl font-black text-white leading-none">{weather.temperature}°</span>
              <span className="text-white/60 text-base mb-2">C</span>
            </div>
            <p className="text-white font-bold text-base mt-1">{weather.weatherLabel}</p>
            <p className="text-white/60 text-xs mt-0.5">Terasa seperti {weather.feelsLike}°C</p>
          </div>
          <div className="text-7xl leading-none select-none">
            {weather.weatherEmoji}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-2 mt-5 pt-4 border-t border-white/20">
          <div className="flex flex-col items-center gap-1">
            <Droplets className="w-4 h-4 text-white/70" />
            <span className="text-white font-bold text-sm">{weather.humidity}%</span>
            <span className="text-white/60 text-[10px]">Kelembaban</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Wind className="w-4 h-4 text-white/70" />
            <span className="text-white font-bold text-sm">{weather.windSpeed}<span className="text-[10px] font-normal"> km/j</span></span>
            <span className="text-white/60 text-[10px]">
              Angin <WindDirectionLabel deg={weather.windDirection} />
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Eye className="w-4 h-4 text-white/70" />
            <span className={`font-bold text-sm ${uvInfo.color}`}>{weather.uvIndex.toFixed(0)}</span>
            <span className="text-white/60 text-[10px]">UV {uvInfo.label}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Thermometer className="w-4 h-4 text-white/70" />
            <span className="text-white font-bold text-sm">{weather.precipitation}<span className="text-[10px] font-normal"> mm</span></span>
            <span className="text-white/60 text-[10px]">Curah Hujan</span>
          </div>
        </div>

        {/* Risk indicator for high precipitation */}
        {weather.precipitation > 10 && (
          <div className="mt-3 bg-red-500/20 border border-red-300/30 rounded-xl px-3 py-2">
            <p className="text-white/90 text-xs font-semibold">
              ⚠️ Curah hujan tinggi — waspada potensi banjir & longsor
            </p>
          </div>
        )}
        {weather.weatherSeverity === 'storm' && (
          <div className="mt-3 bg-red-500/20 border border-red-300/30 rounded-xl px-3 py-2">
            <p className="text-white/90 text-xs font-semibold">
              ⛈️ Badai terdeteksi — hindari ruang terbuka
            </p>
          </div>
        )}

        {/* Source */}
        <p className="text-white/40 text-[10px] mt-3">
          Sumber: Open-Meteo API · {lastFetch ? lastFetch.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
        </p>
      </div>
    </div>
  );
};

export default WeatherWidget;
