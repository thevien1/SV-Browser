/**
 * Component: ExtensionsViewComponent
 * Quản lý Tiện ích Mở rộng (Extensions) chuẩn theo ảnh giao diện GPMLogin
 * - Badge "Extensions"
 * - Nút "+ Thêm extension", ô tìm kiếm, nút làm mới
 * - Hộp cảnh báo Proxy/VPN
 * - Danh sách thẻ Extension (Icon, Version, Name, nút Xóa ✕, ID, Switch On/Off, Upload ↑, Mở thư mục 📁)
 */

export class ExtensionsViewComponent {
  constructor(options = {}) {
    this.container = options.container || document.getElementById('view-extensions');
    this.extensions = [];
    this.searchKeyword = '';
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="extensions-view-wrapper" style="padding: 24px 30px; display: flex; flex-direction: column; gap: 16px; height: 100%; overflow-y: auto;">
        
        <!-- Header Badge -->
        <div style="display: flex; align-items: center;">
          <div class="group-badge-header" style="border-color: #22c55e; color: #16a34a; background: #f0fdf4; font-weight: 600; padding: 4px 14px; border-radius: 6px; font-size: 13px; display: inline-flex; align-items: center; border: 1px solid #22c55e;">
            Extensions
          </div>
        </div>

        <!-- Action Bar: Add Button, Search, Refresh -->
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          
          <!-- Add Extension Dropdown -->
          <div class="btn-group-dropdown" style="position: relative;">
            <button id="btn-add-extension" class="btn btn-primary" style="height: 38px; padding: 0 16px; font-weight: 600; font-size: 13px; display: flex; align-items: center; gap: 6px; background: #0284c7; border-color: #0284c7; color: #fff; border-radius: 4px; cursor: pointer;">
              <span style="font-size: 16px; font-weight: bold; line-height: 1;">+</span> Thêm extension
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 2px;"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div id="dropdown-add-ext-menu" style="display: none; position: absolute; top: calc(100% + 4px); left: 0; background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 100; min-width: 230px; overflow: hidden;">
              <button id="btn-add-ext-url" style="width: 100%; text-align: left; padding: 10px 14px; background: none; border: none; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 8px; color: #0284c7; font-weight: 600; transition: background 0.15s;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                Từ link Chrome Web Store
              </button>
              <button id="btn-add-ext-file" style="width: 100%; text-align: left; padding: 10px 14px; background: none; border: none; border-top: 1px solid #f1f5f9; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 8px; color: #334155; transition: background 0.15s;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                Từ file (.zip, .crx)
              </button>
              <button id="btn-add-ext-folder" style="width: 100%; text-align: left; padding: 10px 14px; background: none; border: none; border-top: 1px solid #f1f5f9; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 8px; color: #334155; transition: background 0.15s;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                Từ thư mục unpacked
              </button>
            </div>
          </div>

          <!-- Search Box -->
          <div style="position: relative; width: 280px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 12px; top: 12px;">
              <circle cx="11" cy="11" r="8"></polyline>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="input-search-extension" class="form-control" placeholder="Tìm kiếm..." style="padding-left: 34px; height: 38px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 4px; width: 100%;">
          </div>

          <!-- Refresh Button -->
          <button id="btn-refresh-extensions" class="btn btn-outline" style="height: 38px; width: 38px; padding: 0; display: flex; align-items: center; justify-content: center; font-size: 15px; border: 1px solid #cbd5e1; border-radius: 4px; background: #fff; cursor: pointer;" title="Tải lại danh sách">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
          </button>
        </div>

        <!-- Warning Box (Cảnh báo Proxy/VPN) -->
        <div style="background: #fffbe6; border-left: 4px solid #f59e0b; border-radius: 4px; padding: 12px 18px; display: flex; flex-direction: column; gap: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
          <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; color: #d97706; font-size: 13.5px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            Cảnh báo
          </div>
          <div style="color: #b45309; font-size: 13px; line-height: 1.5;">
            Vui lòng không cài đặt các extension kết nối Proxy hoặc VPN. Chúng có thể ghi đè kết nối của chúng tôi mặc dù bạn có cố gắng xóa hoặc tắt nó.
          </div>
        </div>

        <!-- Extensions Cards Container -->
        <div id="extensions-cards-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 16px; margin-top: 4px;">
          <!-- Rendered dynamically -->
        </div>

        <!-- Modal: Add from Chrome Web Store URL -->
        <div id="modal-add-ext-url" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; align-items: center; justify-content: center;">
          <div style="background: #ffffff; border-radius: 8px; width: 560px; max-width: 90%; box-shadow: 0 10px 25px rgba(0,0,0,0.2); overflow: hidden; display: flex; flex-direction: column;">
            
            <div style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between;">
              <div style="font-size: 15px; font-weight: 600; color: #1e293b; display: flex; align-items: center; gap: 8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                Tải Extension từ Chrome Web Store
              </div>
              <button id="btn-close-modal-url" style="background: none; border: none; font-size: 18px; color: #64748b; cursor: pointer;">✕</button>
            </div>

            <div style="padding: 20px; display: flex; flex-direction: column; gap: 14px;">
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px;">
                  Link Chrome Web Store hoặc Extension ID:
                </label>
                <input type="text" id="input-ext-url-value" class="form-control" placeholder="https://chromewebstore.google.com/detail/..." style="width: 100%; height: 38px; font-size: 13px; padding: 0 12px; border: 1px solid #cbd5e1; border-radius: 4px; box-sizing: border-box;">
                <div style="font-size: 12px; color: #64748b; margin-top: 6px; line-height: 1.4;">
                  Ví dụ: <code>https://chromewebstore.google.com/detail/bookmarks-quick-search/lniofgaicnjjdfinpnkhmlpmnhacnkca</code><br>
                  hoặc chỉ cần ID: <code>lniofgaicnjjdfinpnkhmlpmnhacnkca</code>
                </div>
              </div>

              <!-- Status / Loading -->
              <div id="ext-url-loading" style="display: none; align-items: center; gap: 10px; padding: 10px 14px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 4px; color: #0369a1; font-size: 13px;">
                <span class="loading-spinner" style="display: inline-block; width: 14px; height: 14px; border: 2px solid #0284c7; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite;"></span>
                <span id="ext-url-status-text">Đang kết nối và tải file từ Chrome Web Store...</span>
              </div>

              <!-- Error Box -->
              <div id="ext-url-error" style="display: none; padding: 10px 14px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; color: #b91c1c; font-size: 13px;"></div>
            </div>

            <div style="padding: 14px 20px; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: flex-end; gap: 10px;">
              <button id="btn-cancel-modal-url" class="btn btn-secondary" style="height: 36px; padding: 0 16px; border: 1px solid #cbd5e1; border-radius: 4px; background: #fff; color: #475569; font-size: 13px; font-weight: 500; cursor: pointer;">
                Hủy
              </button>
              <button id="btn-submit-modal-url" class="btn btn-primary" style="height: 36px; padding: 0 20px; background: #0284c7; border: none; border-radius: 4px; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                Tải & Cài đặt
              </button>
            </div>

          </div>
        </div>

      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const btnAdd = this.container.querySelector('#btn-add-extension');
    const menu = this.container.querySelector('#dropdown-add-ext-menu');
    const btnAddFile = this.container.querySelector('#btn-add-ext-file');
    const btnAddFolder = this.container.querySelector('#btn-add-ext-folder');
    const btnRefresh = this.container.querySelector('#btn-refresh-extensions');
    const inputSearch = this.container.querySelector('#input-search-extension');

    // Toggle menu
    if (btnAdd && menu) {
      btnAdd.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
      });
      document.addEventListener('click', () => {
        if (menu) menu.style.display = 'none';
      });
    }

    // Modal Add from URL elements
    const modalUrl = this.container.querySelector('#modal-add-ext-url');
    const btnAddUrl = this.container.querySelector('#btn-add-ext-url');
    const btnCloseModalUrl = this.container.querySelector('#btn-close-modal-url');
    const btnCancelModalUrl = this.container.querySelector('#btn-cancel-modal-url');
    const btnSubmitModalUrl = this.container.querySelector('#btn-submit-modal-url');
    const inputUrlVal = this.container.querySelector('#input-ext-url-value');
    const loadingBox = this.container.querySelector('#ext-url-loading');
    const errorBox = this.container.querySelector('#ext-url-error');

    const openUrlModal = () => {
      if (menu) menu.style.display = 'none';
      if (modalUrl) {
        modalUrl.style.display = 'flex';
        if (inputUrlVal) {
          inputUrlVal.value = '';
          inputUrlVal.focus();
        }
        if (loadingBox) loadingBox.style.display = 'none';
        if (errorBox) errorBox.style.display = 'none';
        if (btnSubmitModalUrl) {
          btnSubmitModalUrl.disabled = false;
          btnSubmitModalUrl.innerHTML = 'Tải & Cài đặt';
        }
      }
    };

    const closeUrlModal = () => {
      if (modalUrl) modalUrl.style.display = 'none';
    };

    if (btnAddUrl) btnAddUrl.addEventListener('click', openUrlModal);
    if (btnCloseModalUrl) btnCloseModalUrl.addEventListener('click', closeUrlModal);
    if (btnCancelModalUrl) btnCancelModalUrl.addEventListener('click', closeUrlModal);

    // Submit URL
    if (btnSubmitModalUrl) {
      btnSubmitModalUrl.addEventListener('click', async () => {
        const val = inputUrlVal ? inputUrlVal.value.trim() : '';
        if (!val) {
          if (errorBox) {
            errorBox.innerText = 'Vui lòng nhập link Chrome Web Store hoặc Extension ID';
            errorBox.style.display = 'block';
          }
          return;
        }

        if (errorBox) errorBox.style.display = 'none';
        if (loadingBox) loadingBox.style.display = 'flex';
        btnSubmitModalUrl.disabled = true;
        btnSubmitModalUrl.innerHTML = 'Đang tải & giải nén...';

        try {
          const res = await window.api.addExtensionFromUrl(val);
          if (res && res.success) {
            closeUrlModal();
            await this.loadExtensions();
          } else {
            if (loadingBox) loadingBox.style.display = 'none';
            if (errorBox) {
              errorBox.innerText = 'Lỗi: ' + (res.message || 'Không thể tải extension từ link này');
              errorBox.style.display = 'block';
            }
            btnSubmitModalUrl.disabled = false;
            btnSubmitModalUrl.innerHTML = 'Tải & Cài đặt';
          }
        } catch (e) {
          if (loadingBox) loadingBox.style.display = 'none';
          if (errorBox) {
            errorBox.innerText = 'Lỗi: ' + e.message;
            errorBox.style.display = 'block';
          }
          btnSubmitModalUrl.disabled = false;
          btnSubmitModalUrl.innerHTML = 'Tải & Cài đặt';
        }
      });
    }

    // Add from file (.zip, .crx)
    if (btnAddFile) {
      btnAddFile.addEventListener('click', async () => {
        if (menu) menu.style.display = 'none';
        try {
          const res = await window.api.addExtensionDialog();
          if (res && res.success) {
            this.loadExtensions();
          } else if (res && res.message) {
            alert('Lỗi: ' + res.message);
          }
        } catch (e) {
          alert('Lỗi khi thêm extension: ' + e.message);
        }
      });
    }

    // Add from folder
    if (btnAddFolder) {
      btnAddFolder.addEventListener('click', async () => {
        if (menu) menu.style.display = 'none';
        try {
          const res = await window.api.addExtensionFolderDialog();
          if (res && res.success) {
            this.loadExtensions();
          } else if (res && res.message) {
            alert('Lỗi: ' + res.message);
          }
        } catch (e) {
          alert('Lỗi khi thêm extension: ' + e.message);
        }
      });
    }

    // Refresh
    if (btnRefresh) {
      btnRefresh.addEventListener('click', () => {
        this.loadExtensions();
      });
    }

    // Search
    if (inputSearch) {
      inputSearch.addEventListener('input', (e) => {
        this.searchKeyword = e.target.value.trim().toLowerCase();
        this.renderCards();
      });
    }
  }

  async loadExtensions() {
    try {
      this.extensions = await window.api.getExtensions();
      this.renderCards();
    } catch (e) {
      console.error('Lỗi tải danh sách extension:', e);
    }
  }

  renderCards() {
    const listEl = this.container.querySelector('#extensions-cards-list');
    if (!listEl) return;

    let filtered = this.extensions || [];
    if (this.searchKeyword) {
      filtered = filtered.filter(ext => 
        (ext.name && ext.name.toLowerCase().includes(this.searchKeyword)) ||
        (ext.id && ext.id.toLowerCase().includes(this.searchKeyword)) ||
        (ext.folderName && ext.folderName.toLowerCase().includes(this.searchKeyword))
      );
    }

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 48px; text-align: center; color: #94a3b8; background: #fff; border: 1px dashed #cbd5e1; border-radius: 8px;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5" style="margin: 0 auto 12px auto; display: block;">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
          <div style="font-size: 15px; font-weight: 500; color: #64748b; margin-bottom: 6px;">Chưa có Extension nào</div>
          <div style="font-size: 13px;">Bấm nút <strong>+ Thêm extension</strong> ở trên để chọn file .zip, .crx hoặc thư mục unpacked. Hệ thống sẽ tự giải nén vào thư mục <code>Extensions</code>.</div>
        </div>
      `;
      return;
    }

    // Icon mặc định dạng SVG robot/puzzle
    const defaultIconSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" rx="14" fill="%23e0f2fe"/><path d="M42 28h-4v-4a6 6 0 0 0-12 0v4h-4a6 6 0 0 0-6 6v4h4a6 6 0 0 1 0 12h-4v4a6 6 0 0 0 6 6h4v-4a6 6 0 0 1 12 0v4h4a6 6 0 0 0 6-6v-4h-4a6 6 0 0 1 0-12h4v-4a6 6 0 0 0-6-6z" fill="%230284c7"/></svg>`;

    listEl.innerHTML = filtered.map(ext => {
      const iconSrc = ext.icon || defaultIconSvg;
      return `
        <div class="ext-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; display: flex; gap: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); position: relative; transition: box-shadow 0.2s, border-color 0.2s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)'">
          
          <!-- Cột bên trái: Icon + Version bên dưới -->
          <div style="display: flex; flex-direction: column; align-items: center; width: 72px; flex-shrink: 0;">
            <div style="width: 64px; height: 64px; border-radius: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #f8fafc; border: 1px solid #f1f5f9;">
              <img src="${iconSrc}" style="width: 100%; height: 100%; object-fit: contain;" alt="icon">
            </div>
            <div style="margin-top: 8px; font-size: 11.5px; color: #64748b; font-weight: 500; text-align: center; word-break: break-all;">
              ${ext.version}
            </div>
          </div>

          <!-- Cột bên phải: Tên + Xóa, ID, Footer (Switch On/Off, Upload, Folder) -->
          <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
            
            <!-- Hàng 1: Tên và nút Xóa ✕ -->
            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;">
              <div style="font-weight: 600; font-size: 14px; color: #1e293b; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${ext.name}">
                ${ext.name}
              </div>
              <button class="btn-delete-ext" data-folder="${ext.folderName}" style="background: none; border: none; color: #64748b; cursor: pointer; font-size: 14px; padding: 2px 6px; border-radius: 4px; line-height: 1; transition: color 0.15s;" title="Xóa extension">
                ✕
              </button>
            </div>

            <!-- Hàng 2: ID -->
            <div style="font-size: 11.5px; color: #94a3b8; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="ID: ${ext.id}">
              ID: ${ext.id}
            </div>

            <!-- Hàng 3: Switch On/Off + Actions (Folder & Update) -->
            <div style="margin-top: auto; padding-top: 12px; display: flex; align-items: center; justify-content: space-between;">
              
              <!-- Switch On / Off -->
              <div style="display: flex; align-items: center; gap: 8px;">
                <label style="position: relative; display: inline-block; width: 44px; height: 24px; margin: 0; cursor: pointer;">
                  <input type="checkbox" class="toggle-ext-checkbox" data-folder="${ext.folderName}" ${ext.enabled ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                  <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: ${ext.enabled ? '#0284c7' : '#cbd5e1'}; transition: .3s; border-radius: 24px;">
                    <span style="position: absolute; content: ''; height: 18px; width: 18px; left: ${ext.enabled ? '23px' : '3px'}; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%;"></span>
                  </span>
                </label>
                <span class="ext-status-label" style="font-size: 12.5px; font-weight: 600; color: ${ext.enabled ? '#0284c7' : '#64748b'};">
                  ${ext.enabled ? 'On' : 'Off'}
                </span>
              </div>

              <!-- Action icons: Update ↑ & Open Folder 📁 -->
              <div style="display: flex; align-items: center; gap: 8px;">
                <button class="btn-update-ext" data-folder="${ext.folderName}" title="Cập nhật extension từ file mới" style="background: none; border: none; color: #64748b; cursor: pointer; font-size: 15px; padding: 4px; border-radius: 4px; display: flex; align-items: center; justify-content: center; transition: color 0.15s;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5"></line>
                    <polyline points="5 12 12 5 19 12"></polyline>
                  </svg>
                </button>
                <button class="btn-open-folder-ext" data-folder="${ext.folderName}" title="Mở thư mục Extension" style="background: none; border: none; color: #64748b; cursor: pointer; font-size: 15px; padding: 4px; border-radius: 4px; display: flex; align-items: center; justify-content: center; transition: color 0.15s;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button>
              </div>

            </div>

          </div>

        </div>
      `;
    }).join('');

    this.bindCardEvents();
  }

  bindCardEvents() {
    // Delete
    this.container.querySelectorAll('.btn-delete-ext').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const folder = e.currentTarget.dataset.folder;
        if (confirm(`Bạn có chắc chắn muốn xóa extension này? Thư mục lưu trữ sẽ bị xóa vĩnh viễn.`)) {
          const res = await window.api.deleteExtension(folder);
          if (res && res.success) {
            this.loadExtensions();
          } else {
            alert('Không thể xóa: ' + (res.message || 'Lỗi không xác định'));
          }
        }
      });
    });

    // Toggle On / Off
    this.container.querySelectorAll('.toggle-ext-checkbox').forEach(chk => {
      chk.addEventListener('change', async (e) => {
        const folder = e.currentTarget.dataset.folder;
        const enabled = e.currentTarget.checked;
        await window.api.toggleExtension(folder, enabled);
        this.loadExtensions();
      });
    });

    // Open Folder
    this.container.querySelectorAll('.btn-open-folder-ext').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const folder = e.currentTarget.dataset.folder;
        await window.api.openExtensionFolder(folder);
      });
    });

    // Update
    this.container.querySelectorAll('.btn-update-ext').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const folder = e.currentTarget.dataset.folder;
        try {
          const res = await window.api.addExtensionDialog();
          if (res && res.success) {
            this.loadExtensions();
          }
        } catch (err) {
          alert('Lỗi cập nhật: ' + err.message);
        }
      });
    });
  }
}
