import {
  BadgeCheck,
  Building2,
  DraftingCompass,
  Gauge,
  Leaf,
  RefreshCw,
  Settings,
  ShieldCheck,
  TrafficCone,
  Wrench,
} from 'lucide-react'

import section2Img1 from '../assets/home/section2/image1.png'
import section2Img2 from '../assets/home/section2/image2.png'
import section2Img3 from '../assets/home/section2/image3.png'
import section2Img4 from '../assets/home/section2/image4.png'
import section2Img5 from '../assets/home/section2/image5.png'

/** Solo assets de `src/assets/home/section2/`. */
export const ASI_TRABAJAMOS_IMAGES = [
  section2Img1,
  section2Img2,
  section2Img3,
  section2Img4,
  section2Img5,
]

export const VACANTES = [
  {
    title: 'Operario de obra civil',
    area: 'Ejecución en campo',
    location: 'Buenos Aires',
    type: 'Tiempo completo',
    mode: 'Presencial',
    salary: 'A convenir',
    description:
      'Para tareas de apoyo en zanjeo, tendido y mantenimiento de infraestructura urbana.',
    requirements: ['Experiencia en obra', 'Disponibilidad horaria', 'Trabajo en equipo'],
  },
  {
    title: 'Técnico en redes',
    area: 'Infraestructura',
    location: 'Zona norte',
    type: 'Tiempo completo',
    mode: 'Mixto',
    salary: 'A convenir',
    description:
      'Buscamos perfil técnico para relevamientos, soporte de cuadrillas y control de avances.',
    requirements: ['Lectura de planos', 'Manejo de herramientas', 'Registro de avances'],
  },
  {
    title: 'Coordinador de proyectos',
    area: 'Planificación',
    location: 'CABA / AMBA',
    type: 'Full time',
    mode: 'Híbrido',
    salary: 'A definir',
    description:
      'Rol orientado a coordinar equipos, organizar cronogramas y acompañar la entrega de proyectos.',
    requirements: ['Gestión de equipos', 'Comunicación clara', 'Seguimiento de KPIs'],
  },
]

export const NUESTROS_SERVICIOS = [
  {
    title: 'Dirección de Proyectos',
    Icon: DraftingCompass,
    description:
      'Los clientes cada vez más exigentes con el nivel de calidad de sus proveedores, requieren con frecuencia para sus instalaciones un interlocutor que coordine y dirija todo el proceso. Esta coordinación debe ser llevada a cabo por técnicos con demostrada experiencia en la gestión de proyectos en todas sus fases.',
  },
  {
    title: 'Asesoría técnica',
    Icon: Wrench,
    description:
      'La experiencia adquirida por nuestros Profesionales, Supervisores y Encargados de Producción y Servicio, con la creación de vínculos de asistencia con empresas consultoras de distintas especialidades, permiten a SIMETRA SERVICE S.A ofrecer a sus clientes una amplia y flexible gama de servicios de ingeniería.',
  },
  {
    title: 'Montajes mecánicos y eléctricos',
    Icon: Settings,
    description:
      'Desarrollo de proyectos mecánicos y/o eléctricos de instalaciones y procesos industriales, tales como plantas de tratamiento, plantas de inyección e instalaciones de campo',
  },
]
export const MISION_VISION_CARDS = [
  {
    title: 'Infraestructura',
    Icon: Building2,
    description:
      'Infraestructura propia que permite operar en toda la cuenca neuquina con autonomía y eficiencia.',
    layoutClassName: 'md:col-span-3 md:row-start-1',
  },
  {
    title: 'Capacidades',
    Icon: Gauge,
    description:
      'Capacidad de hasta 202.000 horas/año de construcción con alto rendimiento, gracias a personal y subcontratistas calificados.',
    layoutClassName: 'md:col-span-3 md:row-start-1',
    contentAlignClassName: 'md:justify-end',
  },
  {
    title: 'Seguridad y Calidad',
    Icon: ShieldCheck,
    description:
      'Cumplimiento estricto de normativas legales de seguridad e higiene. En proceso de certificación IRAM 3800.',
    layoutClassName: 'md:col-span-3 md:row-start-1',
    contentAlignClassName: 'md:justify-end',
  },
  {
    title: 'Normas ISO',
    Icon: BadgeCheck,
    description:
      'Sistema de gestión basado en ISO 9001, ISO 14001 y OHSAS 18001, enfocado en mejora continua.',
    layoutClassName: 'md:col-span-3 md:row-start-1',
  },
  {
    title: 'Impacto ambiental',
    Icon: Leaf,
    description:
      'Capacitación del personal para reducir o eliminar el impacto ambiental y trabajar bajo estándares de calidad.',
    layoutClassName: 'md:col-span-4 md:row-start-2',
  },
  {
    title: 'Seguridad vial',
    Icon: TrafficCone,
    description:
      'Formación de conductores prudentes para reducir accidentes y eliminar conductas de riesgo.',
    layoutClassName: 'md:col-span-4 md:row-start-2',
  },
  {
    title: 'Mejora continua',
    Icon: RefreshCw,
    description:
      'Planificación y control de procesos para optimizar tiempos, detectar errores y mejorar resultados.',
    layoutClassName: 'md:col-span-4 md:row-start-2',
  },
]

export const CORTINA = { off: 'off', blocking: 'blocking', fading: 'fading' }
