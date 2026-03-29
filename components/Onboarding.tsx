import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Shield, MapPin, MessageSquare, Camera, Siren, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import SigapMascot, { MascotMood } from './SigapMascot';

interface OnboardingProps {
  onComplete: () => void;
}

interface Step {
  icon: React.FC<{ className?: string }>;
  title: string;
  desc: string;
  mascotMood: MascotMood;
  mascotSay: string;
  gradient: string;
  accentColor: string;
  highlight: string;
}

const STEPS: Step[] = [
  {
    icon: Shield,
    title: 'Selamat Datang di Cegah.AI',
    desc: 'Platform kesiapsiagaan bencana berbasis AI untuk melindungi Anda dan keluarga di Indonesia.',
    mascotMood: 'happy',
    mascotSay: 'Hai Kak! Saya SIGAP, pendamping keselamatan digital kamu. Yuk kenalan! 👋',
    gradient: 'from-red-600 via-red-500 to-orange-400',
    accentColor: 'red',
    highlight: 'AI + Data BMKG real-time + Fitur keselamatan keluarga',
  },
  {
    icon: MessageSquare,
    title: 'CegahBot — Asisten AI',
    desc: 'Tanya apa saja tentang bencana, evakuasi, atau P3K. SIGAP siap menjawab 24/7!',
    mascotMood: 'idle',
    mascotSay: 'Kamu bisa tanya apa saja, Kak. Dari gempa sampai pertolongan pertama! 💬',
    gradient: 'from-blue-600 via-indigo-500 to-purple-500',
    accentColor: 'blue',
    highlight: 'Didukung AI canggih dengan pengetahuan bencana Indonesia',
  },
  {
    icon: Camera,
    title: 'Analisis Foto Kerusakan',
    desc: 'Upload foto kerusakan — AI akan mengidentifikasi tingkat keparahan dan langkah keselamatan.',
    mascotMood: 'scanning',
    mascotSay: 'Cukup foto, saya analisis. Banjir, gempa, longsor — saya kenali semuanya! 📸',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    accentColor: 'orange',
    highlight: 'Deteksi otomatis jenis kerusakan + rekomendasi tindakan',
  },
  {
    icon: MapPin,
    title: 'Cek Lokasi & Risiko',
    desc: 'Ketahui potensi bencana di lokasi Anda — gempa, banjir, longsor — berdasarkan data nyata.',
    mascotMood: 'scanning',
    mascotSay: 'Izinkan akses lokasi, saya cek risiko bencana di sekitar kamu! 🗺️',
    gradient: 'from-emerald-500 via-green-500 to-teal-500',
    accentColor: 'green',
    highlight: 'Penilaian risiko berbasis koordinat GPS & peta interaktif',
  },
  {
    icon: Siren,
    title: 'Darurat SOS',
    desc: 'Satu ketukan untuk kirim lokasi darurat. Goyangkan HP untuk SOS otomatis!',
    mascotMood: 'alert',
    mascotSay: 'Saat darurat, saya selalu siap membantu. Keselamatan kamu prioritas utama! 🚨',
    gradient: 'from-rose-600 via-red-500 to-pink-500',
    accentColor: 'rose',
    highlight: 'Shake-to-SOS + Broadcast "Saya Aman" ke keluarga',
  },
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<'next' | 'prev'>('next');
  const [entering, setEntering] = useState(true);
  const touchStartX = useRef(0);
  const touchDelta = useRef(0);

  // ── Entrance animation per step ──
  useEffect(() => {
    setEntering(true);
    const t = setTimeout(() => setEntering(false), 50);
    return () => clearTimeout(t);
  }, [step]);

  const go = useCallback((target: number) => {
    if (target < 0 || target >= STEPS.length || target === step) return;
    setDir(target > step ? 'next' : 'prev');
    setStep(target);
  }, [step]);

  const finish = () => {
    localStorage.setItem('cegah-onboarding-done', 'true');
    onComplete();
  };

  // ── Swipe / Touch ──
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchMove = (e: React.TouchEvent) => { touchDelta.current = e.touches[0].clientX - touchStartX.current; };
  const onTouchEnd = () => {
    if (touchDelta.current < -50) go(step + 1);
    else if (touchDelta.current > 50) go(step - 1);
    touchDelta.current = 0;
  };

  const s = STEPS[step];
  const Icon = s.icon;
  const isLast = step === STEPS.length - 1;

  // Slide class
  const slideClass = entering
    ? (dir === 'next' ? 'translate-x-[60px] opacity-0' : '-translate-x-[60px] opacity-0')
    : 'translate-x-0 opacity-100';

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col overflow-hidden select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Animated background ── */}
      <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} transition-all duration-700`} />
      <div className="absolute inset-0 bg-black/30" />

      {/* Decorative floating circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/5 rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-1/3 -right-16 w-56 h-56 bg-white/5 rounded-full animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute -bottom-12 left-1/4 w-40 h-40 bg-white/5 rounded-full animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
      </div>

      {/* ── Skip ── */}
      <button
        onClick={finish}
        className="absolute top-5 right-5 z-10 text-white/60 hover:text-white text-sm font-medium backdrop-blur-sm bg-white/10 px-4 py-1.5 rounded-full transition-all hover:bg-white/20"
      >
        Lewati
      </button>

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 pt-14 pb-6">
        <div className={`flex flex-col items-center text-center max-w-sm transition-all duration-500 ease-out ${slideClass}`}>

          {/* Mascot + speech bubble */}
          <div className="relative mb-2">
            <div className="relative">
              <SigapMascot mood={s.mascotMood} size={130} />
            </div>
          </div>

          {/* Speech bubble */}
          <div className="relative bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 mb-6 max-w-xs">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/15 border-l border-t border-white/20 rotate-45" />
            <p className="text-white text-sm leading-relaxed font-medium relative z-10">{s.mascotSay}</p>
          </div>

          {/* Feature icon + title */}
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">{s.title}</h2>
          </div>

          {/* Description */}
          <p className="text-white/80 text-sm md:text-base mb-4 leading-relaxed max-w-[300px]">{s.desc}</p>

          {/* Highlight chip */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-300 flex-shrink-0" />
              <p className="text-xs text-white/90 leading-relaxed font-medium">{s.highlight}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom controls ── */}
      <div className="relative z-10 px-6 pb-8 flex flex-col items-center gap-5">
        {/* Progress bar */}
        <div className="flex items-center gap-2">
          {STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => go(idx)}
              className={`h-2 rounded-full transition-all duration-500 ${
                idx === step
                  ? 'w-10 bg-white'
                  : idx < step
                    ? 'w-3 bg-white/50 hover:bg-white/70'
                    : 'w-3 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* CTA button */}
        {isLast ? (
          <button
            onClick={finish}
            className="group w-full max-w-xs bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold text-base shadow-2xl shadow-black/20 hover:shadow-3xl transition-all active:scale-[0.97] flex items-center justify-center gap-2"
          >
            <span>Mulai Sekarang</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <button
            onClick={() => go(step + 1)}
            className="group w-full max-w-xs bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-xl hover:bg-white/30 transition-all active:scale-[0.97] flex items-center justify-center gap-2"
          >
            <span>Selanjutnya</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        {/* Step counter */}
        <p className="text-white/40 text-xs font-medium">{step + 1} / {STEPS.length}</p>
      </div>
    </div>
  );
};

export default Onboarding;
