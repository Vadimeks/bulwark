import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Прыгожыя назвы палёў з твайго JSON
const labels = {
  user_name: "👤 Імя",
  user_status: "🎖 Статус",
  user_contact: "📱 Кантакт",
  user_needs: "📝 Патрэба",
  org_name: "🏢 Арганізацыя",
  contact: "📱 Кантакт",
  message: "💬 Паведамленне",
};

app.post("/api/contact", async (req, res) => {
  const { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID } = process.env;

  try {
    const { formName, formData } = req.body;

    // Вызначаем загаловак у залежнасці ад формы
    const title =
      formName === "Стаць партнёрам"
        ? "🤝 НОВАЯ ПРАПАНОВА ПАРТНЁРСТВА"
        : "🆘 ЗАПЫТ НА ДАПАМОГУ";

    const lines = Object.entries(formData).map(([key, value]) => {
      const label = labels[key] || key;
      return `<b>${label}:</b> ${value}`;
    });

    const messageText = `<b>${title}</b>\n\n` + lines.join("\n");

    const tgResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: messageText,
          parse_mode: "HTML",
        }),
      },
    );

    return res
      .status(tgResponse.ok ? 200 : 500)
      .json({ success: tgResponse.ok });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
});

export default app;
