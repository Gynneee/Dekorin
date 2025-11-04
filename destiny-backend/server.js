import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { HfInference } from '@huggingface/inference';

const app = express();
const port = 3000;

console.log("Mencoba memuat HF_TOKEN:", process.env.HF_TOKEN ? "BERHASIL DIMUAT" : "!!! KOSONG/TIDAK DITEMUKAN !!!");

// Middleware
app.use(cors());
app.use(express.json());

// Inisialisasi
const hf = new HfInference(process.env.HF_TOKEN);
const modelName = 'mistralai/Mistral-7B-Instruct-v0.2';

// Endpoint
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body.message;
    console.log(`Mengirim prompt ke Hugging Face (ChatCompletion): ${userInput}`);


    // Ai Training
    const systemPrompt = `
Peran kamu adalah 'Destiny AI'. Nama kamu HANYA 'Destiny AI'.
Kamu adalah asisten virtual ahli untuk DekorIn.

KONTEKS PERUSAHAAN (WAJIB DIPATUHI):
1.  **Produk:** Kami HANYA menjual **wallpaper dinding fisik** (untuk tembok). Kami TIDAK menjual wallpaper digital (untuk HP/desktop).
2.  **Fitur Unggulan:** Keunggulan utama kami adalah fitur **"Virtual Visualizer"** (Augmented Reality/AR). Fitur ini memungkinkan pelanggan mengunggah foto ruangan mereka untuk 'mencoba' wallpaper di dinding mereka secara virtual sebelum membeli.
3.  **Pasar:** Target kami adalah pasar **Indonesia**.
4.  **Misi:** Membantu 'DekorMate' (sapaan wajib untuk pengguna) menemukan dekorasi dinding yang sempurna dengan teknologi AR.

Kamu harus selalu antusias, ramah, dan sangat membantu.
`.trim(); 

    const exampleUser = "Apa bedanya DekorIn dengan toko wallpaper lain di marketplace?";
    const exampleBot = "Halo, DekorMate! Saya **Destiny AI**. Perbedaan utama kami adalah teknologi **Virtual Visualizer (AR)**! Di DekorIn, Anda tidak perlu menebak-nebak. Anda bisa langsung 'mencoba' wallpaper dinding fisik kami di foto ruangan Anda secara virtual sebelum membeli. Ini jauh lebih pasti daripada hanya melihat gambar di marketplace!";

    const result = await hf.chatCompletion({
      model: modelName,
      messages: [
        { role: "system", content: systemPrompt },
        
        { role: "user", content: exampleUser },
        { role: "assistant", content: exampleBot }, 

        { role: "user", content: userInput }
      ],
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7
      },
      stream: false,
    });

    const aiResponse = result.choices[0].message.content.trim();
    
    console.log(`Menerima balasan: ${aiResponse}`);
    res.json({ message: aiResponse });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mendapatkan respons dari Hugging Face AI' });
  }
});

app.listen(port, () => {
  console.log(`Server (Hugging Face / ChatCompletion) berjalan di http://localhost:${port}`);
});