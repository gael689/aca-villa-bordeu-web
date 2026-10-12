import Link from "next/link";
import { Escudo } from "@/components/marca/Escudo";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";

export default function NoEncontrada() {
  return (
    <section className="grano relative flex min-h-[100svh] items-center overflow-hidden bg-grafito text-white">
      <div aria-hidden="true" className="absolute top-1/2 -right-[6%] w-[min(80vw,700px)] -translate-y-1/2 text-white/[0.06]">
        <Escudo numero="404" className="h-auto w-full" />
      </div>
      <div className="contenedor relative pt-[var(--header-h)]">
        <p className="etiqueta !text-white/70">Error 404</p>
        <h1 className="t-display mt-5 max-w-[11ch]">
          Esta salida <span className="text-rojo">no lleva</span> a ningún lado
        </h1>
        <p className="lead mt-6 text-white/75">Volvé a la ruta: desde el inicio llegás a todo.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-claro">
            <span>Volver al inicio</span>
            <span className="burbuja" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M7 17L17 7M8 7h9v9" />
              </svg>
            </span>
          </Link>
          <BotonConsultar origen="404">Consultar disponibilidad</BotonConsultar>
        </div>
      </div>
    </section>
  );
}
