import { addMinecraftValidation } from "./minecraftValidation.js";

/* =====================
PNG → TGA
===================== */
async function pngToTga(arrayBuffer) {
  const blob = new Blob([arrayBuffer], { type: "image/png" });
  const bitmap = await createImageBitmap(blob);

  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0);

  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = img.data;

  const header = new Uint8Array(18);
  header[2] = 2;
  header[12] = canvas.width & 255;
  header[13] = canvas.width >> 8;
  header[14] = canvas.height & 255;
  header[15] = canvas.height >> 8;
  header[16] = 32;
  header[17] = 0x20;

  const tgaPixels = new Uint8Array(pixels.length);

  for (let i = 0; i < pixels.length; i += 4) {
    tgaPixels[i]     = pixels[i + 2];
    tgaPixels[i + 1] = pixels[i + 1];
    tgaPixels[i + 2] = pixels[i];
    tgaPixels[i + 3] = pixels[i + 3];
  }

  const tga = new Uint8Array(header.length + tgaPixels.length);
  tga.set(header);
  tga.set(tgaPixels, header.length);

  return tga;
}

/* =====================
UNICODE JSON OBFUSCATION
===================== */
function escapeUnicode(str) {
  let out = "";
  for (let i = 0; i < str.length; i++) {
    out += "\\u" + str.charCodeAt(i).toString(16).padStart(4, "0");
  }
  return out;
}

/* ⚠️ SOLO valores, NUNCA keys */
function obfuscateJsonUnicodeSafe(obj) {
  if (Array.isArray(obj)) {
    return obj.map(obfuscateJsonUnicodeSafe);
  }

  if (obj && typeof obj === "object") {
    const out = {};
    for (const key of Object.keys(obj)) {
      out[key] = obfuscateJsonUnicodeSafe(obj[key]);
    }
    return out;
  }

  if (typeof obj === "string") {
    return escapeUnicode(obj);
  }

  return obj;
}

/* =====================
OBF LEVELS (SIN CAMBIOS)
===================== */
const OBFUSCATION_LEVELS = {
  balanced: {
    compact: true,
    stringArray: true,
    stringArrayEncoding: ["base64"],
    stringArrayThreshold: 0.7,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.8,
    renameGlobals: false
  },

  heavy: {
    compact: true,
    stringArray: true,
    stringArrayEncoding: ["base64"],
    stringArrayThreshold: 1,
    controlFlowFlattening: true,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 10,
    selfDefending: true,
    renameGlobals: false
  }
};

/* =====================
MAIN PROCESS
===================== */
export async function processFiles(zip, settings = null) {
  const toast = window.showToast || (() => {});

  const useValidation =
    settings?.mcValidation ??
    document.getElementById("mcValidationToggle")?.checked ??
    false;

  const minifyJSON =
    settings?.minifyJson ??
    document.getElementById("jsonToggle")?.checked ??
    false;

  const obfuscateJSON =
    settings?.obfuscateJson ??
    document.getElementById("jsonObfToggle")?.checked ??
    false;

  const obfuscateJS =
    settings?.obfuscateJs ??
    document.getElementById("jsToggle")?.checked ??
    false;

  const convertPngToTga =
    settings?.pngToTga ??
    document.getElementById("pngToTgaToggle")?.checked ??
    false;

  const jsLevel =
    settings?.jsLevel ??
    document.querySelector('input[name="jsLevel"]:checked')?.value ??
    "light";

  const newZip = new JSZip();

  for (const path in zip.files) {
    const file = zip.files[path];
    if (file.dir) continue;

    let content;

    /* ---------- BIN ---------- */
    if (path.match(/\.(png|jpg|jpeg|ogg|wav|mp3|fsb)$/i)) {
      if (
        convertPngToTga &&
        !useValidation &&                 // 🔒 VALIDATION = NO TGA
        path.toLowerCase().endsWith(".png")
      ) {
        try {
          const buffer = await file.async("arraybuffer");
          const tgaData = await pngToTga(buffer);
          newZip.file(path.replace(/\.png$/i, ".tga"), tgaData);
        } catch {
          newZip.file(path, await file.async("uint8array"));
        }
      } else {
        newZip.file(path, await file.async("uint8array"));
      }
      continue;
    }

    /* ---------- TEXT ---------- */
    content = await file.async("string");

    // JS
    if (path.endsWith(".js") && obfuscateJS) {
      if (useValidation) {
        try {
          content = addMinecraftValidation(content);
        } catch {}
      }
      content = obfuscateJS_func(content, jsLevel);
    }

    // JSON (⚠️ excluir JSON críticos de Minecraft)
    if (
      path.endsWith(".json") &&
      (minifyJSON || obfuscateJSON) &&
      !/manifest\.json$/i.test(path) &&
      !/material/i.test(path) &&
      !/terrain_texture\.json$/i.test(path) &&
      !/item_texture\.json$/i.test(path)
    ) {
      try {
        let parsed = JSON.parse(content);
        if (obfuscateJSON) {
          parsed = obfuscateJsonUnicodeSafe(parsed);
        }
        content = JSON.stringify(parsed);
      } catch {}
    }

    newZip.file(path, content);
  }

  const blob = await newZip.generateAsync({ type: "blob" });
  download(blob);
  return true;
}

/* =====================
JS OBFUSCATOR
===================== */
function obfuscateJS_func(code, level) {
  if (level !== "light" && typeof JavaScriptObfuscator === "undefined") {
    level = "light";
  }

  if (code.includes("_0x")) return code;

  const header = "/* Creator of the Nyrox obfuscator */";

  if (level === "light") {
    const body = code
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "")
      .replace(/\s*\n\s*/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();

    return header + "\n" + body;
  }

  try {
    const obf = JavaScriptObfuscator
      .obfuscate(code, OBFUSCATION_LEVELS[level])
      .getObfuscatedCode();

    return header + "\n" + obf;
  } catch {
    return obfuscateJS_func(code, "light");
  }
}

/* =====================
DOWNLOAD
===================== */
function download(blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "obfuscate_addon.zip";
  a.click();
  URL.revokeObjectURL(url);
}
