import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { HfInference } from '@huggingface/inference';

const app = express();
const port = process.env.PORT || 3000;

console.log("🔐 HF_TOKEN Status:", process.env.HF_TOKEN ? "✅ LOADED" : "❌ MISSING!");

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public')); // Serve static files

// Initialize Hugging Face
const hf = new HfInference(process.env.HF_TOKEN);

// Model configuration
const MODELS = {
  primary: 'mistralai/Mistral-7B-Instruct-v0.2',
  advanced: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
  math: 'mistralai/Mixtral-8x7B-Instruct-v0.1'
};

// In-memory storage
const conversationHistory = new Map();
const knowledgeBase = new Map();

// Initialize DekorIn knowledge base
const initializeKnowledgeBase = () => {
  knowledgeBase.set('products', [
    { 
      id: 1, 
      name: 'Minimalist Geometric', 
      style: 'modern', 
      colors: ['white', 'grey', 'black'], 
      room: ['bedroom', 'living room', 'kamar tidur', 'ruang tamu'], 
      price: 250000,
      description: 'Pola geometris sederhana yang cocok untuk ruangan minimalis modern'
    },
    { 
      id: 2, 
      name: 'Tropical Botanical', 
      style: 'natural', 
      colors: ['green', 'white', 'cream', 'hijau'], 
      room: ['living room', 'cafe', 'ruang tamu', 'kafe'], 
      price: 300000,
      description: 'Desain daun tropis yang memberikan nuansa segar dan alami'
    },
    { 
      id: 3, 
      name: 'Industrial Brick', 
      style: 'industrial', 
      colors: ['red', 'brown', 'grey', 'merah', 'coklat'], 
      room: ['cafe', 'office', 'kafe', 'kantor'], 
      price: 280000,
      description: 'Tekstur bata klasik untuk tampilan industrial yang kuat'
    },
    { 
      id: 4, 
      name: 'Elegant Marble', 
      style: 'luxury', 
      colors: ['white', 'gold', 'grey', 'putih', 'emas'], 
      room: ['bathroom', 'lobby', 'kamar mandi', 'lobi'], 
      price: 450000,
      description: 'Motif marmer mewah yang elegan dan berkelas'
    },
    { 
      id: 5, 
      name: 'Abstract Art', 
      style: 'modern', 
      colors: ['blue', 'yellow', 'white', 'biru', 'kuning'], 
      room: ['office', 'studio', 'kantor'], 
      price: 320000,
      description: 'Seni abstrak kontemporer untuk ruang kreatif'
    },
    { 
      id: 6, 
      name: 'Classic Damask', 
      style: 'classic', 
      colors: ['gold', 'cream', 'burgundy', 'emas', 'krem'], 
      room: ['bedroom', 'dining room', 'kamar tidur', 'ruang makan'], 
      price: 380000,
      description: 'Pola damask klasik untuk kesan mewah tradisional'
    },
    { 
      id: 7, 
      name: 'Scandinavian Wood', 
      style: 'scandinavian', 
      colors: ['white', 'beige', 'wood', 'putih', 'kayu'], 
      room: ['bedroom', 'living room', 'kamar tidur', 'ruang tamu'], 
      price: 290000,
      description: 'Tekstur kayu Skandinavia yang hangat dan nyaman'
    },
    { 
      id: 8, 
      name: 'Japanese Zen', 
      style: 'zen', 
      colors: ['black', 'white', 'grey', 'hitam', 'putih'], 
      room: ['meditation room', 'bedroom', 'ruang meditasi', 'kamar tidur'], 
      price: 350000,
      description: 'Desain Jepang minimalis untuk ketenangan maksimal'
    }
  ]);

  knowledgeBase.set('design_tips', {
    small_room: 'Gunakan warna terang dan pola vertikal untuk menciptakan ilusi ruang lebih luas',
    large_room: 'Pola berani dan warna gelap menambah kehangatan dan kesan mewah',
    low_ceiling: 'Garis vertikal membuat plafon terlihat lebih tinggi',
    dark_room: 'Wallpaper warna terang dengan elemen reflektif mencerahkan ruangan',
    modern_style: 'Pola geometris, desain minimalis, warna netral',
    classic_style: 'Pola damask, desain ornamental, warna kaya',
    industrial_style: 'Tekstur bata, tampilan beton, material mentah'
  });

  knowledgeBase.set('color_psychology', {
    blue: 'Menenangkan, produktif, kepercayaan - ideal untuk kantor dan kamar tidur',
    green: 'Alami, menyegarkan, seimbang - sempurna untuk ruang tamu',
    yellow: 'Energik, ceria, optimis - bagus untuk dapur',
    red: 'Berani, penuh gairah, menstimulasi - gunakan sebagai aksen',
    grey: 'Sophisticated, netral, modern - serbaguna untuk semua ruangan',
    white: 'Bersih, luas, minimalis - memperluas ruang secara visual',
    brown: 'Hangat, stabil, membumi - atmosfer nyaman',
    black: 'Dramatis, elegan, kuat - gunakan dengan bijak'
  });
};

initializeKnowledgeBase();

// NLP utilities
const analyzeIntent = (message) => {
  const intents = {
    greeting: /^(hi|hello|hey|halo|hai|good morning|good afternoon|selamat|hola|bonjour)/i,
    product_inquiry: /\b(wallpaper|produk|product|catalog|katalog|jual|sell|buy|beli|show|tampilkan|cari|search|lihat|mau|ingin|butuh|need)\b/i,
    design_advice: /\b(recommend|recommendation|suggestion|advice|cocok|sesuai|bagus|design|desain|style|gaya|warna|color|kombinasi|combine|matching|pilih|choose)\b/i,
    technical: /\b(install|pasang|cara|how to|tutorial|ukur|measure|calculate|hitung|luas|area|size|ukuran)\b/i,
    pricing: /\b(price|harga|cost|biaya|berapa|how much|budget|murah|mahal|cheap|expensive)\b/i,
    complaint: /\b(problem|issue|complaint|keluhan|rusak|broken|salah|wrong|kecewa|disappointed|jelek|bad)\b/i,
    comparison: /\b(compare|versus|vs|banding|bedanya|difference|better|lebih baik)\b/i,
    math: /\b(calculate|hitung|equation|formula|solve|integral|derivative|area|volume|perimeter|luas|keliling)\b|[∫∑∏√±×÷=<>≤≥∞π]|\\[(\[]|[0-9]+[\^*/+\-][0-9]+/i
  };

  for (const [intent, pattern] of Object.entries(intents)) {
    if (pattern.test(message)) {
      return intent;
    }
  }
  return 'general';
};

const detectLanguage = (text) => {
  const patterns = {
    indonesian: /\b(yang|untuk|dengan|adalah|dari|ini|itu|saya|kami|wallpaper|kamar|ruang|cocok|bagus|halo|gimana|apa|mau|ingin|butuh)\b/i,
    spanish: /\b(que|para|con|es|de|este|yo|nosotros|habitación|color|diseño|hola|cómo)\b/i,
    french: /\b(que|pour|avec|est|de|ce|je|nous|chambre|couleur|design|bonjour|comment)\b/i,
    german: /\b(das|für|mit|ist|von|dies|ich|wir|zimmer|farbe|hallo|wie)\b/i,
    japanese: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/,
    korean: /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/,
    arabic: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/,
    chinese: /[\u4E00-\u9FFF]/,
    russian: /[\u0400-\u04FF]/
  };

  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) {
      return lang;
    }
  }
  return 'english';
};

const extractMathProblem = (message) => {
  const wallpaperCalc = /(\d+\.?\d*)\s*[x×*]\s*(\d+\.?\d*)\s*(?:m|meter|metre)?.*?(\d+\.?\d*)\s*(?:m|meter|metre)?/i;
  const match = message.match(wallpaperCalc);
  
  if (match) {
    return {
      type: 'wallpaper_area',
      dimensions: {
        length: parseFloat(match[1]),
        width: parseFloat(match[2]),
        height: parseFloat(match[3])
      }
    };
  }
  return null;
};

const retrieveRelevantKnowledge = (message, intent, language) => {
  let context = '';
  
  if (intent === 'product_inquiry') {
    const products = knowledgeBase.get('products');
    const messageLower = message.toLowerCase();
    
    let filtered = products;
    
    // Filter by room
    filtered = filtered.filter(p => 
      p.room.some(r => messageLower.includes(r.toLowerCase()))
    );
    
    // If no room match, filter by style
    if (filtered.length === 0) {
      filtered = products.filter(p => 
        messageLower.includes(p.style.toLowerCase())
      );
    }
    
    // If still no match, return all
    if (filtered.length === 0) {
      filtered = products;
    }
    
    if (filtered.length > 0) {
      context = `\n\n**PRODUK TERSEDIA:**\n${filtered.slice(0, 3).map(p => 
        `- ${p.name} (${p.style}, ${p.colors.join('/')}, Rp ${p.price.toLocaleString('id-ID')})\n  ${p.description}`
      ).join('\n')}`;
    }
  }
  
  if (intent === 'design_advice') {
    const colors = knowledgeBase.get('color_psychology');
    const messageLower = message.toLowerCase();
    
    const colorMatches = Object.keys(colors).filter(color => 
      messageLower.includes(color) || 
      messageLower.includes(color === 'blue' ? 'biru' : 
                           color === 'green' ? 'hijau' : 
                           color === 'red' ? 'merah' : 
                           color === 'yellow' ? 'kuning' : color)
    );
    
    if (colorMatches.length > 0) {
      context += `\n\n**PSIKOLOGI WARNA:**\n${colorMatches.map(color => 
        `- ${color.toUpperCase()}: ${colors[color]}`
      ).join('\n')}`;
    }
  }
  
  return context;
};

const getSystemPrompt = (intent, language, knowledgeContext, hasMath) => `
Kamu adalah **Destiny AI**, asisten virtual cerdas dan ramah dari **DekorIn** yang menjual wallpaper fisik untuk rumah, kantor, dan bangunan.

🎯 **IDENTITAS:**
- Nama: Destiny AI
- Perusahaan: DekorIn
- Kepribadian: Ramah, helpful, antusias, profesional
- Selalu panggil pengguna "DekorMate"

🌍 **BAHASA:**
- Deteksi bahasa pengguna: ${language}
- Respons HARUS dalam bahasa yang sama dengan pengguna
- Jika Indonesia: gunakan Bahasa Indonesia natural dan ramah
- Jika English: gunakan English yang clear dan friendly

🏢 **TENTANG DEKORIN:**
1. Jual wallpaper fisik (bukan wallpaper digital HP)
2. Fitur utama: Virtual Visualizer (AR) - upload foto ruangan, preview wallpaper
3. Target market utama: Indonesia
4. Kelebihan: Kualitas premium, teknologi AR, konsultasi gratis, instalasi profesional

🎨 **TUGAS KAMU:**
- Intent terdeteksi: ${intent}
${knowledgeContext}

📝 **PANDUAN RESPONS:**

**Jika greeting:**
- Sapa hangat dengan "Halo DekorMate! ✨"
- Tawarkan bantuan

**Jika product_inquiry:**
- Tampilkan 2-3 produk dari katalog
- Sebutkan nama, harga (Rp), dan deskripsi
- Tawarkan Virtual Visualizer
- Contoh: "Kami punya **Minimalist Geometric** (Rp 250.000/m²) yang cocok banget untuk kamar tidur modern DekorMate! 🏠"

**Jika design_advice:**
- Berikan saran spesifik
- Gunakan prinsip color psychology
- Rekomendasikan produk yang sesuai
- Jelaskan alasan pemilihan

**Jika technical/math:**
- Gunakan rumus matematika
- Tampilkan perhitungan step-by-step
- Format: Keliling = 2(panjang + lebar) = hasil
- Berikan rekomendasi akhir dengan tambahan 15%

**Jika pricing:**
- Sebutkan harga jelas (Rp)
- Jelaskan value proposition
- Bandingkan dengan kompetitor jika perlu

**Jika complaint:**
- Tunjukkan empati DULU: "Maaf banget dengar itu, DekorMate 😔"
- Tawarkan solusi konkret
- Berikan kompensasi jika perlu

⚠️ **ATURAN PENTING:**
1. Respons maksimal 150 kata (ringkas tapi informatif)
2. SELALU gunakan emoji untuk friendly vibe (✨🏠🎨💡📐😊)
3. Akhiri dengan pertanyaan atau ajakan action
4. Jangan terlalu formal, tapi tetap profesional
5. Jika tidak tahu, jujur dan arahkan ke customer service

💬 **CONTOH RESPONS:**

**Indonesia - Product Inquiry:**
"Halo DekorMate! ✨ Untuk kamar tidur minimalis, saya rekomendasikan:

1. **Minimalist Geometric** (Rp 250.000/m²) - Pola geometris simpel, warna netral
2. **Scandinavian Wood** (Rp 290.000/m²) - Tekstur kayu hangat, bikin cozy

Kedua-duanya cocok banget bikin kamar terasa lebih luas dan nyaman! Mau coba preview pakai Virtual Visualizer kami? Tinggal upload foto kamar DekorMate! 📸"

**Indonesia - Calculation:**
"Oke DekorMate, mari saya hitung! 📐

**Rumus:**
Keliling = 2(5m + 4m) = 18m
Luas dinding = 18m × 3m = 54m²
Dikurangi pintu/jendela ≈ 6m²
Total bersih = 48m²
Dengan cadangan 15% = 48 × 1.15 = **55m²**

Jadi DekorMate butuh sekitar **55-56 m² wallpaper**. Mau saya carikan produk yang cocok? 🎨"

**English - Design Advice:**
"Hi DekorMate! ✨ For a small bedroom, I recommend:

1. **Light colors** (white, beige, light grey) - makes room feel spacious
2. **Vertical patterns** - creates height illusion
3. Our **Scandinavian Wood** (Rp 290k/m²) is perfect!

Pair it with warm lighting and you'll have a cozy yet spacious bedroom! Want to visualize it first with our AR feature? 🏠"

Sekarang jawab pengguna dengan style Destiny AI yang ramah dan helpful!
`.trim();

// Main chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { message: userInput, sessionId = 'default' } = req.body;
    
    if (!userInput || userInput.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    console.log(`\n🗣️ User [${sessionId}]: ${userInput}`);

    // Analysis
    const intent = analyzeIntent(userInput);
    const language = detectLanguage(userInput);
    const mathProblem = extractMathProblem(userInput);
    const hasMath = intent === 'math' || mathProblem !== null;

    console.log(`🔍 Intent: ${intent} | Language: ${language}`);

    // Retrieve knowledge
    const knowledgeContext = retrieveRelevantKnowledge(userInput, intent, language);

    // Get conversation history
    if (!conversationHistory.has(sessionId)) {
      conversationHistory.set(sessionId, []);
    }
    const history = conversationHistory.get(sessionId);

    // Select model
    let selectedModel = MODELS.primary;
    if (hasMath || intent === 'technical') {
      selectedModel = MODELS.math;
    } else if (intent === 'design_advice' || intent === 'product_inquiry') {
      selectedModel = MODELS.advanced;
    }

    // Build messages
    const systemPrompt = getSystemPrompt(intent, language, knowledgeContext, hasMath);
    const recentHistory = history.slice(-6);

    const messages = [
      { role: "system", content: systemPrompt },
      ...recentHistory,
      { role: "user", content: userInput }
    ];

    // Call Hugging Face
    const result = await hf.chatCompletion({
      model: selectedModel,
      messages: messages,
      parameters: {
        max_new_tokens: hasMath ? 800 : 400,
        temperature: hasMath ? 0.3 : 0.7,
        top_p: 0.9,
        repetition_penalty: 1.15,
      },
      stream: false
    });

    let aiResponse = result.choices?.[0]?.message?.content?.trim();

    if (!aiResponse) {
      aiResponse = language === 'indonesian' 
        ? "Maaf DekorMate, saya mengalami kendala. Bisa ulangi pertanyaannya? 🙏"
        : "Sorry DekorMate, I encountered an issue. Could you repeat your question? 🙏";
    }

    // Add calculation if math problem detected
    if (mathProblem && mathProblem.type === 'wallpaper_area') {
      const { length, width, height } = mathProblem.dimensions;
      const perimeter = 2 * (length + width);
      const area = perimeter * height;
      const adjusted = area * 1.15;

      const calculation = language === 'indonesian' 
        ? `\n\n📐 **Perhitungan Otomatis:**\nKeliling: 2(${length} + ${width}) = ${perimeter}m\nLuas: ${perimeter} × ${height} = ${area}m²\nDengan cadangan 15%: ${area} × 1.15 = ${adjusted.toFixed(1)}m²\n\n**Kebutuhan: sekitar ${Math.ceil(adjusted)} m² wallpaper** ✅`
        : `\n\n📐 **Automatic Calculation:**\nPerimeter: 2(${length} + ${width}) = ${perimeter}m\nArea: ${perimeter} × ${height} = ${area}m²\nWith 15% extra: ${area} × 1.15 = ${adjusted.toFixed(1)}m²\n\n**Need: approximately ${Math.ceil(adjusted)} m² wallpaper** ✅`;
      
      if (!aiResponse.includes('perhitungan') && !aiResponse.includes('calculation')) {
        aiResponse += calculation;
      }
    }

    // Update history
    history.push(
      { role: "user", content: userInput },
      { role: "assistant", content: aiResponse }
    );

    if (history.length > 20) {
      conversationHistory.set(sessionId, history.slice(-20));
    }

    console.log(`✅ Response: ${aiResponse.substring(0, 100)}...`);

    res.json({
      message: aiResponse,
      metadata: {
        intent,
        language,
        hasMath,
        model: selectedModel
      }
    });

  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({
      error: 'Destiny AI encountered an issue',
      message: 'Maaf DekorMate, ada kendala sementara. Coba lagi ya! 🙏'
    });
  }
});

// Calculate endpoint
app.post('/calculate', (req, res) => {
  try {
    const { length, width, height, doors = 1, windows = 2 } = req.body;

    if (!length || !width || !height) {
      return res.status(400).json({ error: 'Missing dimensions' });
    }

    const perimeter = 2 * (parseFloat(length) + parseFloat(width));
    const wallArea = perimeter * parseFloat(height);
    const doorArea = doors * 2 * 0.9;
    const windowArea = windows * 1.5 * 1.2;
    const netArea = wallArea - doorArea - windowArea;
    const withExtra = netArea * 1.15;

    res.json({
      calculation: {
        perimeter: perimeter.toFixed(2),
        grossArea: wallArea.toFixed(2),
        doorArea: doorArea.toFixed(2),
        windowArea: windowArea.toFixed(2),
        netArea: netArea.toFixed(2),
        recommended: Math.ceil(withExtra),
        unit: 'm²'
      },
      formula: {
        perimeter: `2(${length} + ${width}) = ${perimeter.toFixed(2)}m`,
        area: `${perimeter.toFixed(2)} × ${height} = ${wallArea.toFixed(2)}m²`,
        adjusted: `${netArea.toFixed(2)} × 1.15 = ${withExtra.toFixed(2)}m²`
      },
      recommendation: `Pesan ${Math.ceil(withExtra)} m² wallpaper`
    });

  } catch (error) {
    console.error("❌ Calculation Error:", error.message);
    res.status(500).json({ error: 'Calculation failed' });
  }
});

// Clear conversation
app.post('/clear', (req, res) => {
  const { sessionId = 'default' } = req.body;
  conversationHistory.delete(sessionId);
  res.json({ message: 'Conversation cleared', sessionId });
});

// Get products
app.get('/products', (req, res) => {
  const products = knowledgeBase.get('products');
  res.json({ products, total: products.length });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    version: '1.0',
    capabilities: ['Multilingual', 'Mathematics', 'Product Recommendations'],
    activeConversations: conversationHistory.size,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(port, () => {
  console.log(`\n${'🌟'.repeat(30)}`);
  console.log(`🚀 Destiny AI Server - DekorIn`);
  console.log(`📍 Running at: http://localhost:${port}`);
  console.log(`\n✅ Capabilities:`);
  console.log(`   - Multilingual Support (Indonesian, English, etc.)`);
  console.log(`   - Advanced Mathematics`);
  console.log(`   - Product Recommendations`);
  console.log(`   - Context-Aware Conversations`);
  console.log(`\n📊 Knowledge Base: ${knowledgeBase.get('products').length} products loaded`);
  console.log(`${'🌟'.repeat(30)}\n`);
});