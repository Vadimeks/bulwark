import { t } from "./i18n.js";

const API_URL = import.meta.env.VITE_API_URL || "";

export function initForms() {
  setupForm("help-form", "Дапамога добраахвотнікам");
  setupForm("partners-form", "Стаць партнёрам");

  // --- Жывая валідацыя Дапамогі ---
  const helpForm = document.getElementById("help-form");
  if (helpForm) {
    const inputs = {
      name: helpForm.querySelector('[name="user_name"]'),
      status: helpForm.querySelector('[name="user_status"]'),
      needs: helpForm.querySelector('[name="user_needs"]'),
    };
    const steps = {
      2: document.getElementById("help-step-2"),
      3: document.getElementById("help-step-3"),
      4: document.getElementById("help-step-4"),
    };

    helpForm.addEventListener("input", () => {
      if (inputs.name.value.trim().length >= 2)
        steps[2]?.classList.remove("opacity-40", "pointer-events-none");
      else steps[2]?.classList.add("opacity-40", "pointer-events-none");

      if (inputs.status.value !== "")
        steps[3]?.classList.remove("opacity-40", "pointer-events-none");
      if (inputs.needs.value.trim().length >= 10)
        steps[4]?.classList.remove("opacity-40", "pointer-events-none");
    });
  }

  // --- Жывая валідацыя Партнёраў ---
  const partnersForm = document.getElementById("partners-form");
  if (partnersForm) {
    const inputs = {
      org: partnersForm.querySelector('[name="org_name"]'),
      contact: partnersForm.querySelector('[name="contact"]'),
    };
    const steps = {
      2: document.getElementById("partner-step-2"),
      3: document.getElementById("partner-step-3"),
    };

    partnersForm.addEventListener("input", () => {
      if (inputs.org.value.trim().length >= 2)
        steps[2]?.classList.remove("opacity-40", "pointer-events-none");
      else steps[2]?.classList.add("opacity-40", "pointer-events-none");

      if (inputs.contact.validity.valid && inputs.contact.value.length > 3) {
        steps[3]?.classList.remove("opacity-40", "pointer-events-none");
      }
    });
  }
}

function setupForm(formId, formDisplayName) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const loader = form.querySelector(".loader-icon");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // 1. Уключаем візуал загрузкі
    btn.disabled = true;
    btn.classList.add("opacity-50", "cursor-not-allowed");
    if (loader) {
      loader.classList.remove("hidden");
      loader.style.display = "inline-block";
    }

    // 2. ВЫКЛІКАЕМ адпраўку (вось тут была памылка)
    const success = await sendToBackend(formDisplayName, data);

    // 3. Рэакцыя на вынік
    if (success) {
      showToast(t("footer.form_success") || "Дзякуй! Мы з вамі звяжамся.");
      form.reset();
    } else {
      showToast(
        t("footer.form_error") || "Памылка адпраўкі. Паспрабуйце пазней.",
        "error",
      );
    }

    // 4. Выключаем візуал загрузкі
    btn.disabled = false;
    btn.classList.remove("opacity-50", "cursor-not-allowed");
    if (loader) {
      loader.classList.add("hidden");
      loader.style.display = "none";
    }
  });
}

// Асобная функцыя адпраўкі (адзіная на ўвесь файл)
async function sendToBackend(formName, formData) {
  try {
    // Калі мы на Vercel, API_URL будзе пустым радам, і запыт пойдзе на /api/contact
    const response = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formName, formData }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server responded with error:", errorText);
    }

    return response.ok;
  } catch (error) {
    console.error("Backend connection error:", error);
    return false;
  }
}

function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    Object.assign(container.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: "1000",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    });
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.innerText = message;
  const color = type === "success" ? "#059669" : "#dc2626";
  Object.assign(toast.style, {
    background: "#1a1a1a",
    color: "white",
    padding: "12px 20px",
    borderLeft: `5px solid ${color}`,
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "all 0.4s ease",
    opacity: "0",
    transform: "translateX(20px)",
  });

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(0)";
  }, 10);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}
