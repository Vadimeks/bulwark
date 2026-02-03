import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export function initMaterialsSliders() {
  // Ініцыялізацыя НАВІН
  const newsContainer = document.querySelector(".news-slider");
  if (newsContainer) {
    new Swiper(newsContainer, {
      modules: [Navigation],
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      navigation: {
        nextEl: ".news-next",
        prevEl: ".news-prev",
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  }

  // Ініцыялізацыя СПРАВАЗДАЧ
  const reportsContainer = document.querySelector(".reports-slider");
  if (reportsContainer) {
    new Swiper(reportsContainer, {
      modules: [Navigation],
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      navigation: {
        nextEl: ".reports-next", // Упэўніся, што тут унікальны клас
        prevEl: ".reports-prev", // Упэўніся, што тут унікальны клас
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  }
}
