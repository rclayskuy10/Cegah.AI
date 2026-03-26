import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Clock, AlertTriangle, Users, Plus, Send, Filter, Flame, Droplets, Mountain, CloudRain, Waves, Building } from 'lucide-react';

interface CommunityReport {
  id: string;
  type: string;
  description: string;
  location: string;
  timestamp: Date;
  severity: 'ringan' | 'sedang' | 'berat';
  verified: boolean;
}

const DISASTER_TYPES = [
  { id: 'banjir', label: 'Banjir', icon: Droplets, color: 'bg-blue-500' },
  { id: 'gempa', label: 'Gempa Bumi', icon: Mountain, color: 'bg-red-500' },
  { id: 'longsor', label: 'Tanah Longsor', icon: CloudRain, color: 'bg-amber-500' },
  { id: 'tsunami', label: 'Tsunami', icon: Waves, color: 'bg-cyan-500' },
  { id: 'kebakaran', label: 'Kebakaran', icon: Flame, color: 'bg-orange-500' },
  { id: 'lainnya', label: 'Lainnya', icon: AlertTriangle, color: 'bg-slate-500' },
];

const SEVERITY_CONFIG = {
  ringan: { label: 'Ringan', color: 'bg-green-100 text-green-700 border-green-200' },
  sedang: { label: 'Sedang', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  berat: { label: 'Berat', color: 'bg-red-100 text-red-700 border-red-200' },
};

const CommunityReports: React.FC = () => {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState<string>('semua');
  const [form, setForm] = useState({
    type: 'banjir',
    description: '',
    location: '',
    severity: 'sedang' as 'ringan' | 'sedang' | 'berat',
  });

  useEffect(() => {
    const saved = localStorage.getItem('cegah-community-reports');
    if (saved) {
      const parsed = JSON.parse(saved);
      setReports(parsed.map((r: any) => ({ ...r, timestamp: new Date(r.timestamp) })));
    }
  }, []);

  useEffect(() => {
    if (reports.length > 0) {
      localStorage.setItem('cegah-community-reports', JSON.stringify(reports));
    }
  }, [reports]);

  const submitReport = () => {
    if (!form.description.trim() || !form.location.trim()) return;

    const newReport: CommunityReport = {
      id: Date.now().toString(),
      type: form.type,
      description: form.description,
      location: form.location,
      timestamp: new Date(),
      severity: form.severity,
      verified: false,
    };

    setReports(prev => [newReport, ...prev]);
    setForm({ type: 'banjir', description: '', location: '', severity: 'sedang' });
    setShowForm(false);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm(f => ({ ...f, location: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` }));
        },
        () => {}
      );
    }
  };

  const filteredReports = useMemo(
    () => filterType === 'semua' ? reports : reports.filter(r => r.type === filterType),
    [reports, filterType]
  );

  const getTypeConfig = (type: string) => DISASTER_TYPES.find(t => t.id === type) || DISASTER_TYPES[5];

  return (
    <div className="p-4 md:p-8 space-y-5">
      {/* Header */}
      <div className="animate-fade-in flex items-start justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">Laporan Warga</h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Laporan bencana dari komunitas</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 flex items-center gap-1.5 hover:shadow-xl transition-all active:scale-[0.97]"
        >
          <Plus className="w-4 h-4" />
          Lapor
        </button>
      </div>

      {/* Report Form */}
      {showForm && (
        <div className="animate-slide-up bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-lg space-y-4">
          <h3 className="font-bold text-slate-700 dark:text-slate-200">Buat Laporan Baru</h3>

          {/* Disaster Type */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 block">Jenis Bencana</label>
            <div className="grid grid-cols-3 gap-2">
              {DISASTER_TYPES.map(dt => {
                const TypeIcon = dt.icon;
                return (
                  <button
                    key={dt.id}
                    onClick={() => setForm(f => ({ ...f, type: dt.id }))}
                    className={`p-3 rounded-xl border-2 text-center transition-all text-xs font-semibold flex flex-col items-center gap-1.5 ${
                      form.type === dt.id
                        ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        : 'border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <TypeIcon className="w-4 h-4" />
                    {dt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 block">Tingkat Keparahan</label>
            <div className="flex gap-2">
              {(Object.keys(SEVERITY_CONFIG) as Array<keyof typeof SEVERITY_CONFIG>).map(sev => (
                <button
                  key={sev}
                  onClick={() => setForm(f => ({ ...f, severity: sev }))}
                  className={`flex-1 py-2 rounded-xl border-2 text-xs font-bold transition-all ${
                    form.severity === sev
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      : 'border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {SEVERITY_CONFIG[sev].label}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 block">Lokasi</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="Nama lokasi atau koordinat"
                className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 text-slate-800 dark:text-slate-200"
              />
              <button
                onClick={getLocation}
                className="bg-blue-50 dark:bg-blue-900/30 text-blue-500 p-2.5 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                title="Gunakan lokasi GPS"
              >
                <MapPin className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 block">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Jelaskan kondisi yang terjadi..."
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 resize-none text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Submit */}
          <button
            onClick={submitReport}
            disabled={!form.description.trim() || !form.location.trim()}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            <Send className="w-4 h-4" />
            Kirim Laporan
          </button>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={() => setFilterType('semua')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            filterType === 'semua'
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          Semua
        </button>
        {DISASTER_TYPES.map(dt => (
          <button
            key={dt.id}
            onClick={() => setFilterType(dt.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === dt.id
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {dt.label}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 text-center">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="font-bold text-slate-500 dark:text-slate-400">Belum ada laporan</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Jadilah yang pertama melaporkan kondisi di sekitar Anda</p>
          </div>
        ) : (
          filteredReports.map(report => {
            const typeConfig = getTypeConfig(report.type);
            const TypeIcon = typeConfig.icon;
            const sevConfig = SEVERITY_CONFIG[report.severity];
            return (
              <div key={report.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className={`${typeConfig.color} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <TypeIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{typeConfig.label}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sevConfig.color}`}>{sevConfig.label}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2">{report.description}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {report.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(report.timestamp).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-4">
        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
          <strong>Catatan:</strong> Laporan warga disimpan secara lokal di perangkat Anda. Fitur ini bertujuan untuk membantu kesadaran situasional komunitas. Selalu verifikasi informasi dari sumber resmi (BMKG/BNPB).
        </p>
      </div>
    </div>
  );
};

export default CommunityReports;
