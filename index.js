const BMKGScraper = require('./src/scraper');
const config = require('./config');

(async () => {
  console.log('============================================');
  console.log('🚀 BMKG Data Downloader Dimulai');
  console.log('============================================');
  console.log(`Target Kabupaten: ${config.TARGET_KABUPATEN.nama} (ID: ${config.TARGET_KABUPATEN.id})`);
  console.log(`Rentang Waktu  : ${config.BULAN_AWAL}/${config.TAHUN_AWAL} - ${config.BULAN_AKHIR}/${config.TAHUN_AKHIR}`);
  console.log('--------------------------------------------');

  const scraper = new BMKGScraper(config);
  const failedDownloads = [];

  try {
    await scraper.initialize();
    await scraper.login();

    for (let year = config.TAHUN_AWAL; year <= config.TAHUN_AKHIR; year++) {
      const startMonth = (year === config.TAHUN_AWAL) ? config.BULAN_AWAL : 1;
      const endMonth = (year === config.TAHUN_AKHIR) ? config.BULAN_AKHIR : 12;

      for (let month = startMonth; month <= endMonth; month++) {
        const result = await scraper.downloadDataForMonth(year, month);
        if (!result.success) {
          failedDownloads.push({ year, month: result.month, reason: result.reason });
        }
        // Jeda singkat untuk menghindari server BMKG menganggap kita sebagai bot agresif
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

  } catch (error) {
    console.error('❌ Terjadi kesalahan fatal:', error);
  } finally {
    await scraper.close();
    console.log('\n--------------------------------------------');
    console.log('🏁 Proses Selesai.');
  }

  // Laporan Hasil Akhir
  if (failedDownloads.length > 0) {
    console.log('\n❌ Daftar unduhan yang GAGAL:');
    failedDownloads.forEach(({ year, month, reason }) => {
      console.log(`- ${month} ${year} (Alasan: ${reason})`);
    });
  } else {
    console.log('\n🎉 Semua data berhasil diunduh tanpa ada kegagalan!');
  }
  console.log('============================================');
})();