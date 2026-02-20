import React, { useEffect, useState } from 'react';
import { Activity, MapPin, Clock, AlertTriangle, Loader2, Radio, ChevronDown, ChevronUp } from 'lucide-react';
import { getRecentEarthquakes, getLatestEarthquakes, BMKGEarthquake } from '../services/bmkg';

const EarthquakeHistory: React.FC = () => {
  const [earthquakes, setEarthquakes] = useState<BMKGEarthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latest, recent] = await Promise.all([
          getLatestEarthquakes(),
          getRecentEarthquakes(),
        ]);

        const all = [...latest, ...recent];
        const unique = Array.from(
          new Map(all.map(q => [q.DateTime || q.Jam, q])).values()
        );

        unique.sort((a, b) => {
          const dateA = a.DateTime ? new Date(a.DateTime).getTime() : 0;
          const dateB = b.DateTime ? new Date(b.DateTime).getTime() : 0;
          return dateB - dateA;
        });

        setEarthquakes(unique);
      } catch (err) {
        setError('Gagal memuat data gempa. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getMagnitudeColor = (mag: string) => {
    const m = parseFloat(mag);
    if (m >= 6) return 'bg-red-500 text-white';
    if (m >= 5) return 'bg-orange-500 text-white';
    if (m >= 4) return 'bg-yellow-500 text-white';
    return 'bg-green-500 text-white';
  };

  const getMagnitudeBorder = (mag: string) => {
    const m = parseFloat(mag);
    if (m >= 6) return 'border-red-200 dark:border-red-800';
    if (m >= 5) return 'border-orange-200 dark:border-orange-800';
    if (m >= 4) return 'border-yellow-200 dark:border-yellow-800';
    return 'border-green-200 dark:border-green-800';
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">Riwayat Gempa</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Data gempa terkini dari BMKG Indonesia</p>
      </div>

      {/* Live Badge */}
      <div className="animate-slide-up flex items-center gap-2">
        <span className="text-[11px] font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full border border-green-100 dark:border-green-800 flex items-center gap-1.5">
          <Radio className="w-3 h-3 animate-pulse" /> Data Real-Time BMKG
        </span>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          {earthquakes.length} gempa tercatat
        </span>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-100 dark:border-slate-700 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin absolute inset-0"></div>
          </div>
          <p className="mt-6 font-bold text-slate-700 dark:text-slate-300">Memuat Data Gempa...</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Mengambil data dari BMKG</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 dark:bg-red-900/30 p-5 rounded-2xl border border-red-100 dark:border-red-800 text-center">
          <AlertTriangle className="text-red-500 w-8 h-8 mx-auto mb-2" />
          <p className="text-red-700 dark:text-red-300 font-semibold">{error}</p>
        </div>
      )}

      {/* Earthquake List */}
      {!loading && !error && (
        <div className="space-y-3">
          {earthquakes.map((quake, idx) => {
            const key = quake.DateTime || `${quake.Tanggal}-${quake.Jam}-${idx}`;
            const isExpanded = expandedId === key;

            return (
              <div
                key={key}
                className={`bg-white dark:bg-slate-800 rounded-2xl border-2 transition-all duration-300 overflow-hidden hover:shadow-md ${getMagnitudeBorder(quake.Magnitude)}`}
              >
                {/* Main Row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : key)}
                  className="w-full flex items-center gap-3 md:gap-4 p-4 text-left"
                >
                  {/* Magnitude Badge */}
                  <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black shadow-sm ${getMagnitudeColor(quake.Magnitude)}`}>
                    <span className="text-lg leading-none">{quake.Magnitude}</span>
                    <span className="text-[9px] font-semibold opacity-80">SR</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-800 dark:text-white truncate">
                      {quake.Wilayah}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                        <Clock className="w-3 h-3" />
                        {quake.Tanggal} {quake.Jam}
                      </span>
                    </div>
                  </div>

                  {/* Expand Toggle */}
                  <div className="flex-shrink-0 text-slate-400 dark:text-slate-500">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 border-t border-slate-100 dark:border-slate-700 pt-3 animate-fade-in">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Kedalaman</p>
                        <p className="font-bold text-slate-700 dark:text-slate-200 text-sm mt-0.5">{quake.Kedalaman}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Koordinat</p>
                        <p className="font-bold text-slate-700 dark:text-slate-200 text-sm mt-0.5 font-mono">{quake.Lintang}, {quake.Bujur}</p>
                      </div>
                    </div>
                    {quake.Potensi && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-xl">
                        <p className="text-[10px] text-yellow-600 dark:text-yellow-400 font-semibold uppercase tracking-wider mb-1">Potensi</p>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">{quake.Potensi}</p>
                      </div>
                    )}
                    {/* Mini Map Link */}
                    <a
                      href={`https://www.google.com/maps?q=${quake.Lintang?.replace(' LU','').replace(' LS','-')},${quake.Bujur?.replace(' BT','').replace(' BB','-')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-xl border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      Lihat di Google Maps
                    </a>
                  </div>
                )}
              </div>
            );
          })}

          {earthquakes.length === 0 && (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-semibold">Tidak ada data gempa saat ini</p>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 animate-slide-up">
        <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200 mb-3">Skala Magnitudo</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { label: '< 4.0', color: 'bg-green-500', desc: 'Ringan' },
            { label: '4.0 - 4.9', color: 'bg-yellow-500', desc: 'Sedang' },
            { label: '5.0 - 5.9', color: 'bg-orange-500', desc: 'Kuat' },
            { label: '≥ 6.0', color: 'bg-red-500', desc: 'Sangat Kuat' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.label}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EarthquakeHistory;
