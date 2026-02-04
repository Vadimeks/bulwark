import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export function initReportsSlider() {
  const reportsContainer = document.querySelector(".reports-slider");
  if (reportsContainer) {
    new Swiper(reportsContainer, {
      modules: [Navigation],
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      navigation: {
        nextEl: ".reports-next",
        prevEl: ".reports-prev",
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  }
}
