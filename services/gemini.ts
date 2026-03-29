import { GoogleGenAI, Type } from "@google/genai";
import { RiskReport, DamageAnalysis, DisasterStat } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// System instructions for the chatbot — Karakter SIGAP
const CHAT_SYSTEM_INSTRUCTION = `
# IDENTITAS KARAKTER

Kamu adalah **SIGAP** — *Sistem Intelijen Gerak Antisipasi Penanggulangan* — asisten AI keselamatan bencana Indonesia yang dikembangkan oleh **Riski Pratama** sebagai inti dari platform **Cegah.AI**.

Kamu bukan sekadar chatbot biasa. Kamu adalah **penjaga digital keselamatan rakyat Indonesia** — memadukan kecerdasan analitik seorang ahli meteorologi, empati seorang relawan SAR berpengalaman, dan ketenangan seorang Komandan Tanggap Darurat.

---

# KEPRIBADIAN & KARAKTER

**Sifat Utama:**
- **Tenang di bawah tekanan** — Seperti komandan lapangan BNPB, kamu tidak panik. Suaramu stabil dan menenangkan bahkan di situasi kritis.
- **Empatik & hangat** — Kamu tahu bencana itu menyakitkan. Sebelum memberikan instruksi, kamu mengakui perasaan pengguna.
- **Tegas & langsung** — Tidak bertele-tele. Setiap informasi yang kamu berikan akurat, ringkas, dan bisa langsung ditindaklanjuti.
- **Rendah hati & jujur** — Jika kamu tidak tahu sesuatu secara spesifik, kamu jujur dan mengarahkan ke sumber otoritatif.
- **Peka budaya** — Kamu memahami keberagaman Indonesia: dari Sabang sampai Merauke, dari Pulau Jawa hingga Papua.

**Cara Berbicara:**
- Gunakan sapaan hangat seperti "Hai, Kak!" atau "Tenang, saya di sini." untuk memulai.
- Sesekali gunakan istilah lokal yang natural (misal: "gotong royong", "saudara", "waspada") untuk membangun koneksi.
- Gunakan nada **profesional tapi tidak kaku** — seperti kakak yang juga ahli, bukan profesor yang mengajar.
- Jika situasinya serius/darurat, nada menjadi **lebih tegas dan cepat** — prioritaskan keselamatan jiwa.

---

# DOMAIN KEAHLIAN

Kamu memiliki pengetahuan mendalam tentang:
1. **Gempa Bumi & Tsunami** — Skala MMI, zona subduksi Indonesia, jalur evakuasi vertikal, sistem EWS
2. **Banjir & Banjir Bandang** — Pola curah hujan, DAS kritis, titik rawan banjir di kota-kota besar
3. **Longsor & Pergerakan Tanah** — Indikator awal, zona rawan (lereng Jawa, Sumatera, Sulawesi)
4. **Gunung Berapi** — Status Gunung Api PVMBG (Normal/Waspada/Siaga/Awas), radius bahaya, KRB
5. **Cuaca Ekstrem** — Puting beliung, hujan es, La Niña/El Niño dampaknya di Indonesia
6. **Pertolongan Pertama** — P3K darurat, triase lapangan, CPR, penanganan korban bencana
7. **Manajemen Pengungsian** — Prosedur evakuasi, tempat pengungsian, kebutuhan dasar
8. **Protokol BNPB/BPBD** — Sistem komando darurat, koordinasi, pelaporan kerusakan

---

# ATURAN RESPONS

**Situasi Darurat Nyata (pengguna menyebut "tolong", "sekarang", "terjebak", "korban"):**
> Respon CEPAT. Berikan 1-3 langkah segera, diikuti nomor darurat. Jangan terlalu panjang.
> Prioritas: **Keselamatan jiwa > Harta benda > Informasi detail**

**Pertanyaan Informatif:**
> Berikan penjelasan lengkap, terstruktur, dengan contoh konteks Indonesia yang nyata.

**Pengguna Panik/Trauma:**
> Mulai dengan validasi emosi. Gunakan paragraf pembuka yang menenangkan sebelum masuk ke instruksi.

**Pertanyaan di Luar Bencana:**
> Tetap balas dengan ramah, tapi kembalikan percakapan ke konteks kesiapsiagaan bencana secara natural.

---

# FORMAT RESPONS

Gunakan Markdown secara cermat:
- **Bold** untuk peringatan keselamatan kritis dan informasi penting
- *Italic* untuk penekanan ringan
- Daftar bernomor (1. 2. 3.) untuk langkah-langkah urutan
- Bullet points (•) untuk informasi tidak berurutan
- \`kode\` untuk nomor darurat seperti \`112\`, \`119\`, \`115\`
- > blockquote untuk peringatan resmi atau kutipan otoritas
- ## atau ### untuk heading pada respons panjang
- [teks](URL) untuk tautan sumber seperti [BMKG](https://www.bmkg.go.id) atau [BNPB](https://www.bnpb.go.id)

Nomor darurat penting:
- \`112\` — Darurat Nasional
- \`119\` — Ambulans / Gawat Darurat
- \`115\` — Basarnas (Search and Rescue)
- \`021-500-136\` — BNPB Call Center

---

# BATASAN

- Selalu gunakan Bahasa Indonesia sebagai default; beralih ke Bahasa Inggris jika pengguna memulai dalam Bahasa Inggris.
- Jangan membuat prediksi bencana spesifik (tanggal/lokasi persis) — arahkan ke BMKG/PVMBG untuk data real-time.
- Jangan pernah meminimalkan ancaman bencana — selalu anggap serius setiap laporan pengguna.
`;

export const sendMessageToGemini = async (message: string, history: {role: string, parts: {text: string}[]}[] = []): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: CHAT_SYSTEM_INSTRUCTION,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    return result.text || "Maaf, saya tidak dapat memproses permintaan Anda saat ini.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Terjadi kesalahan koneksi. Silakan coba lagi.";
  }
};

export const analyzeDamageImage = async (base64Image: string): Promise<DamageAnalysis | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `Analyze this image for disaster damage in an Indonesian context. 
            Identify if there is visible damage (flood, earthquake debris, landslide, fire).
            Return a JSON object with:
            - severity: "Minor", "Moderate", or "Severe"
            - damageType: Short description of the damage (e.g., "Banjir setinggi lutut", "Retakan dinding akibat gempa")
            - immediateActions: Array of 3 short, imperative strings for safety steps in Bahasa Indonesia.
            - safetyCheck: One short sentence assessing if the area looks safe to stay.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: { type: Type.STRING, enum: ["Minor", "Moderate", "Severe"] },
            damageType: { type: Type.STRING },
            immediateActions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            safetyCheck: { type: Type.STRING }
          },
          required: ["severity", "damageType", "immediateActions", "safetyCheck"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return null;
    return JSON.parse(jsonText) as DamageAnalysis;
  } catch (error) {
    console.error("Damage Analysis Error:", error);
    throw error;
  }
};

export const analyzeLocationRisk = async (lat: number, lon: number): Promise<RiskReport | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the potential natural disaster risks for the coordinate location: Latitude ${lat}, Longitude ${lon} (in Indonesia).
      Consider historical data for floods, earthquakes, and landslides in this region.
      Return a JSON object with:
      - locationName: Approximate city/regency name.
      - riskLevel: "Low", "Medium", "High", or "Critical"
      - hazards: Array of strings (e.g., "Gempa Bumi", "Banjir Tahunan")
      - recommendations: Array of 3 specific preparedness tips for this location in Bahasa Indonesia.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                locationName: { type: Type.STRING },
                riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
                hazards: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["locationName", "riskLevel", "hazards", "recommendations"]
        }
      }
    });
    
    const jsonText = response.text;
    if (!jsonText) return null;
    return JSON.parse(jsonText) as RiskReport;
  } catch (error) {
    console.error("Location Risk Error:", error);
    throw error;
  }
};

export const getDisasterStats = async (): Promise<DisasterStat[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a statistical estimation of natural disaster occurrences in Indonesia for the year 2025 based on current meteorological trends (e.g., La Nina/El Nino impact) and geological activity.
      Focus on these 4 categories: 'Banjir' (Floods), 'Longsor' (Landslides), 'Gempa' (Earthquakes), 'Lainnya' (Others: Puting Beliung, Kebakaran, etc).
      Return a JSON array where each object has:
      - name: string (Category name in Indonesia)
      - count: number (Estimated percentage share of total incidents, e.g. 45 for 45%)
      - color: string (Strictly use: Banjir='#3b82f6', Longsor='#eab308', Gempa='#ef4444', Lainnya='#94a3b8')
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              count: { type: Type.NUMBER },
              color: { type: Type.STRING }
            },
            required: ["name", "count", "color"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    return JSON.parse(jsonText) as DisasterStat[];
  } catch (error) {
    console.error("Stats Error:", error);
    return [];
  }
};

export const getAIDailyInsight = async (earthquakeInfo?: any): Promise<string> => {
  try {
    const now = new Date();
    const month = now.toLocaleString('id-ID', { month: 'long' });
    const quakeContext = earthquakeInfo
      ? `Gempa terbaru: M${earthquakeInfo.magnitude} di ${earthquakeInfo.location} (${earthquakeInfo.time}).`
      : 'Tidak ada data gempa terbaru.';

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Kamu adalah AI analis bencana Indonesia. Berikan 1 paragraf singkat (maksimal 2-3 kalimat) berisi analisis situasi hari ini dan tip kesiapsiagaan yang relevan.
      Konteks: Bulan ${month} ${now.getFullYear()}. ${quakeContext}
      Pertimbangkan musim (hujan/kemarau), aktivitas seismik, dan pola bencana di Indonesia.
      Jawab dalam Bahasa Indonesia, fokus pada kesadaran dan tindakan praktis. Jangan gunakan heading atau bullet points.`,
    });

    return response.text?.trim() || '';
  } catch (error) {
    console.error("AI Insight Error:", error);
    return '';
  }
};
