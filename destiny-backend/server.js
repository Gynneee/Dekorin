// server.js (Menggunakan 'hf.chatCompletion' yang BENAR)
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

// Inisialisasi Hugging Face
const hf = new HfInference(process.env.HF_TOKEN);
const modelName = 'mistralai/Mistral-7B-Instruct-v0.2';

// Endpoint
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body.message;
    console.log(`Mengirim prompt ke Hugging Face (ChatCompletion): ${userInput}`);

    // Siapkan "kepribadian" AI sebagai System Prompt
    const systemPrompt = "Kamu adalah Destiny AI, asisten virtual yang ramah dan membantu untuk DekorIn, sebuah perusahaan yang menjual wallpaper dan dekorasi dinding. Selalu sapa pengguna sebagai 'DekorMate' dan jawab pertanyaan mereka dengan antusias.";

    // Kirim pesan menggunakan fungsi "chatCompletion" yang benar
    const result = await hf.chatCompletion({
      model: modelName,
      messages: [
        // Pesan pertama mendefinisikan kepribadian AI
        { role: "system", content: systemPrompt },
        // Pesan kedua adalah input dari pengguna
        { role: "user", content: userInput }
      ],
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7
      },
      stream: false, // Kita ingin balasan penuh, bukan streaming
    });

    // Balasan dari 'chatCompletion' ada di 'choices[0].message.content'
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