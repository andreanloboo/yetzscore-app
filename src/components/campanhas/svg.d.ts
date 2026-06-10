// Declaração global para importação de arquivos SVG (Vite resolve como URL).
// Substitui a referência a "vite/client" enquanto o projeto não possui vite-env.d.ts.
declare module "*.svg" {
  const src: string;
  export default src;
}
