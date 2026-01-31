import "./css/main.css";

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const openBtn = document.getElementById("open-sidebar");
  const closeBtn = document.getElementById("close-sidebar");
  const mobileBtn = document.getElementById("mobile-menu-btn");

  // Элементы для выпадаючага меню моў
  const langDropdown = document.querySelector(".dropdown-lang");
  const langBtn = langDropdown?.querySelector("button");

  function openSidebar() {
    sidebar.classList.remove("translate-x-full");
    overlay.classList.remove("hidden");
    setTimeout(() => overlay.classList.remove("opacity-0"), 10);
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    sidebar.classList.add("translate-x-full");
    overlay.classList.add("opacity-0");
    setTimeout(() => {
      if (sidebar.classList.contains("translate-x-full")) {
        overlay.classList.add("hidden");
      }
    }, 300);
    document.body.style.overflow = "";
  }

  // Функцыя для моў
  function toggleLang(e) {
    e.stopPropagation(); // Каб клік не пракідаўся далей на document
    langDropdown.classList.toggle("is-active");
  }

  openBtn?.addEventListener("click", openSidebar);
  mobileBtn?.addEventListener("click", openSidebar);
  closeBtn?.addEventListener("click", closeSidebar);
  overlay?.addEventListener("click", closeSidebar);

  // Клік па кнопцы мовы
  langBtn?.addEventListener("click", toggleLang);

  // Закрыццё ўсяго лішняга пры кліку па-за межамі
  document.addEventListener("click", (e) => {
    if (!langDropdown?.contains(e.target)) {
      langDropdown?.classList.remove("is-active");
    }
  });
});
