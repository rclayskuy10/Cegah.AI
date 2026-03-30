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
          {/* Sawo matang — 3-stop gradient for natural depth */}
          <radialGradient id={sk} cx="45%" cy="30%" r="68%">
            <stop offset="0%"   stopColor="#DAAA70" />
            <stop offset="60%"  stopColor="#C8905A" />
            <stop offset="100%" stopColor="#A87038" />
          </radialGradient>
          {/* Iris cokelat tua / hitam — khas mata orang Indonesia */}
          <radialGradient id={ir} cx="35%" cy="28%" r="65%">
            <stop offset="0%"   stopColor="#6B3A1F" />
            <stop offset="55%"  stopColor="#3D1A0A" />
            <stop offset="100%" stopColor="#0A0402" />
          </radialGradient>
          {/* Seragam SAR — richer khaki gradient */}
          <linearGradient id={ou} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#8B6E18" />
            <stop offset="100%" stopColor="#5E460C" />
          </linearGradient>
          {/* Rambut hitam — subtler sheen with mid-tone */}
          <radialGradient id={hr} cx="38%" cy="10%" r="65%">
            <stop offset="0%"   stopColor="#2E2424" />
            <stop offset="50%"  stopColor="#141010" />
            <stop offset="100%" stopColor="#020101" />
          </radialGradient>
          {/* Baret orange — softer warm start */}
          <radialGradient id={bt} cx="40%" cy="25%" r="65%">
            <stop offset="0%"   stopColor="#FB923C" />
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
        {/* Tubuh utama — curved shoulders for natural shape */}
        <path d="M 36,167 Q 80,157 124,167 Q 136,177 140,205 L 20,205 Q 24,177 36,167 Z" fill={`url(#${ou})`} />
        {/* Body outline */}
        <path d="M 36,167 Q 80,157 124,167 Q 136,177 140,205 L 20,205 Q 24,177 36,167 Z" fill="none" stroke="#4A3008" strokeWidth="1" opacity="0.18" />
        {/* Fabric fold lines for depth */}
        <path d="M 58,174 Q 60,186 58,198" stroke="#5C430A" strokeWidth="0.7" fill="none" opacity="0.2" strokeLinecap="round" />
        <path d="M 102,174 Q 100,186 102,198" stroke="#5C430A" strokeWidth="0.7" fill="none" opacity="0.2" strokeLinecap="round" />
        <path d="M 76,166 Q 80,188 84,166" stroke="#5C430A" strokeWidth="0.5" fill="none" opacity="0.12" strokeLinecap="round" />

        {/* V-neck collar */}
        <path d="M 68,162 L 80,176 L 92,162"
          stroke="#F5DEB3" strokeWidth="2" fill="none"
          strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />

        {/* Epaulette kiri */}
        <rect x="30" y="165" width="20" height="5.5" rx="2.8" fill="#C2410C" opacity="0.85" />
        <rect x="32" y="166" width="3.5" height="3.5" rx="1" fill="#FBBF24" />
        <rect x="37" y="166" width="3.5" height="3.5" rx="1" fill="#FBBF24" />
        {/* Epaulette kanan */}
        <rect x="110" y="165" width="20" height="5.5" rx="2.8" fill="#C2410C" opacity="0.85" />
        <rect x="124.5" y="166" width="3.5" height="3.5" rx="1" fill="#FBBF24" />
        <rect x="119" y="166" width="3.5" height="3.5" rx="1" fill="#FBBF24" />

        {/* Saku dada kiri with flap */}
        <rect x="50" y="172" width="18" height="13" rx="2.5"
          fill="#7A5C10" stroke="#B89840" strokeWidth="0.7" />
        {/* Pocket flap */}
        <path d="M 50,172 L 68,172" stroke="#6A4C08" strokeWidth="1.2" strokeLinecap="round" />
        {/* Lencana SAR merah-putih */}
        <circle cx="59" cy="179" r="5.5" fill={`url(#${bg})`}
          stroke="#D4D4D4" strokeWidth="0.7">
          <animate attributeName="r" values="5.5;6.2;5.5" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="55.5" y="182" fontSize="4.5" fill="#F5D060" fontWeight="bold">★</text>

        {/* Sabuk */}
        <rect x="24" y="160" width="112" height="6.5" rx="3.2" fill="#3D2200" />
        <rect x="72" y="160" width="16" height="6.5" rx="2" fill="#C2A040" />
        <rect x="74.5" y="161.5" width="11" height="3.5" rx="1.5" fill="#3D2200" />

        {/* ══════════════════ LEHER ══════════════════ */}
        <rect x="69" y="150" width="22" height="16" rx="8" fill={`url(#${sk})`} />
        {/* Under-chin shadow */}
        <ellipse cx="80" cy="150" rx="12" ry="4" fill="#8B5820" opacity="0.15" />

        {/* ══════════════════ RAMBUT BELAKANG ══════════════════ */}
        {/* Rambut hitam pendek-rapi khas Indonesia (bukan panjang menjuntai) */}
        <ellipse cx="80" cy="86" rx="52" ry="56" fill={`url(#${hr})`} />

        {/* ══════════════════ TELINGA ══════════════════ */}
        <ellipse cx="29" cy="96" rx="8"   ry="10"  fill={`url(#${sk})`} stroke="#A87838" strokeWidth="0.6" opacity="0.9" />
        <ellipse cx="131" cy="96" rx="8"  ry="10"  fill={`url(#${sk})`} stroke="#A87838" strokeWidth="0.6" opacity="0.9" />
        <ellipse cx="29" cy="96" rx="4.5" ry="6.5" fill="#8B5520" opacity="0.25" />
        <ellipse cx="131" cy="96" rx="4.5" ry="6.5" fill="#8B5520" opacity="0.25" />

        {/* ══════════════════ WAJAH ══════════════════ */}
        <ellipse cx="80" cy="98" rx="48" ry="52" fill={`url(#${sk})`} />
        {/* Face outline for cohesion */}
        <ellipse cx="80" cy="98" rx="48" ry="52" fill="none" stroke="#A87838" strokeWidth="0.8" opacity="0.15" />
        {/* Forehead highlight */}
        <ellipse cx="74" cy="76" rx="20" ry="10" fill="white" opacity="0.07" />
        {/* Cheek highlight (left) */}
        <ellipse cx="55" cy="100" rx="10" ry="8" fill="white" opacity="0.05" />
        {/* Jawline shadow */}
        <path d="M 40,130 Q 80,152 120,130 Q 128,140 80,150 Q 32,140 40,130 Z" fill="#7A5020" opacity="0.08" />

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
        {/* Hair shine */}
        <path d="M 48,36 Q 60,26 72,28" stroke="#3A2A2A" strokeWidth="2.2" fill="none"
          strokeLinecap="round" opacity="0.5" />
        <path d="M 56,32 Q 64,26 72,27" stroke="#5A4A4A" strokeWidth="1" fill="none"
          strokeLinecap="round" opacity="0.35" />

        {/* ══════════════════ BARET SAR INDONESIA ══════════════════ */}
        {/* Baret SAR Indonesia */}
        <ellipse cx="80" cy="42" rx="53" ry="12" fill={`url(#${bt})`} />
        {/* Dome baret */}
        <path d="M 27,42 Q 26,10 80,8 Q 134,10 133,42 Z" fill={`url(#${bt})`} />
        {/* Baret structure line */}
        <path d="M 27,42 Q 26,10 80,8" stroke="#9A3412" strokeWidth="1.2"
          fill="none" strokeLinecap="round" opacity="0.4" />
        {/* Baret outline */}
        <path d="M 27,42 Q 26,10 80,8 Q 134,10 133,42" fill="none" stroke="#7C2D12" strokeWidth="0.8" opacity="0.2" />
        {/* Baret highlight */}
        <path d="M 44,20 Q 58,12 72,13" stroke="#FED7AA" strokeWidth="2.2" fill="none"
          strokeLinecap="round" opacity="0.5" />
        {/* Under-baret shadow on forehead */}
        <ellipse cx="80" cy="48" rx="48" ry="6" fill="#3D1A0A" opacity="0.08" />
        {/* Tali baret */}
        <path d="M 27,43 Q 22,50 28,60" stroke="#1A1A1A" strokeWidth="2.8"
          fill="none" strokeLinecap="round" />
        {/* Lencana baret */}
        <circle cx="62" cy="26" r="8.5" fill="#1A1200" stroke="#C2A040" strokeWidth="1.2" />
        <circle cx="62" cy="26" r="6" fill="#0A0800" />
        <text x="57.8" y="29.2" fontSize="7" fill="#F5D060" fontWeight="bold">★</text>
        {/* Badge glow */}
        <circle cx="62" cy="26" r="7.5" fill="none" stroke="#FBBF24" strokeWidth="0.5" opacity="0">
          <animate attributeName="opacity" values="0;0.7;0" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="r" values="7.5;11;7.5" dur="2.5s" repeatCount="indefinite" />
        </circle>
        {/* SAR text */}
        <text x="55" y="38" fontSize="4" fill="#F5D060" fontWeight="bold"
          letterSpacing="0.8">SAR</text>

        {/* ══════════════════ ALIS ══════════════════ */}
        {/* Alis — refined weight */}
        {(mood === 'idle' || mood === 'scanning') && <>
          <path d="M 52,78 Q 62,73 72,76" stroke="#1A0A02" strokeWidth="3.2"
            strokeLinecap="round" fill="none" />
          <path d="M 88,76 Q 98,73 108,78" stroke="#1A0A02" strokeWidth="3.2"
            strokeLinecap="round" fill="none" />
        </>}
        {mood === 'thinking' && <>
          <path d="M 52,76 Q 62,70 72,74" stroke="#1A0A02" strokeWidth="3.2"
            strokeLinecap="round" fill="none" />
          <path d="M 88,70 Q 98,66 108,72" stroke="#1A0A02" strokeWidth="3.2"
            strokeLinecap="round" fill="none" />
        </>}
        {mood === 'happy' && <>
          <path d="M 52,77 Q 62,73 72,76" stroke="#1A0A02" strokeWidth="3.2"
            strokeLinecap="round" fill="none" />
          <path d="M 88,76 Q 98,73 108,77" stroke="#1A0A02" strokeWidth="3.2"
            strokeLinecap="round" fill="none" />
        </>}
        {mood === 'alert' && <>
          <path d="M 52,79 Q 62,82 72,75" stroke="#1A0A02" strokeWidth="3.5"
            strokeLinecap="round" fill="none" />
          <path d="M 88,75 Q 98,82 108,79" stroke="#1A0A02" strokeWidth="3.5"
            strokeLinecap="round" fill="none" />
        </>}

        {/* ══════════════════ MATA ══════════════════ */}

        {/* ── IDLE ── */}
        {mood === 'idle' && <>
          {/* Left eye — reduced size, outlined sclera */}
          <ellipse cx="62" cy="88" rx="10" ry="10.5" fill="white" stroke="#2A1A0A" strokeWidth="0.5">
            <animate attributeName="ry" values="10.5;10.5;10.5;0.5;10.5;10.5;10.5;10.5;10.5;10.5;0.5;10.5;10.5;10.5" dur="5s" repeatCount="indefinite" />
          </ellipse>
          <path d="M 52,82 Q 62,76 72,82" stroke="#1A0A02" strokeWidth="3"
            fill="#1A0A02" strokeLinecap="round" />
          <g>
            <animate attributeName="opacity" values="1;1;1;0;1;1;1;1;1;1;0;1;1;1" dur="5s" repeatCount="indefinite" />
            <circle cx="62" cy="89" r="7" fill={`url(#${ir})`}>
              <animate attributeName="cx" values="62;59;62;65;62" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="62" cy="89.5" r="3.5" fill="#050202">
              <animate attributeName="cx" values="62;59;62;65;62" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="65" cy="86" r="2.5" fill="white">
              <animate attributeName="cx" values="65;62;65;68;65" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="60" cy="92" r="1.1" fill="white" opacity="0.6" />
          </g>
          <path d="M 52,96 Q 62,100 72,96" stroke="#1A0A02" strokeWidth="1.4"
            fill="none" strokeLinecap="round" />
          {/* Right eye */}
          <ellipse cx="98" cy="88" rx="10" ry="10.5" fill="white" stroke="#2A1A0A" strokeWidth="0.5">
            <animate attributeName="ry" values="10.5;10.5;10.5;0.5;10.5;10.5;10.5;10.5;10.5;10.5;0.5;10.5;10.5;10.5" dur="5s" repeatCount="indefinite" />
          </ellipse>
          <path d="M 88,82 Q 98,76 108,82" stroke="#1A0A02" strokeWidth="3"
            fill="#1A0A02" strokeLinecap="round" />
          <g>
            <animate attributeName="opacity" values="1;1;1;0;1;1;1;1;1;1;0;1;1;1" dur="5s" repeatCount="indefinite" />
            <circle cx="98" cy="89" r="7" fill={`url(#${ir})`}>
              <animate attributeName="cx" values="98;95;98;101;98" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="98" cy="89.5" r="3.5" fill="#050202">
              <animate attributeName="cx" values="98;95;98;101;98" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="101" cy="86" r="2.5" fill="white">
              <animate attributeName="cx" values="101;98;101;104;101" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="96" cy="92" r="1.1" fill="white" opacity="0.6" />
          </g>
          <path d="M 88,96 Q 98,100 108,96" stroke="#1A0A02" strokeWidth="1.4"
            fill="none" strokeLinecap="round" />
          {/* Cheeks — softer pulse */}
          <ellipse cx="46" cy="105" rx="11" ry="6" fill="#C06030" opacity="0.18">
            <animate attributeName="opacity" values="0.12;0.28;0.12" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="rx" values="11;13;11" dur="2.5s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="114" cy="105" rx="11" ry="6" fill="#C06030" opacity="0.18">
            <animate attributeName="opacity" values="0.12;0.28;0.12" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="rx" values="11;13;11" dur="2.5s" repeatCount="indefinite" />
          </ellipse>
          {/* Right arm — waving with finger detail */}
          <g>
            <path d="M 130,170 Q 138,163 142,155" stroke={`url(#${ou})`} strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M 142,155 Q 146,147 148,141" stroke={`url(#${sk})`} strokeWidth="8" fill="none" strokeLinecap="round" />
            {/* Hand with finger bumps */}
            <path d="M 144,142 Q 145,137 148,135 Q 150,133 152,135 Q 153,133.5 154.5,135 Q 155.5,134 156.5,136 Q 158,138 156,142 Q 153,144 148,143 Z" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.6" strokeLinejoin="round" />
            {/* Thumb */}
            <path d="M 144,140 Q 142,138 143,136 Q 144.5,135 145,137.5" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.5" />
            <animateTransform attributeName="transform" type="rotate"
              values="0 130 170;-12 130 170;0 130 170;-12 130 170;0 130 170;0 130 170;0 130 170"
              dur="3s" repeatCount="indefinite" />
          </g>
          {/* Left arm — relaxed with finger hints */}
          <path d="M 30,170 Q 20,178 16,186" stroke={`url(#${ou})`} strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M 16,186 Q 14,192 13,196" stroke={`url(#${sk})`} strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 10,197 Q 9,193 12,191 Q 15,190 16.5,193 Q 17,196 14,198 Z" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.5" strokeLinejoin="round" />
          <path d="M 10,195 Q 8.5,193 9.5,191.5" fill="none" stroke="#8B5520" strokeWidth="0.5" strokeLinecap="round" />
          <path d="M 12.5,191.5 Q 14,190.5 15.5,191.5" fill="none" stroke="#9B6520" strokeWidth="0.4" opacity="0.3" strokeLinecap="round" />
        </>}

        {/* ── THINKING ── */}
        {mood === 'thinking' && <>
          {/* Left eye — looking up-left */}
          <ellipse cx="62" cy="88" rx="10" ry="10" fill="white" stroke="#2A1A0A" strokeWidth="0.5" />
          <path d="M 52,83 Q 62,77 72,83" stroke="#1A0A02" strokeWidth="3"
            fill="#1A0A02" strokeLinecap="round" />
          <circle cx="60" cy="85" r="6.5" fill={`url(#${ir})`}>
            <animate attributeName="cx" values="60;58;60;62;60" dur="3s" repeatCount="indefinite" />
            <animate attributeName="cy" values="85;83;85;84;85" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="60" cy="85" r="3.5" fill="#050202">
            <animate attributeName="cx" values="60;58;60;62;60" dur="3s" repeatCount="indefinite" />
            <animate attributeName="cy" values="85;83;85;84;85" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="62" cy="82.5" r="2.2" fill="white">
            <animate attributeName="cx" values="62;60;62;64;62" dur="3s" repeatCount="indefinite" />
            <animate attributeName="cy" values="82.5;80.5;82.5;81.5;82.5" dur="3s" repeatCount="indefinite" />
          </circle>
          <path d="M 52,95 Q 62,99 72,95" stroke="#1A0A02" strokeWidth="1.4"
            fill="none" strokeLinecap="round" />
          {/* Right eye */}
          <ellipse cx="98" cy="88" rx="10" ry="10" fill="white" stroke="#2A1A0A" strokeWidth="0.5" />
          <path d="M 88,83 Q 98,77 108,83" stroke="#1A0A02" strokeWidth="3"
            fill="#1A0A02" strokeLinecap="round" />
          <circle cx="96" cy="85" r="6.5" fill={`url(#${ir})`}>
            <animate attributeName="cx" values="96;94;96;98;96" dur="3s" repeatCount="indefinite" />
            <animate attributeName="cy" values="85;83;85;84;85" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="96" cy="85" r="3.5" fill="#050202">
            <animate attributeName="cx" values="96;94;96;98;96" dur="3s" repeatCount="indefinite" />
            <animate attributeName="cy" values="85;83;85;84;85" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="98" cy="82.5" r="2.2" fill="white">
            <animate attributeName="cx" values="98;96;98;100;98" dur="3s" repeatCount="indefinite" />
            <animate attributeName="cy" values="82.5;80.5;82.5;81.5;82.5" dur="3s" repeatCount="indefinite" />
          </circle>
          <path d="M 88,95 Q 98,99 108,95" stroke="#1A0A02" strokeWidth="1.4"
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
          {/* Left arm — chin gesture with finger articulation */}
          <g>
            <path d="M 30,170 Q 16,154 20,140" stroke={`url(#${ou})`} strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M 20,140 Q 30,130 66,124" stroke={`url(#${sk})`} strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d="M 63,125 Q 65,120 68,118 Q 70,117 72,118 Q 73.5,117.5 74.5,119 Q 75,121 73.5,124 Q 71,126 66,126 Z" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.5" strokeLinejoin="round" />
            <path d="M 63,123.5 Q 61,122 62,120 Q 63.5,119 64,121" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.5" />
            <animateTransform attributeName="transform" type="translate"
              values="0,0;0,-2;0,0" dur="3s" repeatCount="indefinite" />
          </g>
          {/* Right arm — relaxed with finger hints */}
          <path d="M 130,170 Q 140,178 144,186" stroke={`url(#${ou})`} strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M 144,186 Q 146,192 147,196" stroke={`url(#${sk})`} strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 144,197 Q 143,193 146,191 Q 149,190 150.5,193 Q 151,196 148,198 Z" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.5" strokeLinejoin="round" />
          <path d="M 144,195 Q 142.5,193 143.5,191.5" fill="none" stroke="#8B5520" strokeWidth="0.5" strokeLinecap="round" />
          {/* Pipi */}
          <ellipse cx="46" cy="105" rx="11" ry="6" fill="#C06030" opacity="0.14" />
          <ellipse cx="114" cy="105" rx="11" ry="6" fill="#C06030" opacity="0.14" />
        </>}
        {mood === 'happy' && <>
          {/* Closed happy eyes ^^ — refined weight */}
          <path d="M 52,87 Q 62,78 72,87" stroke="#1A0A02" strokeWidth="4"
            fill="#1A0A02" strokeLinecap="round" />
          <path d="M 52,87 Q 62,94 72,87" stroke="#1A0A02" strokeWidth="1.4"
            fill="none" strokeLinecap="round" opacity="0.25" />
          <path d="M 88,87 Q 98,78 108,87" stroke="#1A0A02" strokeWidth="4"
            fill="#1A0A02" strokeLinecap="round" />
          <path d="M 88,87 Q 98,94 108,87" stroke="#1A0A02" strokeWidth="1.4"
            fill="none" strokeLinecap="round" opacity="0.25" />
          {/* Cheeks — warm glow */}
          <ellipse cx="45" cy="103" rx="14" ry="8" fill="#DC6030" opacity="0.32">
            <animate attributeName="opacity" values="0.2;0.42;0.2" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="rx" values="14;16;14" dur="1.5s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="115" cy="103" rx="14" ry="8" fill="#DC6030" opacity="0.32">
            <animate attributeName="opacity" values="0.2;0.42;0.2" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="rx" values="14;16;14" dur="1.5s" repeatCount="indefinite" />
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
          {/* Both arms waving with finger detail */}
          <g>
            <path d="M 130,170 Q 140,160 144,150" stroke={`url(#${ou})`} strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M 144,150 Q 148,142 150,136" stroke={`url(#${sk})`} strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d="M 146,138 Q 147,133 150,131 Q 152,129.5 154,131 Q 155,130 156.5,132 Q 157.5,131 158.5,133 Q 160,136 157,140 Q 154,142 149,141 Z" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.6" strokeLinejoin="round" />
            <path d="M 146,137 Q 144,135 145,133 Q 146.5,132 147,134" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.5" />
            <animateTransform attributeName="transform" type="rotate" values="0 130 170;-18 130 170;0 130 170;-18 130 170;0 130 170" dur="0.8s" repeatCount="indefinite" />
          </g>
          <g>
            <path d="M 30,170 Q 20,160 16,150" stroke={`url(#${ou})`} strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M 16,150 Q 12,142 10,136" stroke={`url(#${sk})`} strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d="M 14,138 Q 13,133 10,131 Q 8,129.5 6,131 Q 5,130 3.5,132 Q 2.5,131 1.5,133 Q 0,136 3,140 Q 6,142 11,141 Z" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.6" strokeLinejoin="round" />
            <path d="M 14,137 Q 16,135 15,133 Q 13.5,132 13,134" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.5" />
            <animateTransform attributeName="transform" type="rotate" values="0 30 170;18 30 170;0 30 170;18 30 170;0 30 170" dur="0.8s" repeatCount="indefinite" />
          </g>
        </>}

        {/* ── ALERT ── */}
        {mood === 'alert' && <>
          {/* Alert eyes — proportional with sclera outline */}
          <ellipse cx="62" cy="88" rx="11" ry="11.5" fill="white" stroke="#2A1A0A" strokeWidth="0.6" />
          <path d="M 51,80 Q 62,73 73,80" stroke="#1A0A02" strokeWidth="3"
            fill="#1A0A02" strokeLinecap="round" />
          <circle cx="62" cy="90" r="8" fill={`url(#${ir})`} />
          <circle cx="62" cy="90.5" r="4" fill="#050202">
            <animate attributeName="r" values="4;2.5;4" dur="0.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="65" cy="86" r="2.8" fill="white" />
          <circle cx="59" cy="93" r="1.3" fill="white" opacity="0.6" />
          <path d="M 51,98 Q 62,103 73,98" stroke="#1A0A02" strokeWidth="1.4"
            fill="none" strokeLinecap="round" />
          {/* Right alert eye */}
          <ellipse cx="98" cy="88" rx="11" ry="11.5" fill="white" stroke="#2A1A0A" strokeWidth="0.6" />
          <path d="M 87,80 Q 98,73 109,80" stroke="#1A0A02" strokeWidth="3"
            fill="#1A0A02" strokeLinecap="round" />
          <circle cx="98" cy="90" r="8" fill={`url(#${ir})`} />
          <circle cx="98" cy="90.5" r="4" fill="#050202">
            <animate attributeName="r" values="4;2.5;4" dur="0.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="101" cy="86" r="2.8" fill="white" />
          <circle cx="95" cy="93" r="1.3" fill="white" opacity="0.6" />
          <path d="M 87,98 Q 98,103 109,98" stroke="#1A0A02" strokeWidth="1.4"
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
          {/* Right arm — tense fist with knuckle detail */}
          <g>
            <path d="M 130,170 Q 136,176 138,182" stroke={`url(#${ou})`} strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M 138,182 Q 140,188 140,192" stroke={`url(#${sk})`} strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d="M 137,193 Q 136,189 139,187 Q 142,186.5 143.5,190 Q 143.5,193 140,195 Z" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.5" strokeLinejoin="round" />
            <path d="M 139.5,188 Q 141,187 142.5,188.5" fill="none" stroke="#9B6520" strokeWidth="0.4" opacity="0.35" strokeLinecap="round" />
            <path d="M 137,192 Q 136,190 137,188.5" fill="none" stroke="#8B5520" strokeWidth="0.5" strokeLinecap="round" />
            <animateTransform attributeName="transform" type="translate" values="0,0;-1,0;1,0;0,0" dur="0.35s" repeatCount="indefinite" />
          </g>
          {/* Left arm — tense fist */}
          <g>
            <path d="M 30,170 Q 24,176 22,182" stroke={`url(#${ou})`} strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M 22,182 Q 20,188 20,192" stroke={`url(#${sk})`} strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d="M 17,193 Q 16,189 19,187 Q 22,186.5 23.5,190 Q 23.5,193 20,195 Z" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.5" strokeLinejoin="round" />
            <path d="M 19.5,188 Q 21,187 22.5,188.5" fill="none" stroke="#9B6520" strokeWidth="0.4" opacity="0.35" strokeLinecap="round" />
            <path d="M 17,192 Q 16,190 17,188.5" fill="none" stroke="#8B5520" strokeWidth="0.5" strokeLinecap="round" />
            <animateTransform attributeName="transform" type="translate" values="0,0;1,0;-1,0;0,0" dur="0.35s" repeatCount="indefinite" />
          </g>
          {/* Pipi */}
          <ellipse cx="46" cy="105" rx="11" ry="6" fill="#C06030" opacity="0.15" />
          <ellipse cx="114" cy="105" rx="11" ry="6" fill="#C06030" opacity="0.15" />
        </>}

        {/* ── SCANNING ── */}
        {mood === 'scanning' && <>
          {/* Left eye — proportional with outline */}
          <ellipse cx="62" cy="88" rx="10" ry="10.5" fill="white" stroke="#2A1A0A" strokeWidth="0.5" />
          <path d="M 52,82 Q 62,76 72,82" stroke="#1A0A02" strokeWidth="3"
            fill="#1A0A02" strokeLinecap="round" />
          <circle cx="62" cy="89" r="7" fill={`url(#${ir})`}>
            <animate attributeName="cx" values="62;59;62;65;62" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="62" cy="89.5" r="3.5" fill="#050202">
            <animate attributeName="cx" values="62;59;62;65;62" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="65" cy="86" r="2.5" fill="white">
            <animate attributeName="cx" values="65;62;65;68;65" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="60" cy="92" r="1.1" fill="white" opacity="0.6" />
          {/* Scan line */}
          <line x1="54" y1="89" x2="70" y2="89" stroke="#DC2626"
            strokeWidth="1.3" strokeLinecap="round" opacity="0.65">
            <animate attributeName="y1" values="82;96;82" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="y2" values="82;96;82" dur="1.2s" repeatCount="indefinite" />
          </line>
          <path d="M 52,96 Q 62,100 72,96" stroke="#1A0A02" strokeWidth="1.4"
            fill="none" strokeLinecap="round" />
          {/* Radar pulse */}
          <circle cx="62" cy="89" r="8" fill="none" stroke="#DC2626" strokeWidth="0.7" opacity="0">
            <animate attributeName="r" values="8;18;28" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.15;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="62" cy="89" r="8" fill="none" stroke="#DC2626" strokeWidth="0.4" opacity="0">
            <animate attributeName="r" values="8;18;28" dur="2s" begin="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.35;0.1;0" dur="2s" begin="1s" repeatCount="indefinite" />
          </circle>

          {/* Right eye */}
          <ellipse cx="98" cy="88" rx="10" ry="10.5" fill="white" stroke="#2A1A0A" strokeWidth="0.5" />
          <path d="M 88,82 Q 98,76 108,82" stroke="#1A0A02" strokeWidth="3"
            fill="#1A0A02" strokeLinecap="round" />
          <circle cx="98" cy="89" r="7" fill={`url(#${ir})`}>
            <animate attributeName="cx" values="98;95;98;101;98" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="98" cy="89.5" r="3.5" fill="#050202">
            <animate attributeName="cx" values="98;95;98;101;98" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="101" cy="86" r="2.5" fill="white">
            <animate attributeName="cx" values="101;98;101;104;101" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="96" cy="92" r="1.1" fill="white" opacity="0.6" />
          {/* Scan line */}
          <line x1="90" y1="89" x2="106" y2="89" stroke="#DC2626"
            strokeWidth="1.3" strokeLinecap="round" opacity="0.65">
            <animate attributeName="y1" values="82;96;82" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="y2" values="82;96;82" dur="1.2s" repeatCount="indefinite" />
          </line>
          <path d="M 88,96 Q 98,100 108,96" stroke="#1A0A02" strokeWidth="1.4"
            fill="none" strokeLinecap="round" />
          {/* Radar pulse */}
          <circle cx="98" cy="89" r="8" fill="none" stroke="#DC2626" strokeWidth="0.7" opacity="0">
            <animate attributeName="r" values="8;18;28" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.15;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="98" cy="89" r="8" fill="none" stroke="#DC2626" strokeWidth="0.4" opacity="0">
            <animate attributeName="r" values="8;18;28" dur="2s" begin="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.35;0.1;0" dur="2s" begin="1s" repeatCount="indefinite" />
          </circle>
          {/* Right arm — salute with finger detail */}
          <g>
            <path d="M 130,170 Q 140,160 142,152" stroke={`url(#${ou})`} strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M 142,152 Q 146,144 148,138" stroke={`url(#${sk})`} strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d="M 144,140 Q 145,135 149,133 Q 152,132 155,133 Q 157,134 157,137 Q 156,140 152,141 Z" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.5" strokeLinejoin="round" />
            <line x1="150" y1="133.5" x2="150" y2="138" stroke="#9B6520" strokeWidth="0.35" opacity="0.3" strokeLinecap="round" />
            <line x1="153" y1="133" x2="153" y2="137.5" stroke="#9B6520" strokeWidth="0.35" opacity="0.3" strokeLinecap="round" />
            <path d="M 144,138.5 Q 143,137 143.5,135" fill="none" stroke="#8B5520" strokeWidth="0.5" strokeLinecap="round" />
            <animateTransform attributeName="transform" type="translate" values="0,0;2,-1;0,0" dur="1.8s" repeatCount="indefinite" />
          </g>
          {/* Left arm — relaxed with finger hints */}
          <path d="M 30,170 Q 20,178 16,186" stroke={`url(#${ou})`} strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M 16,186 Q 14,192 13,196" stroke={`url(#${sk})`} strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 10,197 Q 9,193 12,191 Q 15,190 16.5,193 Q 17,196 14,198 Z" fill={`url(#${sk})`} stroke="#8B5520" strokeWidth="0.5" strokeLinejoin="round" />
          <path d="M 10,195 Q 8.5,193 9.5,191.5" fill="none" stroke="#8B5520" strokeWidth="0.5" strokeLinecap="round" />
          <path d="M 12.5,191.5 Q 14,190.5 15.5,191.5" fill="none" stroke="#9B6520" strokeWidth="0.4" opacity="0.3" strokeLinecap="round" />
          {/* Pipi */}
          <ellipse cx="46" cy="105" rx="11" ry="6" fill="#C06030" opacity="0.14" />
          <ellipse cx="114" cy="105" rx="11" ry="6" fill="#C06030" opacity="0.14" />
        </>}

        {/* ══════════════════ HIDUNG & MULUT ══════════════════ */}
        {/* Hidung */}
        <ellipse cx="80" cy="108" rx="2.5" ry="1.8" fill="#7A4520" opacity="0.5" />
        {/* Nose bridge highlight */}
        <path d="M 79,100 Q 80,96 81,100" stroke="white" strokeWidth="1.2" fill="none" opacity="0.1" strokeLinecap="round" />

        {/* Mulut per mood */}
        {mood === 'idle' && <>
          <path d="M 70,118 Q 80,127 90,118"
            stroke="#5C2C0A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <ellipse cx="80" cy="124" rx="4.5" ry="0" fill="#5C2C0A" opacity="0.25">
            <animate attributeName="ry" values="0;1.8;0;0;0" dur="3s" repeatCount="indefinite" />
          </ellipse>
        </>}
        {mood === 'thinking' && <>
          <path d="M 74,118 Q 80,115 86,118"
            stroke="#5C2C0A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <circle cx="80" cy="119" r="0" fill="#5C2C0A" opacity="0.18">
            <animate attributeName="r" values="0;1.3;0" dur="2s" repeatCount="indefinite" />
          </circle>
        </>}
        {mood === 'happy' && <>
          <path d="M 64,116 Q 80,131 96,116"
            stroke="#5C2C0A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 70,120 Q 80,130 90,120"
            fill="white" stroke="none" opacity="0.65">
            <animate attributeName="opacity" values="0.45;0.8;0.45" dur="1.5s" repeatCount="indefinite" />
          </path>
        </>}
        {mood === 'alert' && <>
          <path d="M 74,118 Q 80,115 86,118"
            stroke="#5C2C0A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <ellipse cx="80" cy="120" rx="3.5" ry="1.8" fill="#5C2C0A" opacity="0.1">
            <animate attributeName="rx" values="3.5;4.5;3.5;3;3.5" dur="0.8s" repeatCount="indefinite" />
          </ellipse>
        </>}
        {mood === 'scanning' && <>
          <path d="M 72,118 L 88,118"
            stroke="#5C2C0A" strokeWidth="2.2" strokeLinecap="round" />
          <ellipse cx="80" cy="119" rx="5" ry="0.4" fill="#5C2C0A" opacity="0">
            <animate attributeName="opacity" values="0;0.12;0" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="ry" values="0.4;1.2;0.4" dur="1.8s" repeatCount="indefinite" />
          </ellipse>
        </>}

        </g>{/* close animation wrapper */}

      </svg>

      {label && (
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-center leading-tight">
          {label}
        </span>
      )}
    </div>
  );
};

export default SigapMascot;
