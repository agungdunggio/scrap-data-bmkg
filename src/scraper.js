const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Daftar nama bulan dalam bahasa Indonesia
const BULAN_INDONESIA = [
  '', 'januari', 'februari', 'maret', 'april', 'mei', 'juni',
  'juli', 'agustus', 'september', 'oktober', 'november', 'desember'
];

class BMKGScraper {
  constructor(config) {
    this.config = config;
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    if (!fs.existsSync(this.config.DOWNLOAD_DIR)) {
      fs.mkdirSync(this.config.DOWNLOAD_DIR);
    }

    this.browser = await puppeteer.launch({
      headless: false, // Ubah ke 'new' untuk berjalan di background
      defaultViewport: null,
      args: ['--start-maximized'],
    });

    this.page = await this.browser.newPage();

    const client = await this.page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: this.config.DOWNLOAD_DIR,
    });
  }

  async login() {
    if (fs.existsSync(this.config.COOKIE_PATH)) {
      const cookies = JSON.parse(fs.readFileSync(this.config.COOKIE_PATH));
      await this.page.setCookie(...cookies);
      console.log('✅ Cookie dimuat dari file.');
      return;
    }

    console.log('🔐 Login manual dibutuhkan, membuka halaman login...');
    await this.page.goto('https://dataonline.bmkg.go.id/login', { waitUntil: 'networkidle2' });
    
    console.log('➡️ Silakan login secara manual di browser. Skrip akan lanjut setelah Anda berhasil masuk.');
    await this.page.waitForSelector('#kt_app_sidebar_menu_wrapper', { timeout: 0 });
    
    console.log('✅ Login terdeteksi, menyimpan cookie...');
    const cookies = await this.page.cookies();
    fs.writeFileSync(this.config.COOKIE_PATH, JSON.stringify(cookies, null, 2));
    console.log('✅ Cookie berhasil disimpan.');
  }

  async downloadDataForMonth(year, month) {
    const namaBulan = BULAN_INDONESIA[month];
    const endDateObj = new Date(year, month, 0); 
    
    console.log(`\n🔄 Memproses data untuk: ${namaBulan.toUpperCase()} ${year}`);

    try {
      await this.page.goto('https://dataonline.bmkg.go.id/data-harian', { waitUntil: 'networkidle2' });

      // --- Mengisi formulir ---
      await this.page.select('#type', this.config.JENIS_DATA);
      await this.page.evaluate((params) => {
          document.querySelectorAll('input[name="parameter[]"]').forEach(cb => {
              cb.checked = false;
          });
          document.querySelectorAll('input[name="parameter[]"]').forEach(cb => {
              if (params.includes(cb.value)) {
                  cb.checked = true;
              }
          });
      }, this.config.PARAMETER);

      await this.page.waitForFunction(() => {
          const el = document.querySelector('#kabupatenSelect');
          return el && !el.disabled && el.options.length > 1;
      });

      await this.page.select('#kabupatenSelect', this.config.TARGET_KABUPATEN.id);

      const startDMY = `01-${String(month).padStart(2, '0')}-${year}`;
      const endDMY = `${String(endDateObj.getDate()).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
      console.log(`- Mengatur rentang tanggal: ${startDMY} → ${endDMY}`);

      await this.page.waitForSelector('#from', { visible: true });
      await this.page.focus('#from');
      await this.page.click('#from', { clickCount: 3 });
      await this.page.keyboard.press('Backspace');
      await this.page.type('#from', startDMY);
      await this.page.keyboard.press('Enter');

      const toFilled = await this.page.waitForFunction(() => {
        const from = document.querySelector('#from')?.value;
        const to = document.querySelector('#to');
        return to && to.value && to.value !== from;
      }, { timeout: 5000 }).catch(() => false);

      if (!toFilled) {
        await this.page.evaluate((endDMY) => {
          const to = document.querySelector('#to');
          to.removeAttribute('disabled');
          to.removeAttribute('readonly');
          to.value = endDMY;
          to.dispatchEvent(new Event('change', { bubbles: true }));
        }, endDMY);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));  // Tunggu sebentar agar tanggal akhir terisi otomatis

      // --- Submit & Download ---
      await this.page.click('#submitButton');

      const downloadBtn = await this.page.waitForSelector('#excelButton', { visible: true, timeout: 20000 }).catch(() => null);
      if (!downloadBtn) {
        console.warn('⚠️ Tombol unduh (Excel) tidak ditemukan. Mungkin tidak ada data untuk periode ini.');
        return { success: false, year, month: namaBulan, reason: 'Tombol unduh tidak ada' };
      }

      const filesBeforeDownload = new Set(fs.readdirSync(this.config.DOWNLOAD_DIR));
      await downloadBtn.click();
      console.log('📥 Mengunduh file XLS...');

      // --- Menunggu dan Mengganti Nama File ---
      const downloadedFile = await this.waitForDownload(filesBeforeDownload);
      if (downloadedFile) {
        const newFileName = `data_curah_hujan_${this.config.TARGET_KABUPATEN.nama.toLowerCase()}_${namaBulan}_${year}.xlsx`;
        fs.renameSync(
          path.join(this.config.DOWNLOAD_DIR, downloadedFile),
          path.join(this.config.DOWNLOAD_DIR, newFileName)
        );
        console.log(`✅ Berhasil disimpan sebagai: ${newFileName}`);
        return { success: true, file: newFileName };
      } else {
        console.warn('⚠️ Gagal mendeteksi file yang baru diunduh.');
        return { success: false, year, month: namaBulan, reason: 'File tidak terdeteksi setelah unduhan' };
      }
    } catch (error) {
      console.error(`❌ Terjadi error saat memproses ${namaBulan} ${year}: ${error.message}`);
      return { success: false, year, month: namaBulan, reason: error.message };
    }
  }

  async waitForDownload(filesBefore) {
    let attempts = 0;
    while (attempts < 30) { // Coba selama 15 detik
      const filesAfter = new Set(fs.readdirSync(this.config.DOWNLOAD_DIR));
      const diff = [...filesAfter].filter(file => !filesBefore.has(file) && !file.endsWith('.crdownload'));
      if (diff.length > 0) {
        return diff[0];
      }
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }
    return null;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = BMKGScraper;