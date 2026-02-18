import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Activity, PhoneCall, ChevronRight, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DisasterStat } from '../types';
import { getDisasterStats } from '../services/gemini';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DisasterStat[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDisasterStats();
        if (data && data.length > 0) {
          setStats(data);
        } else {
            // Fallback if AI fails or returns empty
             setStats([
                { name: 'Banjir', count: 42, color: '#3b82f6' },
                { name: 'Cuaca Ekstrem', count: 28, color: '#94a3b8' },
                { name: 'Longsor', count: 18, color: '#eab308' },
                { name: 'Gempa', count: 12, color: '#ef4444' },
            ]);
        }
      } catch (error) {
         setStats([
            { name: 'Banjir', count: 42, color: '#3b82f6' },
            { name: 'Cuaca Ekstrem', count: 28, color: '#94a3b8' },
            { name: 'Longsor', count: 18, color: '#eab308' },
            { name: 'Gempa', count: 12, color: '#ef4444' },
        ]);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-4 space-y-6">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Siaga Bencana</h2>
        <p className="text-red-100 text-sm mb-4">
          Indonesia rawan bencana. Persiapkan diri Anda dan keluarga dengan informasi yang tepat.
        </p>
        <button 
          onClick={() => navigate('/chat')}
          className="bg-white text-red-600 px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-red-50 transition-colors w-full sm:w-auto"
        >
          Tanya CegahBot Sekarang
        </button>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => navigate('/risk')}
          className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:border-red-200 transition-all active:scale-95"
        >
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <ShieldAlert size={24} />
          </div>
          <span className="font-semibold text-slate-700 text-sm">Cek Risiko</span>
        </button>

        <button 
          onClick={() => navigate('/report')}
          className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:border-red-200 transition-all active:scale-95"
        >
          <div className="bg-orange-100 p-3 rounded-full text-orange-600">
            <Activity size={24} />
          </div>
          <span className="font-semibold text-slate-700 text-sm">Lapor Dampak</span>
        </button>
      </div>

      {/* Stats Section */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 min-h-[300px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">Statistik Risiko Regional</h3>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">2025 (AI)</span>
        </div>
        
        {loadingStats ? (
            <div className="h-48 w-full flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="animate-spin mb-2" />
                <span className="text-xs">Mengambil data terbaru...</span>
            </div>
        ) : (
            <>
                <div className="h-48 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={stats}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                        >
                        {stats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-sm font-bold text-slate-400">Total</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    {stats.map((stat) => (
                        <div key={stat.name} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: stat.color}}></div>
                            <span className="text-xs text-slate-600 flex-1">{stat.name} ({stat.count}%)</span>
                        </div>
                    ))}
                </div>
            </>
        )}
      </div>

      {/* Emergency Contacts Card */}
      <div className="bg-slate-800 text-white p-5 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
            <PhoneCall className="text-green-400" />
            <h3 className="font-bold text-lg">Nomor Darurat</h3>
        </div>
        <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <div>
                    <p className="font-bold">Basarnas</p>
                    <p className="text-xs text-slate-400">Pencarian & Pertolongan</p>
                </div>
                <a href="tel:115" className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded font-bold text-sm">
                    115
                </a>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <div>
                    <p className="font-bold">Polisi</p>
                    <p className="text-xs text-slate-400">Bantuan Umum</p>
                </div>
                <a href="tel:110" className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded font-bold text-sm">
                    110
                </a>
            </div>
        </div>
      </div>

      {/* Educational Snippet */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
        <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-1">
            <Activity size={16} />
        </div>
        <div>
            <h4 className="font-semibold text-blue-900 text-sm">Tip Hari Ini</h4>
            <p className="text-blue-800 text-xs mt-1 leading-relaxed">
                Siapkan tas siaga bencana (Tas Siaga) berisi dokumen penting, obat-obatan, dan air minum untuk bertahan minimal 3 hari.
            </p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;