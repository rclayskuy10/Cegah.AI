import React, { useState, useEffect } from 'react';
import { Shield, MapPin, MessageSquare, Camera, Package, Siren, Activity, ChevronRight, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const FEATURES = [
  {
    icon: Shield,
    title: 'Selamat Datang di Cegah.AI',
    desc: 'Solusi kesiapsiagaan bencana berbasis AI untuk melindungi Anda dan keluarga di Indonesia.',
    color: 'from-red-500 to-orange-500',
    highlight: 'Aplikasi pertama yang menggabungkan AI, data BMKG real-time, dan fitur keselamatan keluarga.',
  },
  {
    icon: MessageSquare,
    title: 'CegahBot - Asisten AI Bencana',
    desc: 'Tanya apapun tentang kesiapsiagaan bencana. Mendukung input suara untuk situasi darurat.',
    color: 'from-blue-500 to-indigo-500',
    highlight: 'Didukung teknologi AI canggih dengan konteks bencana Indonesia.',
  },
  {
    icon: Camera,
    title: 'Analisis Kerusakan Cerdas',
    desc: 'Upload foto kerusakan untuk analisis tingkat keparahan otomatis dan rekomendasi tindakan.',
    color: 'from-orange-500 to-amber-500',
    highlight: 'AI mengidentifikasi jenis kerusakan dan langkah keselamatan yang harus diambil.',
  },
  {
    icon: MapPin,
    title: 'Peta Rawan & Risiko Lokasi',
    desc: 'Analisis risiko bencana berdasarkan lokasi GPS Anda dengan peta interaktif.',
    color: 'from-green-500 to-emerald-500',
    highlight: 'Penilaian risiko gempa, banjir, longsor berbasis koordinat.',
  },
  {
    icon: Siren,
    title: 'Darurat SOS & Keselamatan Keluarga',
    desc: 'Kirim lokasi darurat dengan satu ketukan. Beritahu keluarga bahwa Anda aman.',
    color: 'from-rose-500 to-red-500',
    highlight: 'Fitur "Goyangkan untuk SOS" dan broadcast "Saya Aman".',
  },
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goNext = () => {
    if (step < FEATURES.length - 1) {
      setAnimating(true);
      setTimeout(() => {
        setStep(s => s + 1);
        setAnimating(false);
      }, 200);
    } else {
      localStorage.setItem('cegah-onboarding-done', 'true');
      onComplete();
    }
  };

  const skip = () => {
    localStorage.setItem('cegah-onboarding-done', 'true');
    onComplete();
  };

  const feature = FEATURES[step];
  const Icon = feature.icon;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-6">
      {/* Skip Button */}
      <button
        onClick={skip}
        className="absolute top-6 right-6 text-slate-400 hover:text-white text-sm font-medium transition-colors"
      >
        Lewati
      </button>

      {/* Content */}
      <div className={`flex flex-col items-center text-center max-w-md transition-all duration-200 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        {/* Icon */}
        <div className={`bg-gradient-to-br ${feature.color} p-6 rounded-3xl shadow-2xl mb-8`}>
          <Icon className="w-16 h-16 text-white" />
        </div>

        {/* Text */}
        <h2 className="text-2xl md:text-3xl font-black text-white mb-3 leading-tight">{feature.title}</h2>
        <p className="text-slate-300 text-sm md:text-base mb-4 leading-relaxed">{feature.desc}</p>
        
        {/* Highlight Badge */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <p className="text-xs text-slate-200 leading-relaxed">{feature.highlight}</p>
          </div>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-2 mb-8">
        {FEATURES.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === step ? 'w-8 bg-red-500' : idx < step ? 'w-2 bg-red-500/50' : 'w-2 bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={goNext}
        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-10 py-4 rounded-2xl font-bold text-base shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/40 transition-all active:scale-[0.97] flex items-center gap-2"
      >
        {step === FEATURES.length - 1 ? 'Mulai Sekarang' : 'Selanjutnya'}
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Onboarding;
