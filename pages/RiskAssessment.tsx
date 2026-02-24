import React, { useState, useCallback } from 'react';
import { MapPin, Navigation, AlertTriangle, ShieldCheck, Info, Sparkles, Compass } from 'lucide-react';
import { analyzeLocationRisk } from '../services/gemini';
import { RiskReport } from '../types';
import MapView from '../components/MapView';

const RiskAssessment: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);
  const [report, setReport] = useState<RiskReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getLocation = () => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung browser ini.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lon: longitude });
        fetchRiskAnalysis(latitude, longitude);
      },
      (err) => {
        setError("Gagal mengambil lokasi. Mohon izinkan akses lokasi.");
        setLoading(false);
      }
    );
  };

  const fetchRiskAnalysis = async (lat: number, lon: number) => {
    try {
      const data = await analyzeLocationRisk(lat, lon);
      setReport(data);
    } catch (err) {
      setError("Gagal menganalisis risiko lokasi.");
    } finally {
      setLoading(false);
    }
  };

  // Consolidated risk level style lookup - avoids 3 separate switch statements
  const RISK_STYLES: Record<string, { gradient: string; bg: string; text: string }> = {
    Critical: { gradient: 'from-red-500 to-red-600',    bg: 'bg-red-50 border-red-100',       text: 'text-red-600' },
    High:     { gradient: 'from-orange-500 to-orange-600', bg: 'bg-orange-50 border-orange-100', text: 'text-orange-600' },
    Medium:   { gradient: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-50 border-yellow-100', text: 'text-yellow-600' },
    Low:      { gradient: 'from-green-500 to-green-600',   bg: 'bg-green-50 border-green-100',   text: 'text-green-600' },
  };
  const getRiskStyle = useCallback((level: string) => RISK_STYLES[level] ?? RISK_STYLES.Low, []);
  const getRiskColor    = (level: string) => getRiskStyle(level).gradient;
  const getRiskBgColor  = (level: string) => getRiskStyle(level).bg;
  const getRiskTextColor = (level: string) => getRiskStyle(level).text;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="mb-2 animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">Peta Rawan</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Analisis risiko bencana di lokasi Anda berbasis AI.</p>
      </div>

      {!report && !loading && (
          <div className="animate-slide-up bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 text-center shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center">
            <div className="relative mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl">
                <Compass size={48} className="text-blue-500 animate-pulse-soft" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 p-1.5 rounded-xl">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 className="font-black text-xl md:text-2xl mb-2 text-slate-800 dark:text-white">Dimana Anda berada?</h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-8 max-w-sm leading-relaxed">Izinkan kami mengakses lokasi Anda untuk memberikan analisis risiko bencana yang akurat menggunakan AI.</p>
            <button 
                onClick={getLocation}
                className="group bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-red-500/20 hover:shadow-2xl hover:shadow-red-500/30 transition-all active:scale-[0.98] flex items-center gap-2.5"
            >
                <MapPin size={18} className="group-hover:animate-bounce-soft" />
                Cek Risiko Lokasi Saya
            </button>
          </div>
      )}

      {loading && (
          <div className="animate-fade-in flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-red-100 dark:border-red-900 rounded-full animate-ping absolute"></div>
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white relative z-10 shadow-xl shadow-red-500/30">
                    <Navigation className="animate-pulse-soft w-8 h-8" />
                </div>
              </div>
              <p className="mt-8 font-bold text-lg text-slate-700 dark:text-slate-200">Menganalisis Data Geografis...</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Mengambil data historis bencana dari AI.</p>
              <div className="mt-4 flex gap-1">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
          </div>
      )}

      {error && !loading && (
          <div className="animate-fade-in bg-red-50 dark:bg-red-900/30 p-5 rounded-2xl border border-red-100 dark:border-red-800 text-center">
              <div className="bg-red-100 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="text-red-500 w-6 h-6" />
              </div>
              <p className="text-red-700 font-semibold">{error}</p>
              <button onClick={getLocation} className="mt-3 bg-red-500 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-red-600 transition-colors">
                Coba Lagi
              </button>
          </div>
      )}

      {report && !loading && (
          <div className="space-y-4 animate-slide-up">
              
              {/* Location Card */}
              <div className="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-2">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-1 rounded-lg">
                      <MapPin size={12} className="text-blue-500" />
                    </div>
                    Lokasi Terdeteksi
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">{report.locationName}</h2>
                {coords && <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-1.5 bg-slate-50 dark:bg-slate-700 inline-block px-2 py-1 rounded-lg">{coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}</p>}
              </div>

              {/* Interactive Map */}
              {coords && (
                <div className="animate-slide-up">
                  <MapView
                    lat={coords.lat}
                    lon={coords.lon}
                    locationName={report.locationName}
                    riskLevel={report.riskLevel}
                  />
                </div>
              )}

              {/* Risk Level Card */}
              <div className={`p-6 md:p-8 rounded-3xl border shadow-sm ${getRiskBgColor(report.riskLevel)} relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-5">
                  <AlertTriangle size={200} className="absolute -right-10 -bottom-10" />
                </div>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold opacity-50 uppercase tracking-wider mb-1">Tingkat Risiko</p>
                    <h3 className={`text-4xl md:text-5xl font-black tracking-tight ${getRiskTextColor(report.riskLevel)}`}>{report.riskLevel}</h3>
                  </div>
                  <div className={`bg-gradient-to-r ${getRiskColor(report.riskLevel)} p-4 rounded-2xl shadow-lg`}>
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Hazards List */}
              <div className="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-1.5 rounded-lg">
                        <Info size={16} className="text-blue-500" />
                      </div>
                      Potensi Bahaya
                  </h4>
                  <div className="flex flex-wrap gap-2">
                      {report.hazards.map((hazard, idx) => (
                          <span key={idx} className="bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl text-sm font-medium border border-slate-100 dark:border-slate-600 transition-colors cursor-default">
                              {hazard}
                          </span>
                      ))}
                  </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                      <div className="bg-green-50 dark:bg-green-900/30 p-1.5 rounded-lg">
                        <ShieldCheck size={16} className="text-green-500" />
                      </div>
                      Rekomendasi Kesiapsiagaan
                  </h4>
                  <ul className="space-y-3">
                      {report.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-green-50/50 dark:bg-green-900/20 p-4 rounded-2xl border border-green-100/50 dark:border-green-800/50 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors">
                              <span className="bg-gradient-to-br from-green-500 to-green-600 text-white w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 shadow-sm">
                                  {idx + 1}
                              </span>
                              <span>{rec}</span>
                          </li>
                      ))}
                  </ul>
              </div>

              {/* Re-check button */}
              <button 
                onClick={() => { setReport(null); setCoords(null); }}
                className="w-full bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 py-3 rounded-2xl font-semibold text-sm border border-slate-200 dark:border-slate-600 transition-all flex items-center justify-center gap-2"
              >
                <MapPin size={16} />
                Cek Lokasi Lain
              </button>
          </div>
      )}
    </div>
  );
};

export default RiskAssessment;