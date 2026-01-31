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
    tgaPixels[i] = pixels[i + 2];
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
Unicode JSON OBFUSCATION
===================== */
function escapeUnicode(str) {
  let out = "";
  for (let i = 0; i < str.length; i++) {
    out += "\\u" + str.charCodeAt(i).toString(16).padStart(4, "0");
  }
  return out;
}

function obfuscateJsonUnicode(obj) {
  if (Array.isArray(obj)) {
    return obj.map(obfuscateJsonUnicode);
  }
  if (obj && typeof obj === "object") {
    const out = {};
    for (const key of Object.keys(obj)) {
      const newKey = escapeUnicode(key);
      out[newKey] = obfuscateJsonUnicode(obj[key]);
    }
    return out;
  }
  if (typeof obj === "string") {
    return escapeUnicode(obj);
  }
  return obj;
}

/* =====================
OBF LEVELS
===================== */
const OBFUSCATION_LEVELS = {
  balanced: {
    compact: true,
    stringArray: true,
    stringArrayEncoding: ["base64"],
    stringArrayThreshold: 0.7,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    renameGlobals: false
  },

  heavy: {
    compact: true,
    stringArray: true,
    stringArrayEncoding: ["base64"],
    stringArrayThreshold: 1,
    controlFlowFlattening: true,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 1.2,
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

  if (!obfuscateJS && !minifyJSON && !obfuscateJSON && !convertPngToTga) {
    toast("Nothing to process — enable JS / JSON / PNG", "error");
    return false;
  }

  const newZip = new JSZip();

  for (const path in zip.files) {
    try {
      const file = zip.files[path];
      if (file.dir) continue;

      let content;

      /* ---------- BIN ---------- */
      if (path.match(/\.(png|jpg|jpeg|ogg|wav|mp3|fsb)$/i)) {
        if (convertPngToTga && path.toLowerCase().endsWith(".png")) {
          const buffer = await file.async("arraybuffer");
          try {
            const tgaData = await pngToTga(buffer);
            newZip.file(path.replace(/\.png$/i, ".tga"), tgaData);
          } catch {
            newZip.file(path, buffer);
          }
        } else {
          content = await file.async("uint8array");
          newZip.file(path, content);
        }
        continue;
      }

      /* ---------- TEXT ---------- */
      content = await file.async("string");

      // JS
      if (path.endsWith(".js") && obfuscateJS) {
        if (useValidation) {
          try { content = addMinecraftValidation(content); } catch {}
        }
        content = obfuscateJS_func(content, jsLevel);
      }

      // JSON (todos)
      if (path.endsWith(".json") && (minifyJSON || obfuscateJSON)) {
        try {
          let parsed = JSON.parse(content);

          if (obfuscateJSON) {
            parsed = obfuscateJsonUnicode(parsed);
          }

          content = JSON.stringify(parsed);
        } catch {
          console.warn("Invalid JSON skipped:", path);
        }
      }

      newZip.file(path, content);

    } catch (err) {
      console.error("File failed:", path, err);
    }
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

  const header = "/* Creator of the Nyrox obfuscator*/";

  if (level === "light") {
    const body = code
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "")
      .replace(/\s*\n\s*/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();

    return [header, body].join("\n");
  }

  try {
    const obf = JavaScriptObfuscator
      .obfuscate(
        code,
        OBFUSCATION_LEVELS[level] || OBFUSCATION_LEVELS.balanced
      )
      .getObfuscatedCode();

    return [header, obf].join("\n");
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