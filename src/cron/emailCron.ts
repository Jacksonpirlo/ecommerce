import cron, { type ScheduledTask } from "node-cron";
import { connectDB } from "../lib/db";
import { User } from "../database/models/User";// Si da error, prueba "../database/models/User.js"
import nodemailer from "nodemailer";

const globalForCron = globalThis as typeof globalThis & {
  aurinegroDailyEmail?: ScheduledTask;
  aurinegroDailyEmailRunning?: boolean;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendDailyEmailToUsers() {
  console.log("Iniciando envío de correos...");
  if (globalForCron.aurinegroDailyEmailRunning) return;
  globalForCron.aurinegroDailyEmailRunning = true;

  try {
    await connectDB();
    const users = await User.find({}, { email: 1, name: 1 }).lean();

    for (const user of users) {
      if (!user.email) continue;
      await transporter.sendMail({
        from: `"Plantas bonitas" <${process.env.MAIL_USER}>`,
        to: user.email,
        subject: "Recordatorio diario de Plantas bonitas",
        html: `
          <div style="font-family: Arial; text-align: center;">
            <h1>¡Hola, ${user.name}!</h1>
            <p>Este es tu email automático diario de <b>Plantas bonitas</b>.</p>
            <a href="${process.env.NEXT_PUBLIC_API_URL}/dashboard"
                style="padding: 10px 20px; background: #16a34a; color: white; text-decoration: none; border-radius: 8px;">
              Ir al dashboard
            </a>
          </div>
        `,
      });
      console.log(`Correo enviado a: ${user.email}`);
    }
    console.log("Correos diarios enviados a todos los usuarios");
  } catch (error) {
    console.error("Error en el cron job de email diario:", error);
  } finally {
    globalForCron.aurinegroDailyEmailRunning = false;
  }
}

// Ejecuta todos los días a las 9:50 AM (hora del servidor)
if (!globalForCron.aurinegroDailyEmail) {
  globalForCron.aurinegroDailyEmail = cron.schedule("00 9 * * *", sendDailyEmailToUsers);
  console.log("Cron job programado para las 9:50 AM.");
}

// Para pruebas, puedes llamar manualmente la función:
// sendDailyEmailToUsers();
