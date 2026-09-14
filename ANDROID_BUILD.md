# 🤖 Panduan Build Package Installer Android (APK) dengan Tauri v2

Aplikasi **Cashflow Mobile** kini mendukung pengemasan native Android (*standalone installer* `.apk`) menggunakan framework **Tauri v2**.

---

## ⚡ Cara 1: Build Otomatis via GitHub Actions (Rekomendasi)

Anda **tidak perlu** menginstal Rust, Java JDK, atau Android Studio di komputer Anda. File konfigurasi workflow sudah kami siapkan di `ci/build-android.yml`.

### Cara Mengaktifkannya di GitHub:
1. Buka repository GitHub Anda di browser:  
   `https://github.com/andrealfiano7/cashflow-mobile-app`
2. Klik tombol **Add file** -> **Create new file**.
3. Ketik nama file: `.github/workflows/build-android.yml`
4. Buka file [ci/build-android.yml](file:///e:/Apps/Cashflow/ci/build-android.yml), salin (*copy*) seluruh isinya, lalu *paste* ke editor GitHub dan klik **Commit changes**.
5. Buka tab **Actions** di GitHub -> klik workflow **Build Android APK (Tauri v2)** -> klik **Run workflow**.
6. Setelah proses build selesai (centang hijau), scroll ke bawah ke bagian **Artifacts**.
7. Download file zip **`Cashflow-Mobile-Android-APK`**, ekstrak, dan installer `.apk` siap di-install di HP Android Anda!

---

## 💻 Cara 2: Build Manual di Komputer Lokal (Windows)

Jika Anda ingin mengompilasi APK langsung dari laptop/PC Windows Anda, ikuti langkah persiapan toolchain berikut:

### 1. Prasyarat yang Perlu Diinstal:
1. **Rust & Cargo**:
   - Download dan jalankan installer [rustup-init.exe](https://rustup.rs/).
   - Tambahkan target Android dengan perintah PowerShell:
     ```powershell
     rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
     ```
2. **Java Development Kit (JDK 17)**:
   - Unduh [Eclipse Temurin OpenJDK 17](https://adoptium.net/temurin/releases/?version=17).
   - Set environment variable `JAVA_HOME`.
3. **Android Studio**:
   - Unduh [Android Studio](https://developer.android.com/studio).
   - Buka **SDK Manager** -> tab **SDK Tools**, centang dan instal:
     - Android SDK Platform-Tools
     - Android SDK Build-Tools (versi 34)
     - Android NDK (versi 26.1 atau terbaru)
     - Android SDK Command-line Tools
   - Set environment variable:
     - `ANDROID_HOME` = `C:\Users\<Username>\AppData\Local\Android\Sdk`
     - `NDK_HOME` = `$ANDROID_HOME\ndk\<versi_ndk>`

### 2. Perintah Build:
Setelah semua prasyarat terpasang:

```powershell
# Jalankan inisialisasi Android
npm run tauri -- android init

# Build file installer APK (Universal)
npm run android:build -- --apk
```

File APK akan tersedia di folder:  
`src-tauri/gen/android/app/build/outputs/apk/universal/release/`
