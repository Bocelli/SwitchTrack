/**
 * [TRAIL:APK] Automated Native Android APK Builder for SwitchTrack
 * - Compiles Android resources with AAPT2
 * - Generates Joy-Con themed adaptive app icons
 * - Compiles Java sources with javac
 * - Dexes bytecode with D8 (R8)
 * - Packages, zip-aligns, and signs APK with apksigner
 * - Outputs production-ready, installable APK
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const ANDROID_DIR = path.join(ROOT_DIR, 'android');
const BUILD_DIR = path.join(ANDROID_DIR, 'build');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const ANDROID_HOME = 'C:\\Android';
const BUILD_TOOLS = path.join(ANDROID_HOME, 'build-tools\\33.0.2');
const PLATFORM_JAR = path.join(ANDROID_HOME, 'platforms\\android-33\\android.jar');
const D8_JAR = path.join(BUILD_TOOLS, 'lib\\d8.jar');
const AAPT2 = path.join(BUILD_TOOLS, 'aapt2.exe');
const ZIPALIGN = path.join(BUILD_TOOLS, 'zipalign.exe');
const APKSIGNER = path.join(BUILD_TOOLS, 'apksigner.bat');

const JDK_BIN = 'C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.20.101-hotspot\\bin';
const JAVAC = path.join(JDK_BIN, 'javac.exe');
const JAR = path.join(JDK_BIN, 'jar.exe');
const KEYTOOL = path.join(JDK_BIN, 'keytool.exe');
const JAVA = path.join(JDK_BIN, 'java.exe');

// =========================================================================
// 1. Icon Generator: Genera ic_launcher.png puro a tema Switch Joy-Con
// =========================================================================
function createPng(width, height, getPixel) {
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter byte: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (-(c & 1) & 0xedb88320);
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii');
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(data.length, 0);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
  }

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', zlib.deflateSync(rawData)),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

function generateSwitchIcon(size) {
  return createPng(size, size, (x, y, w, h) => {
    const nx = x / w;
    const ny = y / h;

    // Sfondo dark squircle (#0c0e14)
    const cx = nx - 0.5;
    const cy = ny - 0.5;
    const cornerRadius = 0.22;
    const ax = Math.abs(cx);
    const ay = Math.abs(cy);
    
    // Contorno icona
    if (Math.pow(ax, 4) + Math.pow(ay, 4) > Math.pow(0.48, 4)) {
      return [0, 0, 0, 0]; // Trasparente esterno
    }

    // Bordo sottile glow
    const borderDist = Math.pow(ax, 4) + Math.pow(ay, 4);
    if (borderDist > Math.pow(0.46, 4)) {
      return [255, 255, 255, 40];
    }

    // Area Switch Console centrale (x da 0.22 a 0.78, y da 0.22 a 0.78)
    const inConsoleY = ny >= 0.22 && ny <= 0.78;
    const isLeftJoyCon = inConsoleY && nx >= 0.22 && nx <= 0.47;
    const isRightJoyCon = inConsoleY && nx >= 0.53 && nx <= 0.78;

    // Joy-Con sinistro (Neon Red #e60012)
    if (isLeftJoyCon) {
      // Bordo curvo esterno
      if (nx <= 0.32) {
        const dy = (ny - 0.5) / 0.28;
        const dx = (0.32 - nx) / 0.10;
        if (dx * dx + dy * dy > 1) return [14, 17, 26, 255];
      }

      // Analog stick sinistro (cerchio nero/grigio a (0.35, 0.40))
      const stickDx = (nx - 0.35) * w;
      const stickDy = (ny - 0.40) * h;
      const stickDist = Math.sqrt(stickDx * stickDx + stickDy * stickDy);
      const stickRadius = size * 0.065;
      if (stickDist <= stickRadius) {
        if (stickDist >= stickRadius - 1.5) return [255, 255, 255, 220]; // Bordo bianco
        return [20, 24, 34, 255]; // Centro scuro
      }

      // Pulsante Minus (-) a (0.42, 0.30)
      if (Math.abs(nx - 0.42) * w < size * 0.035 && Math.abs(ny - 0.30) * h < size * 0.012) {
        return [255, 255, 255, 230];
      }

      return [230, 0, 18, 255]; // Neon Red
    }

    // Joy-Con destro (Neon Cyan #00c3e3)
    if (isRightJoyCon) {
      // Bordo curvo esterno
      if (nx >= 0.68) {
        const dy = (ny - 0.5) / 0.28;
        const dx = (nx - 0.68) / 0.10;
        if (dx * dx + dy * dy > 1) return [14, 17, 26, 255];
      }

      // Analog stick destro (cerchio nero/grigio a (0.65, 0.60))
      const stickDx = (nx - 0.65) * w;
      const stickDy = (ny - 0.60) * h;
      const stickDist = Math.sqrt(stickDx * stickDx + stickDy * stickDy);
      const stickRadius = size * 0.065;
      if (stickDist <= stickRadius) {
        if (stickDist >= stickRadius - 1.5) return [255, 255, 255, 220]; // Bordo bianco
        return [20, 24, 34, 255]; // Centro scuro
      }

      // Pulsante Plus (+) a (0.58, 0.30)
      const plusX = Math.abs(nx - 0.58) * w;
      const plusY = Math.abs(ny - 0.30) * h;
      if ((plusX < size * 0.035 && plusY < size * 0.012) || (plusY < size * 0.035 && plusX < size * 0.012)) {
        return [255, 255, 255, 230];
      }

      return [0, 195, 227, 255]; // Neon Cyan
    }

    // Sfondo interno base
    return [14, 17, 26, 255];
  });
}

export function buildApk() {
  console.log('========================================================');
  console.log('📱 AVVIO COMPILAZIONE NATIVA ANDROID APK PER SWITCHTRACK');
  console.log('========================================================');

  // Pulizia e creazione directory di lavoro
  if (fs.existsSync(BUILD_DIR)) {
    fs.rmSync(BUILD_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(BUILD_DIR, { recursive: true });
  fs.mkdirSync(path.join(BUILD_DIR, 'gen'), { recursive: true });
  fs.mkdirSync(path.join(BUILD_DIR, 'classes'), { recursive: true });
  fs.mkdirSync(path.join(BUILD_DIR, 'res_compiled'), { recursive: true });

  // 1. Generazione Icone Mipmap
  console.log('[1/8] Generazione icone Joy-Con per tutte le densità Android...');
  const iconSizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
  };

  for (const [dir, size] of Object.entries(iconSizes)) {
    const targetDir = path.join(ANDROID_DIR, 'res', dir);
    fs.mkdirSync(targetDir, { recursive: true });
    const iconData = generateSwitchIcon(size);
    fs.writeFileSync(path.join(targetDir, 'ic_launcher.png'), iconData);
  }
  console.log('  ✔ Icone generate con successo (48px - 192px)');

  // 2. Compilazione Risorse (AAPT2 Compile)
  console.log('[2/8] Compilazione risorse con AAPT2...');
  const resDir = path.join(ANDROID_DIR, 'res');
  const compiledResZip = path.join(BUILD_DIR, 'res_compiled', 'compiled.flata');
  execSync(`"${AAPT2}" compile --dir "${resDir}" -o "${compiledResZip}"`, { stdio: 'inherit' });
  console.log('  ✔ Risorse compilate in archivio flata');

  // 3. Link Risorse e Generazione R.java (AAPT2 Link)
  console.log('[3/8] Link risorse e generazione R.java...');
  const manifest = path.join(ANDROID_DIR, 'AndroidManifest.xml');
  const unalignedApk = path.join(BUILD_DIR, 'unaligned.apk');
  const genDir = path.join(BUILD_DIR, 'gen');
  
  execSync(`"${AAPT2}" link -I "${PLATFORM_JAR}" "${compiledResZip}" --manifest "${manifest}" -o "${unalignedApk}" --java "${genDir}" --auto-add-overlay`, { stdio: 'inherit' });
  console.log('  ✔ Pacchetto base generato e R.java creato');

  // 4. Compilazione Java (Javac)
  console.log('[4/8] Compilazione sorgenti Java...');
  const javaSrc = path.join(ANDROID_DIR, 'src', 'com', 'bocelli', 'switchtrack', 'MainActivity.java');
  const rJava = path.join(genDir, 'com', 'bocelli', 'switchtrack', 'R.java');
  const classesDir = path.join(BUILD_DIR, 'classes');

  execSync(`"${JAVAC}" -encoding UTF-8 -cp "${PLATFORM_JAR}" -d "${classesDir}" "${rJava}" "${javaSrc}"`, { stdio: 'inherit' });
  console.log('  ✔ File di classe .class generati');

  // 5. Conversione Bytecode in Dalvik DEX (D8)
  console.log('[5/8] Conversione in Dalvik Executable (classes.dex) con D8...');
  const classFiles = [
    path.join(classesDir, 'com', 'bocelli', 'switchtrack', '*.class')
  ];

  // Invoca direttamente D8 con il classpath (bypassando il vecchio d8.bat)
  execSync(`"${JAVA}" -cp "${D8_JAR}" com.android.tools.r8.D8 --lib "${PLATFORM_JAR}" --min-api 21 --output "${BUILD_DIR}" ${classesDir}\\com\\bocelli\\switchtrack\\*.class`, { stdio: 'inherit' });
  console.log('  ✔ classes.dex generato con successo');

  // 6. Inserimento classes.dex nell'APK
  console.log('[6/8] Inserimento classes.dex nell\'APK non allineato...');
  process.chdir(BUILD_DIR);
  execSync(`"${JAR}" -uf "${unalignedApk}" classes.dex`, { stdio: 'inherit' });
  process.chdir(ROOT_DIR);
  console.log('  ✔ DEX inserito nell\'archivio APK');

  // 7. Allineamento Zip a 4-byte (zipalign)
  console.log('[7/8] Allineamento a 4-byte con zipalign...');
  const alignedApk = path.join(BUILD_DIR, 'aligned.apk');
  execSync(`"${ZIPALIGN}" -f -p 4 "${unalignedApk}" "${alignedApk}"`, { stdio: 'inherit' });
  console.log('  ✔ Allineamento completato');

  // 8. Firma Digitale con Keystore & Apksigner
  console.log('[8/8] Firma crittografica APK con apksigner (v1, v2, v3)...');
  const keystore = path.join(ANDROID_DIR, 'switchtrack.keystore');
  const ksPass = 'switchtrack123';
  const keyAlias = 'switchtrack';

  if (!fs.existsSync(keystore)) {
    console.log('  Creazione nuovo keystore di firma SwitchTrack...');
    execSync(`"${KEYTOOL}" -genkeypair -validity 10000 -dname "CN=SwitchTrack, OU=Mobile, O=Bocelli, L=Rome, ST=Italy, C=IT" -keystore "${keystore}" -storepass "${ksPass}" -keypass "${ksPass}" -alias "${keyAlias}" -keyalg RSA -keysize 2048`, { stdio: 'ignore' });
  }

  const finalApkPath = path.join(ANDROID_DIR, 'SwitchTrack.apk');
  fs.copyFileSync(alignedApk, finalApkPath);

  execSync(`"${APKSIGNER}" sign --ks "${keystore}" --ks-pass "pass:${ksPass}" --ks-key-alias "${keyAlias}" --key-pass "pass:${ksPass}" "${finalApkPath}"`, { stdio: 'inherit' });

  // Verifica integrità della firma
  execSync(`"${APKSIGNER}" verify --verbose "${finalApkPath}"`, { stdio: 'inherit' });

  // Copia nei downloads pubblici del server web
  const publicDownloadsDir = path.join(PUBLIC_DIR, 'downloads');
  fs.mkdirSync(publicDownloadsDir, { recursive: true });
  const publicApk = path.join(publicDownloadsDir, 'SwitchTrack.apk');
  fs.copyFileSync(finalApkPath, publicApk);

  // Copia anche nella root di public per accesso diretto /SwitchTrack.apk
  fs.copyFileSync(finalApkPath, path.join(PUBLIC_DIR, 'SwitchTrack.apk'));

  const apkStats = fs.statSync(finalApkPath);
  const sizeMb = (apkStats.size / (1024 * 1024)).toFixed(2);

  console.log('========================================================');
  console.log(`🎉 BUILD APK COMPLETATO CON SUCCESSO!`);
  console.log(`📦 Percorso locale: ${finalApkPath}`);
  console.log(`🌐 Download Web:    /downloads/SwitchTrack.apk`);
  console.log(`⚖️  Dimensione:      ${sizeMb} MB (${apkStats.size.toLocaleString('it-IT')} byte)`);
  console.log('========================================================');

  return { finalApkPath, publicApk, sizeBytes: apkStats.size };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildApk();
}
