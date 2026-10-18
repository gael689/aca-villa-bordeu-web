# ACA Villa Bordeu

Sitio del motel ACA Villa Bordeu (Bahía Blanca): habitaciones, restaurante, gimnasio y estación de servicio, pensado primero para empresas que alojan equipos de trabajo.

## Desarrollo
npm install && npm run dev

## Dónde vive

- **Producción**: el hosting del cliente (ISPConfig de NetPro: Apache + PHP, sin Node), carpeta `web/` por FTP.
  Sitio estático: `out/`. El formulario de mail sale por `api/consulta.php` (`mail()` del mismo servidor, que el SPF del dominio autoriza).
  **No tocar el DNS ni los nameservers**: el mail de `info@` vive en otro servidor del mismo proveedor (190.185.150.3).
- **Vista previa**: Vercel (https://aca-villa-bordeu-web.vercel.app, noindex), con `/api/consulta` por Resend.

## Publicar en el hosting

```bash
node scripts/exportar.mjs                                    # fotos WebP + build estático + .htaccess + chequeos
NODE_PATH=../../../../taller/node_modules node scripts/og.mjs   # imágenes para compartir, si cambió un título o una foto
node scripts/exportar.mjs                                    # otra vez si og.mjs generó imágenes nuevas
node scripts/subir.mjs --respaldo                            # solo la primera vez: baja el sitio viejo entero
node scripts/subir.mjs                                       # sube out/ a web/
```

Las credenciales del FTP van en `.env.hosting` (ignorado por git; formato en `scripts/subir.mjs`).

### La primera vez, en el servidor (a mano, por FTP)

- Borrar `index.php` y los `.php` sueltos del sitio viejo después de subir (las URLs igual redirigen por el `.htaccess`), y `standard_index.html`.
- **Borrar `scam 33.JPG`**: es una imagen de phishing (de Bank of America) que quedó de un hackeo viejo.
- Revisar qué hay en `123/` y `new/` (dan 403, nadie las enlaza).
- No tocar `stats/`, `error/` (ISPConfig), ni `noticias/` y `menu/` (pantallas que puede estar usando un televisor del hotel). `rcc/`, `camaras/`, `vieja/` e `Images/` quedan hasta que el cliente confirme que no se usan.

### Verificar después de subir

```bash
curl -sI https://www.acavillabordeu.com.ar/habitaciones | head -1                  # 200
curl -sI https://acavillabordeu.com.ar/ | grep -i location                          # → https://www.acavillabordeu.com.ar/
curl -sI http://www.acavillabordeu.com.ar/resto.php | grep -i location              # → https://www.acavillabordeu.com.ar/restaurante
curl -sI https://www.acavillabordeu.com.ar/habitaciones/ | grep -i location         # → /habitaciones
curl -sI https://www.acavillabordeu.com.ar/Default.asp | grep -i location           # → /
curl -sI https://www.acavillabordeu.com.ar/no-existe | head -1                      # 404
curl -s https://www.acavillabordeu.com.ar/robots.txt                                # Allow: / y el sitemap
curl -sI https://www.acavillabordeu.com.ar/menu/ | head -1                          # 200 (la pantalla vieja sigue)
curl -s -o /dev/null -w "%{http_code}\n" https://www.acavillabordeu.com.ar/favicon.ico   # 200
```

Y a mano: mandar una reserva y un pedido por mail desde la web (llega a `info@` y la copia a quien escribió), y por WhatsApp.

## Variables de entorno
Ver `.env.example`. El export las fija solo (`scripts/exportar.mjs`).

Plan completo: `../PLAN.md` y `../plan/`.
