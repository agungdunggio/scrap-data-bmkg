# BMKG Data Downloader

Skrip Node.js untuk mengunduh data cuaca harian (khususnya curah hujan) secara otomatis dari situs [dataonline.bmkg.go.id](https://dataonline.bmkg.go.id).

## ✨ Fitur

-   **Login Otomatis**: Cukup login manual sekali, skrip akan menyimpan *session* (cookie) untuk penggunaan selanjutnya.
-   **Konfigurasi Mudah**: Atur kabupaten, rentang tahun, dan rentang bulan yang diinginkan melalui satu file `config.js`.
-   **Fleksibel**: Dapat diadaptasi untuk mengunduh parameter data lain.
-   **Penamaan File Otomatis**: File yang diunduh akan otomatis diganti namanya dengan format yang jelas, contoh: `data_curah_hujan_gorontalo_juni_2024.xlsx`.
-   **Laporan Hasil**: Memberikan ringkasan unduhan yang berhasil dan yang gagal di akhir proses.

## ⚙️ Prasyarat

-   [Node.js](https://nodejs.org/) (versi 16 atau lebih baru)
-   NPM (biasanya sudah terinstal bersama Node.js)

## 🚀 Instalasi

1.  **Clone repositori ini:**
    ```bash
    git clone [https://github.com/NAMA_USER_ANDA/NAMA_REPO_ANDA.git](https://github.com/NAMA_USER_ANDA/NAMA_REPO_ANDA.git)
    cd NAMA_REPO_ANDA
    ```

2.  **Instal dependensi:**
    ```bash
    npm install
    ```

## 🔧 Konfigurasi

Sebelum menjalankan skrip, buka file `config.js` dan sesuaikan dengan kebutuhan Anda.

1.  **`TARGET_KABUPATEN`**:
    -   Ganti `nama` dan `id` sesuai kota target.
    -   **Cara menemukan ID Kabupaten**:
        1.  Buka [halaman data harian BMKG](https://dataonline.bmkg.go.id/data-harian).
        2.  Di browser, klik kanan pada dropdown "Pilih Kabupaten/Kota" lalu pilih "Inspect" atau "Inspect Element".
        3.  Cari tag `<option>` untuk kota yang Anda inginkan dan salin `value`-nya.
        
        Contoh untuk `JAKARTA PUSAT` adalah `<option value="97003">JAKARTA PUSAT</option>`. Jadi, `id` yang digunakan adalah `97003`.

2.  **`TAHUN_AWAL` & `TAHUN_AKHIR`**:
    -   Tentukan rentang tahun data yang ingin diambil.

3.  **`BULAN_AWAL` & `BULAN_AKHIR`**:
    -   Tentukan rentang bulan. Skrip akan mengunduh data dalam rentang tahun dan bulan yang sudah ditentukan.

## ▶️ Cara Menjalankan

1.  Buka terminal atau command prompt di direktori proyek.
2.  Jalankan perintah:
    ```bash
    node index.js
    ```

3.  **Untuk Penggunaan Pertama Kali**: Browser Chromium akan terbuka dan meminta Anda untuk login ke situs BMKG. Lakukan login seperti biasa. Setelah berhasil, skrip akan menyimpan *cookie* Anda di file `cookies.json` dan melanjutkan proses secara otomatis. Untuk selanjutnya, Anda tidak perlu login lagi.

File yang berhasil diunduh akan tersimpan di dalam folder `downloads`.

## ⚠️ Disclaimer

Skrip ini bergantung pada struktur HTML dan alur situs BMKG. Jika situs tersebut mengalami perubahan desain atau alur, skrip ini mungkin akan berhenti berfungsi dan memerlukan pembaruan.