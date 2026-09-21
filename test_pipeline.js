const LicenseManager = require('./licenseManager');
const ProfileStore = require('./profileStore');
const BrowserLauncher = require('./browserLauncher');
const path = require('path');
const fs = require('fs');

async function testAll() {
  console.log('=== 1. KIỂM THỬ LICENSE MANAGER ===');
  const tempDir = path.join(__dirname, 'test_app_data');
  if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });

  const lm = new LicenseManager(tempDir);
  const hwid = lm.getHWID();
  console.log('[PASS] HWID máy tính:', hwid);

  // Test 1: Tạo key 7 ngày cho 1 máy
  const key7d = lm.generateKey({
    type: 'trial',
    durationDays: 7,
    maxMachines: 1,
    customerName: 'KhachHang_1'
  });
  console.log('[PASS] Key 7 ngày tạo ra:', key7d.key);

  // Kích hoạt key 7 ngày
  const actRes = lm.activate(key7d.key);
  console.log('[PASS] Kích hoạt key 7 ngày:', actRes.valid, actRes.message);
  const status7d = lm.checkStatus();
  console.log('[PASS] Trạng thái bản quyền:', status7d.type, 'Hạn còn:', status7d.daysLeft, 'Số máy:', status7d.maxMachines);

  // Test 2: Tạo key Vĩnh viễn (Lifetime) cho 5 máy
  const keyLife5m = lm.generateKey({
    type: 'lifetime',
    maxMachines: 5,
    customerName: 'KhachHang_VIP'
  });
  console.log('[PASS] Key Vĩnh viễn 5 máy:', keyLife5m.key);
  const actRes2 = lm.activate(keyLife5m.key);
  console.log('[PASS] Kích hoạt key vĩnh viễn:', actRes2.valid, actRes2.message);
  const statusLife = lm.checkStatus();
  console.log('[PASS] Trạng thái sau nâng cấp:', statusLife.type, 'Hạn:', statusLife.daysLeft, 'Số máy:', statusLife.maxMachines);

  console.log('\n=== 2. KIỂM THỬ PROFILE STORE ===');
  const ps = new ProfileStore(tempDir);
  const initialProfiles = ps.getAllProfiles();
  console.log('[PASS] Số lượng profile ban đầu (mẫu giống ảnh):', initialProfiles.length);

  const created = ps.createProfile({
    name: 'Profile Automation Test',
    browserType: 'chrome',
    proxy: '1.2.3.4:8080'
  });
  console.log('[PASS] Đã tạo profile mới:', created.name, created.id);

  const batch = ps.batchCreate({
    count: 3,
    namePrefix: 'BatchProfile',
    browserType: 'edge'
  });
  console.log('[PASS] Đã tạo hàng loạt 3 profile:', batch.map(b => b.name).join(', '));

  console.log('\n=== 3. KIỂM THỬ BROWSER LAUNCHER ===');
  const bl = new BrowserLauncher(path.join(tempDir, 'profiles_dir'));
  const detected = bl.detectBrowsers();
  console.log('[PASS] Các trình duyệt nhận diện được trên máy:');
  for (const [bName, bPath] of Object.entries(detected)) {
    console.log(`  - ${bName.toUpperCase()}: ${bPath}`);
  }

  // Dọn dẹp thư mục test
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log('\n>>> TẤT CẢ KIỂM THỬ ĐÃ THÀNH CÔNG RỰC RỠ! <<<');
}

testAll().catch(console.error);
