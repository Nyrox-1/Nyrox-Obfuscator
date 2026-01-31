import { loadZipFile } from "./fileLoader.js";
import { renderTree } from "./treeView.js";
import { processFiles } from "./obfuscator.js";

/* =====================
   TOAST
===================== */
function showToast(message, type = "error") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

window.showToast = showToast;

/* =====================
   ELEMENTS
===================== */
const fileInput = document.getElementById("fileInput");
const uploadZone = document.getElementById("uploadZone");
const mainContent = document.getElementById("mainContent");
const processBtn = document.getElementById("processBtn");

let zipData = null;

/* =====================
   UPLOAD
===================== */

uploadZone.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {

    zipData = await loadZipFile(file);
    renderTree(zipData);

    uploadZone.classList.add("loaded");
    mainContent.classList.add("enabled");

    processBtn.disabled = false;

    showToast("ZIP loaded", "success");

  } catch (error) {
    showToast("Error loading ZIP file", "error");
    console.error(error);
  }
});

/* =====================
   READ SETTINGS
===================== */

function getSettings() {
  return {
    pngToTga: document.getElementById("pngToTgaToggle")?.checked ?? false,
    minifyJson: document.getElementById("jsonToggle")?.checked ?? false,
    obfuscateJson: document.getElementById("jsonObfToggle")?.checked ?? false,
    obfuscateJs: document.getElementById("jsToggle")?.checked ?? false,
    mcValidation: document.getElementById("mcValidationToggle")?.checked ?? false,
    jsLevel:
      document.querySelector("input[name='jsLevel']:checked")?.value ??
      "balanced"
  };
}

/* =====================
   PROCESS BUTTON
===================== */

processBtn.addEventListener("click", async () => {

  if (!zipData) {
    showToast("No ZIP loaded", "error");
    return;
  }

  const settings = getSettings();

  processBtn.disabled = true;
  processBtn.style.opacity = "0.6";

  try {

    const ok = await processFiles(zipData, settings);

    // ⚠️ solo mostrar success si realmente procesó
    if (ok === true) {
      showToast("ZIP generated successfully", "success");
    }

  } catch (error) {
    console.error(error);
    showToast("Error processing files", "error");

  } finally {
    processBtn.disabled = false;
    processBtn.style.opacity = "1";
  }
});

/* =====================
   SETTINGS COLLAPSE
===================== */

document.querySelectorAll(".settings-header").forEach(header => {
  header.addEventListener("click", () => {
    header.parentElement.classList.toggle("open");
  });
});

/* =====================
   RADIO SELECT
===================== */

document.querySelectorAll(".radio-option").forEach(option => {
  option.addEventListener("click", () => {

    const group = option.closest(".settings-content");

    group.querySelectorAll(".radio-option")
      .forEach(o => o.classList.remove("selected"));

    option.classList.add("selected");
    option.querySelector("input").checked = true;
  });
});

/* =====================
   JS LEVEL LOCK
===================== */

const jsToggle = document.getElementById("jsToggle");
const jsLevelPanel = document.querySelector(".settings-section:nth-child(2)");

if (jsToggle && jsLevelPanel) {

  function updateJsLevelState() {
    jsLevelPanel.style.opacity = jsToggle.checked ? "1" : "0.5";
    jsLevelPanel.style.pointerEvents = jsToggle.checked ? "auto" : "none";
  }

  jsToggle.addEventListener("change", updateJsLevelState);
  updateJsLevelState();
}
