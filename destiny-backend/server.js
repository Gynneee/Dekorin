import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const port = 3000;

app.use(cors()); 
app.use(express.json());

// Inisialisasi Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Sapaan awal dan konteks untuk AI
// Ini membantu AI tahu perannya sebagai "Destiny" untuk "DekorIn"
const chatHistory = [
  {
    role: "user",
    parts: [{ text: "Kamu adalah Destiny AI, asisten virtual yang ramah dan membantu untuk DekorIn, sebuah perusahaan yang menjual wallpaper dan dekorasi dinding. Sapa pengguna sebagai 'DekorMate' dan jawab pertanyaan mereka terkait dekorasi, wallpaper, atau ide desain interior." }],
  },
  {
    role: "model",
    parts: [{ text: "Tentu! Halo, DekorMate! Aku Destiny AI, siap membantumu menemukan dekorasi dinding yang sempurna. Ada yang bisa kubantu hari ini?" }],
  },
];

const chat = model.startChat({
  history: chatHistory,
  generationConfig: {
    maxOutputTokens: 1000,
  },
});

app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body.message;

    // Kirim pesan ke Gemini
    const result = await chat.sendMessage(userInput);
    const text = result.response.candidates[0].content.parts[0].text;

    // Kirim balasan Gemini kembali ke frontend
    res.json({ message: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mendapatkan respons dari AI' });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});