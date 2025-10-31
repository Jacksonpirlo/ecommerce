import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const text = await req.text();

    if (!text) {
      return Response.json(
        { ok: false, error: "No se recibió body" },
        { status: 400 }
      );
    }

    const { email, asunto, mensajeHtml } = JSON.parse(text);

    if (!email || !asunto || !mensajeHtml) {
      return Response.json(
        { ok: false, error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Platas Bonitas" <${process.env.MAIL_USER}>`,
      to: email,
      subject: asunto,
      html: mensajeHtml,
    });

    return Response.json({ ok: true, message: "Correo enviado" });
  } catch (error: any) {
    console.error("Error en /api/sendEmail:", error);
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }
}
