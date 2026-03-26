import React, { useState, useEffect } from 'react';
import { WifiOff, AlertTriangle, PhoneCall, Mountain, Waves, CloudRain, Droplets, Flame, ChevronDown, ChevronUp, Shield } from 'lucide-react';

interface EmergencyGuide {
  title: string;
  steps: string[];
}

interface EmergencyContact {
  name: string;
  number: string;
  desc: string;
}

interface OfflineData {
  emergencyContacts: EmergencyContact[];
  guides: Record<string, EmergencyGuide>;
}

const FALLBACK_OFFLINE_DATA: OfflineData = {
  emergencyContacts: [
    { name: 'Darurat Umum', number: '112', desc: 'Ambulans, Pemadam, Polisi' },
    { name: 'Basarnas', number: '115', desc: 'Pencarian & Pertolongan' },
    { name: 'Polisi', number: '110', desc: 'Bantuan Keamanan' },
    { name: 'Ambulans', number: '118', desc: 'Layanan Medis Darurat' },
    { name: 'PMI', number: '119', desc: 'Palang Merah Indonesia' },
    { name: 'BNPB', number: '117', desc: 'Badan Penanggulangan Bencana' },
  ],
  guides: {
    gempa: {
      title: 'Gempa Bumi',
      steps: [
        'DROP — Jatuhkan badan ke lantai segera',
        'COVER — Berlindung di bawah meja kokoh, lindungi kepala & leher',
        'HOLD ON — Pegang kuat sampai guncangan berhenti',
        'Jangan berlari keluar saat masih berguncang',
        'Setelah berhenti, keluar dengan hati-hati & jauhi bangunan',
        'Periksa luka pada diri sendiri dan orang sekitar',
        'Waspada gempa susulan, jangan masuk bangunan rusak',
      ],
    },
    banjir: {
      title: 'Banjir',
      steps: [
        'Segera pindah ke tempat yang lebih tinggi',
        'Jangan berjalan atau berkendara melewati air banjir',
        'Matikan listrik jika air mulai masuk rumah',
        'Bawa tas siaga dan dokumen penting',
        'Hindari saluran air, selokan, dan daerah rendah',
        'Ikuti arahan evakuasi dari petugas BPBD',
        'Jangan minum air banjir, gunakan air bersih yang disimpan',
      ],
    },
    tsunami: {
      title: 'Tsunami',
      steps: [
        'Jika di pantai & merasakan gempa kuat — SEGERA lari ke dataran tinggi',
        'Jangan menunggu peringatan resmi, langsung bergerak',
        'Lari ke tempat minimal 30 meter di atas permukaan laut',
        'Jauhi pantai, sungai, dan muara sungai',
        'Jika terjebak, pegang benda terapung yang kuat',
        'Jangan kembali ke pantai sampai ada pernyataan aman resmi',
        'Waspadai gelombang susulan yang bisa lebih besar',
      ],
    },
    longsor: {
      title: 'Tanah Longsor',
      steps: [
        'Jauhi daerah lereng dan tebing saat hujan lebat',
        'Perhatikan tanda: retakan tanah, suara gemuruh, air keruh tiba-tiba',
        'Segera evakuasi jika ada tanda-tanda longsor',
        'Lari menjauhi arah longsoran secara lateral (samping), bukan ke bawah',
        'Jangan mendekati area longsor setelah kejadian',
        'Hubungi petugas BPBD untuk bantuan evakuasi',
        'Periksa kondisi bangunan sebelum memasuki kembali',
      ],
    },
    erupsi: {
      title: 'Erupsi Gunung Api',
      steps: [
        'Ikuti arahan evakuasi dari PVMBG dan BPBD setempat',
        'Jauhi area dalam radius zona bahaya yang ditetapkan',
        'Gunakan masker N95 atau kain basah untuk lindungi pernapasan',
        'Tutup pintu dan jendela rapat-rapat dari abu vulkanik',
        'Lindungi sumber air dan makanan dari abu vulkanik',
        'Jangan menyeberangi sungai dekat gunung api (bahaya lahar)',
        'Siapkan tas siaga dengan perlengkapan minimal 3 hari',
      ],
    },
  },
};

const guideColors: Record<string, { bg: string; icon: string; badge: string }> = {
  gempa:  { bg: 'bg-red-50 dark:bg-red-900/20',    icon: 'bg-red-500',    badge: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' },
  banjir: { bg: 'bg-blue-50 dark:bg-blue-900/20',   icon: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
  tsunami:{ bg: 'bg-cyan-50 dark:bg-cyan-900/20',   icon: 'bg-cyan-500',   badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300' },
  longsor:{ bg: 'bg-amber-50 dark:bg-amber-900/20', icon: 'bg-amber-500',  badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' },
  erupsi: { bg: 'bg-orange-50 dark:bg-orange-900/20', icon: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' },
};

const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState<OfflineData | null>(null);
  const [expandedGuide, setExpandedGuide] = useState<string>('gempa'); // auto-expand first guide

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => { setIsOnline(false); loadOfflineData(); };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!navigator.onLine) loadOfflineData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineData = async () => {
    try {
      const cache = await caches.open('cegah-offline-data');
      const response = await cache.match('/offline-emergency-data');
      if (response) {
        const data = await response.json();
        setOfflineData(data);
      } else {
        setOfflineData(FALLBACK_OFFLINE_DATA);
      }
    } catch {
      setOfflineData(FALLBACK_OFFLINE_DATA);
    }
  };

  const guideIcons: Record<string, React.ReactNode> = {
    gempa:   <Mountain className="w-5 h-5 text-white" />,
    tsunami: <Waves className="w-5 h-5 text-white" />,
    banjir:  <Droplets className="w-5 h-5 text-white" />,
    longsor: <CloudRain className="w-5 h-5 text-white" />,
    erupsi:  <Flame className="w-5 h-5 text-white" />,
  };

  if (isOnline) return null;

  const data = offlineData || FALLBACK_OFFLINE_DATA;

  return (
    <div className="animate-slide-up">
      {/* Offline Hero Banner */}
      <div className="mx-4 mt-4 bg-gradient-to-r from-slate-900 to-red-900 rounded-3xl p-5 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-red-500 p-2.5 rounded-2xl shadow-lg shadow-red-500/30">
            <WifiOff className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-black text-base">Mode Offline Aktif</h3>
            <p className="text-xs text-slate-300 mt-0.5">Panduan darurat & nomor penting tersedia</p>
          </div>
          <div className="bg-red-500/20 border border-red-500/30 px-3 py-1.5 rounded-xl">
            <Shield className="w-4 h-4 text-red-300" />
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Fitur AI & data BMKG real-time tidak tersedia. Gunakan panduan darurat dan nomor penting di bawah ini.
        </p>
      </div>

      {/* Emergency Contacts - always visible */}
      <div className="mx-4 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-green-500 p-1.5 rounded-lg">
            <PhoneCall className="w-3.5 h-3.5 text-white" />
          </div>
          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">Nomor Darurat Indonesia</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {data.emergencyContacts.map((contact) => (
            <a
              key={contact.number}
              href={`tel:${contact.number.replace(/[^0-9]/g, '')}`}
              className="bg-slate-900 hover:bg-slate-800 rounded-2xl p-3 transition-colors text-center active:scale-95"
            >
              <p className="text-green-400 font-black text-lg leading-none">{contact.number}</p>
              <p className="font-bold text-white text-[11px] mt-1">{contact.name}</p>
              <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{contact.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Emergency Guides - auto-shown, first one expanded */}
      <div className="mx-4 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-red-500 p-1.5 rounded-lg">
            <AlertTriangle className="w-3.5 h-3.5 text-white" />
          </div>
          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">Panduan Darurat Offline</h3>
        </div>
        <div className="space-y-2">
          {Object.entries(data.guides).map(([key, guide]) => {
            const isExpanded = expandedGuide === key;
            const colors = guideColors[key] || guideColors.gempa;
            return (
              <div
                key={key}
                className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                  isExpanded
                    ? 'border-slate-200 dark:border-slate-700 shadow-md'
                    : 'border-slate-100 dark:border-slate-700/50'
                }`}
              >
                <button
                  onClick={() => setExpandedGuide(isExpanded ? '' : key)}
                  className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                    isExpanded ? colors.bg : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className={`${colors.icon} w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    {guideIcons[key] || <AlertTriangle className="w-5 h-5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-100 block">{guide.title}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{guide.steps.length} langkah tindakan darurat</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${colors.badge}`}>
                    {isExpanded ? 'Tutup' : 'Buka'}
                  </span>
                </button>

                {isExpanded && (
                  <div className="bg-white dark:bg-slate-800 px-4 pb-4 pt-2 animate-fade-in">
                    <ol className="space-y-2.5">
                      {guide.steps.map((step, idx) => (
                        <li key={idx} className="flex gap-3 items-start">
                          <span className={`${colors.icon} text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5 shadow-sm`}>
                            {idx + 1}
                          </span>
                          <span className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom note */}
      <div className="mx-4 mt-4 mb-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
        <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
          ⚡ Panduan ini tersedia 100% tanpa koneksi internet. Hubungi nomor darurat di atas untuk bantuan segera.
        </p>
      </div>
    </div>
  );
};

export default OfflineBanner;
