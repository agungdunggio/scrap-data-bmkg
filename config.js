/**
 * =================================================================
 * PENGATURAN UNDUHAN DATA BMKG
 * Ubah nilai di bawah ini sesuai dengan kebutuhan Anda.
 * =================================================================
 */
const path = require('path');

const config = {
  // --- KONFIGURASI TARGET ---
  // Ganti 'nama' dan 'id' sesuai dengan kabupaten yang Anda inginkan.
  // Untuk menemukan ID:
  // 1. Buka https://dataonline.bmkg.go.id/data-harian
  // 2. Pilih "Stasiun MKG"
  // 3. Klik kanan pada dropdown "Pilih Kabupaten/Kota", lalu "Inspect Element"
  // 4. Cari tag <option> untuk kota Anda dan lihat value-nya. Contoh: <option value="97052">GORONTALO</option>
  TARGET_KABUPATEN: {
    nama: 'Gorontalo',
    id: '97052' // Contoh ID untuk Gorontalo
  },

  // --- KONFIGURASI RENTANG WAKTU ---
  // Tentukan rentang tahun dan bulan yang ingin diunduh.
  // Skrip akan mengunduh data dari (TAHUN_AWAL, BULAN_AWAL) hingga (TAHUN_AKHIR, BULAN_AKHIR).
  TAHUN_AWAL: 2025,
  TAHUN_AKHIR: new Date().getFullYear(), // Ambil sampai tahun sekarang
  
  BULAN_AWAL: 1,  // Januari
  BULAN_AKHIR: 1, // Juni

  // --- PENGATURAN TEKNIS (JARANG DIUBAH) ---
  // Lokasi penyimpanan file unduhan dan cookie
  DOWNLOAD_DIR: path.resolve(__dirname, 'downloads'),
  COOKIE_PATH: path.resolve(__dirname, 'cookies.json'),

  JENIS_DATA: 'mkg',       // Tidak Perlu Diubah (mkg = Stasiun UPT)

  // =================================================================
  // Masukkan semua parameter yang ingin diunduh.
  //  nilai parameter: 
  //    Arah angin saat kecepatan maksimum: 'wind_dir'
  //    Curah hujan: 'rainfall', 
  //    Arah angin terbanyak: 'wind_dir_car', 
  //    Kecepatan angin maksimum: 'wind_speed', 
  //    Kecepatan angin rata-rata: 'wind_avg', 
  //    Kelembapan rata-rata: 'hum_avg', 
  //    Lamanya penyinaran matahari: 'sunshine', 
  //    Suhu maksimum: 'temp_max', 
  //    Suhu minimum: 'temp_min', 
  //    Suhu rata-rata: 'temp_avg'
  // =================================================================
  PARAMETER: ['rainfall'],
};

module.exports = config;