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

        {/* ── Ground shadow ── */}
        <ellipse cx="80" cy="200" rx="52" ry="6" fill="rgba(0,0,0,0.10)" />

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
        {/* Lencana SAR merah-putih di saku */}
        <circle cx="60" cy="179" r="6" fill={`url(#${bg})`}
          stroke="#E5E5E5" strokeWidth="0.8" />
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
        {/* Lencana di baret — lingkaran hitam + bintang emas */}
        <circle cx="62" cy="26" r="9" fill="#1A1200" stroke="#C2A040" strokeWidth="1.5" />
        <circle cx="62" cy="26" r="6.5" fill="#0A0800" />
        <text x="57.5" y="29.5" fontSize="7.5" fill="#F5D060" fontWeight="bold">★</text>
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
          {/* Kiri */}
          <ellipse cx="58" cy="86" rx="13" ry="13" fill="white" />
          <path d="M 45,78 Q 58,70 71,78" stroke="#1A0A02" strokeWidth="3.8"
            fill="#1A0A02" strokeLinecap="round" />
          <circle cx="58" cy="87" r="9"   fill={`url(#${ir})`} />
          <circle cx="58" cy="88" r="5"   fill="#050202" />
          <circle cx="62" cy="83" r="3.2" fill="white" />
          <circle cx="55" cy="91" r="1.4" fill="white" opacity="0.7" />
          <path d="M 45,97 Q 58,102 71,97" stroke="#1A0A02" strokeWidth="1.8"
            fill="none" strokeLinecap="round" />
          {/* Kanan */}
          <ellipse cx="102" cy="86" rx="13" ry="13" fill="white" />
          <path d="M 89,78 Q 102,70 115,78" stroke="#1A0A02" strokeWidth="3.8"
            fill="#1A0A02" strokeLinecap="round" />
          <circle cx="102" cy="87" r="9"    fill={`url(#${ir})`} />
          <circle cx="102" cy="88" r="5"    fill="#050202" />
          <circle cx="106" cy="83" r="3.2"  fill="white" />
          <circle cx="99" cy="91" r="1.4"   fill="white" opacity="0.7" />
          <path d="M 89,97 Q 102,102 115,97" stroke="#1A0A02" strokeWidth="1.8"
            fill="none" strokeLinecap="round" />
          {/* Pipi kemerahan natural */}
          <ellipse cx="43"  cy="106" rx="13" ry="7" fill="#C06030" opacity="0.22" />
          <ellipse cx="117" cy="106" rx="13" ry="7" fill="#C06030" opacity="0.22" />
        </>}

        {/* ── THINKING ── */}
        {mood === 'thinking' && <>
          {/* Kiri — iris ke atas, ekspresi berpikir */}
          <ellipse cx="58" cy="86" rx="12" ry="12" fill="white" />
          <path d="M 46,79 Q 58,71 70,79" stroke="#1A0A02" strokeWidth="3.8"
            fill="#1A0A02" strokeLinecap="round" />
          <circle cx="58" cy="82" r="8.5" fill={`url(#${ir})`} />
          <circle cx="58" cy="82" r="4.5" fill="#050202" />
          <circle cx="61" cy="79" r="2.6" fill="white" />
          <path d="M 46,95 Q 58,100 70,95" stroke="#1A0A02" strokeWidth="1.8"
            fill="none" strokeLinecap="round" />
          {/* Kanan */}
          <ellipse cx="102" cy="86" rx="12" ry="12" fill="white" />
          <path d="M 90,79 Q 102,71 114,79" stroke="#1A0A02" strokeWidth="3.8"
            fill="#1A0A02" strokeLinecap="round" />
          <circle cx="102" cy="82" r="8.5" fill={`url(#${ir})`} />
          <circle cx="102" cy="82" r="4.5" fill="#050202" />
          <circle cx="105" cy="79" r="2.6" fill="white" />
          <path d="M 90,95 Q 102,100 114,95" stroke="#1A0A02" strokeWidth="1.8"
            fill="none" strokeLinecap="round" />
          {/* Gelembung pikiran */}
          <circle cx="118" cy="64" r="2.3" fill="#E2E8F0" />
          <circle cx="125" cy="54" r="3.5" fill="#EEF2F8" />
          <circle cx="134" cy="42" r="5.5" fill="#F1F5FB" stroke="#CBD5E1" strokeWidth="0.8"/>
          <circle cx="130" cy="42" r="1.2" fill="#94A3B8" />
          <circle cx="134" cy="42" r="1.2" fill="#94A3B8" />
          <circle cx="138" cy="42" r="1.2" fill="#94A3B8" />
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
          {/* Pipi merona terang */}
          <ellipse cx="42"  cy="104" rx="16" ry="9" fill="#DC6030" opacity="0.38" />
          <ellipse cx="118" cy="104" rx="16" ry="9" fill="#DC6030" opacity="0.38" />
          {/* Bintang kecil — efek gembira */}
          <text x="26"  y="80" fontSize="12" fill="#FBBF24" opacity="0.95">✦</text>
          <text x="118" y="80" fontSize="12" fill="#FBBF24" opacity="0.95">✦</text>
        </>}

        {/* ── ALERT ── */}
        {mood === 'alert' && <>
          {/* Mata melotot waspada */}
          <ellipse cx="58"  cy="87" rx="14" ry="14" fill="white" />
          <path d="M 44,77 Q 58,68 72,77" stroke="#1A0A02" strokeWidth="3.8"
            fill="#1A0A02" strokeLinecap="round" />
          <circle cx="58"  cy="89" r="10.5" fill={`url(#${ir})`} />
          <circle cx="58"  cy="90" r="5.5"  fill="#050202" />
          <circle cx="63"  cy="84" r="3.5"  fill="white" />
          <circle cx="55"  cy="93" r="1.6"  fill="white" opacity="0.65" />
          <path d="M 44,99 Q 58,105 72,99" stroke="#1A0A02" strokeWidth="1.8"
            fill="none" strokeLinecap="round" />
          {/* Kanan */}
          <ellipse cx="102" cy="87" rx="14" ry="14" fill="white" />
          <path d="M 88,77 Q 102,68 116,77" stroke="#1A0A02" strokeWidth="3.8"
            fill="#1A0A02" strokeLinecap="round" />
          <circle cx="102" cy="89" r="10.5" fill={`url(#${ir})`} />
          <circle cx="102" cy="90" r="5.5"  fill="#050202" />
          <circle cx="107" cy="84" r="3.5"  fill="white" />
          <circle cx="99"  cy="93" r="1.6"  fill="white" opacity="0.65" />
          <path d="M 88,99 Q 102,105 116,99" stroke="#1A0A02" strokeWidth="1.8"
            fill="none" strokeLinecap="round" />
          {/* Tetes keringat di dahi */}
          <path d="M 128,72 Q 130,64 132,72 Q 130,79 128,72 Z" fill="#93C5FD" opacity="0.85" />
          {/* Garis tegangan */}
          <line x1="122" y1="68" x2="128" y2="64" stroke="#FCA5A5" strokeWidth="1.5"
            strokeLinecap="round" opacity="0.7" />
          <line x1="133" y1="60" x2="136" y2="55" stroke="#FCA5A5" strokeWidth="1.5"
            strokeLinecap="round" opacity="0.7" />
          {/* Pipi */}
          <ellipse cx="43"  cy="106" rx="13" ry="7" fill="#C06030" opacity="0.18" />
          <ellipse cx="117" cy="106" rx="13" ry="7" fill="#C06030" opacity="0.18" />
        </>}

        {/* ── SCANNING ── */}
        {mood === 'scanning' && <>
          {/* Kiri — mata menyipit fokus */}
          <ellipse cx="58"  cy="87" rx="13" ry="8.5" fill="white" />
          <path d="M 45,81 Q 58,74 71,81" stroke="#1A0A02" strokeWidth="3.8"
            fill="#1A0A02" strokeLinecap="round" />
          <path d="M 45,93 Q 58,89 71,93" stroke="#1A0A02" strokeWidth="2.8"
            fill="none" strokeLinecap="round" />
          <circle cx="58"  cy="87" r="6.5" fill={`url(#${ir})`} />
          <circle cx="58"  cy="88" r="3.5" fill="#050202" />
          <circle cx="61"  cy="84" r="2"   fill="white" />
          {/* Kanan — mata normal dengan scan line */}
          <ellipse cx="102" cy="86" rx="13" ry="13" fill="white" />
          <path d="M 89,78 Q 102,70 115,78" stroke="#1A0A02" strokeWidth="3.8"
            fill="#1A0A02" strokeLinecap="round" />
          <circle cx="102" cy="87" r="9"    fill={`url(#${ir})`} />
          <circle cx="102" cy="88" r="5"    fill="#050202" />
          <circle cx="106" cy="83" r="3.2"  fill="white" />
          <path d="M 89,96 Q 102,101 115,96" stroke="#1A0A02" strokeWidth="1.8"
            fill="none" strokeLinecap="round" />
          {/* Garis scan merah bergantian */}
          <line x1="90" y1="86" x2="115" y2="86" stroke="#DC2626"
            strokeWidth="1.8" strokeLinecap="round">
            <animate attributeName="y1" values="79;95;79" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="y2" values="79;95;79" dur="1.2s" repeatCount="indefinite" />
          </line>
          <line x1="90" y1="86" x2="115" y2="86" stroke="#FCA5A5"
            strokeWidth="0.8" strokeLinecap="round" opacity="0.5">
            <animate attributeName="y1" values="79;95;79" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="y2" values="79;95;79" dur="1.2s" repeatCount="indefinite" />
          </line>
          {/* Pipi */}
          <ellipse cx="43"  cy="106" rx="13" ry="7" fill="#C06030" opacity="0.16" />
          <ellipse cx="117" cy="106" rx="13" ry="7" fill="#C06030" opacity="0.16" />
        </>}

        {/* ══════════════════ HIDUNG & MULUT ══════════════════ */}
        {/* Hidung kecil — lurus khas Asia */}
        <ellipse cx="80" cy="108" rx="2.5" ry="2" fill="#7A4520" opacity="0.55" />

        {/* Mulut per mood */}
        {mood === 'idle' &&
          <path d="M 68,120 Q 80,130 92,120"
            stroke="#5C2C0A" strokeWidth="2.5" fill="none" strokeLinecap="round" />}
        {mood === 'thinking' &&
          <path d="M 74,120 Q 80,116 86,120"
            stroke="#5C2C0A" strokeWidth="2.5" fill="none" strokeLinecap="round" />}
        {mood === 'happy' && <>
          <path d="M 62,118 Q 80,134 98,118"
            stroke="#5C2C0A" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Gigi — senyum lebar */}
          <path d="M 68,122 Q 80,132 92,122"
            fill="white" stroke="none" opacity="0.7" />
        </>}
        {mood === 'alert' && <>
          <path d="M 73,120 Q 80,116 87,120"
            stroke="#5C2C0A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <ellipse cx="80" cy="122" rx="4" ry="2" fill="#5C2C0A" opacity="0.12" />
        </>}
        {mood === 'scanning' &&
          <path d="M 70,120 L 90,120"
            stroke="#5C2C0A" strokeWidth="2.5" strokeLinecap="round" />}

        {/* Pipi natural untuk semua mood selain happy (sudah di dalam happy block) */}
        {mood !== 'happy' && <>
          <ellipse cx="43"  cy="112" rx="13" ry="7" fill="#A04020" opacity="0.15" />
          <ellipse cx="117" cy="112" rx="13" ry="7" fill="#A04020" opacity="0.15" />
        </>}

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
