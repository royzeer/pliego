// Logo de Pliego: la palabra "pliego." con la esquina de la p doblada como una hoja.
// Usa currentColor para seguir el tema claro u oscuro.
import { useId } from "react";

export default function Logo({ height = 32, title = "Pliego" }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="-4 -4 368 164" height={height} role="img" aria-label={title} style={{ display: "block", width: "auto" }}>
      <defs>
        <mask id={`pl${id}`} maskUnits="userSpaceOnUse" x="-10" y="-10" width="380" height="180">
          <rect x="-10" y="-10" width="380" height="180" fill="#fff" />
          <path d="M34,40 V70 H64 Z" fill="none" stroke="#000" strokeWidth="3.5" strokeLinejoin="round" />
        </mask>
      </defs>
      <g mask={`url(#pl${id})`} fill="currentColor">
        <path fillRule="evenodd" d="M0,40 H34 L64,70 V72 A32,32 0 0 1 32,104 H20 V152 H0 Z M21,72 a11,11 0 1 0 22,0 a11,11 0 1 0 -22,0 Z" />
        <path d="M34,40 V70 H64 Z" />
        <rect x="70" y="0" width="20" height="104" />
        <rect x="96" y="40" width="20" height="64" />
        <circle cx="106" cy="18" r="11" />
        <rect x="128" y="66" width="58" height="12" />
        <rect x="236" y="40" width="20" height="80" />
        <circle cx="344" cy="92" r="12" />
        <g fill="none" stroke="currentColor" strokeWidth="20">
          <path d="M176,72 A22,22 0 1 0 172,84.6" />
          <circle cx="224" cy="72" r="22" />
          <path d="M246,116 Q246,142 220,142 H198" />
          <circle cx="294" cy="72" r="22" />
        </g>
      </g>
    </svg>
  );
}
