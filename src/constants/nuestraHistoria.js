import imgPart1 from '../assets/home/section3/imgPart1.png'
import imgPart2 from '../assets/home/section3/imgPart2.png'
import imgPart3 from '../assets/home/section3/imgPart3.png'
import imgPart4 from '../assets/home/section3/imgPart4.png'

/** Fracción de longitud del path: posiciones a lo largo de la línea */
export const NUESTRA_HISTORIA_QUARTILE_FRACTIONS = {
  Q1: 0.1,
  Q2: 0.4,
  Q3: 0.7,
  Q4: 1,
}

/**
 * Cada “parte” de la sección: posición a lo largo del trazo, imagen de botón, título y cuerpo.
 * Los títulos reutilizarán `SectionTitle`; el texto `FadeInAndOut` (próximo paso).
 */
export const NUESTRA_HISTORIA_PARTS = [
  {
    id: 'q1',
    key: 'Q1',
    quartile: NUESTRA_HISTORIA_QUARTILE_FRACTIONS.Q1,
    image: imgPart1,
    title: 'Origen de la Empresa',
    text:
      'SIMETRA SERVICE S.A inició sus actividades en abril del año 2000, con el objetivo de brindar un servicio eficiente e integral a la industria del petróleo y el gas.',
  },
  {
    id: 'q2',
    key: 'Q2',
    quartile: NUESTRA_HISTORIA_QUARTILE_FRACTIONS.Q2,
    image: imgPart2,
    title: 'Misión y Enfoque',
    text:
      'Desde sus inicios, la empresa se enfoca en la atención y seguimiento de las necesidades de sus clientes, incorporando nuevas tecnologías y optimizando constantemente sus procesos.',
  },
  {
    id: 'q3',
    key: 'Q3',
    quartile: NUESTRA_HISTORIA_QUARTILE_FRACTIONS.Q3,
    image: imgPart3,
    title: 'Mejora Continua y Equipo',
    text:
      'SIMETRA apuesta a la sistematización de tareas, la mejora constante en los métodos de ejecución y la capacitación permanente de su equipo de trabajo.',
  },
  {
    id: 'q4',
    key: 'Q4',
    quartile: NUESTRA_HISTORIA_QUARTILE_FRACTIONS.Q4,
    image: imgPart4,
    title: 'Infraestructura y Compromiso',
    text:
      'Cuenta con una infraestructura adecuada que permite cumplir con los plazos de obra, garantizando resultados óptimos y respetando estrictas normas de seguridad, calidad y medio ambiente. Se posiciona como un aliado confiable para obras de pequeña y mediana envergadura.',
  },
]
