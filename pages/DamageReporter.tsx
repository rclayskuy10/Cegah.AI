import React, { useState, useRef } from 'react';
import { Camera, Upload, AlertTriangle, CheckCircle, XCircle, Loader2, ArrowRight, ShieldAlert } from 'lucide-react';
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
        // Gemini needs just the base64 data, not the prefix
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
      case 'Severe': return 'bg-red-100 text-red-700 border-red-200';
      case 'Moderate': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Minor': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Lapor & Analisis</h2>
        <p className="text-sm text-slate-500">Unggah foto kerusakan untuk analisis cepat AI.</p>
      </div>

      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-2xl h-64 flex flex-col items-center justify-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
        >
          <div className="bg-white p-4 rounded-full shadow-sm mb-3">
            <Camera className="w-8 h-8 text-red-500" />
          </div>
          <p className="font-medium text-slate-600">Ambil Foto atau Upload</p>
          <p className="text-xs text-slate-400 mt-1">Dukung JPG/PNG</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageUpload} 
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative rounded-2xl overflow-hidden shadow-md aspect-video bg-black">
            <img src={image} alt="Report Preview" className="w-full h-full object-contain" />
            <button 
              onClick={reset}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full backdrop-blur-sm"
            >
              <XCircle size={24} />
            </button>
          </div>

          {loading && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center py-10">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin mx-auto mb-3" />
              <h3 className="font-semibold text-slate-800">Menganalisis Kerusakan...</h3>
              <p className="text-xs text-slate-500 mt-1">AI sedang memproses tingkat keparahan.</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
              <AlertTriangle className="flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {analysis && (
            <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-5 border-b border-slate-100">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-800">Hasil Analisis</h3>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getSeverityColor(analysis.severity)}`}>
                        {analysis.severity} Impact
                    </span>
                </div>
                <p className="text-slate-600 font-medium">{analysis.damageType}</p>
              </div>
              
              <div className="p-5 bg-slate-50 space-y-4">
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tindakan Segera</h4>
                    <ul className="space-y-2">
                        {analysis.immediateActions.map((action, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{action}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pemeriksaan Keamanan</h4>
                    <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <ShieldAlert className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <p className="text-sm text-blue-800 font-medium leading-relaxed">
                            {analysis.safetyCheck}
                        </p>
                    </div>
                </div>
              </div>
              
              <div className="p-4 bg-white border-t border-slate-100">
                 <button className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-900 transition-colors flex items-center justify-center gap-2">
                    Kirim Laporan ke Petugas <ArrowRight size={16} />
                 </button>
                 <p className="text-center text-[10px] text-slate-400 mt-2">
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