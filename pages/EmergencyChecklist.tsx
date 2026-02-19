import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Package, Download, Share2, RotateCcw } from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  description: string;
  checked: boolean;
}

const CHECKLIST_DATA: Omit<ChecklistItem, 'checked'>[] = [
  // Dokumen & Uang
  { id: 'doc1', category: 'Dokumen & Uang', item: 'KTP & Kartu Keluarga', description: 'Fotokopi & dokumen asli dalam plastik kedap air' },
  { id: 'doc2', category: 'Dokumen & Uang', item: 'Buku Tabungan & ATM', description: 'Simpan dalam kantong tertutup rapat' },
  { id: 'doc3', category: 'Dokumen & Uang', item: 'Uang Tunai', description: 'Minimal Rp 500.000 pecahan kecil' },
  { id: 'doc4', category: 'Dokumen & Uang', item: 'BPJS/Asuransi', description: 'Kartu kesehatan dan asuransi' },
  
  // Kebutuhan Dasar
  { id: 'basic1', category: 'Kebutuhan Dasar', item: 'Air Minum', description: '3 liter per orang untuk 3 hari' },
  { id: 'basic2', category: 'Kebutuhan Dasar', item: 'Makanan Tahan Lama', description: 'Biskuit, makanan kaleng, kurma' },
  { id: 'basic3', category: 'Kebutuhan Dasar', item: 'Pakaian Ganti', description: '2-3 pasang, termasuk pakaian hangat' },
  { id: 'basic4', category: 'Kebutuhan Dasar', item: 'Selimut/Sleeping Bag', description: 'Untuk kehangatan di pengungsian' },
  
  // Kesehatan
  { id: 'health1', category: 'Kesehatan', item: 'Obat-obatan Pribadi', description: 'Obat rutin & resep dokter' },
  { id: 'health2', category: 'Kesehatan', item: 'P3K Dasar', description: 'Perban, plester, antiseptik, obat demam' },
  { id: 'health3', category: 'Kesehatan', item: 'Masker & Hand Sanitizer', description: 'Untuk kebersihan di pengungsian' },
  { id: 'health4', category: 'Kesehatan', item: 'Vitamin & Suplemen', description: 'Untuk menjaga daya tahan tubuh' },
  
  // Alat Komunikasi & Penerangan
  { id: 'comm1', category: 'Komunikasi & Penerangan', item: 'HP & Charger', description: 'Termasuk powerbank penuh' },
  { id: 'comm2', category: 'Komunikasi & Penerangan', item: 'Senter & Baterai Cadangan', description: 'Minimal 2 buah senter' },
  { id: 'comm3', category: 'Komunikasi & Penerangan', item: 'Radio Portable', description: 'Untuk info darurat dari BMKG/BNPB' },
  { id: 'comm4', category: 'Komunikasi & Penerangan', item: 'Peluit Darurat', description: 'Untuk meminta pertolongan' },
  
  // Kebersihan
  { id: 'hygiene1', category: 'Kebersihan', item: 'Sabun & Shampo', description: 'Ukuran travel pack' },
  { id: 'hygiene2', category: 'Kebersihan', item: 'Sikat Gigi & Pasta Gigi', description: 'Untuk setiap anggota keluarga' },
  { id: 'hygiene3', category: 'Kebersihan', item: 'Handuk Kecil', description: '1-2 buah handuk cepat kering' },
  { id: 'hygiene4', category: 'Kebersihan', item: 'Tissue & Tisu Basah', description: 'Untuk kebersihan darurat' },
  
  // Perlengkapan Khusus
  { id: 'special1', category: 'Perlengkapan Khusus', item: 'Susu Formula & Popok', description: 'Jika ada bayi/balita' },
  { id: 'special2', category: 'Perlengkapan Khusus', item: 'Kacamata Cadangan', description: 'Jika menggunakan kacamata' },
  { id: 'special3', category: 'Perlengkapan Khusus', item: 'Makanan Hewan Peliharaan', description: 'Jika membawa hewan peliharaan' },
  { id: 'special4', category: 'Perlengkapan Khusus', item: 'Alat Tulis & Catatan', description: 'Untuk mencatat informasi penting' },
  
  // Alat Tambahan
  { id: 'tools1', category: 'Alat Tambahan', item: 'Pisau Lipat/Multitool', description: 'Untuk berbagai keperluan darurat' },
  { id: 'tools2', category: 'Alat Tambahan', item: 'Tali/Rope', description: '5-10 meter tali kuat' },
  { id: 'tools3', category: 'Alat Tambahan', item: 'Plastik Besar/Terpal', description: 'Untuk alas atau penutup' },
  { id: 'tools4', category: 'Alat Tambahan', item: 'Korek Api/Lighter', description: 'Simpan dalam wadah kedap air' },
];

const EmergencyChecklist: React.FC = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  useEffect(() => {
    // Load from localStorage or initialize
    const saved = localStorage.getItem('cegah-checklist');
    if (saved) {
      setChecklist(JSON.parse(saved));
    } else {
      setChecklist(CHECKLIST_DATA.map(item => ({ ...item, checked: false })));
    }
  }, []);

  useEffect(() => {
    // Save to localStorage whenever checklist changes
    if (checklist.length > 0) {
      localStorage.setItem('cegah-checklist', JSON.stringify(checklist));
    }
  }, [checklist]);

  const toggleItem = (id: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const resetChecklist = () => {
    if (confirm('Reset semua checklist? Progress akan hilang.')) {
      setChecklist(CHECKLIST_DATA.map(item => ({ ...item, checked: false })));
    }
  };

  const categories = ['Semua', ...Array.from(new Set(CHECKLIST_DATA.map(item => item.category)))];
  
  const filteredChecklist = selectedCategory === 'Semua' 
    ? checklist 
    : checklist.filter(item => item.category === selectedCategory);

  const totalItems = checklist.length;
  const checkedItems = checklist.filter(item => item.checked).length;
  const progress = Math.round((checkedItems / totalItems) * 100);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Dokumen & Uang': 'bg-blue-50 border-blue-200 text-blue-700',
      'Kebutuhan Dasar': 'bg-green-50 border-green-200 text-green-700',
      'Kesehatan': 'bg-red-50 border-red-200 text-red-700',
      'Komunikasi & Penerangan': 'bg-yellow-50 border-yellow-200 text-yellow-700',
      'Kebersihan': 'bg-purple-50 border-purple-200 text-purple-700',
      'Perlengkapan Khusus': 'bg-pink-50 border-pink-200 text-pink-700',
      'Alat Tambahan': 'bg-orange-50 border-orange-200 text-orange-700',
    };
    return colors[category] || 'bg-slate-50 border-slate-200 text-slate-700';
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800">Tas Siaga Bencana</h2>
        <p className="text-sm text-slate-400 mt-1">Checklist persiapan untuk keluarga Anda</p>
      </div>

      {/* Progress Card */}
      <div className="animate-slide-up bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">Progress Kesiapan</h3>
            <p className="text-white/80 text-sm">{checkedItems} dari {totalItems} item</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
            <Package className="w-8 h-8" />
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-white/20 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-right text-sm mt-2 font-bold">{progress}%</p>
        
        {progress === 100 && (
          <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
            <p className="text-sm font-semibold text-center">
              🎉 Tas siaga Anda sudah lengkap! Periksa kembali setiap 6 bulan.
            </p>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-red-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {filteredChecklist.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`bg-white rounded-2xl p-4 border-2 transition-all cursor-pointer hover:shadow-md ${
              item.checked 
                ? 'border-green-300 bg-green-50/30' 
                : 'border-slate-100 hover:border-red-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {item.checked ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-300" />
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className={`font-bold text-sm transition-all ${
                    item.checked ? 'text-green-700 line-through' : 'text-slate-800'
                  }`}>
                    {item.item}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </div>
                <p className={`text-xs leading-relaxed ${
                  item.checked ? 'text-green-600' : 'text-slate-500'
                }`}>
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 sticky bottom-4">
        <button
          onClick={resetChecklist}
          className="flex-1 bg-white text-slate-700 px-4 py-3 rounded-2xl font-bold shadow-sm border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-5 rounded-2xl">
        <h4 className="font-bold text-blue-900 text-sm mb-2">💡 Tips Penting</h4>
        <ul className="text-xs text-blue-700 space-y-1.5 leading-relaxed">
          <li>• Simpan tas siaga di tempat yang mudah dijangkau</li>
          <li>• Periksa dan perbarui isi tas setiap 6 bulan sekali</li>
          <li>• Pastikan semua anggota keluarga tahu lokasi tas</li>
          <li>• Sesuaikan isi dengan kebutuhan keluarga Anda</li>
          <li>• Siapkan tas terpisah untuk hewan peliharaan jika ada</li>
        </ul>
      </div>
    </div>
  );
};

export default EmergencyChecklist;
