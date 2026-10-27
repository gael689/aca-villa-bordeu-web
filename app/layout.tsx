import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleTagManager } from "@/components/layout/GoogleAds";
import "./globals.css";
import { SITIO, urlAbs } from "@/lib/sitio";
import { JsonLd, motelJsonLd, organizacionJsonLd } from "@/lib/schema";
import { ConsultaProvider } from "@/components/consulta/ConsultaContext";
import { ConsultaLazy } from "@/components/consulta/ConsultaLazy";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BarraFija } from "@/components/layout/BarraFija";
import { Motion } from "@/components/motion/Motion";

const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-barlow", display: "swap" });
const barlowCondensed = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-barlow-condensed", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITIO.url),
  title: {
    default: "ACA Villa Bordeu · Alojamiento y habitaciones en Bahía Blanca",
    template: "%s",
  },
  description:
    "Alojamiento del ACA sobre las rutas 3, 33 y 35 en Bahía Blanca: habitaciones con cochera, restaurante, gimnasio y estación YPF. Para equipos de trabajo.",
  applicationName: SITIO.nombre,
  category: "travel",
  verification: {
    // Search Console (cuenta de Gael, 19/10/2026). Es público: va en el <head> de todas las páginas.
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ?? "EEiuUcQw1roEFXY3FbkDFOvpnY-OLPoIhQe7cWdtE2w",
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION } : undefined,
  },
  other: {
    "geo.region": "AR-B",
    "geo.placename": SITIO.direccion.ciudad,
    "geo.position": `${SITIO.direccion.lat};${SITIO.direccion.lng}`,
    ICBM: `${SITIO.direccion.lat}, ${SITIO.direccion.lng}`,
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: SITIO.nombre,
    url: urlAbs("/"),
    images: [{ url: "/og/inicio.jpg", width: 1200, height: 630, alt: "ACA Villa Bordeu · Bahía Blanca" }],
  },
  twitter: { card: "summary_large_image" },
  robots: SITIO.indexable ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#141516",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Corre antes del primer pintado. `js` activa los estados iniciales ocultos de
// las animaciones. Se animan también con «menos movimiento» del sistema (decisión
// de Gael, 19/10/2026: con Windows las apagan muchos sin saberlo).
// Con poca señal el motor tarda en bajar y lo oculto quedaba en blanco (20/10/2026):
// si el motor no arrancó 1,5 s después de que la persona baja o toca, o a los 5 s,
// se saca `js` y se ve todo sin animar. Con 2G o ahorro de datos ni se agrega.
const ANTES_DE_PINTAR = `(function(d,w){try{var c=navigator.connection;if(c&&(c.saveData||/2g/.test(c.effectiveType)))return;d.classList.add('js');var sacar=function(){if(!d.classList.contains('anim-ready'))d.classList.remove('js')},ev=['scroll','touchstart','wheel','keydown'],una=function(){ev.forEach(function(e){w.removeEventListener(e,una,true)});setTimeout(sacar,1500)};ev.forEach(function(e){w.addEventListener(e,una,{passive:true,capture:true})});setTimeout(sacar,5000)}catch(e){}})(document.documentElement,window)`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={`${barlow.variable} ${barlowCondensed.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: ANTES_DE_PINTAR }} />
      </head>
      <body>
        <a href="#contenido" className="skip">
          Saltar al contenido
        </a>
        <ConsultaProvider>
          <Header />
          <main id="contenido">{children}</main>
          <Footer />
          <BarraFija />
          <ConsultaLazy />
          <Motion />
        </ConsultaProvider>
        {/* La organización, el sitio y el motel en todas las páginas: los @id de cada página apuntan acá. */}
        <JsonLd data={[...organizacionJsonLd(), motelJsonLd()]} />
        {process.env.VERCEL ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
        <GoogleTagManager />
      </body>
    </html>
  );
}
