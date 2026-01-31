export async function loadZipFile(file) {
  return await JSZip.loadAsync(file);
}