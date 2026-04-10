# SimetraSA Frontend

Aplicacion web construida con React y Vite.

## Tecnologias actuales

- `react` + `react-dom`: base de la interfaz.
- `vite`: bundler y servidor de desarrollo.
- `react-router-dom`: enrutamiento de paginas.
- `tailwindcss` + `@tailwindcss/vite`: estilos utilitarios.
- `framer-motion`: animaciones.
- `eslint`: reglas de calidad de codigo.

## Scripts

- `npm run dev`: levanta entorno de desarrollo.
- `npm run build`: genera build de produccion.
- `npm run preview`: previsualiza la build.
- `npm run lint`: ejecuta lint.

## Estructura de trabajo actual

```txt
src/
  assets/
  animations/
  components/
  layouts/
  pages/
    home/
      page.jsx
      sections/
    proyects/
      page.jsx
      sections/
    postulacion/
      page.jsx
      sections/
    contacto/
      page.jsx
  utils/
  App.jsx
  index.css
  main.jsx
```

## Flujo actual de la app

- `src/main.jsx` monta la aplicacion con `BrowserRouter`.
- `src/App.jsx` define rutas para:
  - `/`
  - `/proyects`
  - `/postulacion`
  - `/contacto`
- `src/layouts/MainLayout/MainLayout.jsx` envuelve la navegacion y el `Outlet`.
- Cada pagina principal vive en `src/pages/*/page/*Page.jsx` y consume secciones en `src/pages/*/sections`.

## Archivos agregados y su rol

- `src/components/Button.jsx`: boton base reutilizable.
- `src/components/Input.jsx`: input base reutilizable.
- `src/layouts/LoadingScreen.jsx`: pantalla de carga con mascara y progreso.
- `src/animations/SplitPanelSlide.jsx`: animacion de paneles para el loading.
- `src/utils/useDeviceType.js`: deteccion de dispositivo por breakpoints.
- `src/utils/usePageLoader.js`: seguimiento de carga de recursos por pagina.
- `src/utils/useSectionHeights.js`: medicion de secciones para animaciones de scroll.
- `src/assets/seccion1/FondoZanja.png` y `src/assets/seccion1/camion3d.png`: recursos graficos.

## Nota de organizacion

Actualmente conviven dos enfoques de pagina:

- Enfoque activo enrutado: `src/pages/*/page/*Page.jsx` (usado por `src/App.jsx`).
- Enfoque en transicion: `src/pages/*/page.jsx` (algunos vacios o de ejemplo).

Recomendacion para la siguiente iteracion: unificar en un solo enfoque para evitar duplicidades y rutas/imports inconsistentes.
