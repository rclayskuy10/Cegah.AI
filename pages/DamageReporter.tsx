import React, { useState, useRef } from 'react';
import { Camera, Upload, AlertTriangle, CheckCircle, XCircle, Loader2, ArrowRight, ShieldAlert, ImagePlus, RotateCcw, Sparkles } from 'lucide-react';
import { analyzeDamageImage } from '../services/gemini';
import { DamageAnalysis } from '../types';

const DamageReporter: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<DamageAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setImage(base64String);
        analyzeImage(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64Data: string) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await analyzeDamageImage(base64Data);
      setAnalysis(result);
    } catch (err) {
      setError("Gagal menganalisis gambar. Pastikan gambar jelas dan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setAnalysis(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Severe': return 'bg-red-50 text-red-600 border-red-200';
      case 'Moderate': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'Minor': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'Severe': return 'from-red-500 to-red-600';
      case 'Moderate': return 'from-orange-500 to-orange-600';
      case 'Minor': return 'from-yellow-500 to-yellow-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="mb-2 animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800">Lapor & Analisis</h2>
        <p className="text-sm text-slate-400 mt-1">Unggah foto kerusakan untuk analisis cepat berbasis AI.</p>
      </div>

      {!image ? (
        <div className="animate-slide-up">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group border-2 border-dashed border-slate-200 rounded-3xl h-72 flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50 cursor-pointer hover:border-red-300 hover:bg-gradient-to-b hover:from-red-50/30 hover:to-orange-50/20 transition-all duration-300"
          >
            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 p-5 rounded-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <ImagePlus className="w-10 h-10 text-red-400 group-hover:text-red-500 transition-colors" />
            </div>
            <p className="font-bold text-slate-700 text-base">Ambil Foto atau Upload</p>
            <p className="text-xs text-slate-400 mt-1.5">Mendukung format JPG & PNG</p>
            <div className="mt-4 bg-red-50 text-red-500 px-4 py-2 rounded-full text-xs font-semibold border border-red-100 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
              Pilih Gambar
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Image Preview */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-video bg-slate-900">
            <img src={image} alt="Report Preview" className="w-full h-full object-contain" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            <button 
              onClick={reset}
              className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-xl backdrop-blur-sm transition-colors shadow-lg flex items-center gap-1.5 text-xs font-semibold"
            >
              <RotateCcw size={14} />
              Reset
            </button>
            {analysis && (
              <div className={`absolute bottom-3 left-3 bg-gradient-to-r ${getSeverityBg(analysis.severity)} text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg`}>
                {analysis.severity} Impact
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
              <div className="relative inline-block">
                <div className="w-16 h-16 border-4 border-slate-100 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin absolute inset-0"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-red-500" />
                </div>
              </div>
              <h3 className="font-bold text-slate-800 mt-4 text-lg">Menganalisis Kerusakan...</h3>
              <p className="text-xs text-slate-400 mt-1">AI sedang memproses tingkat keparahan gambar Anda.</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 p-5 rounded-2xl flex items-center gap-3 animate-fade-in">
              <div className="bg-red-100 p-2 rounded-xl flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">Terjadi Kesalahan</p>
                <p className="text-xs text-red-600 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Analysis Result */}
          {analysis && (
            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden animate-slide-up">
              <div className="p-5 md:p-6 border-b border-slate-100">
                <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Hasil Analisis AI</span>
                      </div>
                      <h3 className="font-black text-xl text-slate-800">Laporan Kerusakan</h3>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${getSeverityColor(analysis.severity)}`}>
                        {analysis.severity}
                    </span>
                </div>
                <p className="text-slate-600 font-medium bg-slate-50 px-4 py-3 rounded-xl text-sm">{analysis.damageType}</p>
              </div>
              
              <div className="p-5 md:p-6 space-y-5">
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      Tindakan Segera
                    </h4>
                    <ul className="space-y-2">
                        {analysis.immediateActions.map((action, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 bg-green-50/50 p-3.5 rounded-2xl border border-green-100/50 hover:bg-green-50 transition-colors">
                                <span className="bg-green-500 text-white w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{idx + 1}</span>
                                <span className="leading-relaxed">{action}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
                      Pemeriksaan Keamanan
                    </h4>
                    <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                        <ShieldAlert className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-800 font-medium leading-relaxed">
                            {analysis.safetyCheck}
                        </p>
                    </div>
                </div>
              </div>
              
              <div className="p-5 md:p-6 bg-slate-50 border-t border-slate-100">
                 <button className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white py-3.5 rounded-2xl font-bold text-sm hover:from-slate-700 hover:to-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 active:scale-[0.98]">
                    Kirim Laporan ke Petugas <ArrowRight size={16} />
                 </button>
                 <p className="text-center text-[10px] text-slate-400 mt-2.5">
                    Laporan akan diteruskan ke BPBD setempat (Simulasi).
                 </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DamageReporter;