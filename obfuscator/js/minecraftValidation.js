export function addMinecraftValidation(code) {
  const validation = `
/* Nyrox Protection */
if (typeof world === "undefined") {
  console.warn("Nyrox: Invalid environment");
}
`;

  if (code.trim().startsWith("import")) {
    const lines = code.split("\n");
    let lastImport = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("import")) {
        lastImport = i;
      }
    }

    lines.splice(lastImport + 1, 0, validation);
    return lines.join("\n");
  }

  return validation + "\n" + code;
}