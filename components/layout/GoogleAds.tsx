"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

// Tag de Google Ads que ya usa el sitio viejo (hay campañas activas). Arranca con
// Consent Mode en «denegado» y se habilita cuando la persona acepta el aviso.
// Solo se carga en producción.
const ADS_ID = "AW-17391925073";
const CLAVE = "vb-cookies";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function GoogleTagManager() {
  const [decision, setDecision] = useState<"si" | "no" | null | undefined>(undefined);
  const activo = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

  useEffect(() => {
    let d: string | null = null;
    try {
      d = localStorage.getItem(CLAVE);
    } catch {}
    // Lectura de almacenamiento al montar: no hay forma de saberlo en el servidor.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDecision(d === "si" || d === "no" ? d : null);
  }, []);

  const elegir = (v: "si" | "no") => {
    try {
      localStorage.setItem(CLAVE, v);
    } catch {}
    setDecision(v);
    window.gtag?.("consent", "update", {
      ad_storage: v === "si" ? "granted" : "denied",
      ad_user_data: v === "si" ? "granted" : "denied",
      ad_personalization: v === "si" ? "granted" : "denied",
      analytics_storage: v === "si" ? "granted" : "denied",
    });
  };

  if (!activo) return null;

  return (
    <>
      <Script id="gtag-consent" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});
try{if(localStorage.getItem('${CLAVE}')==='si'){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'})}}catch(e){}
gtag('js',new Date());gtag('config','${ADS_ID}');`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`} strategy="lazyOnload" />
      {decision === null && (
        <div
          role="dialog"
          aria-label="Aviso de cookies"
          className="fixed inset-x-2 bottom-[calc(80px+env(safe-area-inset-bottom))] z-[120] mx-auto max-w-[560px] rounded-[20px] bg-white p-4 text-[14px] text-tinta shadow-[0_24px_60px_-20px_rgb(0_0_0/0.45)] md:bottom-5 md:left-5 md:mx-0"
        >
          <p>Usamos cookies para medir las visitas y mejorar la publicidad. ¿Nos dejás?</p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => elegir("si")} className="btn sin-burbuja !min-h-10 !px-5 !text-[14px]">
              Acepto
            </button>
            <button type="button" onClick={() => elegir("no")} className="btn btn-fantasma sin-burbuja !min-h-10 !px-5 !text-[14px]">
              No, gracias
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/** Conversión de Google Ads (se llama al enviar una consulta). */
export function conversionAds(evento: string) {
  window.gtag?.("event", evento, { send_to: ADS_ID });
}
