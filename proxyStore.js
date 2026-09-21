const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ProxyChecker = require('./proxyChecker');

class ProxyStore {
  constructor(dataDir) {
    this.dataDir = dataDir || path.join(__dirname, 'app_data');
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    this.proxiesFilePath = path.join(this.dataDir, 'proxies.json');
    this.proxies = [];
    this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(this.proxiesFilePath)) {
        this.proxies = JSON.parse(fs.readFileSync(this.proxiesFilePath, 'utf8'));
      } else {
        this.proxies = [];
        this.saveData();
      }
    } catch (e) {
      console.error('Lỗi nạp proxies.json:', e);
      this.proxies = [];
    }
  }

  saveData() {
    try {
      fs.writeFileSync(this.proxiesFilePath, JSON.stringify(this.proxies, null, 2), 'utf8');
    } catch (e) {
      console.error('Lỗi ghi proxies.json:', e);
    }
  }

  generateUuid() {
    return crypto.randomUUID ? crypto.randomUUID() : 'proxy_' + Math.random().toString(36).substr(2, 9);
  }

  getAll() {
    return this.proxies;
  }

  getById(id) {
    return this.proxies.find(p => p.id === id);
  }

  formatRawProxy(p) {
    if (p.user && p.pass) {
      return `${p.host}:${p.port}:${p.user}:${p.pass}`;
    }
    return `${p.host}:${p.port}`;
  }

  addProxy(data) {
    const rawStr = (typeof data === 'string') ? data.trim() : (data.raw || '').trim();
    const type = ((data.type || 'http') + '').toUpperCase() === 'SOCKS5' ? 'SOCKS5' : 'HTTP';
    const parsed = ProxyChecker.parseProxy(rawStr, type.toLowerCase());

    const host = (data.host || parsed.host || '').trim();
    const port = parseInt(data.port || parsed.port || 80, 10);
    const user = (data.user || parsed.user || '').trim();
    const pass = (data.pass || parsed.pass || '').trim();

    if (!host) {
      throw new Error('Host proxy không hợp lệ');
    }

    const newProxy = {
      id: this.generateUuid(),
      type: type,
      host,
      port,
      user,
      pass,
      raw: rawStr || (user && pass ? `${host}:${port}:${user}:${pass}` : `${host}:${port}`),
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
      note: data.note || '',
      status: data.status || 'ready',
      ip: data.ip || host,
      country: data.country || 'us',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.proxies.unshift(newProxy);
    this.saveData();
    return newProxy;
  }

  addMultiple(input, defaultType = 'HTTP', tags = [], note = '') {
    let lines = [];
    if (Array.isArray(input)) {
      lines = input;
    } else if (typeof input === 'string') {
      lines = input.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    }

    const created = [];
    for (const line of lines) {
      try {
        let type = defaultType;
        let str = line.trim();
        if (str.toLowerCase().startsWith('socks5://')) {
          type = 'SOCKS5';
          str = str.substring(9);
        } else if (str.toLowerCase().startsWith('http://')) {
          type = 'HTTP';
          str = str.substring(7);
        }

        const parsed = ProxyChecker.parseProxy(str, type.toLowerCase());
        if (!parsed.host) continue;

        const newProxy = {
          id: this.generateUuid(),
          type: type.toUpperCase() === 'SOCKS5' ? 'SOCKS5' : 'HTTP',
          host: parsed.host,
          port: parsed.port || 80,
          user: parsed.user || '',
          pass: parsed.pass || '',
          raw: line.trim(),
          tags: Array.isArray(tags) ? [...tags] : (tags ? [tags] : []),
          note: note || '',
          status: 'ready',
          ip: parsed.host,
          country: 'us',
          createdAt: Date.now(),
          updatedAt: Date.now()
        };

        this.proxies.unshift(newProxy);
        created.push(newProxy);
      } catch (err) {
        console.warn('Bỏ qua dòng proxy không hợp lệ:', line, err);
      }
    }

    this.saveData();
    return created;
  }

  updateProxy(id, data) {
    const p = this.proxies.find(x => x.id === id);
    if (!p) return null;

    if (data.type) p.type = (data.type + '').toUpperCase() === 'SOCKS5' ? 'SOCKS5' : 'HTTP';
    if (data.host !== undefined) p.host = data.host.trim();
    if (data.port !== undefined) p.port = parseInt(data.port, 10) || p.port;
    if (data.user !== undefined) p.user = (data.user || '').trim();
    if (data.pass !== undefined) p.pass = (data.pass || '').trim();
    if (data.tags !== undefined) p.tags = Array.isArray(data.tags) ? data.tags : [data.tags];
    if (data.note !== undefined) p.note = data.note;
    if (data.status !== undefined) p.status = data.status;
    if (data.ip !== undefined) p.ip = data.ip;
    if (data.country !== undefined) p.country = data.country;

    p.raw = this.formatRawProxy(p);
    p.updatedAt = Date.now();

    this.saveData();
    return p;
  }

  deleteProxy(id) {
    const idx = this.proxies.findIndex(p => p.id === id);
    if (idx !== -1) {
      const removed = this.proxies.splice(idx, 1)[0];
      this.saveData();
      return removed;
    }
    return null;
  }

  deleteMultiple(ids) {
    if (!Array.isArray(ids) || ids.length === 0) return 0;
    const initialLen = this.proxies.length;
    this.proxies = this.proxies.filter(p => !ids.includes(p.id));
    const deletedCount = initialLen - this.proxies.length;
    if (deletedCount > 0) {
      this.saveData();
    }
    return deletedCount;
  }

  async checkProxy(id) {
    const p = this.proxies.find(x => x.id === id);
    if (!p) return { success: false, message: 'Không tìm thấy proxy' };

    p.status = 'checking';
    const testRes = await ProxyChecker.testProxy(p.raw || `${p.host}:${p.port}`, (p.type || 'http').toLowerCase());
    if (testRes && testRes.live) {
      p.status = 'Live';
      p.ip = testRes.ip || p.host;
      p.country = (testRes.country || 'us').toLowerCase();
    } else {
      p.status = 'Die';
    }
    p.updatedAt = Date.now();
    this.saveData();
    return { success: true, proxy: p, result: testRes };
  }
}

module.exports = ProxyStore;
