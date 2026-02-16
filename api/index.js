import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import rateLimit from "express-rate-limit";

const app = express();
app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());

const { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID } = process.env;

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: "Занадта шмат запытаў. Паспрабуйце пазней.",
  },
});

app.use("/api/contact", apiLimiter);

const fieldLabels = {
  user_name: "👤 Імя / Пазыўны",
  user_status: "🎖 Статус",
  user_needs: "📝 Патрэба",
  user_contact: "📱 Кантакт",
  org_name: "🏢 Арганізацыя / Імя",
  contact: "📱 Email / Telegram",
  message: "💬 Паведамленне",
};

app.post("/api/contact", async (req, res) => {
  try {
    const { formName, formData } = req.body;

    let header = "";
    if (formName.includes("Дапамога")) {
      header = "🆘 <b>ЗАПЫТ НА ДАПАМОГУ</b>";
    } else if (formName.includes("партнёр")) {
      header = "🤝 <b>НОВАЯ ПРАПАНОВА ПАРТНЁРСТВА</b>";
    } else {
      header = `📩 <b>НОВАЯ ЗАЯВА: ${formName}</b>`;
    }

    let messageText = `${header}\n\n`;

    for (const [key, value] of Object.entries(formData)) {
      const label = fieldLabels[key] || key;
      if (value) {
        messageText += `${label}: ${value}\n`;
      }
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: messageText,
        parse_mode: "HTML",
      }),
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const errorData = await response.json();
      console.error("TG Error:", errorData);
      return res.status(500).json({ success: false });
    }
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ success: false });
  }
});

// На Vercel не патрэбны app.listen, але экспарт абавязковы
export default app;
