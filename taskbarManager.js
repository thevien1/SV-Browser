const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

class TaskbarManager {
  constructor() {
    this.appDataDir = path.join(process.env.LOCALAPPDATA || 'C:\\Windows\\Temp', 'SVBrowser');
    if (!fs.existsSync(this.appDataDir)) {
      try { fs.mkdirSync(this.appDataDir, { recursive: true }); } catch (e) {}
    }
    this.helperScriptPath = path.join(this.appDataDir, 'taskbar_helper.ps1');
    this.ensureHelperScript();
  }

  ensureHelperScript() {
    const psScript = `
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;

public class Win32Helper {
    [DllImport("user32.dll", SetLastError = true)]
    public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);

    [DllImport("user32.dll")]
    public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);

    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

    [DllImport("user32.dll", CharSet = CharSet.Auto)]
    public static extern IntPtr SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);

    [DllImport("user32.dll", EntryPoint = "SetClassLong")]
    public static extern uint SetClassLongPtr32(IntPtr hWnd, int nIndex, uint dwNewLong);

    [DllImport("user32.dll", EntryPoint = "SetClassLongPtr")]
    public static extern IntPtr SetClassLongPtr64(IntPtr hWnd, int nIndex, IntPtr dwNewLong);

    public static IntPtr SetClassLong(IntPtr hWnd, int nIndex, IntPtr dwNewLong) {
        if (IntPtr.Size > 4)
            return SetClassLongPtr64(hWnd, nIndex, dwNewLong);
        else
            return new IntPtr(SetClassLongPtr32(hWnd, nIndex, (uint)dwNewLong.ToInt32()));
    }

    [DllImport("user32.dll", SetLastError = true)]
    public static extern IntPtr LoadImage(IntPtr hinst, string lpszName, uint uType, int cxDesired, int cyDesired, uint fuLoad);

    [DllImport("shell32.dll", SetLastError = true)]
    public static extern int SHGetPropertyStoreForWindow(IntPtr hwnd, ref Guid iid, [Out, MarshalAs(UnmanagedType.Interface)] out IPropertyStore propertyStore);

    public const uint WM_SETICON = 0x0080;
    public const int ICON_SMALL = 0;
    public const int ICON_BIG = 1;
    public const int GCLP_HICON = -14;
    public const int GCLP_HICONSM = -34;
    public const uint IMAGE_ICON = 1;
    public const uint LR_LOADFROMFILE = 0x00000010;

    [ComImport, Guid("886d8eeb-8cf2-4446-8d02-cdba1dbdcf99"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    public interface IPropertyStore {
        int GetCount(out uint cProps);
        int GetAt(uint iProp, out PropertyKey pkey);
        int GetValue(ref PropertyKey key, out PropVariant pv);
        int SetValue(ref PropertyKey key, ref PropVariant pv);
        int Commit();
    }

    [StructLayout(LayoutKind.Sequential, Pack = 4)]
    public struct PropertyKey {
        public Guid fmtid;
        public uint pid;
        public PropertyKey(Guid guid, uint pid) {
            this.fmtid = guid;
            this.pid = pid;
        }
    }

    [StructLayout(LayoutKind.Explicit)]
    public struct PropVariant {
        [FieldOffset(0)] public ushort vt;
        [FieldOffset(8)] public IntPtr ptr;

        public static PropVariant FromString(string val) {
            PropVariant pv = new PropVariant();
            pv.vt = 31; // VT_LPWSTR
            pv.ptr = Marshal.StringToCoTaskMemUni(val);
            return pv;
        }
    }

    public static PropertyKey PKEY_AppUserModel_ID = new PropertyKey(new Guid("9F4C2855-9F79-4B39-A8D0-E1D42DE1D5F3"), 5);
    public static PropertyKey PKEY_AppUserModel_RelaunchIconResource = new PropertyKey(new Guid("9F4C2855-9F79-4B39-A8D0-E1D42DE1D5F3"), 2);

    public static bool ApplyWindowSettings(IntPtr hWnd, string appId, string icoPath) {
        if (hWnd == IntPtr.Zero) return false;

        try {
            Guid guid = new Guid("886d8eeb-8cf2-4446-8d02-cdba1dbdcf99");
            IPropertyStore store;
            int hr = SHGetPropertyStoreForWindow(hWnd, ref guid, out store);
            if (hr == 0 && store != null) {
                PropVariant pvId = PropVariant.FromString(appId);
                store.SetValue(ref PKEY_AppUserModel_ID, ref pvId);

                if (!string.IsNullOrEmpty(icoPath)) {
                    PropVariant pvIcon = PropVariant.FromString(icoPath + ",0");
                    store.SetValue(ref PKEY_AppUserModel_RelaunchIconResource, ref pvIcon);
                }

                store.Commit();
            }

            if (!string.IsNullOrEmpty(icoPath)) {
                IntPtr hIcon = LoadImage(IntPtr.Zero, icoPath, IMAGE_ICON, 0, 0, LR_LOADFROMFILE);
                if (hIcon != IntPtr.Zero) {
                    SendMessage(hWnd, WM_SETICON, (IntPtr)ICON_BIG, hIcon);
                    SendMessage(hWnd, WM_SETICON, (IntPtr)ICON_SMALL, hIcon);
                    SetClassLong(hWnd, GCLP_HICON, hIcon);
                    SetClassLong(hWnd, GCLP_HICONSM, hIcon);
                }
            }

            return true;
        } catch {
            return false;
        }
    }
}
"@
`;
    fs.writeFileSync(this.helperScriptPath, psScript, 'utf8');
  }

  /**
   * Áp dụng Taskbar Grouping (AppUserModelID) và Icon Badge cho cửa sổ trình duyệt đã bật
   */
  attachTaskbarBadge(pid, profileIndex, icoPath, profileTitle = '') {
    if (process.platform !== 'win32') return;

    const appId = `SVBrowser.Profile.${profileIndex}`;

    // Đảm bảo icon nằm trong thư mục ASCII để Win32 API không bị lỗi Unicode
    let safeIcoPath = icoPath;
    if (icoPath && fs.existsSync(icoPath)) {
      const asciiIconDir = path.join(this.appDataDir, 'icons');
      if (!fs.existsSync(asciiIconDir)) {
        try { fs.mkdirSync(asciiIconDir, { recursive: true }); } catch (e) {}
      }
      const dest = path.join(asciiIconDir, `icon_chrome_${profileIndex}.ico`);
      try {
        fs.copyFileSync(icoPath, dest);
        safeIcoPath = dest;
      } catch (e) {}
    }

    const escapedIco = (safeIcoPath || '').replace(/\\/g, '\\\\');
    const escapedHelper = this.helperScriptPath.replace(/\\/g, '\\\\');

    const psCommand = `
. '${escapedHelper}'

$targetPid = ${pid}
$appId = '${appId}'
$icoPath = '${escapedIco}'

for ($i = 0; $i -lt 25; $i++) {
    Start-Sleep -Milliseconds 300
    $pids = @($targetPid)
    $children = Get-CimInstance Win32_Process -Filter "ParentProcessId = $targetPid" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty ProcessId
    if ($children) { $pids += $children }

    $applied = $false
    [Win32Helper]::EnumWindows({
        param($hwnd, $lp)
        [uint32]$wPid = 0
        [Win32Helper]::GetWindowThreadProcessId($hwnd, [ref]$wPid)
        if ($pids -contains $wPid) {
            $ok = [Win32Helper]::ApplyWindowSettings($hwnd, $appId, $icoPath)
            if ($ok) { $script:applied = $true }
        }
        return $true
    }, [IntPtr]::Zero)

    if ($applied) { break }
}
`;

    const b64 = Buffer.from(psCommand, 'utf16le').toString('base64');
    exec(`powershell -NoProfile -ExecutionPolicy Bypass -EncodedCommand ${b64}`, (err) => {
      if (err) {
        console.warn(`Taskbar attach error for PID ${pid}:`, err.message);
      }
    });
  }
}

module.exports = TaskbarManager;
