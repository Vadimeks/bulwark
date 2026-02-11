import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { openUniversalModal } from "./modal.js";

// Зменная за межамі функцый, каб мець доступ да інстансу
let swiperInstance = null;

export async function initNewsSlider() {
  const sliderWrapper = document.querySelector(".news-slider .swiper-wrapper");
  if (!sliderWrapper) return;

  try {
    const response = await fetch("/data/news.json");
    const allNews = await response.json();

    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split(".").map(Number);
      return new Date(year, month - 1, day);
    };

    const sortedNews = allNews.sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateB - dateA || b.id - a.id;
    });

    const latestNews = sortedNews.slice(0, 3);

    sliderWrapper.innerHTML = latestNews
      .map(
        (news) => `
        <div class="swiper-slide h-auto flex">
          <div class="bg-black/20 border border-white/5 h-full flex flex-col hover:border-red-600/30 transition-all group w-full">
            <div class="aspect-video bg-black/40 flex items-center justify-center p-8 overflow-hidden relative">
              <img src="/src/assets/img/logo.svg" alt="Logo" class="w-20 opacity-20 group-hover:scale-110 transition-transform duration-500">
            </div>
            <div class="p-6 flex flex-col grow">
              <span class="text-red-600 text-[10px] font-bold uppercase tracking-widest mb-2">${news.date}</span>
              <h4 class="text-white font-bold mb-3 line-clamp-2 italic uppercase text-sm tracking-widest group-hover:text-red-600 transition-colors">
                ${news.title}
              </h4>
              <p class="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                ${news.excerpt}
              </p>
              <button class="open-news-btn mt-auto text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-red-600 transition-all" 
                      data-id="${news.id}">
                <span data-i18n="news.read_more">Чытаць цалкам</span>
                <i class="fa-solid fa-chevron-right text-[8px]"></i>
              </button>
            </div>
          </div>
        </div>
      `,
      )
      .join("");

    // Дадаем слухач для адкрыцця мадалкі
    sliderWrapper.addEventListener("click", (e) => {
      const btn = e.target.closest(".open-news-btn");
      if (btn) {
        const newsItem = allNews.find(
          (n) => String(n.id) === String(btn.dataset.id),
        );
        if (newsItem) openUniversalModal(newsItem);
      }
    });

    // Запускаем кіраванне свайперам
    manageSwiper();
    window.addEventListener("resize", manageSwiper);
  } catch (error) {
    console.error("Памылка загрузкі навін:", error);
  }
}

function manageSwiper() {
  const sliderElement = document.querySelector(".news-slider");
  if (!sliderElement) return;

  const isDesktop = window.innerWidth >= 1280;

  if (isDesktop) {
    if (swiperInstance) {
      swiperInstance.destroy(true, true);
      swiperInstance = null;
      // Дапамагаем браўзеру пералічыць сетку
      window.dispatchEvent(new Event("resize"));
    }
  } else {
    if (!swiperInstance) {
      swiperInstance = new Swiper(".news-slider", {
        modules: [Navigation],
        slidesPerView: 1,
        spaceBetween: 16,
        navigation: {
          nextEl: ".news-next",
          prevEl: ".news-prev",
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
        },
      });
    }
  }
}
