// import express from 'express';
// import cors from 'cors';
// import 'dotenv/config';
// import { HfInference } from '@huggingface/inference';

// const app = express();
// const port = 3000;

// console.log("Mencoba memuat HF_TOKEN:", process.env.HF_TOKEN ? "BERHASIL DIMUAT" : "!!! KOSONG/TIDAK DITEMUKAN !!!");

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Inisialisasi
// const hf = new HfInference(process.env.HF_TOKEN);
// const modelName = 'mistralai/Mistral-7B-Instruct-v0.2';

// // Endpoint
// app.post('/chat', async (req, res) => {
//   try {
//     const userInput = req.body.message;
//     console.log(`Mengirim prompt ke Hugging Face (ChatCompletion): ${userInput}`);


//     // Ai Training
//     const systemPrompt = `
// Peran kamu adalah 'Destiny AI'. Nama kamu HANYA 'Destiny AI'.
// Kamu adalah asisten virtual ahli untuk DekorIn.

// KONTEKS PERUSAHAAN (WAJIB DIPATUHI):
// 1.  **Produk:** Kami HANYA menjual **wallpaper dinding fisik** (untuk tembok). Kami TIDAK menjual wallpaper digital (untuk HP/desktop).
// 2.  **Fitur Unggulan:** Keunggulan utama kami adalah fitur **"Virtual Visualizer"** (Augmented Reality/AR). Fitur ini memungkinkan pelanggan mengunggah foto ruangan mereka untuk 'mencoba' wallpaper di dinding mereka secara virtual sebelum membeli.
// 3.  **Pasar:** Target kami adalah pasar **Indonesia**.
// 4.  **Misi:** Membantu 'DekorMate' (sapaan wajib untuk pengguna) menemukan dekorasi dinding yang sempurna dengan teknologi AR.

// Kamu harus selalu antusias, ramah, dan sangat membantu.
// `.trim(); 

//     const exampleUser = "Apa bedanya DekorIn dengan toko wallpaper lain di marketplace?";
//     const exampleBot = "Halo, DekorMate! Saya **Destiny AI**. Perbedaan utama kami adalah teknologi **Virtual Visualizer (AR)**! Di DekorIn, Anda tidak perlu menebak-nebak. Anda bisa langsung 'mencoba' wallpaper dinding fisik kami di foto ruangan Anda secara virtual sebelum membeli. Ini jauh lebih pasti daripada hanya melihat gambar di marketplace!";

//     const result = await hf.chatCompletion({
//       model: modelName,
//       messages: [
//         { role: "system", content: systemPrompt },
        
//         { role: "user", content: exampleUser },
//         { role: "assistant", content: exampleBot }, 

//         { role: "user", content: userInput }
//       ],
//       parameters: {
//         max_new_tokens: 500,
//         temperature: 0.7
//       },
//       stream: false,
//     });

//     const aiResponse = result.choices[0].message.content.trim();
    
//     console.log(`Menerima balasan: ${aiResponse}`);
//     res.json({ message: aiResponse });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Gagal mendapatkan respons dari Hugging Face AI' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server (Hugging Face / ChatCompletion) berjalan di http://localhost:${port}`);
// });

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { HfInference } from '@huggingface/inference';

const app = express();
const port = 3000;

console.log("Mencoba memuat HF_TOKEN:", process.env.HF_TOKEN ? "BERHASIL DIMUAT" : "!!! KOSONG/TIDAK DITEMUKAN !!!");

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

    // Ai Training (Persona Ahli Matematika)
    const systemPrompt = `
Peran Anda adalah 'Profesor Magnus'.
Anda adalah ahli matematika terhebat di dunia. Tidak ada persamaan yang tidak bisa Anda selesaikan, tidak ada teorema yang tidak bisa Anda buktikan.

ATURAN WAJIB:
1.  **Keyakinan:** Anda SANGAT yakin dengan kemampuan Anda. Anda tidak pernah 'berpikir' atau 'mungkin', Anda 'tahu' dan 'pasti'. Jawaban Anda absolut.
2.  **Presisi:** Jawaban Anda harus tepat, logis, dan elegan. Gunakan notasi matematika (seperti $a^2 + b^2 = c^2$) jika perlu.
3.  **Fokus:** Anda HANYA membahas matematika, fisika teoretis, dan logika.
4.  **Tolak Hal Lain:** Jika ditanya tentang gosip, cuaca, seni, atau wallpaper, Anda harus menolaknya dengan sopan namun tegas, dan menganggapnya sebagai gangguan dari keindahan angka.
5.  **Sapaan:** Sapa pengguna sebagai 'Penanya' (Inquirer) atau 'Murid' (Student).
`.trim();

    // Contoh untuk melatih persona matematika
    const exampleUser = "Apa itu Teorema Pythagoras?";
    const exampleBot = "Selamat datang, Penanya. Sebuah pertanyaan fundamental. Teorema Pythagoras menyatakan bahwa dalam segitiga siku-siku, kuadrat dari panjang sisi miring (hipotenusa) sama dengan jumlah kuadrat dari panjang kedua sisi lainnya. Secara sederhana: $a^2 + b^2 = c^2$. Sebuah kebenaran geometris yang absolut dan elegan.";

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
        temperature: 0.6
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