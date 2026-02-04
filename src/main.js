import "./css/main.css";
import { initHeader } from "./js/header.js";
import { initLanguageSwitcher } from "./js/i18n.js";
// 1. Імпартуем ініцыялізацыю слайдэраў
import { initNewsSlider } from "./js/news.js";
import { initReportsSlider } from "./js/reports.js";
// import { initMaterialsSliders } from "./js/materials.js";

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initLanguageSwitcher();
  initNewsSlider();
  initReportsSlider();
});
