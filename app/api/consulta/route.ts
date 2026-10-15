import { Resend } from "resend";
import { z } from "zod";
import { SITIO } from "@/lib/sitio";
import { esMail } from "@/lib/mensaje";

// Recibe la consulta del panel (o el pedido del Resto) y la manda al mail del
// hotel con Resend. Nombre, teléfono y e-mail son obligatorios: el hotel contesta
// con «Responder» (reply-to) o llama al teléfono, que va en el asunto.

const Esquema = z.object({
  modo: z.enum(["empresa", "viaje", "pedido"]),
  mensaje: z.string().min(10).max(4000),
  nombre: z.string().trim().min(3).max(120),
  telefono: z
    .string()
    .trim()
    .max(40)
    .refine((s) => s.replace(/\D/g, "").length >= 8),
  email: z.string().trim().max(120).refine(esMail),
  empresa: z.string().max(120).optional().default(""),
  // Trampa para robots: el campo es invisible, una persona nunca lo completa.
  sitio: z.string().max(0).optional().default(""),
});

// Límite simple por IP (por instancia): suficiente contra un robot insistente.
const recientes = new Map<string, number[]>();
function demasiados(ip: string) {
  const ahora = Date.now();
  const lista = (recientes.get(ip) ?? []).filter((t) => ahora - t < 10 * 60_000);
  lista.push(ahora);
  recientes.set(ip, lista);
  return lista.length > 5;
}

const escapar = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "?";
  if (demasiados(ip)) return Response.json({ ok: false }, { status: 429 });

  let datos: z.infer<typeof Esquema>;
  try {
    datos = Esquema.parse(await req.json());
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const clave = process.env.RESEND_API_KEY;
  if (!clave) {
    console.error("Falta RESEND_API_KEY");
    return Response.json({ ok: false }, { status: 503 });
  }

  const destino = process.env.CONSULTA_DESTINO ?? SITIO.mail;
  const remitente = process.env.CONSULTA_REMITENTE ?? "Villa Bordeu <consultas@envios.acavillabordeu.com.ar>";
  const quien = datos.empresa ? `${datos.empresa} (${datos.nombre})` : datos.nombre;
  const pedido = datos.modo === "pedido";
  const tipo = datos.modo === "empresa" ? "Equipo de trabajo" : datos.modo === "viaje" ? "Viaje" : "Pedido del Resto";
  const que = pedido ? "pedido" : "consulta";
  const { email, telefono } = datos;

  const html = `
  <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#1c1d1f;max-width:560px">
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#846400">${pedido ? "Pedido" : "Consulta"} desde la web · ${tipo}</p>
    <h1 style="margin:0 0 16px;font-size:22px">${escapar(quien)}</h1>
    <div style="background:#f6f5f2;border-radius:12px;padding:16px;white-space:pre-line">${escapar(datos.mensaje)}</div>
    <p style="margin:16px 0 0"><strong>Teléfono:</strong> ${escapar(telefono)} · <strong>Mail:</strong> ${escapar(email)}</p>
    <p style="margin:4px 0 0;color:#55585a;font-size:13px">Respondé este mail y le llega directo.</p>
  </div>`;

  try {
    const resend = new Resend(clave);
    const { error } = await resend.emails.send({
      from: remitente,
      to: destino,
      replyTo: email,
      subject: `${pedido ? "Pedido web" : "Consulta web"} · ${tipo} · ${quien} · ${telefono}`,
      html,
      text: `${datos.mensaje}\n\nTeléfono: ${telefono} · Mail: ${email}`,
    });
    if (error) throw new Error(error.message);

    // Copia para quien escribió.
    await resend.emails.send({
      from: remitente,
      to: email,
      replyTo: destino,
      subject: `Recibimos tu ${que} · ACA Villa Bordeu`,
      html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#1c1d1f;max-width:560px">
        <p>¡Hola ${escapar(datos.nombre)}! Recibimos tu ${que} y te respondemos lo antes posible.</p>
        <div style="background:#f6f5f2;border-radius:12px;padding:16px;white-space:pre-line">${escapar(datos.mensaje)}</div>
        <p>Si preferís, escribinos por WhatsApp al ${SITIO.celular} o llamá al ${SITIO.telefono}. Recepción abierta las 24 horas.</p>
        <p style="color:#55585a;font-size:13px">ACA Villa Bordeu · ${SITIO.direccion.calle}, ${SITIO.direccion.ciudad}</p>
      </div>`,
    });
    return Response.json({ ok: true });
  } catch (e) {
    console.error("Resend:", e);
    return Response.json({ ok: false }, { status: 502 });
  }
}
