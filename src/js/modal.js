/**
 * Універсальная мадалка для матэрыялаў і навін
 */

export function openUniversalModal(item) {
  const modal = document.getElementById("material-modal");
  const modalContent = document.getElementById("modal-content");
  const modalTitle = document.getElementById("modal-title");
  const modalMeta = document.getElementById("modal-meta");
  const modalInternalNav = document.getElementById("modal-internal-nav");
  const scrollContainer = modal?.querySelector(".overflow-y-auto");

  if (!modal || !modalContent) return;

  // 1. Напаўняем асноўны кантэнт
  modalMeta.innerText = item.date
    ? item.date
    : item.category
      ? "#" + item.category
      : "";
  modalTitle.innerText = item.title;
  modalContent.innerHTML = item.content;

  // 2. Генерацыя ўнутранай навігацыі па h3
  if (modalInternalNav) {
    const headings = modalContent.querySelectorAll("h3");

    if (headings.length > 0) {
      modalInternalNav.innerHTML = Array.from(headings)
        .map((h3, index) => {
          const anchorId = `nav-anchor-${index}`;
          h3.id = anchorId; // Прысвойваем ID кожнаму загалоўку
          return `
                        <button data-anchor="${anchorId}" 
                                class="text-[10px] md:text-[11px] uppercase font-bold tracking-[0.2em] text-white/40 hover:text-red-600 transition-all py-1">
                            ${h3.innerText}
                        </button>
                    `;
        })
        .join("");

      modalInternalNav.classList.remove("hidden");

      // Апрацоўка клікаў па навігацыі ўнутры мадалкі
      modalInternalNav.onclick = (e) => {
        const btn = e.target.closest("button");
        if (btn) {
          const target = document.getElementById(btn.dataset.anchor);
          if (target && scrollContainer) {
            scrollContainer.scrollTo({
              top: target.offsetTop - 20,
              behavior: "smooth",
            });
          }
        }
      };
    } else {
      modalInternalNav.classList.add("hidden");
      modalInternalNav.innerHTML = "";
    }
  }

  // 3. Адкрыццё мадалкі
  modal.classList.remove("hidden");
  if (scrollContainer) scrollContainer.scrollTo(0, 0); // Скідваем скрол уверх
  document.body.style.overflow = "hidden";

  // Абнаўляем пераклады (калі выкарыстоўваецца глабальная функцыя)
  if (window.updateContent) window.updateContent();
}

export function closeUniversalModal() {
  const modal = document.getElementById("material-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

export function initModalControl() {
  const modal = document.getElementById("material-modal");
  if (!modal) return;

  // Кнопкі закрыцця
  const closeBtn = document.getElementById("close-modal");
  const closeTextBtn = document.getElementById("close-modal-text");

  if (closeBtn) closeBtn.onclick = closeUniversalModal;
  if (closeTextBtn) closeTextBtn.onclick = closeUniversalModal;

  // Закрыццё па кліку на оверлэй (па-за межамі кантэйнера)
  modal.onclick = (e) => {
    if (e.target === modal || e.target.classList.contains("modal-overlay")) {
      closeUniversalModal();
    }
  };

  // Друк
  const printBtn = document.getElementById("print-material");
  if (printBtn) {
    printBtn.onclick = () => window.print();
  }

  // Капіяванне
  const copyBtn = document.getElementById("copy-material");
  if (copyBtn) {
    copyBtn.onclick = async () => {
      const content = document.getElementById("modal-content").innerText;
      try {
        await navigator.clipboard.writeText(content);
        const copyTextSpan = document.getElementById("copy-text");
        if (copyTextSpan) {
          const originalText = copyTextSpan.innerText;
          copyTextSpan.innerText = "COPIED!";
          setTimeout(() => {
            copyTextSpan.innerText = originalText;
            if (window.updateContent) window.updateContent();
          }, 2000);
        }
      } catch (err) {
        console.error("Не ўдалося скапіяваць:", err);
      }
    };
  }
}
