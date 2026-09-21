/**
 * Component: PlaceholderViewComponent
 * Hiển thị giao diện cho các mục như Nhóm, Proxy, Extensions, Automation... khi người dùng bấm vào trên sidebar
 */

export class PlaceholderViewComponent {
  constructor(options = {}) {
    this.container = options.container || document.getElementById('view-placeholder');
  }

  async show(tabName, displayName, description = '') {
    if (!this.container) return;

    if (tabName === 'automation') {
      await this.showAutomationView(displayName);
      return;
    }

    this.container.innerHTML = `
      <div style="padding: 30px; display: flex; flex-direction: column; gap: 20px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <h2 style="font-size: 20px; font-weight: 700; color: var(--text-main);">${displayName}</h2>
          <span style="font-size: 12px; background: #eff6ff; color: #0284c7; padding: 3px 10px; border-radius: 12px; font-weight: 600;">Sẵn sàng</span>
        </div>

        <p style="color: var(--text-muted); font-size: 13.5px; max-width: 650px;">
          ${description || `Khu vực quản lý ${displayName}. Tại đây bạn có thể cấu hình các thông số nâng cao hoặc kết nối dữ liệu cho profile trình duyệt.`}
        </p>

        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 24px; max-width: 700px;">
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px;">Trạng thái hệ thống</div>
          <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 15px;">
            Mô-đun đang hoạt động ổn định và sẵn sàng đồng bộ với engine Chromium/Chrome-bin.
          </div>
          <button class="btn btn-primary" onclick="window.sidebarComp?.setActiveTab('profiles'); window.appSwitchTab?.('profiles');">
            ← Quay lại Quản lý Profiles
          </button>
        </div>
      </div>
    `;
    this.container.style.display = 'flex';
  }

  async showAutomationView(displayName) {
    this.container.style.display = 'flex';

    // Hiển thị trạng thái đang kiểm tra
    this.container.innerHTML = `
      <div style="padding: 30px; display: flex; flex-direction: column; gap: 20px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <h2 style="font-size: 20px; font-weight: 700; color: var(--text-main);">${displayName}</h2>
          <span style="font-size: 12px; background: #f1f5f9; color: #64748b; padding: 3px 10px; border-radius: 12px; font-weight: 600;">Đang kiểm tra...</span>
        </div>
        <div style="color: var(--text-muted); font-size: 13.5px;">Đang kiểm tra phần mềm GPM Automate Editor trên máy...</div>
      </div>
    `;

    let info = { installed: false, targetPath: 'D:\\Phần mềm\\GPMAutomateEditor' };
    try {
      if (window.api && window.api.checkAutomateInstalled) {
        info = await window.api.checkAutomateInstalled();
      }
    } catch (e) {
      console.error('Lỗi check automate installed:', e);
    }

    if (info.installed) {
      // ĐÃ CÀI ĐẶT -> Tự động mở phần mềm lên
      try {
        if (window.api && window.api.launchAutomate) {
          const launchRes = await window.api.launchAutomate();
          if (launchRes && launchRes.success) {
            if (window.showGlobalToast) {
              window.showGlobalToast('🚀 Đang mở phần mềm GPM Automate Editor...');
            }
          }
        }
      } catch (err) {
        console.error('Lỗi khởi chạy GPM Automate Editor:', err);
      }

      this.container.innerHTML = `
        <div style="padding: 30px; display: flex; flex-direction: column; gap: 20px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <h2 style="font-size: 20px; font-weight: 700; color: var(--text-main);">${displayName}</h2>
            <span style="font-size: 12px; background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; padding: 3px 10px; border-radius: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 5px;">
              <span style="width: 7px; height: 7px; background: #10b981; border-radius: 50%; display: inline-block;"></span>
              Đã cài đặt & Sẵn sàng
            </span>
          </div>

          <p style="color: var(--text-muted); font-size: 13.5px; max-width: 700px; line-height: 1.6;">
            GPM Automate Editor - Công cụ thiết kế kịch bản tự động hóa trực quan (Visual Workflow Editor). Phần mềm đã được tự động mở để bạn làm việc.
          </p>

          <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 24px; max-width: 750px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <div style="font-weight: 600; font-size: 14px; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
                <span style="color: #10b981; font-size: 16px;">✔</span> Trạng thái phần mềm
              </div>
              <span style="font-size: 12px; color: #10b981; background: #ecfdf5; padding: 2px 8px; border-radius: 4px; font-weight: 500;">Hoạt động</span>
            </div>

            <div style="background: var(--bg-main, #f8fafc); border: 1px solid var(--border-color); border-radius: 6px; padding: 12px 14px; font-size: 13px; margin-bottom: 18px; color: var(--text-muted);">
              <div style="margin-bottom: 6px;"><strong>📁 Thư mục cài đặt:</strong> <code style="color: #0284c7; background: #e0f2fe; padding: 2px 6px; border-radius: 4px; font-size: 12.5px;">${info.path || 'D:\\Phần mềm\\GPMAutomateEditor'}</code></div>
              <div><strong>⚡ Trạng thái:</strong> Ứng dụng GPM Automate Editor đang chạy và sẵn sàng tương tác với hệ thống profile SV Browser qua API nội bộ.</div>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
              <button class="btn btn-primary" id="btn-relaunch-automate" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px;">
                🚀 Mở lại phần mềm
              </button>
              <button class="btn btn-outline" id="btn-open-folder-automate" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px;">
                📁 Mở thư mục cài đặt
              </button>
              <button class="btn btn-outline" id="btn-open-automate-store" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px;">
                🏪 Chợ kịch bản (app.gpmautomate.com)
              </button>
              <button class="btn btn-outline" onclick="window.sidebarComp?.setActiveTab('profiles'); window.appSwitchTab?.('profiles');" style="margin-left: auto;">
                ← Quay lại Profiles
              </button>
            </div>
          </div>
        </div>
      `;

      this.container.querySelector('#btn-relaunch-automate')?.addEventListener('click', async () => {
        if (window.api && window.api.launchAutomate) {
          await window.api.launchAutomate();
          if (window.showGlobalToast) {
            window.showGlobalToast('🚀 Đang mở lại GPM Automate Editor...');
          }
        }
      });

      this.container.querySelector('#btn-open-folder-automate')?.addEventListener('click', async () => {
        if (window.api && window.api.openAutomateFolder) {
          await window.api.openAutomateFolder();
        }
      });

      this.container.querySelector('#btn-open-automate-store')?.addEventListener('click', async () => {
        if (window.api && window.api.openExternal) {
          await window.api.openExternal('https://app.gpmautomate.com/');
        }
      });

    } else {
      // CHƯA CÀI ĐẶT -> Hiện link tải và hướng dẫn
      if (window.showGlobalToast) {
        window.showGlobalToast('⚠️ Chưa phát hiện GPM Automate Editor trên máy', true);
      }

      this.container.innerHTML = `
        <div style="padding: 30px; display: flex; flex-direction: column; gap: 20px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <h2 style="font-size: 20px; font-weight: 700; color: var(--text-main);">${displayName}</h2>
            <span style="font-size: 12px; background: #fff1f2; color: #e11d48; border: 1px solid #fecdd3; padding: 3px 10px; border-radius: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 5px;">
              <span style="width: 7px; height: 7px; background: #e11d48; border-radius: 50%; display: inline-block;"></span>
              Chưa cài đặt
            </span>
          </div>

          <p style="color: var(--text-muted); font-size: 13.5px; max-width: 700px; line-height: 1.6;">
            Khu vực quản lý Kịch bản Tự động hóa (Automation). Bạn cần tải và cài đặt phần mềm <strong>GPM Automate Editor</strong> để thiết kế kịch bản kéo - thả cho trình duyệt.
          </p>

          <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 24px; max-width: 750px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px; color: #e11d48; font-weight: 600; font-size: 14px;">
              <span>⚠️</span> Chưa tìm thấy phần mềm tại: <code style="font-size: 13px; background: #fee2e2; color: #b91c1c; padding: 2px 6px; border-radius: 4px;">${info.targetPath || 'D:\\Phần mềm\\GPMAutomateEditor'}</code>
            </div>

            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
              <div style="font-weight: 600; font-size: 13.5px; color: #1e40af; margin-bottom: 10px;">
                🔗 Liên kết tải về và truy cập GPM Automate chính thức:
              </div>
              <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #1e3a8a; line-height: 2;">
                <li>
                  <strong>Trang chủ & Tải phần mềm:</strong>
                  <a href="https://gpmautomate.com/" class="ext-link" data-url="https://gpmautomate.com/" style="color: #0284c7; text-decoration: underline; font-weight: 600; margin-left: 4px; cursor: pointer;">https://gpmautomate.com/</a>
                </li>
                <li>
                  <strong>Kho ứng dụng & Kịch bản mẫu (2000+ kịch bản):</strong>
                  <a href="https://app.gpmautomate.com/" class="ext-link" data-url="https://app.gpmautomate.com/" style="color: #0284c7; text-decoration: underline; font-weight: 600; margin-left: 4px; cursor: pointer;">https://app.gpmautomate.com/</a>
                </li>
                <li>
                  <strong>Tài liệu hướng dẫn kịch bản:</strong>
                  <a href="https://docs.gpmautomate.com/" class="ext-link" data-url="https://docs.gpmautomate.com/" style="color: #0284c7; text-decoration: underline; font-weight: 600; margin-left: 4px; cursor: pointer;">https://docs.gpmautomate.com/</a>
                </li>
              </ul>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
              <button class="btn btn-primary" id="btn-dl-gpmautomate" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px;">
                🌐 Tải GPM Automate (gpmautomate.com)
              </button>
              <button class="btn btn-outline" id="btn-dl-appstore" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px;">
                🏪 Chợ kịch bản (app.gpmautomate.com)
              </button>
              <button class="btn btn-outline" id="btn-recheck-install" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; color: #0284c7;">
                🔄 Quét lại & Mở phần mềm
              </button>
              <button class="btn btn-outline" onclick="window.sidebarComp?.setActiveTab('profiles'); window.appSwitchTab?.('profiles');" style="margin-left: auto;">
                ← Quay lại Profiles
              </button>
            </div>
          </div>
        </div>
      `;

      // Click link mở trình duyệt
      this.container.querySelectorAll('.ext-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const url = link.getAttribute('data-url');
          if (url && window.api && window.api.openExternal) {
            window.api.openExternal(url);
          }
        });
      });

      this.container.querySelector('#btn-dl-gpmautomate')?.addEventListener('click', () => {
        if (window.api && window.api.openExternal) {
          window.api.openExternal('https://gpmautomate.com/');
        }
      });

      this.container.querySelector('#btn-dl-appstore')?.addEventListener('click', () => {
        if (window.api && window.api.openExternal) {
          window.api.openExternal('https://app.gpmautomate.com/');
        }
      });

      this.container.querySelector('#btn-recheck-install')?.addEventListener('click', async () => {
        await this.showAutomationView(displayName);
      });
    }
  }

  hide() {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }
}
