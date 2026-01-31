const translations = {
  en: {
    badge: "Minecraft Fixed Edition",
    title: "Nyrox Obfuscator",
    heroText:
      "Professional and secure code obfuscation for Minecraft Bedrock addons. Protect your JavaScript and JSON files without breaking compatibility",
    enter: "Enter",
    faqTitle: "Frequently Asked Questions",
    faq1q: "What file types are supported?",
    faq1a:
      "JavaScript and JSON files used in Minecraft Bedrock behavior and resource packs",
    faq2q: "Will this break my addons?",
    faq2a:
      "No. The obfuscation process is designed to preserve full Bedrock compatibility",
    faq3q: "Does everything run locally?",
    faq3a:
      "Yes. All processing is done locally in your browser for maximum privacy"
  },

  es: {
    badge: "Minecraft Fixed Edition",
    title: "Nyrox Obfuscator",
    heroText:
      "Ofuscacion de código profesional y segura para addons de Minecraft Bedrock. Protege tus archivos JavaScript y JSON sin romper la compatibilidad",
    enter: "Entrar",
    faqTitle: "Preguntas Frecuentes",
    faq1q: "¿Qué tipos de archivos son compatibles?",
    faq1a:
      "Archivos JavaScript y JSON utilizados en packs de comportamiento y recursos de Minecraft Bedrock",
    faq2q: "¿Esto puede romper mis addons?",
    faq2a:
      "No. El proceso de ofuscacion está diseñado para mantener compatibilidad total con Bedrock",
    faq3q: "¿Todo se ejecuta localmente?",
    faq3a:
      "Sí. Todo el procesamiento se realiza localmente en tu navegador para mayor privacidad"
  }
};

function setLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  localStorage.setItem("lang", lang);
}

const switcher = document.getElementById("languageSwitcher");
const savedLang = localStorage.getItem("lang") || "en";
switcher.value = savedLang;
setLanguage(savedLang);

switcher.addEventListener("change", e => {
  setLanguage(e.target.value);
});