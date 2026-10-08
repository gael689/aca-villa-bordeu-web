# ACA Villa Bordeu — web

Sitio del motel ACA Villa Bordeu (Bahía Blanca). Plan completo en `../PLAN.md` y `../plan/01..06`.
Preview: https://aca-villa-bordeu-web.vercel.app (noindex). Dominio a mantener: `www.acavillabordeu.com.ar`.

## Reglas que no se rompen (decididas con Gael y el cliente)

- **Cero precios en el sitio**: ni tarifas, ni «desde», ni signo $, ni en el JSON-LD (sin `offers` ni `priceRange`).
- **Sin condiciones**: factura, cuenta corriente, temporadas, cupos y capacidad de grupos no van. Todo «escribinos por WhatsApp o mail».
- La consulta (`components/consulta/`) es **sin precio** y termina en WhatsApp (asistido: la persona aprieta enviar) o mail por Resend.
- Contacto único en `lib/sitio.ts`: WhatsApp/teléfono +54 9 291 642-1036 · info@acavillabordeu.com.ar.
- 26 departamentos (single/doble/triple) = lo que el sitio viejo llamaba habitaciones. Pet friendly, recepción 24 h y lavandería: confirmados.
- No afirmar remodelación ni nombrar empresas como clientes sin confirmación.
- Rojo de marca `#DF1D2E` (logo ACA 2024). El logo está vectorizado desde el favicon (`lib/logo.ts`): reemplazar si el ACA pasa el vector.

## Técnico

- Next 16 estático + Tailwind v4 + GSAP/Lenis. El motor (`components/motion/motor.ts`) arranca con la primera interacción o a los 4 s; las páginas declaran efectos con `data-*`.
- Fotos: `python scripts/preparar-fotos.py` genera `public/fotos` y `lib/fotos.json` desde `../fotos-seleccion`.
- Contenido SEO en `lib/rubros.ts`, `lib/rutas.ts`, `lib/cerca.ts`, `lib/carta.ts`, `lib/faq.ts`. Cada página tiene que tener contenido propio (nada de páginas puerta).
- Redirecciones del sitio viejo y de las URLs históricas en `next.config.ts`.
- Google Ads `AW-17391925073` (campañas activas del cliente): solo carga con `NEXT_PUBLIC_INDEXABLE=1` en producción.
- Para publicar: `NEXT_PUBLIC_SITE_URL=https://www.acavillabordeu.com.ar`, `NEXT_PUBLIC_INDEXABLE=1`, `RESEND_API_KEY`, dominio de envío verificado. **No mover los nameservers**: el mail `info@` vive en el mismo servidor; cambiar solo A y CNAME.
- Favicon en `app/favicon.ico` (raíz de `app/`, nunca en un grupo de rutas).
