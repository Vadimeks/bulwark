export async function initMaterials() {
  const container = document.getElementById("materials-container");
  const nav = document.getElementById("materials-nav");
  const modal = document.getElementById("material-modal");
  const modalContent = document.getElementById("modal-content");
  const closeBtn = document.getElementById("close-modal");
  const modalInternalNav = document.getElementById("modal-internal-nav");

  if (!container) return;

  try {
    const response = await fetch("/data/materials.json");
    const data = await response.json();

    // 1. Галоўная навігацыя (скрол да картак на старонцы)
    if (nav) {
      nav.innerHTML = data
        .map(
          (item) => `
          <button onclick="document.getElementById('${item.id}').scrollIntoView({ behavior: 'smooth', block: 'start' })"
                  class="px-4 py-2 border border-white/10 text-[10px] uppercase font-black tracking-widest text-white/50 hover:border-red-600 hover:text-white transition-all bg-black">
              #${item.category}
          </button>
      `,
        )
        .join("");
    }

    // 2. Генерацыя картак матэрыялаў
    container.innerHTML = data
      .map(
        (item) => `
        <div id="${item.id}" class="flex flex-col md:flex-row border border-white/5 bg-[#0a0a0a] hover:border-red-600/30 transition-all group scroll-mt-24">
            <div class="md:w-1/4 p-8 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-center bg-white/2">
                <span class="text-red-600 font-black uppercase italic text-2xl tracking-tighter">
                    ${item.category}
                </span>
            </div>
            <div class="md:w-3/4 p-8 flex flex-col justify-between">
                <div>
                    <h4 class="text-white font-bold mb-3 text-xl uppercase tracking-tight group-hover:text-red-600 transition-colors">
                        ${item.title}
                    </h4>
                    <p class="text-gray-500 text-sm mb-8 leading-relaxed line-clamp-2">
                        ${item.short}
                    </p>
                </div>
                <button class="read-more-btn text-white font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-3 hover:text-red-600 transition-all" 
                        data-id="${item.id}">
                    Чытаць матэрыял <i class="fa-solid fa-arrow-right text-[8px]"></i>
                </button>
            </div>
        </div>
    `,
      )
      .join("");

    // 3. Функцыя адкрыцця мадалкі
    const openModal = (id) => {
      const item = data.find((m) => m.id === id);
      if (item) {
        // Устаўляем кантэнт з адаптыўнымі загалоўкамі
        modalContent.innerHTML = `
            <div class="mb-10">
                <span class="text-red-600 font-bold uppercase tracking-widest text-[10px] md:text-xs">#${item.category}</span>
                <h2 class="text-2xl md:text-4xl lg:text-5xl font-black uppercase italic text-white mt-2 leading-none tracking-tighter wrap-break-words">
                    ${item.title}
                </h2>
            </div>
            <div class="material-text text-gray-300 mb-20">
                ${item.content}
            </div>
        `;

        // Аўтаматычная генерацыя ўнутранай навігацыі (Sticky Bottom)
        if (modalInternalNav) {
          // Шукаем усе h3, якія маюць id у кантэнце
          const headings = modalContent.querySelectorAll("h3[id]");

          if (headings.length > 0) {
            modalInternalNav.innerHTML = Array.from(headings)
              .map(
                (h3) => `
                <button data-anchor="${h3.id}" 
                        class="px-3 py-2 bg-black border border-white/10 text-[8px] md:text-[10px] uppercase font-black tracking-widest text-white/50 hover:text-red-600 hover:border-red-600 transition-all">
                  ${h3.innerText}
                </button>
              `,
              )
              .join("");

            modalInternalNav.classList.remove("hidden");

            // Дэлегаванне кліку для скролу ўнутры мадалкі
            modalInternalNav.onclick = (e) => {
              const btn = e.target.closest("button");
              if (btn) {
                const targetElement = document.getElementById(
                  btn.dataset.anchor,
                );
                const scrollContainer = modal.querySelector(".overflow-y-auto");
                if (targetElement && scrollContainer) {
                  scrollContainer.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: "smooth",
                  });
                }
              }
            };
          } else {
            modalInternalNav.innerHTML = "";
            modalInternalNav.classList.add("hidden");
          }
        }

        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
      }
    };

    // Слухачы падзей
    container.addEventListener("click", (e) => {
      const btn = e.target.closest(".read-more-btn");
      if (btn) openModal(btn.dataset.id);
    });

    const closeModal = () => {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    };

    closeBtn.onclick = closeModal;

    // Утыліты (Друк і Капіяванне)
    document.getElementById("print-material").onclick = () =>
      setTimeout(() => window.print(), 250);

    document.getElementById("copy-material").onclick = async () => {
      const copyTextSpan = document.getElementById("copy-text");
      await navigator.clipboard.writeText(modalContent.innerText);
      copyTextSpan.innerText = "Скапіявана!";
      setTimeout(() => (copyTextSpan.innerText = "Скапіяваць тэкст"), 2000);
    };

    // Закрыццё па кліку на фон
    modal.onclick = (e) => {
      if (
        e.target.id === "material-modal" ||
        e.target.classList.contains("container-custom")
      ) {
        closeModal();
      }
    };
  } catch (e) {
    console.error("Error loading materials:", e);
  }
}
