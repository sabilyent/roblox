# 🏝️ Pulau Kata — 3D Island Word Quest

<div align="center">

**Permainan 3D penerokaan pulau + teka-teki ejaan Bahasa Malaysia**

Teroka pulau tropika yang indah • Kutip huruf-huruf bercahaya • Eja perkataan dari petunjuk • Bina pulau impian anda

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)

</div>

---

## 📖 Tentang Permainan

**Pulau Kata** ialah permainan 3D berasaskan web yang terinspirasi oleh Roblox. Pemain meneroka sebuah pulau tropika 3D yang indah, mengutip huruf-huruf bercahaya yang bertaburan di serata pulau, dan menggunakan huruf tersebut untuk mengeja perkataan Bahasa Malaysia berdasarkan petunjuk yang diberikan.

Setiap perkataan yang berjaya dieja akan menghadiahkan item-item pembinaan — dari pokok kelapa hingga mercusuar — yang boleh digunakan untuk memperindah dan mengembangkan pulau anda!

### ✨ Ciri-ciri Utama

- 🌴 **Pulau 3D Prosedural** — Pulau tropika dengan pantai, bukit, air berombak, dan langit yang cantik
- 🏃 **Watak Gaya Roblox** — Watak blok yang boleh berjalan, berlari, dan melompat
- 🔤 **Kutip Huruf** — Huruf 3D bercahaya terapung di udara, sedia untuk dikutip
- 💡 **20 Teka-teki BM** — Perkataan Bahasa Malaysia dari mudah hingga sukar dengan petunjuk menarik
- 🏗️ **Sistem Pembinaan** — Letak item ganjaran pada grid untuk membina pulau anda
- 🎨 **Visual Premium** — Kesan cahaya, zarah, glassmorphism UI, dan animasi lancar
- 💾 **Auto-Simpan** — Kemajuan disimpan secara automatik di pelayar anda

---

## 🎮 Cara Bermain

### Kawalan

| Kekunci | Aksi |
|---|---|
| `W` `A` `S` `D` / `↑` `←` `↓` `→` | Bergerak |
| `Space` | Lompat |
| `Tetikus` | Pandang sekeliling |
| `E` | Interaksi / Kutip |
| `B` | Mod Pembinaan (buka/tutup) |
| `V` | Lihat Belakang (buka/tutup) |
| `Tab` | Inventori |
| `R` | Pusing item (dalam mod bina) |
| `X` | Padam item (dalam mod bina) |
| `Scroll` | Zum masuk/keluar |

### Aliran Permainan

```
🏝️ Teroka Pulau → 🔤 Jumpa & Kutip Huruf → 💡 Baca Petunjuk
       ↑                                            ↓
🏗️ Bina Pulau ← 🎁 Dapat Ganjaran ← ✍️ Eja Perkataan
```

1. **Teroka** pulau 3D dengan kawalan WASD
2. **Kutip** huruf-huruf bercahaya yang tersebar di serata pulau
3. **Baca** petunjuk di bahagian atas skrin
4. **Susun** huruf yang dikutip untuk mengeja perkataan yang betul
5. **Terima** ganjaran item pembinaan
6. **Bina** pulau anda dengan item yang diperoleh
7. **Ulang** dengan teka-teki baru yang lebih mencabar!

---

## 🚀 Mula Bermain

### Keperluan
- Pelayar web moden (Chrome 90+, Firefox 90+, Edge 90+, Safari 15+)
- GPU bersepadu atau dedikasi
- Sambungan internet (untuk muat Three.js dari CDN)

### Pemasangan

```bash
# Klon repositori
git clone https://github.com/sabilyent/roblox.git

# Masuk direktori
cd roblox

# Buka dalam pelayar — Pilih salah satu:

# Pilihan 1: Buka terus
open index.html            # macOS
xdg-open index.html        # Linux
start index.html           # Windows

# Pilihan 2: Guna pelayan tempatan (disyorkan untuk prestasi terbaik)
npx serve .
# atau
python3 -m http.server 8000
```

> **Nota:** Tiada proses binaan diperlukan! Hanya buka `index.html` dalam pelayar.

---

## 📁 Struktur Projek

```
roblox/
├── 📄 index.html          # Struktur halaman + UI overlay
├── 🎨 index.css           # Gaya (glassmorphism, animasi, responsif)
├── ⚙️ game.js             # Enjin permainan lengkap
├── 📋 PRD.md              # Dokumen Keperluan Produk
└── 📖 README.md           # Dokumentasi projek (ini)
```

---

## 🛠️ Tumpukan Teknologi

| Teknologi | Versi | Kegunaan |
|---|---|---|
| **HTML5** | — | Struktur halaman, overlay UI, HUD |
| **CSS3** | — | Glassmorphism, animasi, responsif |
| **JavaScript** | ES6+ | Logik permainan, pengurusan keadaan |
| **Three.js** | r160+ | Rendering 3D, pencahayaan, kamera, geometri |

Semua kebergantungan dimuatkan melalui CDN — tiada `npm install` diperlukan.

---

## 🧩 Senarai Teka-teki

Permainan mengandungi 20 perkataan Bahasa Malaysia merentasi pelbagai kategori:

| Kategori | Contoh Perkataan | Kesukaran |
|---|---|---|
| 🌍 Geografi | Pulau, Lautan, Pantai, Gunung | Mudah–Sederhana |
| 🌿 Alam | Bunga, Hutan, Pelangi, Telaga | Mudah–Sederhana |
| 🏗️ Bangunan | Rumah, Jambatan, Mercusuar, Benteng, Gerbang | Mudah–Sukar |
| 🐾 Haiwan | Ikan, Burung | Mudah |
| ⭐ Lain-lain | Bintang, Khazanah, Perahu, Mahkota, Permata | Sederhana–Sukar |

---

## 🏗️ Item Pembinaan

Ganjaran dari teka-teki termasuk:

| Kategori | Item |
|---|---|
| 🌴 **Alam Semula Jadi** | Pokok kelapa, bunga, kolam, pokok biasa |
| 🏠 **Struktur** | Pondok, jambatan, jeti, mercusuar, gerbang, benteng |
| 🎨 **Hiasan** | Lampu, payung pantai, sarang burung, patung, perigi |
| ⭐ **Istimewa** | Peti harta, perahu, air pancut |

---

## 🎨 Rekabentuk Visual

- **Gaya Seni:** Low-poly / voxel terinspirasi Roblox
- **Palet Warna:** Tropika yang ceria dan terang
- **UI:** Glassmorphism dengan border gradient dan blur
- **Kesan:** Cahaya bloom pada huruf, zarah semasa kutipan, animasi lancar

---

## 💾 Penyimpanan Data

Semua data permainan disimpan dalam `localStorage` pelayar:
- Posisi pemain
- Inventori item
- Bangunan yang diletakkan
- Teka-teki yang diselesaikan
- Skor dan tahap

> **Amaran:** Membersihkan cache pelayar akan memadam data permainan anda.

---

## 🤝 Sumbangan

Sumbangan dialu-alukan! Sila ikut langkah berikut:

1. Fork repositori ini
2. Cipta branch baru (`git checkout -b ciri/ciri-baru`)
3. Commit perubahan anda (`git commit -m 'Tambah ciri baru'`)
4. Push ke branch (`git push origin ciri/ciri-baru`)
5. Buka Pull Request

### Panduan Sumbangan
- Pastikan kod berfungsi dalam pelayar tanpa binaan
- Kekalkan gaya low-poly/voxel yang konsisten
- Tambah komen dalam Bahasa Malaysia atau Inggeris
- Uji pada sekurang-kurangnya Chrome dan Firefox

---

## 📄 Lesen

Projek ini dilesenkan di bawah [MIT License](LICENSE).

---

## 🙏 Penghargaan

- [Three.js](https://threejs.org/) — Pustaka 3D JavaScript
- [Roblox](https://www.roblox.com/) — Inspirasi gaya visual
- Guru-guru Bahasa Malaysia — Inspirasi kandungan pendidikan

---

<div align="center">

**Dibina dengan ❤️ untuk pembelajaran Bahasa Malaysia**

🏝️ *Teroka. Kutip. Eja. Bina.* 🏝️

</div>
