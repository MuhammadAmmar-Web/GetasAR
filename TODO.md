# TODO - Sidebar Mobile menjadi Navbar Menarik

## Rencana (Opsi A: Top Navbar + Bottom Navigation Bar)

- [x] 1. Modifikasi `src/components/Sidebar.jsx`
      - Desktop: pertahankan sidebar kiri penuh
      - Mobile: Top Navbar (brand GETAS AR) + Bottom Navigation Bar (4 ikon menu)
- [x] 2. Hapus tombol hamburger di `MainContent.jsx`
- [x] 3. Hapus tombol hamburger di `ARProduk.jsx`
- [x] 4. Hapus tombol hamburger di `Panduan.jsx`
- [x] 5. Hapus tombol hamburger di `Tentang.jsx`
- [x] 6. Verifikasi aplikasi (jalankan build/lint) - build sukses, lint 0 warning 0 error

## Perbaikan Error Build mind-ar

- [x] 1. Instalasi `mind-ar@^1.2.5` (`npm install mind-ar --ignore-scripts`)
- [x] 2. Perbaiki path video di `ARProduk.jsx` (folder `video/` singular + URL-encode spasi)
      - `/video/kopigempol.mp4`
      - `/video/susu%20kambing.mp4`
      - `/video/kolang%20kaling.mp4`
- [x] 3. Patch kompatibilitas `mind-ar` dengan three.js modern (r152+)
      - `node_modules/mind-ar/dist/mindar-image-three.prod.js`
      - Ganti `sRGBEncoding` / `renderer.outputEncoding` → `renderer.outputColorSpace = "srgb"`
      - Buat `scripts/patch-mindar.js` + hook `postinstall` di `package.json` (tahan saat reinstall)
- [x] 4. Verifikasi build - `npm run build` sukses

> `public/target/targets.mind` (target terkompilasi) sudah dibuat otomatis via `scripts/compile-targets.js`
> (pure-JS, tanpa node-canvas). Jalankan ulang dengan `npm run compile-targets` jika marker PNG berubah.

## Perbaikan Loading Kamera Lambat

- [x] 1. Buat file `targets.mind` (sebelumnya tidak ada → MindAR menunggu/gagal memuat marker)
- [x] 2. Hapus `<StrictMode>` di `src/main.jsx` (mencegah kamera start dua kali di mode dev)
- [x] 3. Tambah guard `startedRef` di `ARProduk.jsx` agar MindAR hanya start satu kali
- [x] 4. Kurangi durasi `LoadingScreen` dari 2500ms → 1200ms
- [x] 5. Tambah script `compile-targets` di package.json untuk rekompilasi ulang
