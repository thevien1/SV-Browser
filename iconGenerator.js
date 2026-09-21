const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

class IconGenerator {
  constructor(cacheDir) {
    this.appDataDir = path.join(process.env.LOCALAPPDATA || 'C:\\Windows\\Temp', 'SVBrowser');
    this.cacheDir = cacheDir || path.join(this.appDataDir, 'icons');
    if (!fs.existsSync(this.cacheDir)) {
      try {
        fs.mkdirSync(this.cacheDir, { recursive: true });
      } catch (e) {}
    }
    this.scriptPath = path.join(this.appDataDir, 'generate_icon.ps1');
    this.ensureScript();
  }

  ensureScript() {
    const src = path.join(__dirname, 'generate_icon.ps1');
    if (fs.existsSync(src)) {
      try {
        fs.copyFileSync(src, this.scriptPath);
      } catch (e) {}
    }
  }

  /**
   * Tìm file exe tốt nhất để trích xuất icon gốc của trình duyệt
   */
  getBaseExeForIcon(browserType = 'chrome', customExePath = null) {
    const type = (browserType || 'chrome').toLowerCase();
    
    // Nếu là chrome, ưu tiên Google Chrome chính thức để có logo Chrome chuẩn đa sắc màu
    if (type === 'chrome') {
      const officialChrome = [
        path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe'),
        path.join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'Google', 'Chrome', 'Application', 'chrome.exe'),
        path.join(process.env.LOCALAPPDATA || '', 'Google', 'Chrome', 'Application', 'chrome.exe')
      ];
      for (const p of officialChrome) {
        if (fs.existsSync(p)) return p;
      }
    }

    if (customExePath && fs.existsSync(customExePath)) {
      return customExePath;
    }

    // Kiểm tra drivers trong workspace
    const v151 = path.join(__dirname, 'drivers', 'ChromiumCore_v151', 'Chrome-bin', 'chrome.exe');
    if (fs.existsSync(v151)) return v151;

    return null;
  }

  /**
   * Tạo icon badged dạng hình Chrome + thanh pill xanh có số thứ tự ở dưới
   * Giống 100% hình ảnh trong taskbar người dùng gửi
   */
  getOrCreateProfileIcon(numberText, browserType = 'chrome', customExePath = null) {
    const safeNumber = String(numberText || '1').trim();
    const safeType = (browserType || 'chrome').toLowerCase();
    
    const icoPath = path.join(this.cacheDir, `icon_${safeType}_${safeNumber}.ico`);
    const pngPath = path.join(this.cacheDir, `icon_${safeType}_${safeNumber}.png`);

    // Nếu đã tạo rồi thì trả về ngay (cực nhanh, 0ms)
    if (fs.existsSync(icoPath) && fs.existsSync(pngPath)) {
      return { icoPath, pngPath };
    }

    const baseExe = this.getBaseExeForIcon(safeType, customExePath);
    if (!baseExe) {
      return { icoPath: null, pngPath: null };
    }

    try {
      const res = spawnSync('powershell', [
        '-NoProfile',
        '-ExecutionPolicy', 'Bypass',
        '-File', this.scriptPath,
        '-ExePath', baseExe,
        '-NumberText', safeNumber,
        '-IcoPath', icoPath,
        '-PngPath', pngPath
      ], { encoding: 'utf8' });

      if (res.status === 0 && fs.existsSync(icoPath) && fs.existsSync(pngPath)) {
        return { icoPath, pngPath };
      } else {
        console.warn('generate_icon stderr:', res.stderr || res.stdout);
        return { icoPath: null, pngPath: null };
      }
    } catch (err) {
      console.warn('Lỗi tạo icon profile badge:', err.message);
      return { icoPath: null, pngPath: null };
    }
  }
}

module.exports = IconGenerator;
