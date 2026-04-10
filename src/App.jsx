import { Route, Routes } from 'react-router-dom'
import ContactoPage from './pages/contacto/page'
import HomePage from './pages/home/page'
import PostulacionPage from './pages/postulacion/page'
import ProyectsPage from './pages/proyects/page'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/proyects" element={<ProyectsPage />} />
      <Route path="/postulacion" element={<PostulacionPage />} />
      <Route path="/contacto" element={<ContactoPage />} />
    </Routes>
  )
}
