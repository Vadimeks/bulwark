export function initHeader() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  // const openBtn = document.getElementById("open-sidebar");
  const closeBtn = document.getElementById("close-sidebar");
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const header = document.getElementById("main-header");
  const homeLink = document.getElementById("home-link");
  const langDropdown = document.getElementById("lang-dropdown");
  const langBtn = document.getElementById("lang-btn");

  // --- МОВЫ ---
  function toggleLang(e) {
    e.preventDefault();
    // Прыбралі stopPropagation, каб i18n.js мог злавіць падзею
    langDropdown?.classList.toggle("is-active");
  }

  langDropdown?.addEventListener("click", (e) => {
    if (e.target.closest(".lang-switch")) {
      langDropdown.classList.remove("is-active");
    }
  });

  document.addEventListener("click", (e) => {
    if (langDropdown && !langDropdown.contains(e.target)) {
      langDropdown.classList.remove("is-active");
    }
  });

  // --- САЙДБАР ---
  function openSidebar() {
    sidebar?.classList.remove("translate-x-full");
    overlay?.classList.remove("hidden");
    setTimeout(() => overlay?.classList.remove("opacity-0"), 10);
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    sidebar?.classList.add("translate-x-full");
    overlay?.classList.add("opacity-0");
    setTimeout(() => {
      if (sidebar?.classList.contains("translate-x-full")) {
        overlay?.classList.add("hidden");
      }
    }, 300);
    document.body.style.overflow = "";
  }

  sidebar?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeSidebar);
  });

  // --- СКРОЛ ---
  function handleScroll() {
    const isScrolled = window.scrollY > 300;
    homeLink?.classList.toggle("opacity-0", !isScrolled);
    homeLink?.classList.toggle("translate-x-5", !isScrolled);
    homeLink?.classList.toggle("pointer-events-none", !isScrolled);
    homeLink?.classList.toggle("opacity-100", isScrolled);
    homeLink?.classList.toggle("translate-x-0", isScrolled);

    if (isScrolled) {
      header?.classList.remove("bg-[#1a1a1a]");
      header?.classList.add("bg-black/60", "backdrop-blur-md", "shadow-2xl");
    } else {
      header?.classList.add("bg-[#1a1a1a]");
      header?.classList.remove("bg-black/60", "backdrop-blur-md", "shadow-2xl");
    }
  }

  window.addEventListener("scroll", handleScroll);
  // openBtn?.addEventListener("click", openSidebar);
  mobileBtn?.addEventListener("click", openSidebar);
  closeBtn?.addEventListener("click", closeSidebar);
  overlay?.addEventListener("click", closeSidebar);
  langBtn?.addEventListener("click", toggleLang);

  handleScroll();
}
