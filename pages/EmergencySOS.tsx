import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Phone, MapPin, Share2, Shield, Heart, AlertTriangle, Siren, Users, Vibrate, Volume2 } from 'lucide-react';

interface EmergencyContact {
  name: string;
  number: string;
  desc: string;
  color: string;
}

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { name: 'Darurat Umum', number: '112', desc: 'Ambulans, Pemadam, Polisi', color: 'from-red-500 to-red-600' },
  { name: 'Basarnas', number: '115', desc: 'Pencarian & Pertolongan', color: 'from-orange-500 to-orange-600' },
  { name: 'Polisi', number: '110', desc: 'Bantuan Keamanan', color: 'from-blue-500 to-blue-600' },
  { name: 'Ambulans', number: '118', desc: 'Layanan Medis Darurat', color: 'from-green-500 to-green-600' },
  { name: 'PMI', number: '119', desc: 'Palang Merah Indonesia', color: 'from-rose-500 to-rose-600' },
  { name: 'BNPB', number: '117', desc: 'Badan Penanggulangan Bencana', color: 'from-purple-500 to-purple-600' },
];

const EmergencySOS: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationName, setLocationName] = useState<string>('Mencari lokasi...');
  const [isSafe, setIsSafe] = useState<boolean | null>(null);
  const [safeBroadcastSent, setSafeBroadcastSent] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [shakeEnabled, setShakeEnabled] = useState(() => {
    return localStorage.getItem('cegah-shake-sos') === 'true';
  });
  const shakeThreshold = 25;
  const lastShakeTime = useRef(0);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lon: longitude });
          setLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        () => setLocationName('Lokasi tidak tersedia')
      );
    }
  }, []);

  // Shake detection for SOS activation
  useEffect(() => {
    if (!shakeEnabled || typeof DeviceMotionEvent === 'undefined') return;

    const handleMotion = (e: DeviceMotionEvent) => {
      const accel = e.accelerationIncludingGravity;
      if (!accel || accel.x === null || accel.y === null || accel.z === null) return;

      const totalAccel = Math.sqrt(accel.x ** 2 + accel.y ** 2 + accel.z ** 2);
      const now = Date.now();

      if (totalAccel > shakeThreshold && now - lastShakeTime.current > 2000) {
        lastShakeTime.current = now;
        setSosActive(true);
        // Vibrate pattern for SOS: ... --- ...
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100, 50, 100, 200, 300, 50, 300, 50, 300, 200, 100, 50, 100, 50, 100]);
        }
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [shakeEnabled]);

  const toggleShakeDetection = () => {
    const newVal = !shakeEnabled;
    setShakeEnabled(newVal);
    localStorage.setItem('cegah-shake-sos', String(newVal));
    if (newVal && navigator.vibrate) {
      navigator.vibrate(200);
    }
  };

  const shareLocation = useCallback(async () => {
    const locText = location
      ? `https://www.google.com/maps?q=${location.lat},${location.lon}`
      : 'Lokasi tidak tersedia';

    const message = `🆘 *DARURAT - Cegah.AI*\n\nSaya membutuhkan bantuan!\n📍 Lokasi: ${locText}\n⏰ Waktu: ${new Date().toLocaleString('id-ID')}\n\n_Pesan dikirim via Cegah.AI Emergency SOS_`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'SOS - Cegah.AI', text: message });
      } catch { /* user cancelled */ }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    }
  }, [location]);

  const broadcastSafe = useCallback(async () => {
    const locText = location
      ? `https://www.google.com/maps?q=${location.lat},${location.lon}`
      : '';

    const message = `✅ *SAYA AMAN - Cegah.AI*\n\nSaya dalam kondisi aman setelah kejadian bencana.\n${locText ? `📍 Lokasi terakhir: ${locText}\n` : ''}⏰ Waktu: ${new Date().toLocaleString('id-ID')}\n\n_Pesan dikirim via Cegah.AI Family Safety_`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Saya Aman - Cegah.AI', text: message });
        setIsSafe(true);
        setSafeBroadcastSent(true);
      } catch { /* user cancelled */ }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
      setIsSafe(true);
      setSafeBroadcastSent(true);
    }
  }, [location]);

  return (
    <div className="p-4 md:p-8 space-y-5">
      {/* Header */}
      <div className="animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">Darurat SOS</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Akses cepat bantuan darurat & berbagi lokasi</p>
      </div>

      {/* SOS Button */}
      <div className="animate-slide-up flex justify-center">
        <button
          onClick={shareLocation}
          className={`relative w-44 h-44 rounded-full flex flex-col items-center justify-center text-white font-black shadow-2xl transition-all duration-300 active:scale-95 ${
            sosActive
              ? 'bg-gradient-to-br from-red-600 to-red-700 shadow-red-500/50 animate-pulse-soft'
              : 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105'
          }`}
        >
          <div className="absolute inset-0 rounded-full border-4 border-red-400/30 animate-ping" style={{ animationDuration: '2s' }}></div>
          <div className="absolute inset-2 rounded-full border-2 border-white/20"></div>
          <Siren className="w-12 h-12 mb-1" />
          <span className="text-2xl tracking-tight">SOS</span>
          <span className="text-[10px] font-semibold opacity-80">Kirim Lokasi Darurat</span>
        </button>
      </div>

      {/* Location Info */}
      <div className="animate-slide-up bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex items-center gap-3">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-xl flex-shrink-0">
          <MapPin className="w-5 h-5 text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Lokasi Anda</p>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{locationName}</p>
        </div>
        {location && (
          <button
            onClick={shareLocation}
            className="bg-red-50 dark:bg-red-900/30 text-red-500 p-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors flex-shrink-0"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* I'm Safe Button */}
      <div className="animate-slide-up">
        {!safeBroadcastSent ? (
          <button
            onClick={broadcastSafe}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-2xl font-bold shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <Heart className="w-5 h-5" />
            <div className="text-left">
              <span className="block text-sm">Saya Aman</span>
              <span className="block text-[10px] font-medium opacity-80">Beritahu keluarga & teman</span>
            </div>
          </button>
        ) : (
          <div className="w-full bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 p-4 rounded-2xl flex items-center gap-3">
            <div className="bg-green-500 p-2 rounded-xl flex-shrink-0">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-green-700 dark:text-green-300 text-sm">Status Aman Terkirim</p>
              <p className="text-xs text-green-600 dark:text-green-400">Keluarga telah diberitahu</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Dial Emergency Contacts */}
      <div className="animate-slide-up">
        <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
          <Phone className="w-4 h-4 text-red-500" />
          Hubungi Darurat
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {EMERGENCY_CONTACTS.map((contact) => (
            <a
              key={contact.number}
              href={`tel:${contact.number}`}
              className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all active:scale-[0.97] group"
            >
              <div className={`bg-gradient-to-r ${contact.color} w-10 h-10 rounded-xl flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform`}>
                <Phone className="w-5 h-5 text-white" />
              </div>
              <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">{contact.name}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-1.5">{contact.desc}</p>
              <span className="text-lg font-black text-slate-800 dark:text-white">{contact.number}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="animate-slide-up bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 space-y-3">
        <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm flex items-center gap-2">
          <Shield className="w-4 h-4 text-slate-500" />
          Pengaturan Darurat
        </h3>
        
        {/* Shake to SOS */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 dark:bg-orange-900/30 p-2 rounded-xl">
              <Vibrate className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Goyangkan untuk SOS</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Goyangkan HP kuat untuk aktifkan SOS</p>
            </div>
          </div>
          <button
            onClick={toggleShakeDetection}
            className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
              shakeEnabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-200 ${
              shakeEnabled ? 'translate-x-5' : 'translate-x-0.5'
            }`}></div>
          </button>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="animate-slide-up bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="bg-amber-500 p-2 rounded-xl flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-amber-800 dark:text-amber-200 text-sm">Tips Keselamatan</h4>
            <ul className="mt-2 space-y-1.5">
              <li className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">• Simpan nomor darurat di speed dial HP Anda</li>
              <li className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">• Bagikan lokasi real-time ke keluarga saat bencana</li>
              <li className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">• Sepakati titik kumpul keluarga jika terpisah</li>
              <li className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">• Aktifkan fitur "Goyangkan untuk SOS" agar bisa cepat mengirim lokasi darurat</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencySOS;
