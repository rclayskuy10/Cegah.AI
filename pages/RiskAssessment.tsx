import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { analyzeLocationRisk } from '../services/gemini';
import { RiskReport } from '../types';

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

  const getRiskColor = (level: string) => {
      switch(level) {
          case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
          case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
          case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
          default: return 'text-green-600 bg-green-50 border-green-200';
      }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-slate-800">Peta Rawan</h2>
        <p className="text-sm text-slate-500">Analisis risiko bencana di lokasi Anda saat ini berbasis AI.</p>
      </div>

      {!report && !loading && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-200 flex flex-col items-center">
            <div className="bg-blue-50 p-4 rounded-full text-blue-500 mb-4">
                <Navigation size={40} className="animate-pulse" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-800">Dimana Anda berada?</h3>
            <p className="text-slate-500 text-sm mb-6">Izinkan kami mengakses lokasi untuk memberikan analisis risiko bencana yang akurat.</p>
            <button 
                onClick={getLocation}
                className="bg-red-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-95 flex items-center gap-2"
            >
                <MapPin size={18} />
                Cek Risiko Lokasi Saya
            </button>
          </div>
      )}

      {loading && (
          <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-red-100 rounded-full animate-ping absolute"></div>
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white relative z-10 shadow-xl">
                    <Navigation className="animate-pulse" />
                </div>
              </div>
              <p className="mt-6 font-semibold text-slate-600">Menganalisis Data Geografis...</p>
              <p className="text-xs text-slate-400 mt-1">Mengambil data historis bencana.</p>
          </div>
      )}

      {error && !loading && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700 text-sm font-medium text-center">
              {error}
              <button onClick={getLocation} className="block w-full mt-2 text-red-800 underline">Coba Lagi</button>
          </div>
      )}

      {report && !loading && (
          <div className="space-y-4 animate-in fade-in duration-700">
              
              {/* Location Card */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                    <MapPin size={12} />
                    Lokasi Terdeteksi
                </div>
                <h2 className="text-xl font-bold text-slate-800">{report.locationName}</h2>
                {coords && <p className="text-xs text-slate-400 font-mono mt-1">{coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}</p>}
              </div>

              {/* Risk Level Card */}
              <div className={`p-6 rounded-2xl border flex items-center justify-between shadow-sm ${getRiskColor(report.riskLevel)}`}>
                 <div>
                    <p className="text-xs font-bold opacity-70 uppercase mb-1">Tingkat Risiko</p>
                    <h3 className="text-3xl font-black tracking-tight">{report.riskLevel}</h3>
                 </div>
                 <AlertTriangle size={48} className="opacity-20" />
              </div>

              {/* Hazards List */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                  <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                      <Info size={18} className="text-blue-500" />
                      Potensi Bahaya
                  </h4>
                  <div className="flex flex-wrap gap-2">
                      {report.hazards.map((hazard, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200">
                              {hazard}
                          </span>
                      ))}
                  </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                  <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                      <ShieldCheck size={18} className="text-green-500" />
                      Rekomendasi Kesiapsiagaan
                  </h4>
                  <ul className="space-y-3">
                      {report.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                              <span className="bg-green-100 text-green-600 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                  {idx + 1}
                              </span>
                              {rec}
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
      )}
    </div>
  );
};

export default RiskAssessment;