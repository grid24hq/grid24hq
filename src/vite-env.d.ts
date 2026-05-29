/// <reference types="vite/client" />

// SVG imports als URL string (Vite standaard gedrag)
declare module '*.svg' {
  const src: string
  export default src
}
