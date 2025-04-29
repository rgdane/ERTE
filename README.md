# ERTE - Electronic Resident Transaction Environment

Aplikasi manajemen data warga, rumah, histori kependudukan, dan pembayaran, dibangun menggunakan Laravel (backend) dan React (frontend).

## 🔧 Kebutuhan Sistem
- PHP ≥ 8.1
- Node.js ≥ 18
- MySQL
- Composer
- NPM
- Laragon (direkomendasikan untuk kemudahan setup)

---

## 📁 Struktur Folder
```
ERTE/
├── backend/     # Laravel project
└── frontend/    # React project
```

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Tempatkan Proyek
Ekstrak atau clone folder `ERTE` ke dalam:
```
C:\laragon\www\
```

### 2. Jalankan Backend (Laravel)
```bash
cd C:\laragon\www\ERTE\backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Akses backend di:
```
http://127.0.0.1:8000
```

### 3. Jalankan Frontend (React)
```bash
cd C:\laragon\www\ERTE\frontend
npm install
npm run dev
```

Akses frontend di:
```
http://localhost:5173
```

---

## 📦 Build Production

### Laravel (Backend)
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### React (Frontend)
```bash
npm run build
```

File hasil build akan berada di folder `frontend/dist`. Anda bisa mengarahkan nginx/XAMPP untuk serve dari folder ini jika perlu deployment manual.

---

## 📋 Catatan
- Gunakan Postman untuk testing API jika diperlukan.
- Gunakan akun MySQL default Laragon (`root`, tanpa password) atau sesuaikan di file `.env`.