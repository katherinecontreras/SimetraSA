/**
 * App.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Rutas de la aplicación con lazy loading por página.
 * Cada página carga su propio chunk JS solo cuando se navega a ella.
 */

import { lazy, Suspense } from 'react'
import { Route, Routes }   from 'react-router-dom'

const HomePage       = lazy(() => import('./pages/home/page'))
const ProyectsPage   = lazy(() => import('./pages/proyects/page'))
const PostulacionPage = lazy(() => import('./pages/postulacion/page'))
const ContactoPage   = lazy(() => import('./pages/contacto/page'))

// Fallback mínimo mientras carga el chunk JS de la página
// (el LoadingScreen propio de cada página se encarga del resto)
function PageFallback() {
  return <div aria-hidden style={{ visibility: 'hidden' }} />
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/"            element={<HomePage />} />
        <Route path="/proyects"    element={<ProyectsPage />} />
        <Route path="/postulacion" element={<PostulacionPage />} />
        <Route path="/contacto"    element={<ContactoPage />} />
      </Routes>
    </Suspense>
  )
}