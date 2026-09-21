const fs = require('fs');
const path = require('path');

const profilesFile = path.join(__dirname, 'app_data', 'profiles.json');
const profilesDataDir = path.join(__dirname, 'profiles_data');

if (!fs.existsSync(profilesDataDir)) {
  fs.mkdirSync(profilesDataDir, { recursive: true });
}

const profiles = JSON.parse(fs.readFileSync(profilesFile, 'utf8'));

profiles.forEach(p => {
  const pDir = path.join(profilesDataDir, `profile_${p.id}`);
  if (!fs.existsSync(pDir)) {
    fs.mkdirSync(pDir, { recursive: true });
  }

  // Tạo file profile_info.txt trong từng thư mục profile
  const infoTxt = `ID: ${p.id}
Tên profile: ${p.name}
Nhóm: ${p.group}
Trình duyệt: ${p.browserType} (${p.version || '151.0.7922.76'})
Hệ điều hành: ${p.os || 'Windows'}
Proxy: ${p.proxy}
Quốc gia: ${p.proxyCountry || 'us'}
Trạng thái: ${p.status}
Lần chạy cuối: ${p.lastRun}
Tags: ${p.tags || ''}
Ghi chú: ${p.notes || ''}
URL kiểm tra IP: https://myip.link/
Thời gian tạo: ${new Date(p.createdAt).toLocaleString('vi-VN')}
`;

  fs.writeFileSync(path.join(pDir, 'profile_info.txt'), infoTxt, 'utf8');
});

console.log(`Đã đồng bộ thành công ${profiles.length} profiles vào: ${profilesDataDir}`);
console.log('Các thư mục trong profiles_data:', fs.readdirSync(profilesDataDir));
