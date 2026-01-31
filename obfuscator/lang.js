const translations = {
  en: {
    // Top Bar
    back: "Back",
    
    // Header
    badge_protection: "Professional Protection",
    title: "Nyrox Obfuscator",
    subtitle: "Advanced security and obfuscation system designed to protect Minecraft Bedrock addons, ensuring code integrity, structural validation, and resistance against reverse engineering",
    
    // Upload
    upload_title: "Click to upload ZIP file",
    upload_hint: "Supports Behavior Pack (BP) and Resource Pack (RP) nested structures",
    
    // File Structure
    file_structure: "File Structure",
    legend_obfuscable: "Obfuscable",
    legend_readonly: "Read-only",
    legend_protected: "Protected",
    
    // Settings
    settings_obfuscation: "Obfuscation Settings",
    opt_minify_json: "Minify JSON",
    opt_obfuscate_js: "Obfuscate JavaScript",
    opt_mc_validation: "Minecraft Validation",
    
    settings_js_level: "JS Obfuscation Level",
    js_light: "Light",
    js_light_desc: "Minify only",
    js_balanced: "Balanced",
    js_balanced_desc: "Recommended for Minecraft Bedrock addons",
    js_heavy: "Heavy",
    js_heavy_desc: "Maximum protection",
    
    // Button
    generate_zip: "Generate Protected ZIP",
    
    // Toast Messages
    toast_no_zip: "No ZIP file loaded",
    toast_no_files: "No supported files found",
    toast_json_error: "JSON error in file",
    toast_processing: "Processing files...",
    toast_success: "ZIP generated successfully"
  },

  es: {
    // Top Bar
    back: "Volver",
    
    // Header
    badge_protection: "Proteccion Profesional",
    title: "Nyrox Obfuscator",
    subtitle: "Sistema avanzado de seguridad y ofuscación diseñado para proteger addons de Minecraft Bedrock, garantizando la integridad del código, validación estructural y resistencia contra ingeniería inversa",
    
    // Upload
    upload_title: "Haz clic para subir archivo ZIP",
    upload_hint: "Compatible con estructuras unidas de Behavior Pack (BP) y Resource Pack (RP)",
    
    // File Structure
    file_structure: "Estructura de Archivos",
    legend_obfuscable: "Ofuscable",
    legend_readonly: "Solo lectura",
    legend_protected: "Protegido",
    
    // Settings
    settings_obfuscation: "Configuración de Ofuscación",
    opt_minify_json: "Minificar JSON",
    opt_obfuscate_js: "Ofuscar JavaScript",
    opt_mc_validation: "Validación de Minecraft",
    
    settings_js_level: "Nivel de Ofuscación JS",
    js_light: "Ligero",
    js_light_desc: "Solo minificación",
    js_balanced: "Equilibrado",
    js_balanced_desc: "Recomendado para addons de Minecraft Bedrock",
    js_heavy: "Pesado",
    js_heavy_desc: "Protección máxima",
    
    // Button
    generate_zip: "Generar ZIP Protegido",
    
    // Toast Messages
    toast_no_zip: "No hay archivo ZIP cargado",
    toast_no_files: "No se encontraron archivos compatibles",
    toast_json_error: "Error de JSON en archivo",
    toast_processing: "Procesando archivos...",
    toast_success: "ZIP generado exitosamente"
  }
};

function setLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  localStorage.setItem("lang", lang);
}

// Detectar idioma guardado o del panel principal
const switcher = document.getElementById("languageSwitcher");
const savedLang = localStorage.getItem("lang") || "en";
switcher.value = savedLang;
setLanguage(savedLang);

switcher.addEventListener("change", e => {
  setLanguage(e.target.value);
});

// Exportar función para usar en mensajes dinámicos
window.getTranslation = function(key) {
  const currentLang = localStorage.getItem("lang") || "en";
  return translations[currentLang][key] || key;
};
