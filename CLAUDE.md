# ACA Villa Bordeu — web

Sitio del motel ACA Villa Bordeu (Bahía Blanca). Plan completo en `../PLAN.md` y `../plan/01..06`.
Preview: https://aca-villa-bordeu-web.vercel.app (noindex). Dominio a mantener: `www.acavillabordeu.com.ar`.

## Reglas que no se rompen (decididas con Gael y el cliente)

- **Cero precios en el sitio**: ni tarifas, ni «desde», ni signo $, ni en el JSON-LD (sin `offers` ni `priceRange`).
- **Sin condiciones**: factura, cuenta corriente, temporadas, cupos y capacidad de grupos no van. Todo «escribinos por WhatsApp o mail».
- La consulta (`components/consulta/`) es **sin precio** y termina en WhatsApp (asistido: la persona aprieta enviar) o mail por Resend.
- Contacto en `lib/sitio.ts`: **llamar** al fijo 0291 488-6855 (`telefono`, `telLink`, JSON-LD) · **WhatsApp** al +54 9 291 642-1036 (`celular`) · info@acavillabordeu.com.ar.
- **Nunca la palabra «complejo»** (al dueño no le gusta): «Instalaciones» en títulos y menú (`/instalaciones`), «el predio» o «Villa Bordeu» en los textos.
- **1984 es el año de Villa Bordeu entero**, no solo del Resto (`SITIO.abiertoDesde`).
- **La web es amarilla, no roja** (pedido del cliente, oct/2026): amarillo ACA `#F1BB01`, el de aca.org.ar. La palabra destacada de los títulos (`.resalte`) va **en letra amarilla, también sobre claro**: el cliente no quiere subrayado de marcador. Botones y bloques: relleno amarillo con texto tinta. Textos chicos e íconos sobre claro: `text-acento` (dorado `#846400` sobre claro, amarillo sobre oscuro, vía `--acento` en `globals.css`). Sobre `bg-amarillo`, texto tinta, nunca blanco.
- Oficina de cortesía: se muestra, sin condiciones (las pone el hotel por WhatsApp/mail).
- `components/v2/Respaldo.tsx` («El respaldo del ACA») está guardado sin uso: si el dueño quiere volver, reemplaza a `<ViajeSocios />` en `app/page.tsx`.
- **Habitaciones, nunca «departamentos»** (pedido del cliente, oct/2026; femenino: «cada habitación», «las 26»). Son 26 (single/doble/triple), página `/habitaciones` (`/departamentos` redirige). Pet friendly, recepción 24 h y lavandería: confirmados.
- No afirmar remodelación ni nombrar empresas como clientes sin confirmación.
- El rojo `#DF1D2E` queda **solo en el logo ACA** (`text-marca-aca`, favicon), como en aca.org.ar. El logo está vectorizado desde el favicon (`lib/logo.ts`): reemplazar si el ACA pasa el vector.
- Menú: Socios (`/socios-aca`) va primero, antes de Empresas.
- **Datos obligatorios** en la reserva y en el pedido (pedido del cliente, oct/2026): nombre y apellido, teléfono y e-mail (`DatosPersonales` en `components/consulta/Campos.tsx`, validación en `lib/mensaje.ts`). Sin ellos no sale ni por WhatsApp ni por mail. El botón del encabezado dice «Reservas»; el WhatsApp del encabezado es verde.
- **Prepará tu pedido** (`components/pedido/Pedido.tsx`), pensado para empresas: un asistente paso a paso — cuántos son → entrada (opcional) → plato principal → bebida → postre (opcional) → día y hora → datos — que manda por WhatsApp o mail (`modo: "pedido"` en `/api/consulta`). Cada capítulo de la carta va a un paso por `CURSO_DE`: si se agrega un capítulo a `lib/carta.ts`, sumarlo ahí. La carta de la página es solo de lectura. La carta va **sin vinos**. QR impreso en `../qr-restaurante/`: apunta a la web nueva que sale de `main` (`aca-villa-bordeu-web.vercel.app/restaurante#carta`), nunca al sitio viejo.
- **Cómo llegar**: el título dice «Antes del cruce de rutas», con la dirección arriba (pedido del cliente).
- og:image: `scripts/og-inicio.mjs` regenera `public/og/inicio.jpg`.

## Técnico

- Next 16 estático + Tailwind v4 + GSAP/Lenis. El motor (`components/motion/motor.ts`) arranca con la primera interacción o a los 4 s; las páginas declaran efectos con `data-*`.
- Fotos: `python scripts/preparar-fotos.py` genera `public/fotos` y `lib/fotos.json` desde `../fotos-seleccion`.
- Contenido SEO en `lib/rubros.ts`, `lib/rutas.ts`, `lib/cerca.ts`, `lib/carta.ts`, `lib/faq.ts`. Cada página tiene que tener contenido propio (nada de páginas puerta).
- Redirecciones del sitio viejo y de las URLs históricas en `next.config.ts`.
- Google Ads `AW-17391925073` (campañas activas del cliente): solo carga con `NEXT_PUBLIC_INDEXABLE=1` en producción.
- Para publicar: `NEXT_PUBLIC_SITE_URL=https://www.acavillabordeu.com.ar`, `NEXT_PUBLIC_INDEXABLE=1`, `RESEND_API_KEY`, dominio de envío verificado. **No mover los nameservers**: el mail `info@` vive en el mismo servidor; cambiar solo A y CNAME.
- Favicon en `app/favicon.ico` (raíz de `app/`, nunca en un grupo de rutas).
