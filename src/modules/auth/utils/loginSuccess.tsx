import { useSession } from "next-auth/react";

async function enviarCorreo() {
  const email = "usuario@ejemplo.com";
  const asunto = "Bienvenido a Metrofem";
  const mensajeHtml = `
    <div style="font-family: Arial; text-align: center;">
      <h1>¡Bienvenido, ${email}!</h1>
      <p>Gracias por unirte a <b>Metrofem</b>.</p>
      <p>Haz clic abajo para ir al dashboard:</p>
      <a href="https://tuapp.com/dashboard" style="padding: 10px 20px; background: #6b46c1; color: white; text-decoration: none; border-radius: 8px;">Ir al dashboard</a>
    </div>
  `;

  await fetch("/api/sendEmail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, asunto, mensajeHtml }),
  });
}
