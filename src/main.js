import "./css/main.css";
import { initHeader } from "./js/header.js";
import { initLanguageSwitcher } from "./js/i18n.js";
// 1. Імпартуем ініцыялізацыю слайдэраў
import { initMaterialsSliders } from "./js/materials.js";

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initLanguageSwitcher();
  // 2. Выклікаем функцыю для матэрыялаў
  initMaterialsSliders();
});
