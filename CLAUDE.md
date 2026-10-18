# ACA Villa Bordeu — web

Sitio del motel ACA Villa Bordeu (Bahía Blanca). Plan completo en `../PLAN.md` y `../plan/01..06`.
Preview: https://aca-villa-bordeu-web.vercel.app (noindex). Dominio a mantener: `www.acavillabordeu.com.ar`.

## Reglas que no se rompen (decididas con Gael y el cliente)

- **Cero precios en el sitio**: ni tarifas, ni «desde», ni signo $, ni en el JSON-LD (sin `offers` ni `priceRange`).
- **Sin condiciones**: factura, cuenta corriente, temporadas, cupos y capacidad de grupos no van. Todo «escribinos por WhatsApp o mail».
- La consulta (`components/consulta/`) es **sin precio** y termina en WhatsApp (asistido: la persona aprieta enviar) o mail (`SITIO.consultaApi`: `hosting/api/consulta.php` en producción, Resend en Vercel; los dos con la misma validación: si se cambia una, cambiar la otra).
- **Después de enviar** (WhatsApp o mail), la reserva y el pedido **no quedan guardados** (pedido del cliente, 16/10/2026): se muestra «Se abrió WhatsApp» / «Recibimos…» (`Enviado` en `Campos.tsx`) y al cerrar todo vuelve a cero, sessionStorage incluido.
- Contacto en `lib/sitio.ts`: **llamar** al fijo 0291 488-6855 (`telefono`, `telLink`, JSON-LD) · **WhatsApp** al +54 9 291 642-1036 (`celular`) · info@acavillabordeu.com.ar.
- **Nunca la palabra «complejo»** (al dueño no le gusta): «Instalaciones» en títulos y menú (`/instalaciones`), «el predio» o «Villa Bordeu» en los textos.
- **1984 es el año de Villa Bordeu entero**, no solo del Resto (`SITIO.abiertoDesde`).
- **La web es amarilla, no roja** (pedido del cliente, oct/2026): amarillo ACA `#F1BB01`, el de aca.org.ar. La palabra destacada de los títulos (`.resalte`) va **en letra amarilla, también sobre claro**: el cliente no quiere subrayado de marcador. Botones y bloques: relleno amarillo con texto tinta. Textos chicos e íconos sobre claro: `text-acento` (dorado `#846400` sobre claro, amarillo sobre oscuro, vía `--acento` en `globals.css`). Sobre `bg-amarillo`, texto tinta, nunca blanco.
- Oficina de cortesía: se muestra, sin condiciones (las pone el hotel por WhatsApp/mail).
- `components/v2/Respaldo.tsx` («El respaldo del ACA») está guardado sin uso: si el dueño quiere volver, reemplaza a `<ViajeSocios />` en `app/page.tsx`.
- **Habitaciones, nunca «departamentos»** (pedido del cliente, oct/2026; femenino: «cada habitación», «las habitaciones»). Tipos single/doble/triple, página `/habitaciones` (`/departamentos` redirige). **El sitio nunca dice cuántas habitaciones hay** (pedido del cliente, 18/10/2026): ni el número en textos, títulos ni JSON-LD. Pet friendly, recepción 24 h y lavandería: confirmados.
- No afirmar remodelación ni nombrar empresas como clientes sin confirmación.
- El rojo `#DF1D2E` queda **solo en el logo ACA** (`text-marca-aca`, favicon), como en aca.org.ar. El logo está vectorizado desde el favicon (`lib/logo.ts`): reemplazar si el ACA pasa el vector.
- Menú: Socios (`/socios-aca`) va primero, antes de Empresas.
- **Datos obligatorios** en la reserva y en el pedido (pedido del cliente, oct/2026): nombre y apellido, teléfono y e-mail (`DatosPersonales` en `components/consulta/Campos.tsx`, validación en `lib/mensaje.ts`). Sin ellos no sale ni por WhatsApp ni por mail. El botón del encabezado dice «Reservas»; el WhatsApp del encabezado es verde.
- **Prepará tu pedido** (`components/pedido/Pedido.tsx`), pensado para empresas: un asistente paso a paso — cuántos son → entrada (opcional) → plato principal → bebida → postre (opcional) → días (uno o varios, almuerzo/cena y hora opcional, mismo horario o uno por día) → datos — en un panel centrado en escritorio, con filtros por capítulo y «Mis elegidos» (sin buscador); firma «Pedido desde la web»; manda por WhatsApp o mail (`modo: "pedido"` en `/api/consulta`). Cada capítulo de la carta va a un paso por `CURSO_DE`: si se agrega un capítulo a `lib/carta.ts`, sumarlo ahí. La carta de la página es solo de lectura. La carta va **sin vinos**. QR impreso en `../qr-restaurante/`: apunta a la web nueva que sale de `main` (`aca-villa-bordeu-web.vercel.app/restaurante#carta`), nunca al sitio viejo.
- **Cómo llegar**: el título dice «Antes del cruce de rutas», con la dirección arriba (pedido del cliente).
- og:image **propia por página**: `scripts/og.mjs` lee `out/` (h1 + primera foto de cada URL del sitemap) y escribe `public/og/<página>.jpg` (`/empresas/agro` → `empresas--agro.jpg`, `imagenOg` en `lib/meta.ts`). Si cambia un título o la foto de portada, volver a correrlo y commitear `public/og`. `exportar.mjs` corta si falta alguna.

## Técnico

- Next 16 (export estático en producción) + Tailwind v4 + GSAP/Lenis. El motor (`components/motion/motor.ts`) arranca con la primera interacción o a los 4 s; las páginas declaran efectos con `data-*`.
- Fotos: `python scripts/preparar-fotos.py` genera `public/fotos` y `lib/fotos.json` desde `../fotos-seleccion`.
- Contenido SEO en `lib/rubros.ts`, `lib/rutas.ts`, `lib/cerca.ts`, `lib/carta.ts`, `lib/faq.ts`. Cada página tiene que tener contenido propio (nada de páginas puerta).
- Redirecciones del sitio viejo y de las URLs históricas en `lib/redirecciones.json` (las usan `next.config.ts` y el `.htaccess`). Inventario del sitio viejo: las 7 `.php`, las ASP/HTML 2002–2013 del Wayback y `_reservas.php`, `_resto.php`, `Precios/`. Carpetas viejas que **se conservan** en el servidor: `stats`, `error`, `noticias`, `menu` (pantallas del hotel), `rcc`, `camaras`, `vieja`, `Images` (`CARPETAS` en `exportar.mjs`).
- Google Ads `AW-17391925073` (campañas activas del cliente) con aviso de cookies y Consent Mode: solo carga con `NEXT_PUBLIC_INDEXABLE=1` (lo pone `exportar.mjs`; nunca en Vercel).
- **Producción = hosting del cliente** (ISPConfig de NetPro, Apache + PHP, carpeta `web/` por FTP), no Vercel. `node scripts/exportar.mjs` arma `out/` (export estático con `SALIDA=estatica`, fotos WebP pre-generadas por `lib/imagen-loader.ts`, `.htaccess` con URLs sin `.html`, https+www y las 301) y corta si algo sale `noindex`, con canónica equivocada o sin og:image. Pasos completos y verificación en el README. **Subir lo decide y lo hace Gael** (`scripts/subir.mjs`, credenciales en `.env.hosting`, nunca al repo). **No tocar DNS ni nameservers**: el mail de `info@` vive en otro servidor del proveedor.
- Favicon en `app/favicon.ico` (raíz de `app/`, nunca en un grupo de rutas).
