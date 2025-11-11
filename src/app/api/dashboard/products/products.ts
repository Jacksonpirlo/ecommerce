export async function GET(req: Request) {
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

    return Response.json({ ok: true, message: "Correo enviado" });
  } catch (error: any) {
    console.error("Error en /api/sendEmail:", error);
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }
}
