import React from 'react';

export type MascotMood = 'idle' | 'thinking' | 'happy' | 'alert' | 'scanning';

interface SigapMascotProps {
  mood?: MascotMood;
  size?: number;
  className?: string;
  label?: string;
}

const SigapMascot: React.FC<SigapMascotProps> = ({
  mood = 'idle',
  size = 120,
  className = '',
  label,
}) => {
  // Unique IDs per instance to avoid SVG gradient conflicts
  const uid = React.useId().replace(/:/g, '_');
  // Indonesia-themed color tokens
  const sk  = `${uid}sk`;  // sawo matang skin
  const ir  = `${uid}ir`;  // dark brown iris
  const ou  = `${uid}ou`;  // SAR uniform (cokelat tua)
  const hr  = `${uid}hr`;  // hitam berkilau (black hair)
  const bt  = `${uid}bt`;  // baret gradient
  const bg  = `${uid}bg`;  // background badge merah-putih

  const height = Math.round(size * 1.28);

  return (
    <div className={`flex flex-col items-center gap-1.5 ${className}`} style={{ width: size }}>
      <svg
        width={size}
        height={height}
        viewBox="0 0 160 205"
        overflow="visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sawo matang — kulit khas Indonesia (cokelat kekuningan hangat) */}
          <radialGradient id={sk} cx="42%" cy="32%" r="65%">
            <stop offset="0%"   stopColor="#D4955A" />
            <stop offset="100%" stopColor="#A0622A" />
          </radialGradient>
          {/* Iris cokelat tua / hitam — khas mata orang Indonesia */}
          <radialGradient id={ir} cx="35%" cy="28%" r="65%">
            <stop offset="0%"   stopColor="#6B3A1F" />
            <stop offset="55%"  stopColor="#3D1A0A" />
            <stop offset="100%" stopColor="#0A0402" />
          </radialGradient>
          {/* Seragam SAR/BASARNAS cokelat khaki */}
          <linearGradient id={ou} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#8B6914" />
            <stop offset="100%" stopColor="#5C430A" />
          </linearGradient>
          {/* Rambut hitam berkilau Indonesia */}
          <radialGradient id={hr} cx="38%" cy="10%" r="65%">
            <stop offset="0%"   stopColor="#2A2020" />
            <stop offset="60%"  stopColor="#0D0808" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          {/* Baret orange SAR Indonesia */}
          <radialGradient id={bt} cx="40%" cy="25%" r="65%">
            <stop offset="0%"   stopColor="#F97316" />
            <stop offset="100%" stopColor="#C2410C" />
          </radialGradient>
          {/* Lencana bulat merah-putih bendera Indonesia */}
          <linearGradient id={bg} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#DC2626" />
            <stop offset="50%"  stopColor="#DC2626" />
            <stop offset="50%"  stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
        </defs>

        {/* ── Ground shadow (animasi napas) ── */}
        <ellipse cx="80" cy="200" rx="52" ry="6" fill="rgba(0,0,0,0.10)">
          {mood === 'idle' && <animate attributeName="rx" values="52;46;52" dur="2.5s" repeatCount="indefinite" />}
          {mood === 'happy' && <animate attributeName="rx" values="52;38;52" dur="1.2s" repeatCount="indefinite" />}
          {mood === 'alert' && <animate attributeName="rx" values="52;50;52;50;52" dur="0.5s" repeatCount="indefinite" />}
          {mood === 'thinking' && <animate attributeName="rx" values="52;48;52" dur="3s" repeatCount="indefinite" />}
          {mood === 'scanning' && <animate attributeName="rx" values="48;52;48" dur="1.8s" repeatCount="indefinite" />}
        </ellipse>

        {/* ═══ WRAPPER ANIMASI UTAMA ═══ */}
        <g>
          {/* Idle: napas naik-turun + goyang pelan */}
          {mood === 'idle' && <animateTransform attributeName="transform" type="translate" values="0,0;-1,-4;0,-6;1,-4;0,0" dur="2.5s" repeatCount="indefinite" />}
          {/* Thinking: miringkan kepala bolak-balik */}
          {mood === 'thinking' && <animateTransform attributeName="transform" type="rotate" values="0 80 100;-3 80 100;0 80 100;3 80 100;0 80 100" dur="3s" repeatCount="indefinite" />}
          {/* Happy: bounce energik */}
          {mood === 'happy' && <animateTransform attributeName="transform" type="translate" values="0,0;1,-10;0,-1;-1,-10;0,0" dur="1.2s" repeatCount="indefinite" />}
          {/* Alert: getar kuat */}
          {mood === 'alert' && <animateTransform attributeName="transform" type="translate" values="0,0;-2,-1;2,1;-2,0;2,-1;-1,1;1,0;0,0" dur="0.5s" repeatCount="indefinite" />}
          {/* Scanning: ayun + naik pelan */}
          {mood === 'scanning' && <animateTransform attributeName="transform" type="translate" values="0,0;-2,-2;0,-3;2,-2;0,0" dur="1.8s" repeatCount="indefinite" />}

        {/* ══════════════════ BADAN / SERAGAM SAR ══════════════════ */}
        {/* Tubuh utama seragam cokelat khaki */}
        <path d="M 34,170 Q 80,160 126,170 L 138,205 L 22,205 Z" fill={`url(#${ou})`} />

        {/* Kerah V seragam */}
        <path d="M 67,164 L 80,178 L 93,164"
          stroke="#F5DEB3" strokeWidth="2.2" fill="none"
          strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />

        {/* Epaulette (tanda pangkat di bahu) — kiri */}
        <rect x="28" y="168" width="22" height="6" rx="3" fill="#C2410C" opacity="0.9" />
        <rect x="30" y="169" width="4" height="4" rx="1" fill="#FBBF24" />
        <rect x="36" y="169" width="4" height="4" rx="1" fill="#FBBF24" />
        {/* Epaulette kanan */}
        <rect x="110" y="168" width="22" height="6" rx="3" fill="#C2410C" opacity="0.9" />
        <rect x="126" y="169" width="4" height="4" rx="1" fill="#FBBF24" />
        <rect x="120" y="169" width="4" height="4" rx="1" fill="#FBBF24" />

        {/* Saku dada kiri */}
        <rect x="50" y="172" width="20" height="14" rx="3"
          fill="#7A5C10" stroke="#C2A040" strokeWidth="0.8" />
        {/* Lencana SAR merah-putih di saku — berdenyut */}
        <circle cx="60" cy="179" r="6" fill={`url(#${bg})`}
          stroke="#E5E5E5" strokeWidth="0.8">
          <animate attributeName="r" values="6;7;6" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Bintang kecil di tengah lencana */}
        <text x="56.5" y="182" fontSize="5" fill="#F5D060" fontWeight="bold">★</text>

        {/* Sabuk / ikat pinggang cokelat tua */}
        <rect x="25" y="162" width="110" height="7" rx="3.5" fill="#3D2200" />
        <rect x="73" y="162" width="14" height="7" rx="2" fill="#C2A040" />
        <rect x="75" y="163.5" width="10" height="4" rx="1.5" fill="#3D2200" />

        {/* ══════════════════ LEHER ══════════════════ */}
        <rect x="69" y="150" width="22" height="16" rx="8" fill={`url(#${sk})`} />

        {/* ══════════════════ RAMBUT BELAKANG ══════════════════ */}
        {/* Rambut hitam pendek-rapi khas Indonesia (bukan panjang menjuntai) */}
        <ellipse cx="80" cy="86" rx="52" ry="56" fill={`url(#${hr})`} />

        {/* ══════════════════ TELINGA ══════════════════ */}
        <ellipse cx="29" cy="96" rx="8"   ry="10"  fill={`url(#${sk})`} />
        <ellipse cx="131" cy="96" rx="8"  ry="10"  fill={`url(#${sk})`} />
        <ellipse cx="29" cy="96" rx="4.5" ry="6.5" fill="#8B5520" opacity="0.35" />
        <ellipse cx="131" cy="96" rx="4.5" ry="6.5" fill="#8B5520" opacity="0.35" />

        {/* ══════════════════ WAJAH ══════════════════ */}
        <ellipse cx="80" cy="98" rx="48" ry="52" fill={`url(#${sk})`} />

        {/* ══════════════════ RAMBUT DEPAN (potongan pendek rapi) ══════════════════ */}
        {/* Garis rambut rata / fringe pendek */}
        <path d="M 32,82 Q 32,30 80,24 Q 128,30 128,82 Q 112,52 80,48 Q 48,52 32,82 Z"
          fill={`url(#${hr})`} />
        {/* Poni depan — pendek lurus (gaya Jakarta modern) */}
        <path d="M 34,60 Q 38,36 48,34 Q 56,34 54,58 Q 52,44 49,46 Q 45,50 40,66 Z"
          fill={`url(#${hr})`} />
        <path d="M 52,56 Q 57,34 66,32 Q 73,32 71,56 Q 69,42 66,44 Q 63,50 58,64 Z"
          fill={`url(#${hr})`} />
        {/* Tengah — poni rata */}
        <path d="M 70,56 Q 74,28 80,26 Q 86,28 82,56 Q 81,44 80,46 Q 79,44 78,56 Z"
          fill={`url(#${hr})`} />
        <path d="M 89,56 Q 93,34 101,32 Q 108,34 105,56 Q 103,42 100,44 Q 97,50 93,64 Z"
          fill={`url(#${hr})`} />
        <path d="M 106,58 Q 111,36 120,34 Q 126,36 123,58 Q 120,46 117,48 Q 114,52 110,66 Z"
          fill={`url(#${hr})`} />
        {/* Kilap rambut hitam */}
        <path d="M 48,36 Q 60,26 72,28" stroke="#4A3A3A" strokeWidth="2.5" fill="none"
          strokeLinecap="round" opacity="0.6" />
        <path d="M 56,32 Q 64,26 72,27" stroke="#6A5A5A" strokeWidth="1.2" fill="none"
          strokeLinecap="round" opacity="0.4" />

        {/* ══════════════════ BARET SAR INDONESIA ══════════════════ */}
        {/* Baret orange khas SAR/BASARNAS Indonesia */}
        {/* Lingkaran baret bawah */}
        <ellipse cx="80" cy="42" rx="53" ry="12" fill={`url(#${bt})`} />
        {/* Dome baret */}
        <path d="M 27,42 Q 26,10 80,8 Q 134,10 133,42 Z" fill={`url(#${bt})`} />
        {/* Shadow/gelap di sisi baret */}
        <path d="M 27,42 Q 26,10 80,8" stroke="#9A3412" strokeWidth="1.5"
          fill="none" strokeLinecap="round" opacity="0.5" />
        {/* Kilap baret */}
        <path d="M 44,20 Q 58,12 72,13" stroke="#FED7AA" strokeWidth="2.5" fill="none"
          strokeLinecap="round" opacity="0.55" />
        {/* Tali baret kiri — karet hitam */}
        <path d="M 27,43 Q 22,50 28,60" stroke="#1A1A1A" strokeWidth="3"
          fill="none" strokeLinecap="round" />
        {/* Lencana di baret — lingkaran hitam + bintang emas berkedip */}
        <circle cx="62" cy="26" r="9" fill="#1A1200" stroke="#C2A040" strokeWidth="1.5" />
        <circle cx="62" cy="26" r="6.5" fill="#0A0800" />
        <text x="57.5" y="29.5" fontSize="7.5" fill="#F5D060" fontWeight="bold">★</text>
        {/* Kilap bintang baret */}
        <circle cx="62" cy="26" r="8" fill="none" stroke="#FBBF24" strokeWidth="0.6" opacity="0">
          <animate attributeName="opacity" values="0;0.8;0" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="r" values="8;12;8" dur="2.5s" repeatCount="indefinite" />
        </circle>
        {/* Tulisan "SAR" kecil di bawah bintang */}
        <text x="55" y="38" fontSize="4.2" fill="#F5D060" fontWeight="bold"
          letterSpacing="0.8">SAR</text>

        {/* ══════════════════ ALIS ══════════════════ */}
        {/* Alis tebal hitam khas Indonesia */}
        {(mood === 'idle' || mood === 'scanning') && <>
          <path d="M 46,74 Q 58,68 70,72" stroke="#1A0A02" strokeWidth="3.8"
            strokeLinecap="round" fill="none" />
          <path d="M 90,72 Q 102,68 114,74" stroke="#1A0A02" strokeWidth="3.8"
            strokeLinecap="round" fill="none" />
        </>}
        {mood === 'thinking' && <>
          <path d="M 46,72 Q 58,64 70,70" stroke="#1A0A02" strokeWidth="3.8"
            strokeLinecap="round" fill="none" />
          <path d="M 90,66 Q 102,60 114,66" stroke="#1A0A02" strokeWidth="3.8"
            strokeLinecap="round" fill="none" />
        </>}
        {mood === 'happy' && <>
          <path d="M 46,72 Q 58,66 70,71" stroke="#1A0A02" strokeWidth="3.8"
            strokeLinecap="round" fill="none" />
          <path d="M 90,71 Q 102,66 114,72" stroke="#1A0A02" strokeWidth="3.8"
            strokeLinecap="round" fill="none" />
        </>}
        {mood === 'alert' && <>
          {/* Mengernyit ke dalam — ekspresi waspada */}
          <path d="M 46,74 Q 58,78 70,70" stroke="#1A0A02" strokeWidth="4.2"
            strokeLinecap="round" fill="none" />
          <path d="M 90,70 Q 102,78 114,74" stroke="#1A0A02" strokeWidth="4.2"
            strokeLinecap="round" fill="none" />
        </>}

        {/* ══════════════════ MATA ══════════════════ */}

        {/* ── IDLE ── */}
        {mood === 'idle' && <>
          {/* Kiri — dengan animasi kedip + iris lihat kiri-kanan */}
          <ellipse cx="58" cy="86" rx="13" ry="13" fill="white">
            <animate attributeName="ry" values="13;13;13;1;13;13;13;13;13;13;1;13;13;13" dur="5s" repeatCount="indefinite" />
          </ellipse>
          <path d="M 45,78 Q 58,70 71,78" stroke="#1A0A02" strokeWidth="3.8"
            fill="#1A0A02" strokeLinecap="round" />
          {/* Grup iris kiri — hilang saat kedip */}
          <g>
            <animate attributeName="opacity" values="1;1;1;0;1;1;1;1;1;1;0;1;1;1" dur="5s" repeatCount="indefinite" />
            <circle cx="58" cy="87" r="9" fill={`url(#${ir})`}>
              <animate attributeName="cx" values="58;54;58;62;58" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="58" cy="88" r="5" fill="#050202">
              <animate attributeName="cx" values="58;54;58;62;58" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="62" cy="83" r="3.2" fill="white">
              <animate attributeName="cx" values="62;58;62;66;62" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="55" cy="91" r="1.4" fill="white" opacity="0.7" />
          </g>
          <path d="M 45,97 Q 58,102 71,97" stroke="#1A0A02" strokeWidth="1.8"
            fill="none" strokeLinecap="round" />
          {/* Kanan — dengan animasi kedip + iris lihat kiri-kanan */}
          <ellipse cx="102" cy="86" rx="13" ry="13" fill="white">
            <animate attributeName="ry" values="13;13;13;1;13;13;13;13;13;13;1;13;13;13" dur="5s" repeatCount="indefinite" />
          </ellipse>
          <path d="M 89,78 Q 102,70 115,78" stroke="#1A0A02" strokeWidth="3.8"
            fill="#1A0A02" strokeLinecap="round" />
          {/* Grup iris kanan — hilang saat kedip */}
          <g>
            <animate attributeName="opacity" values="1;1;1;0;1;1;1;1;1;1;0;1;1;1" dur="5s" repeatCount="indefinite" />
            <circle cx="102" cy="87" r="9" fill={`url(#${ir})`}>
              <animate attributeName="cx" values="102;98;102;106;102" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="102" cy="88" r="5" fill="#050202">
              <animate attributeName="cx" values="102;98;102;106;102" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="106" cy="83" r="3.2" fill="white">
              <animate attributeName="cx" values="106;102;106;110;106" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="99" cy="91" r="1.4" fill="white" opacity="0.7" />
          </g>
          <path d="M 89,97 Q 102,102 115,97" stroke="#1A0A02" strokeWidth="1.8"
            fill="none" strokeLinecap="round" />
          {/* Pipi kemerahan natural — pulse lembut */}
          <ellipse cx="43"  cy="106" rx="13" ry="7" fill="#C06030" opacity="0.22">
            <animate attributeName="opacity" values="0.15;0.35;0.15" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="rx" values="13;15;13" dur="2.5s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="117" cy="106" rx="13" ry="7" fill="#C06030" opacity="0.22">
            <animate attributeName="opacity" values="0.15;0.35;0.15" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="rx" values="13;15;13" dur="2.5s" repeatCount="indefinite" />
          </ellipse>
          {/* ── Lengan kanan — lambaian ── */}
          <g>
            {/* Sleeve (seragam) */}
            <path d="M 132,172 Q 140,165 144,157" stroke={`url(#${ou})`} strokeWidth="10" fill="none" strokeLinecap="round" />
            {/* Forearm (kulit) */}
            <path d="M 144,157 Q 148,149 150,143" stroke={`url(#${sk})`} strokeWidth="8" fill="none" strokeLinecap="round" />
            {/* Tangan (mitten kanan - telapak + ibu jari) */}
            <path d="M 145,143 Q 147,137 152,136 Q 157,136 157,140 Q 157,144 152,145 Z" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.6" />
            <ellipse cx="145" cy="139" rx="2.5" ry="3" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.5" />
            <animateTransform attributeName="transform" type="rotate"
              values="0 132 172;-12 132 172;0 132 172;-12 132 172;0 132 172;0 132 172;0 132 172"
              dur="3s" repeatCount="indefinite" />
          </g>
          {/* ── Lengan kiri — rileks di sisi ── */}
          <path d="M 28,172 Q 18,180 14,188" stroke={`url(#${ou})`} strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M 14,188 Q 12,194 11,198" stroke={`url(#${sk})`} strokeWidth="8" fill="none" strokeLinecap="round" />
          {/* Tangan kiri rileks (kepalan ringan) */}
          <path d="M 8,199 Q 7,195 10,193 Q 14,193 15,197 Q 15,201 11,202 Z" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.5" />
        </>}

        {/* ── THINKING ── */}
        {mood === 'thinking' && <>
          {/* Kiri — iris bergerak ke atas-kiri (berpikir) */}
          <ellipse cx="58" cy="86" rx="12" ry="12" fill="white" />
          <path d="M 46,79 Q 58,71 70,79" stroke="#1A0A02" strokeWidth="3.8"
            fill="#1A0A02" strokeLinecap="round" />
          <circle cx="55" cy="82" r="8.5" fill={`url(#${ir})`}>
            <animate attributeName="cx" values="55;53;55;57;55" dur="3s" repeatCount="indefinite" />
            <animate attributeName="cy" values="82;80;82;81;82" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="55" cy="82" r="4.5" fill="#050202">
            <animate attributeName="cx" values="55;53;55;57;55" dur="3s" repeatCount="indefinite" />
            <animate attributeName="cy" values="82;80;82;81;82" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="55" cy="79" r="2.6" fill="white">
            <animate attributeName="cx" values="55;53;55;57;55" dur="3s" repeatCount="indefinite" />
            <animate attributeName="cy" values="79;77;79;78;79" dur="3s" repeatCount="indefinite" />
          </circle>
          <path d="M 46,95 Q 58,100 70,95" stroke="#1A0A02" strokeWidth="1.8"
            fill="none" strokeLinecap="round" />
          {/* Kanan */}
          <ellipse cx="102" cy="86" rx="12" ry="12" fill="white" />
          <path d="M 90,79 Q 102,71 114,79" stroke="#1A0A02" strokeWidth="3.8"
            fill="#1A0A02" strokeLinecap="round" />
          <circle cx="99" cy="82" r="8.5" fill={`url(#${ir})`}>
            <animate attributeName="cx" values="99;97;99;101;99" dur="3s" repeatCount="indefinite" />
            <animate attributeName="cy" values="82;80;82;81;82" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="99" cy="82" r="4.5" fill="#050202">
            <animate attributeName="cx" values="99;97;99;101;99" dur="3s" repeatCount="indefinite" />
            <animate attributeName="cy" values="82;80;82;81;82" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="99" cy="79" r="2.6" fill="white">
            <animate attributeName="cx" values="99;97;99;101;99" dur="3s" repeatCount="indefinite" />
            <animate attributeName="cy" values="79;77;79;78;79" dur="3s" repeatCount="indefinite" />
          </circle>
          <path d="M 90,95 Q 102,100 114,95" stroke="#1A0A02" strokeWidth="1.8"
            fill="none" strokeLinecap="round" />
          {/* Gelembung pikiran — animasi muncul bergelombang */}
          <circle cx="118" cy="64" r="2.3" fill="#E2E8F0">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="r" values="2;2.8;2" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="125" cy="54" r="3.5" fill="#EEF2F8">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
            <animate attributeName="r" values="3;4;3" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="134" cy="42" r="5.5" fill="#F1F5FB" stroke="#CBD5E1" strokeWidth="0.8">
            <animate attributeName="r" values="5;6.5;5" dur="1.5s" begin="0.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="130" cy="42" r="1.2" fill="#94A3B8" />
          <circle cx="134" cy="42" r="1.2" fill="#94A3B8">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="0.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="138" cy="42" r="1.2" fill="#94A3B8" />
          {/* ── Lengan kiri — ke dagu (gesture berpikir) ── */}
          <g>
            {/* Sleeve */}
            <path d="M 28,172 Q 14,156 18,142" stroke={`url(#${ou})`} strokeWidth="10" fill="none" strokeLinecap="round" />
            {/* Forearm */}
            <path d="M 18,142 Q 28,132 66,126" stroke={`url(#${sk})`} strokeWidth="8" fill="none" strokeLinecap="round" />
            {/* Tangan di dagu (kepalan di bawah mulut) */}
            <path d="M 63,127 Q 65,121 70,120 Q 75,120 75,125 Q 74,128 69,128 Z" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.5" />
            <animateTransform attributeName="transform" type="translate"
              values="0,0;0,-2;0,0" dur="3s" repeatCount="indefinite" />
          </g>
          {/* ── Lengan kanan — rileks di sisi ── */}
          <path d="M 132,172 Q 142,180 146,188" stroke={`url(#${ou})`} strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M 146,188 Q 148,194 149,198" stroke={`url(#${sk})`} strokeWidth="8" fill="none" strokeLinecap="round" />
          {/* Tangan kanan rileks (kepalan ringan) */}
          <path d="M 146,199 Q 145,195 148,193 Q 152,193 153,197 Q 153,201 149,202 Z" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.5" />
          {/* Pipi */}
          <ellipse cx="43"  cy="106" rx="13" ry="7" fill="#C06030" opacity="0.16" />
          <ellipse cx="117" cy="106" rx="13" ry="7" fill="#C06030" opacity="0.16" />
        </>}

        {/* ── HAPPY ── */}
        {mood === 'happy' && <>
          {/* Mata tertutup ^^ — ekspresi senang / lega */}
          <path d="M 45,85 Q 58,74 71,85" stroke="#1A0A02" strokeWidth="4.8"
            fill="#1A0A02" strokeLinecap="round" />
          <path d="M 45,85 Q 58,93 71,85" stroke="#1A0A02" strokeWidth="1.8"
            fill="none" strokeLinecap="round" opacity="0.3" />
          <path d="M 89,85 Q 102,74 115,85" stroke="#1A0A02" strokeWidth="4.8"
            fill="#1A0A02" strokeLinecap="round" />
          <path d="M 89,85 Q 102,93 115,85" stroke="#1A0A02" strokeWidth="1.8"
            fill="none" strokeLinecap="round" opacity="0.3" />
          {/* Pipi merona terang — berdenyut gembira */}
          <ellipse cx="42"  cy="104" rx="16" ry="9" fill="#DC6030" opacity="0.38">
            <animate attributeName="opacity" values="0.25;0.5;0.25" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="rx" values="16;18;16" dur="1.5s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="118" cy="104" rx="16" ry="9" fill="#DC6030" opacity="0.38">
            <animate attributeName="opacity" values="0.25;0.5;0.25" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="rx" values="16;18;16" dur="1.5s" repeatCount="indefinite" />
          </ellipse>
          {/* Bintang kecil — berputar & berdenyut */}
          <g>
            <text x="26" y="80" fontSize="12" fill="#FBBF24" opacity="0.95">✦</text>
            <animateTransform attributeName="transform" type="rotate" values="0 32 76;360 32 76" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;1;0.5" dur="0.8s" repeatCount="indefinite" />
          </g>
          <g>
            <text x="118" y="80" fontSize="12" fill="#FBBF24" opacity="0.95">✦</text>
            <animateTransform attributeName="transform" type="rotate" values="360 124 76;0 124 76" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;1;0.5" dur="0.8s" begin="0.4s" repeatCount="indefinite" />
          </g>
          {/* Confetti / nada musik melayang */}
          <g opacity="0.85">
            <text x="20" y="64" fontSize="10" fill="#F59E0B">♪</text>
            <animateTransform attributeName="transform" type="translate" values="0,0;-4,-14;-8,-28" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0.5;0" dur="2s" repeatCount="indefinite" />
          </g>
          <g opacity="0.85">
            <text x="128" y="58" fontSize="9" fill="#EC4899">♫</text>
            <animateTransform attributeName="transform" type="translate" values="0,0;6,-16;12,-32" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0.5;0" dur="2.5s" repeatCount="indefinite" />
          </g>
          <g opacity="0.8">
            <text x="16" y="50" fontSize="8" fill="#8B5CF6">♥</text>
            <animateTransform attributeName="transform" type="translate" values="0,0;2,-18;4,-36" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.8;0" dur="3s" repeatCount="indefinite" />
          </g>
          {/* ── Lambaian kedua tangan senang ── */}
          <g>
            <path d="M 132,172 Q 142,162 146,152" stroke={`url(#${ou})`} strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M 146,152 Q 150,144 152,138" stroke={`url(#${sk})`} strokeWidth="8" fill="none" strokeLinecap="round" />
            {/* Tangan kanan (mitten wave - telapak + ibu jari) */}
            <path d="M 147,140 Q 149,134 154,133 Q 159,133 159,137 Q 159,141 154,142 Z" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.6" />
            <ellipse cx="147" cy="136" rx="2.5" ry="3" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.5" />
            <animateTransform attributeName="transform" type="rotate" values="0 132 172;-18 132 172;0 132 172;-18 132 172;0 132 172" dur="0.8s" repeatCount="indefinite" />
          </g>
          <g>
            <path d="M 28,172 Q 18,162 14,152" stroke={`url(#${ou})`} strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M 14,152 Q 10,144 8,138" stroke={`url(#${sk})`} strokeWidth="8" fill="none" strokeLinecap="round" />
            {/* Tangan kiri (mitten wave) */}
            <path d="M 13,140 Q 11,134 6,133 Q 1,133 1,137 Q 1,141 6,142 Z" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.6" />
            <ellipse cx="13" cy="136" rx="2.5" ry="3" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.5" />
            <animateTransform attributeName="transform" type="rotate" values="0 28 172;18 28 172;0 28 172;18 28 172;0 28 172" dur="0.8s" repeatCount="indefinite" />
          </g>
        </>}

        {/* ── ALERT ── */}
        {mood === 'alert' && <>
          {/* Mata melotot waspada — pupil mengecil membesar */}
          <ellipse cx="58"  cy="87" rx="14" ry="14" fill="white" />
          <path d="M 44,77 Q 58,68 72,77" stroke="#1A0A02" strokeWidth="3.8"
            fill="#1A0A02" strokeLinecap="round" />
          <circle cx="58"  cy="89" r="10.5" fill={`url(#${ir})`} />
          <circle cx="58"  cy="90" r="5.5"  fill="#050202">
            <animate attributeName="r" values="5.5;3.5;5.5" dur="0.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="63"  cy="84" r="3.5"  fill="white" />
          <circle cx="55"  cy="93" r="1.6"  fill="white" opacity="0.65" />
          <path d="M 44,99 Q 58,105 72,99" stroke="#1A0A02" strokeWidth="1.8"
            fill="none" strokeLinecap="round" />
          {/* Kanan */}
          <ellipse cx="102" cy="87" rx="14" ry="14" fill="white" />
          <path d="M 88,77 Q 102,68 116,77" stroke="#1A0A02" strokeWidth="3.8"
            fill="#1A0A02" strokeLinecap="round" />
          <circle cx="102" cy="89" r="10.5" fill={`url(#${ir})`} />
          <circle cx="102" cy="90" r="5.5"  fill="#050202">
            <animate attributeName="r" values="5.5;3.5;5.5" dur="0.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="107" cy="84" r="3.5"  fill="white" />
          <circle cx="99"  cy="93" r="1.6"  fill="white" opacity="0.65" />
          <path d="M 88,99 Q 102,105 116,99" stroke="#1A0A02" strokeWidth="1.8"
            fill="none" strokeLinecap="round" />
          {/* Tetes keringat di dahi — animasi jatuh */}
          <g>
            <path d="M 128,72 Q 130,64 132,72 Q 130,79 128,72 Z" fill="#93C5FD" opacity="0.85" />
            <animateTransform attributeName="transform" type="translate" values="0,0;0,12;0,0" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0.9;0;0.9" dur="1.5s" repeatCount="indefinite" />
          </g>
          {/* Garis tegangan — berkedip */}
          <line x1="122" y1="68" x2="128" y2="64" stroke="#FCA5A5" strokeWidth="1.5"
            strokeLinecap="round" opacity="0.7">
            <animate attributeName="opacity" values="0;0.9;0" dur="0.6s" repeatCount="indefinite" />
          </line>
          <line x1="133" y1="60" x2="136" y2="55" stroke="#FCA5A5" strokeWidth="1.5"
            strokeLinecap="round" opacity="0.7">
            <animate attributeName="opacity" values="0.9;0;0.9" dur="0.6s" repeatCount="indefinite" />
          </line>
          {/* Tanda seru — blink */}
          <g>
            <text x="136" y="50" fontSize="16" fill="#DC2626" fontWeight="bold">！</text>
            <animate attributeName="opacity" values="0;1;0" dur="0.8s" repeatCount="indefinite" />
          </g>
          <g>
            <text x="18" y="62" fontSize="12" fill="#DC2626" fontWeight="bold">！</text>
            <animate attributeName="opacity" values="1;0;1" dur="0.8s" repeatCount="indefinite" />
          </g>
          {/* ── Lengan kanan — tegang di sisi ── */}
          <g>
            <path d="M 132,172 Q 138,178 140,184" stroke={`url(#${ou})`} strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M 140,184 Q 142,190 142,194" stroke={`url(#${sk})`} strokeWidth="8" fill="none" strokeLinecap="round" />
            {/* Tangan kanan (kepalan tegang) */}
            <path d="M 139,195 Q 138,191 141,189 Q 145,189 146,193 Q 146,197 142,198 Z" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.5" />
            <animateTransform attributeName="transform" type="translate" values="0,0;-1,0;1,0;0,0" dur="0.35s" repeatCount="indefinite" />
          </g>
          {/* ── Lengan kiri — tegang di sisi ── */}
          <g>
            <path d="M 28,172 Q 22,178 20,184" stroke={`url(#${ou})`} strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M 20,184 Q 18,190 18,194" stroke={`url(#${sk})`} strokeWidth="8" fill="none" strokeLinecap="round" />
            {/* Tangan kiri (kepalan tegang) */}
            <path d="M 15,195 Q 14,191 17,189 Q 21,189 22,193 Q 22,197 18,198 Z" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.5" />
            <animateTransform attributeName="transform" type="translate" values="0,0;1,0;-1,0;0,0" dur="0.35s" repeatCount="indefinite" />
          </g>
          {/* Pipi */}
          <ellipse cx="43"  cy="106" rx="13" ry="7" fill="#C06030" opacity="0.18" />
          <ellipse cx="117" cy="106" rx="13" ry="7" fill="#C06030" opacity="0.18" />
        </>}

        {/* ── SCANNING ── */}
        {mood === 'scanning' && <>
          {/* === Mata Kiri — identik dengan idle + iris scan lebih cepat === */}
          <ellipse cx="58" cy="86" rx="13" ry="13" fill="white" />
          <path d="M 45,78 Q 58,70 71,78" stroke="#1A0A02" strokeWidth="3.8"
            fill="#1A0A02" strokeLinecap="round" />
          <circle cx="58" cy="87" r="9" fill={`url(#${ir})`}>
            <animate attributeName="cx" values="58;54;58;62;58" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="58" cy="88" r="5" fill="#050202">
            <animate attributeName="cx" values="58;54;58;62;58" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="62" cy="83" r="3.2" fill="white">
            <animate attributeName="cx" values="62;58;62;66;62" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="55" cy="91" r="1.4" fill="white" opacity="0.7" />
          {/* Scan line mata kiri */}
          <line x1="50" y1="87" x2="66" y2="87" stroke="#DC2626"
            strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
            <animate attributeName="y1" values="80;94;80" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="y2" values="80;94;80" dur="1.2s" repeatCount="indefinite" />
          </line>
          <path d="M 45,97 Q 58,102 71,97" stroke="#1A0A02" strokeWidth="1.8"
            fill="none" strokeLinecap="round" />
          {/* Lingkaran radar pulse di mata kiri */}
          <circle cx="58" cy="87" r="10" fill="none" stroke="#DC2626" strokeWidth="0.8" opacity="0">
            <animate attributeName="r" values="10;20;30" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.2;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="58" cy="87" r="10" fill="none" stroke="#DC2626" strokeWidth="0.5" opacity="0">
            <animate attributeName="r" values="10;20;30" dur="2s" begin="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.15;0" dur="2s" begin="1s" repeatCount="indefinite" />
          </circle>

          {/* === Mata Kanan — 100% identik dengan idle + scan line overlay === */}
          <ellipse cx="102" cy="86" rx="13" ry="13" fill="white" />
          <path d="M 89,78 Q 102,70 115,78" stroke="#1A0A02" strokeWidth="3.8"
            fill="#1A0A02" strokeLinecap="round" />
          <circle cx="102" cy="87" r="9" fill={`url(#${ir})`}>
            <animate attributeName="cx" values="102;98;102;106;102" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="102" cy="88" r="5" fill="#050202">
            <animate attributeName="cx" values="102;98;102;106;102" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="106" cy="83" r="3.2" fill="white">
            <animate attributeName="cx" values="106;102;106;110;106" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="99" cy="91" r="1.4" fill="white" opacity="0.7" />
          {/* Scan line — sweep di atas iris (y80-y94, di dalam sclera) */}
          <line x1="94" y1="87" x2="110" y2="87" stroke="#DC2626"
            strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
            <animate attributeName="y1" values="80;94;80" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="y2" values="80;94;80" dur="1.2s" repeatCount="indefinite" />
          </line>
          <path d="M 89,97 Q 102,102 115,97" stroke="#1A0A02" strokeWidth="1.8"
            fill="none" strokeLinecap="round" />
          {/* Lingkaran radar pulse di mata kanan */}
          <circle cx="102" cy="87" r="10" fill="none" stroke="#DC2626" strokeWidth="0.8" opacity="0">
            <animate attributeName="r" values="10;20;30" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.2;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="102" cy="87" r="10" fill="none" stroke="#DC2626" strokeWidth="0.5" opacity="0">
            <animate attributeName="r" values="10;20;30" dur="2s" begin="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.15;0" dur="2s" begin="1s" repeatCount="indefinite" />
          </circle>
          {/* ── Lengan kanan — salute/visor ── */}
          <g>
            <path d="M 132,172 Q 142,162 144,154" stroke={`url(#${ou})`} strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M 144,154 Q 148,146 150,140" stroke={`url(#${sk})`} strokeWidth="8" fill="none" strokeLinecap="round" />
            {/* Tangan kanan salute (telapak datar) */}
            <path d="M 146,141 Q 148,135 153,134 Q 158,134 158,138 Q 158,142 153,143 Z" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.5" />
            <animateTransform attributeName="transform" type="translate" values="0,0;2,-1;0,0" dur="1.8s" repeatCount="indefinite" />
          </g>
          {/* ── Lengan kiri — rileks di sisi ── */}
          <path d="M 28,172 Q 18,180 14,188" stroke={`url(#${ou})`} strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M 14,188 Q 12,194 11,198" stroke={`url(#${sk})`} strokeWidth="8" fill="none" strokeLinecap="round" />
          {/* Tangan kiri rileks (kepalan ringan) */}
          <path d="M 8,199 Q 7,195 10,193 Q 14,193 15,197 Q 15,201 11,202 Z" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.5" />
          {/* Pipi */}
          <ellipse cx="43"  cy="106" rx="13" ry="7" fill="#C06030" opacity="0.16" />
          <ellipse cx="117" cy="106" rx="13" ry="7" fill="#C06030" opacity="0.16" />
        </>}

        {/* ══════════════════ HIDUNG & MULUT ══════════════════ */}
        {/* Hidung kecil — lurus khas Asia */}
        <ellipse cx="80" cy="108" rx="2.5" ry="2" fill="#7A4520" opacity="0.55" />

        {/* Mulut per mood */}
        {mood === 'idle' && <>
          <path d="M 68,120 Q 80,130 92,120"
            stroke="#5C2C0A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Mulut bergerak sedikit — seperti bersenandung */}
          <ellipse cx="80" cy="126" rx="5" ry="0" fill="#5C2C0A" opacity="0.3">
            <animate attributeName="ry" values="0;2;0;0;0" dur="3s" repeatCount="indefinite" />
          </ellipse>
        </>}
        {mood === 'thinking' && <>
          <path d="M 74,120 Q 80,116 86,120"
            stroke="#5C2C0A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* mulut maju-mundur mikir */}
          <circle cx="80" cy="121" r="0" fill="#5C2C0A" opacity="0.2">
            <animate attributeName="r" values="0;1.5;0" dur="2s" repeatCount="indefinite" />
          </circle>
        </>}
        {mood === 'happy' && <>
          <path d="M 62,118 Q 80,134 98,118"
            stroke="#5C2C0A" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Gigi — senyum lebar + bernapas */}
          <path d="M 68,122 Q 80,132 92,122"
            fill="white" stroke="none" opacity="0.7">
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="1.5s" repeatCount="indefinite" />
          </path>
        </>}
        {mood === 'alert' && <>
          <path d="M 73,120 Q 80,116 87,120"
            stroke="#5C2C0A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Mulut tegang bergetar */}
          <ellipse cx="80" cy="122" rx="4" ry="2" fill="#5C2C0A" opacity="0.12">
            <animate attributeName="rx" values="4;5;4;3;4" dur="0.8s" repeatCount="indefinite" />
          </ellipse>
        </>}
        {mood === 'scanning' && <>
          <path d="M 70,120 L 90,120"
            stroke="#5C2C0A" strokeWidth="2.5" strokeLinecap="round" />
          {/* Garis mulut berdenyut saat scan */}
          <ellipse cx="80" cy="121" rx="6" ry="0.5" fill="#5C2C0A" opacity="0">
            <animate attributeName="opacity" values="0;0.15;0" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="ry" values="0.5;1.5;0.5" dur="1.8s" repeatCount="indefinite" />
          </ellipse>
        </>}

        {/* Pipi natural untuk semua mood selain happy (sudah di dalam happy block) */}

        </g>{/* tutup wrapper animasi utama */}

      </svg>

      {/* Label opsional */}
      {label && (
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-center leading-tight">
          {label}
        </span>
      )}
    </div>
  );
};

export default SigapMascot;
