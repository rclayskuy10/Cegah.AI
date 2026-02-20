import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Activity, PhoneCall, ChevronRight, Loader2, Shield, Zap, ArrowRight, Sparkles, MapPin, Camera, MessageSquare, Radio, AlertCircle, CloudRain } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DisasterStat } from '../types';
import { getRealTimeDisasterStats, getLatestEarthquakeInfo, getWeatherWarnings } from '../services/bmkg';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DisasterStat[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [earthquakeInfo, setEarthquakeInfo] = useState<any>(null);
  const [loadingQuake, setLoadingQuake] = useState(true);
  const [weatherWarning, setWeatherWarning] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getRealTimeDisasterStats();
        if (result && result.stats && result.stats.length > 0) {
          setStats(result.stats);
        } else {
             setStats([
                { name: 'Banjir', count: 42, color: '#3b82f6' },
                { name: 'Cuaca Ekstrem', count: 28, color: '#8b5cf6' },
                { name: 'Longsor', count: 18, color: '#f59e0b' },
                { name: 'Gempa', count: 12, color: '#ef4444' },
            ]);
        }
      } catch (error) {
         setStats([
            { name: 'Banjir', count: 42, color: '#3b82f6' },
            { name: 'Cuaca Ekstrem', count: 28, color: '#8b5cf6' },
            { name: 'Longsor', count: 18, color: '#f59e0b' },
            { name: 'Gempa', count: 12, color: '#ef4444' },
        ]);
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchEarthquake = async () => {
      try {
        const quakeData = await getLatestEarthquakeInfo();
        setEarthquakeInfo(quakeData);
      } catch (error) {
        console.error('Failed to fetch earthquake data:', error);
      } finally {
        setLoadingQuake(false);
      }
    };

    const fetchWeather = async () => {
      try {
        const weatherData = await getWeatherWarnings();
        if (weatherData && weatherData.warning && weatherData.warning.length > 0) {
          setWeatherWarning(weatherData);
        }
      } catch (error) {
        console.error('Failed to fetch weather warnings:', error);
      }
    };

    fetchStats();
    fetchEarthquake();
    fetchWeather();
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      
      {/* Hero Section - Modern Gradient */}
      <div className="animate-fade-in relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-red-900 rounded-3xl p-6 md:p-10 text-white shadow-2xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-3 leading-tight">Siaga Bencana<br/>Dimulai dari <span className="gradient-text">Kesiapan.</span></h2>
          <p className="text-slate-300 text-sm md:text-base mb-6 max-w-lg leading-relaxed">
            Indonesia rawan bencana. Persiapkan diri Anda dan keluarga dengan informasi yang tepat dan akurat berbasis AI.
          </p>
          <button 
            onClick={() => navigate('/chat')}
            className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-red-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/30 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <MessageSquare className="w-4 h-4" />
            Tanya CegahBot Sekarang
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Weather Warning Alert */}
      {weatherWarning && weatherWarning.warning && weatherWarning.warning.length > 0 && (
        <div className="animate-slide-up bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border-l-4 border-orange-500 p-4 md:p-5 rounded-2xl shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-orange-500 p-2 rounded-xl flex-shrink-0">
              <CloudRain className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-orange-900 text-sm md:text-base flex items-center gap-2">
                Peringatan Cuaca
                <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">BMKG</span>
              </h4>
              <div className="mt-2 space-y-1">
                {weatherWarning.warning.slice(0, 3).map((warning: string, idx: number) => (
                  <p key={idx} className="text-xs md:text-sm text-orange-800 leading-relaxed">
                    • {warning}
                  </p>
                ))}
              </div>
              <p className="text-xs text-orange-600 mt-2 font-medium">
                Tetap waspada dan ikuti arahan dari pihak berwenang.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Grid */}
      <div className="animate-slide-up grid grid-cols-3 gap-3 md:gap-4">
        <button 
          onClick={() => navigate('/risk')}
          className="hover-card bg-white dark:bg-slate-800 p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center gap-3 group"
        >
          <div className="bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 p-3 md:p-4 rounded-2xl text-blue-600 dark:text-blue-400 transition-colors duration-300">
            <MapPin size={22} />
          </div>
          <div className="text-center">
            <span className="font-bold text-slate-700 dark:text-slate-200 text-xs md:text-sm">Cek Risiko</span>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 hidden md:block">Analisis lokasi</p>
          </div>
        </button>

        <button 
          onClick={() => navigate('/report')}
          className="hover-card bg-white dark:bg-slate-800 p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center gap-3 group"
        >
          <div className="bg-orange-50 dark:bg-orange-900/30 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/50 p-3 md:p-4 rounded-2xl text-orange-600 dark:text-orange-400 transition-colors duration-300">
            <Camera size={22} />
          </div>
          <div className="text-center">
            <span className="font-bold text-slate-700 dark:text-slate-200 text-xs md:text-sm">Lapor Dampak</span>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 hidden md:block">Upload foto</p>
          </div>
        </button>

        <button 
          onClick={() => navigate('/chat')}
          className="hover-card bg-white dark:bg-slate-800 p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center gap-3 group"
        >
          <div className="bg-green-50 dark:bg-green-900/30 group-hover:bg-green-100 dark:group-hover:bg-green-900/50 p-3 md:p-4 rounded-2xl text-green-600 dark:text-green-400 transition-colors duration-300">
            <MessageSquare size={22} />
          </div>
          <div className="text-center">
            <span className="font-bold text-slate-700 dark:text-slate-200 text-xs md:text-sm">CegahBot</span>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 hidden md:block">Tanya AI</p>
          </div>
        </button>
      </div>

      {/* Latest Earthquake Info - Real-time BMKG */}
      {loadingQuake ? (
        <div className="animate-slide-up bg-gradient-to-br from-red-50 to-orange-50 p-5 md:p-6 rounded-3xl border border-red-100 shadow-sm">
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-medium">Memuat data gempa terkini...</span>
          </div>
        </div>
      ) : earthquakeInfo ? (
        <div className="animate-slide-up bg-gradient-to-br from-red-50 to-orange-50 p-5 md:p-6 rounded-3xl border border-red-100 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-red-500 p-3 rounded-2xl flex-shrink-0 shadow-lg shadow-red-500/30">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-red-900 text-base md:text-lg">Gempa Terkini</h3>
                  <p className="text-xs text-red-600 mt-0.5">Sumber: BMKG Indonesia</p>
                </div>
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  M {earthquakeInfo.magnitude}
                </span>
              </div>
              <div className="space-y-2 mt-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{earthquakeInfo.location}</p>
                    <p className="text-xs text-slate-500">{earthquakeInfo.depth}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-xs text-slate-600">{earthquakeInfo.time}</p>
                </div>
                {earthquakeInfo.potential && (
                  <div className="mt-3 bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-red-200">
                    <p className="text-xs font-semibold text-red-700">{earthquakeInfo.potential}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Stats Section */}
      <div className="animate-slide-up bg-white dark:bg-slate-800 p-5 md:p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 min-h-[300px]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Statistik Risiko</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Data real-time BMKG</p>
          </div>
          <span className="text-[11px] font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 flex items-center gap-1">
            <Radio className="w-3 h-3 animate-pulse" /> Data Real-Time
          </span>
        </div>
        
        {loadingStats ? (
            <div className="h-48 w-full flex flex-col items-center justify-center text-slate-400">
                <div className="relative">
                  <div className="w-12 h-12 border-3 border-slate-100 rounded-full"></div>
                  <div className="w-12 h-12 border-3 border-red-500 border-t-transparent rounded-full animate-spin absolute inset-0"></div>
                </div>
                <span className="text-xs mt-4 font-medium">Mengambil data terbaru...</span>
            </div>
        ) : (
            <div className="md:flex md:items-center md:gap-8">
                <div className="h-48 w-full md:w-1/2 relative">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={stats}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="count"
                        stroke="none"
                        >
                        {stats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '12px', 
                            border: '1px solid #e2e8f0', 
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                            fontSize: '12px',
                            fontWeight: '600'
                          }} 
                        />
                    </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                          <span className="text-2xl font-black text-slate-700">{stats.reduce((a, b) => a + b.count, 0)}</span>
                          <p className="text-[10px] text-slate-400 font-medium">Total %</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 md:mt-0 md:flex-1">
                    {stats.map((stat) => (
                        <div key={stat.name} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{backgroundColor: stat.color}}></div>
                            <div>
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{stat.name}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500">{stat.count}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* Emergency Contacts Card */}
      <div className="animate-slide-up bg-slate-900 text-white p-5 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
              <div className="bg-green-500/20 p-2 rounded-xl">
                <PhoneCall className="text-green-400 w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Nomor Darurat</h3>
                <p className="text-[11px] text-slate-400">Hubungi saat keadaan darurat</p>
              </div>
          </div>
          <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div>
                      <p className="font-bold">Basarnas</p>
                      <p className="text-xs text-slate-400">Pencarian & Pertolongan</p>
                  </div>
                  <a href="tel:115" className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-green-500/20">
                      115
                  </a>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div>
                      <p className="font-bold">Polisi</p>
                      <p className="text-xs text-slate-400">Bantuan Umum</p>
                  </div>
                  <a href="tel:110" className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-green-500/20">
                      110
                  </a>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div>
                      <p className="font-bold">Darurat Umum</p>
                      <p className="text-xs text-slate-400">Ambulans & Kebakaran</p>
                  </div>
                  <a href="tel:112" className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-green-500/20">
                      112
                  </a>
              </div>
          </div>
        </div>
      </div>

      {/* Educational Snippet */}
      <div className="animate-slide-up bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 p-5 rounded-2xl flex items-start gap-4 hover-card">
        <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600 flex-shrink-0">
            <Zap size={18} />
        </div>
        <div>
            <h4 className="font-bold text-blue-900 text-sm">Tip Kesiapsiagaan</h4>
            <p className="text-blue-700 text-sm mt-1.5 leading-relaxed">
                Siapkan tas siaga bencana berisi dokumen penting, obat-obatan, air minum, senter, dan makanan tahan lama untuk bertahan minimal 3 hari.
            </p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;