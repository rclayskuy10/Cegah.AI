import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, AlertTriangle, PhoneCall, Mountain, Waves, CloudRain, Droplets, Flame, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

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

const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showGuides, setShowGuides] = useState(false);
  const [offlineData, setOfflineData] = useState<OfflineData | null>(null);
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      loadOfflineData();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!navigator.onLine) {
      loadOfflineData();
    }

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
      }
    } catch (err) {
      // Fallback data if cache isn't available
      setOfflineData({
        emergencyContacts: [
          { name: 'Darurat Umum', number: '112', desc: 'Ambulans, Pemadam, Polisi' },
          { name: 'Basarnas', number: '115', desc: 'Pencarian & Pertolongan' },
          { name: 'Polisi', number: '110', desc: 'Bantuan Keamanan' },
        ],
        guides: {
          gempa: {
            title: 'Panduan Saat Gempa Bumi',
            steps: [
              'DROP - Jatuhkan badan ke lantai',
              'COVER - Berlindung di bawah meja kokoh',
              'HOLD ON - Pegang kuat sampai guncangan berhenti',
              'Jangan berlari keluar saat berguncang',
              'Keluar dengan hati-hati setelah berhenti',
            ]
          }
        }
      });
    }
  };

  const guideIcons: Record<string, React.ReactNode> = {
    gempa: <Mountain className="w-5 h-5" />,
    tsunami: <Waves className="w-5 h-5" />,
    banjir: <Droplets className="w-5 h-5" />,
    longsor: <CloudRain className="w-5 h-5" />,
    erupsi: <Flame className="w-5 h-5" />,
  };

  if (isOnline) return null;

  return (
    <div className="animate-slide-up">
      {/* Offline Banner */}
      <div className="mx-4 mt-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-500 p-2 rounded-xl flex-shrink-0">
            <WifiOff className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-yellow-800 dark:text-yellow-200 text-sm">Mode Offline</h4>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-0.5">
              Beberapa fitur tidak tersedia. Panduan darurat tetap bisa diakses.
            </p>
          </div>
          <button
            onClick={() => setShowGuides(!showGuides)}
            className="bg-yellow-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-yellow-600 transition-colors flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            {showGuides ? 'Tutup' : 'Panduan'}
          </button>
        </div>
      </div>

      {/* Offline Emergency Content */}
      {showGuides && offlineData && (
        <div className="mx-4 mt-3 space-y-3 animate-fade-in">
          {/* Emergency Contacts */}
          <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-4">
              <PhoneCall className="w-4 h-4 text-green-400" />
              <h3 className="font-bold text-sm">Nomor Darurat (Tersedia Offline)</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {offlineData.emergencyContacts.map((contact) => (
                <a
                  key={contact.number}
                  href={`tel:${contact.number.replace(/[^0-9]/g, '')}`}
                  className="bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-colors"
                >
                  <p className="font-bold text-sm">{contact.name}</p>
                  <p className="text-green-400 font-mono text-lg font-bold">{contact.number}</p>
                  <p className="text-[10px] text-slate-400">{contact.desc}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Emergency Guides */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">Panduan Darurat (Offline)</h3>
              </div>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {Object.entries(offlineData.guides).map(([key, guide]) => (
                <div key={key}>
                  <button
                    onClick={() => setExpandedGuide(expandedGuide === key ? null : key)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="bg-red-50 dark:bg-red-900/30 text-red-500 p-2 rounded-xl flex-shrink-0">
                      {guideIcons[key] || <AlertTriangle className="w-5 h-5" />}
                    </div>
                    <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 flex-1">{guide.title}</span>
                    {expandedGuide === key ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {expandedGuide === key && (
                    <div className="px-4 pb-4 animate-fade-in">
                      <ol className="space-y-2">
                        {guide.steps.map((step, idx) => (
                          <li key={idx} className="flex gap-3 items-start text-sm text-slate-600 dark:text-slate-300">
                            <span className="bg-red-500 text-white w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineBanner;
