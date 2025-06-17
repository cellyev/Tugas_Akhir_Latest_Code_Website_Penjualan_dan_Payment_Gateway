# 🌐 Web Penjualan & Payment Gateway - Soundbox Payment Project

Repositori ini merupakan bagian dari **proyek Tugas Akhir kelas XII** dengan judul:  
**"Alat Soundbox Payment Berbasis IoT dengan Pengembangan Web Penjualan dan Payment Gateway."**

Repositori ini merupakan versi ke-8 atau akhir proyek, di dalamnya Anda akan menemukan **source code sistem web** yang berfungsi sebagai **backend dan frontend** untuk mendukung transaksi penjualan digital, terhubung langsung dengan perangkat IoT **Soundbox Payment** melalui API.

---

## 🔧 Teknologi yang Digunakan

### ⚛️ Frontend
- **React.js** — Framework JavaScript modern untuk membangun antarmuka pengguna dinamis.
- **TailwindCSS** — Untuk styling yang cepat dan responsif.

### ⚙️ Backend
- **Node.js & Express.js** — Server backend yang mengatur rute API, autentikasi, dan komunikasi dengan perangkat IoT.
- **MongoDB** — Sebagai basis data utama untuk menyimpan data transaksi, pengguna, produk, dan log perangkat.

### ☁️ Infrastruktur & Integrasi
- **AWS EC2** — Digunakan sebagai server utama untuk menjalankan backend & frontend secara production-ready.
- **AWS S3** — Menyimpan gambar produk, bukti transaksi, dan file media lainnya.
- **AWS Route 53** — Mengelola DNS dan routing domain.

### 🌐 Domain
- Website ini dapat diakses melalui domain:  
  🔗 [`https://vailovent.my.id`](https://vailovent.my.id)

### 💳 Payment Gateway
- **Midtrans** — Digunakan untuk menerima pembayaran melalui berbagai metode (QRIS, e-wallet, virtual account, kartu kredit, dll).
- Mendukung callback untuk mengirim notifikasi pembayaran ke perangkat IoT Soundbox.

### 🔐 Keamanan
- **Certbot (Let's Encrypt)** — Digunakan untuk mengaktifkan HTTPS pada domain menggunakan SSL gratis.
- Middleware autentikasi JWT digunakan untuk mengamankan akses API.

---

## 🔁 Alur Sistem

1. **Pengguna mengakses web** melalui domain `vailovent.my.id`.
2. **Pilih produk**, kemudian lanjut ke halaman checkout.
3. Sistem akan membuat **transaksi baru di backend** dan mengarahkan pengguna ke Midtrans Snap Page.
4. Setelah pembayaran berhasil:
   - Midtrans akan mengirim notifikasi (`callback`) ke backend.
   - Backend menyimpan status transaksi sebagai **Successfull**.
   - Perangkat **Soundbox Payment** akan mendapatkan data transaksi dan akan bekerja sesuai dengan fungsinya.
5. Admin dapat melihat histori transaksi, status, dan mengelola produk melalui dashboard.

---

## 🚀 Fitur Utama

- ✅ Registrasi & Login pengguna
- 🛒 Manajemen produk dan keranjang
- 💳 Proses pembayaran digital (Midtrans)
- 📦 Halaman riwayat transaksi
- 📤 Upload gambar produk (terintegrasi dengan AWS S3)
- 🔒 Sistem autentikasi berbasis JWT
- 🌐 Responsif dan aman (HTTPS dengan Certbot)
- 🔔 API notifikasi untuk perangkat Soundbox Payment

