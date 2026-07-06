// Ícones do admscore (sessão do administrador).
interface IconProps {
  className?: string;
}

export function CampanhasIcon({ className = "size-6" }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v16.5a1.5 1.5 0 0 0 1.5 1.5H21" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 14l3.5-3.5 3 3L20 7" />
    </svg>
  );
}

export function CargasIcon({ className = "size-6" }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4 4 4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

export function CatalogosIcon({ className = "size-6" }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5v-13Z" />
    </svg>
  );
}

export function ClientesIcon({ className = "size-6" }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8 12 3 3 8l9 5 9-5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8v8l9 5 9-5V8M12 13v8" />
    </svg>
  );
}

export function UsuariosIcon({ className = "size-6" }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
      />
    </svg>
  );
}

export function SearchIcon({ className = "size-5" }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="m20 20-3.2-3.2" />
    </svg>
  );
}

export function RefreshIcon({ className = "size-5" }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 20v-5h-5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 14a7 7 0 0 0 12.9 2.5M19 10A7 7 0 0 0 6.1 7.5" />
    </svg>
  );
}

export function PencilIcon({ className = "size-5" }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 4.5l3 3L8 19l-4 1 1-4L16.5 4.5Z" />
    </svg>
  );
}

export function EyeIcon({ className = "size-5" }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

export function ChevronLeftIcon({ className = "size-5" }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function ChevronRightIcon({ className = "size-5" }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function CalendarIcon({ className = "size-5" }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path strokeLinecap="round" d="M3.5 9.5h17M8 3v4m8-4v4" />
    </svg>
  );
}

export function SessoesIcon({ className = "size-6" }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8m-4-3v3" />
    </svg>
  );
}

export function EyeOffIcon({ className = "size-5" }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A9.6 9.6 0 0 1 12 5c4.6 0 8.6 3 10 7.2a10.6 10.6 0 0 1-2.6 3.9M6.6 6.6A10.7 10.7 0 0 0 2 12.2 10.6 10.6 0 0 0 12 19a9.8 9.8 0 0 0 3.4-.6" />
    </svg>
  );
}
