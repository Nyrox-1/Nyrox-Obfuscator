const container = document.getElementById("treeContainer");

export function renderTree(zip) {
  container.innerHTML = "";

  if (!zip || !zip.files) {
    console.error("No zip files found");
    return;
  }

  const paths = Object.keys(zip.files);
  const maxVisible = 10;

  paths.forEach((path, index) => {
    const file = zip.files[path];

    const div = document.createElement("div");
    div.className = "tree-item";
    
    if (index >= maxVisible) {
      div.classList.add("tree-item-hidden");
    }

    if (file.dir) {
      div.classList.add("folder");
      div.innerHTML = `
        <svg class="tree-file-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.906 9c.382 0 .749.057 1.094.162V9a3 3 0 0 0-3-3h-3.879a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H6a3 3 0 0 0-3 3v3.162A3.756 3.756 0 0 1 4.094 9h15.812ZM4.094 10.5a2.25 2.25 0 0 0-2.227 2.568l.857 6A2.25 2.25 0 0 0 4.951 21H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-2.227-2.568H4.094Z" />
        </svg>
        ${path}
      `;
    } else {
      div.classList.add("file");

      if (path.endsWith(".js")) {
        div.classList.add("obfuscable");
        div.innerHTML = `
          <svg class="tree-file-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm14.25 6a.75.75 0 0 1-.22.53l-2.25 2.25a.75.75 0 1 1-1.06-1.06L15.44 12l-1.72-1.72a.75.75 0 1 1 1.06-1.06l2.25 2.25c.141.14.22.331.22.53Zm-10.28-.53a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 1 0 1.06-1.06L8.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-2.25 2.25Z" clip-rule="evenodd" />
          </svg>
          ${path}
        `;
      } else if (path.endsWith(".json")) {
        div.classList.add("obfuscable");
        div.innerHTML = `
          <svg class="tree-file-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clip-rule="evenodd" />
            <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
          </svg>
          ${path}
        `;
      } else if (path.endsWith(".png") || path.endsWith(".jpg") || path.endsWith(".jpeg")) {
        div.classList.add("protected");
        div.innerHTML = `
          <svg class="tree-file-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clip-rule="evenodd" />
          </svg>
          ${path}
        `;
      } else {
        div.innerHTML = `
          <svg class="tree-file-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Z" clip-rule="evenodd" />
            <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
          </svg>
          ${path}
        `;
      }
    }

    container.appendChild(div);
  });

  if (paths.length > maxVisible) {
    const seeMoreBtn = document.createElement("button");
    seeMoreBtn.className = "tree-see-more";
    seeMoreBtn.innerHTML = `
      <span class="see-more-text">See more (${paths.length - maxVisible})</span>
      <svg class="see-more-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
      </svg>
    `;

    seeMoreBtn.addEventListener("click", () => {
      const isExpanded = seeMoreBtn.classList.contains("expanded");
      const allItems = container.querySelectorAll(".tree-item");

      if (isExpanded) {
        // Colapsar - ocultar items después del límite
        allItems.forEach((item, index) => {
          if (index >= maxVisible) {
            item.classList.add("tree-item-hidden");
          }
        });
        seeMoreBtn.classList.remove("expanded");
        seeMoreBtn.querySelector(".see-more-text").textContent = `See more (${paths.length - maxVisible})`;
        seeMoreBtn.querySelector(".see-more-icon").style.transform = "rotate(0deg)";
      } else {
        // Expandir - mostrar todos los items
        allItems.forEach(item => {
          item.classList.remove("tree-item-hidden");
        });
        seeMoreBtn.classList.add("expanded");
        seeMoreBtn.querySelector(".see-more-text").textContent = "See less";
        seeMoreBtn.querySelector(".see-more-icon").style.transform = "rotate(180deg)";
      }
    });

    container.appendChild(seeMoreBtn);
  }
}