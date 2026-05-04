import YPF from '../assets/proyects/YPF.png'
import TGS from '../assets/proyects/TGS.png'
import TUBOSCOPE from '../assets/proyects/TUBOSCOPE.png'
import CAPEX from '../assets/proyects/CAPEX.png'
import OLDELVAL from '../assets/proyects/OLDELVAL.png'
import MEGA from '../assets/proyects/MEGA.png'
import CAMUZZI from '../assets/proyects/CAMUZZI.png'
import EXXON from '../assets/proyects/EXXON.png'
import YSUR from '../assets/proyects/YSUR.png'
import DUKE from '../assets/proyects/DUKE.png'
import TECPETROL from '../assets/proyects/TECPETROL.png'
import CARTELLONE from '../assets/proyects/CARTELLONE.png'
import PETROBRAS from '../assets/proyects/PETROBRAS.png'
import PLUSPETROL from '../assets/proyects/PLUSPETROL.png'
import AMERICAS from '../assets/proyects/AMERICAS.png'
import GYP from '../assets/proyects/GYP.png'
import OILMS from '../assets/proyects/OILMS.png'
import BANCO from '../assets/proyects/BANCO.png'
import SCHLUMBERGER from '../assets/proyects/SCHLUMBERGER.png'
import SHAWCOR from '../assets/proyects/SHAWCOR.png'
import PANAMERICAN from '../assets/proyects/PANAMERICAN.png'

export const DISCIPLINAS = [
  { nombre: 'Ingeniería de Detalle', id: 1 },
  { nombre: 'Civil', id: 2 },
  { nombre: 'Piping', id: 3 },
  { nombre: 'Mecánica', id: 4 },
  { nombre: 'Electricidad', id: 5 },
  { nombre: 'Instrumentación y Control', id: 6 },
  { nombre: 'Ductos', id: 7 },
]

export const PROYECTOS_EMPRESA = [
  {
    cliente: 'YPF',
    imagen: YPF,
    color: '#0067B1',
    proyectos: [
      {
        desc: 'Adecuaciones en USP-EC 01 en Yacimiento Loma La Lata',
        disc_id: [1, 2, 3, 4, 5],
      },
      {
        desc: 'Adecuaciones USP04 Drenajes Presurizados - Sierra Barrosa',
        disc_id: [1, 2, 3, 4, 5],
      },
      {
        desc: 'Nuevo Pozo de Captación y Bombeo de Agua Río Neuquén y Reemplazo parcial de Acueducto.',
        disc_id: [1, 2, 3, 4, 5, 6],
      },
      {
        desc: 'Construcción muro Recinto de Tanques en Bat. 01-VAM, Plateas de Contención Line Break y Muro Contención Compresora VAM. Adecuación de Instrumentación y canalizaciones. Terminación de montaje de separador y PEM en Batería 01 VAM.',
        disc_id: [1, 2, 3, 4, 5, 6],
      },
      {
        desc: 'Tendido 1130 metros de ducto de caño ERFV 8” de RCI PTC ATD / Reemplazo de 1080 m CAÑO ERFV 8" acueducto 12” a 8” desde SAT-3 a SAT-1 / Tendido de 2600 m CAÑO ERFV 4" Nuevo oleoducto desde USP-EC SBR04 a BAT NG-2',
        disc_id: [1, 2, 3, 4, 7],
      },
      {
        desc: 'Construcciones, modificaciones y PEM en “Planta Compresora el Casquete”.',
        disc_id: [1, 2, 3, 4, 5, 6],
      },
      {
        desc: 'Montaje de tanque cortador 320 m3, montaje de tanque de stock 160 m3, montaje de 2 bombas alternativas tipo stork, const. y montaje de cañería asociada, montaje de la Instalación de Electricidad, Instrumentación y control.',
        disc_id: [1, 2, 3, 4, 5, 6],
      },
      {
        desc: 'Desarrollo de ingenieria de detalle montaje civil, mecanico, piping, electricidad e instrumentacion. Puesta en marcha',
        disc_id: [1, 2, 3, 4, 5, 6],
      },
      {
        desc: 'Mantenimiento general y readecuaciones de sistema de deshidratacion: torre contactora, regeneradora de glicol y construccion skid de filtrado, para Yacimiento Pampa de las Yeguas',
        disc_id: [1, 2, 3, 4, 6],
      },
      {
        desc: 'Líneas de flujo, gasoducto, deshidratadora, separador, venteos y pozo de quema en El Orejano - UN ANC / Mantenimiento general y readecuaciones de sistema de deshidratación: torre contactora, regeneradora de glicol y construcción skid de filtrado, para Yacimiento Pampa de las Yeguas',
        disc_id: [1, 2, 3, 4, 6],
      },
      {
        desc: 'Calentamiento de petroleo y tratamiento de agua de purga en Cabecera De Bombeo LLL - UN NG',
        disc_id: [1, 2, 3, 4, 5, 6],
      },
      {
        desc: 'Montaje y puesta en marcha de bombas de inyeccion y tendido de cañerias - El Porton',
        disc_id: [1, 2, 3, 4, 5, 6],
      },
      {
        desc: 'Montaje de lineas de flujo y colectores en el ambito de Loma Campana - UN ANC',
        disc_id: [1, 2, 3, 4],
      },
      {
        desc: 'Instalaciones tempranas de Lineas de flujo, gasoducto y colector en Rincon de Mangrullo - UN ANC',
        disc_id: [1, 2, 3, 4, 5],
      },
      {
        desc: 'Montaje de electrocompresor en USP -3 LLL',
        disc_id: [1, 2, 3, 4, 5],
      },
      {
        desc: 'Readecuacion de las instalaciones cabecera de bombeo, playa de tanques y planta PIA 1 - Unidad de Negocio Neuquen Gas',
        disc_id: [1, 2, 3, 4, 5, 6],
      },
      {
        desc: 'Interconexion TK Pulmon CAP 320 m3 PTC SCB - Unidad de Negocios Neuquen',
        disc_id: [1, 2, 3, 4, 5, 6],
      },
      {
        desc: 'Reemplazo tramos de oleoductos y acueductos ubicados en yacimiento La Ventana y Vizcacheras - Mendoza Norte. A su vez se deberá instalar sistemas line break en oleoducto',
        disc_id: [1, 3],
      },
      {
        desc: 'Operaciones de Hot Tap y Line Stop en diametros 2", 3", 4", 6", 8", 10" y 12" para la confeccion de 13 Tie In bateria 3 de LLL',
        disc_id: [1, 3],
      },
      {
        desc: 'Operaciones de Hot Tap en 8" en area No Convencionales de Loma Campana, para la confeccion de 4 Tie In.',
        disc_id: [1, 3],
      },
      {
        desc: 'Desarrollo de Ingenieria de detalle y construccion de las modificaciones para la adecuacion del colector de ingreso de gas a Planta LTS-1 de la Unidad de Negocios Neuquen Gas',
        disc_id: [1, 3, 4],
      },
      {
        desc: 'Flowlines 9 pozos - Instalacion temprana Rincon del Magrullo – Unidad de Negocios no convencionales.',
        disc_id: [1, 2, 3, 4, 5],
      },
      {
        desc: 'Normalizacion de líneas soterradas en Planta LTS-1 y LTS-2 – Unidad de negocios Neuquen Gas',
        disc_id: [1, 2, 3, 4],
      },
      {
        desc: 'Realizar el reemplazo de 6500 Mt. De cañeria de 8 pulgadas, y recuperacion de 3000 mts de cañeria 8" existente - UNMza',
        disc_id: [1, 3],
      },
      {
        desc: 'Los trabajos consisten en realizar el tendido de aprox. 2.550 metros de cañería de 6” API 5L X 42 5,16 mm, desnuda interior, exterior sobre caballetes a montar. A la cañería instalada se le debe realizar el tracing de mantenimiento y revestimiento exterior.',
        disc_id: [1, 3],
      },
      {
        desc: 'Tendido de acueducto loop Pta Tratamiento Aguada Toledo - Satelite 3, UNNG',
        disc_id: [1, 3],
      },
    ],
  },
  {
    cliente: 'TGS S.A',
    imagen: TGS,
    color: '#00A6D6',
    proyectos: [
      {
        desc: 'Mejoras en lineas de agua de refrigeracion en PC Rio Neuquen',
        disc_id: [1, 2, 3, 4, 5],
      },
      {
        desc: 'Montaje de back-up de compresión en Planta Río Neuquén',
        disc_id: [1, 2, 3, 4, 5, 6],
      },
      {
        desc: 'Instalación de un Separador General SG-002, con su Puente de medición, puente de regulación y cañerías asociadas. Instalación de dos Filtros Coalescentes y sus cañerías asociadas. Instalación de dos Plantas de Deshidratación de Gas por TEG, de 1 MM / 2 MM de procesamiento. Incorporación de by pass para PM 24” y para PM 620 16”.',
        disc_id: [1, 2, 3, 4, 5, 6],
      },
      {
        desc: 'Instalación de trampas de scrappers en loop Gasoducto Neuba II - Tramo Loma de La Lata e Instalación de Filtro de Partículas',
        disc_id: [1, 2, 3, 4, 5, 6],
      },
      {
        desc: 'Ingenieria de detalle, construcción de trampa Lanzadora y Trampa Recetora de scrapper en diametro 30" con construccion y montaje de gasoducto de 750 metros lineales de 30"',
        disc_id: [1, 2, 3, 5, 6],
      },
      {
        desc: 'Recouting de 4000 mts lineales de gasoducto Neuba 2',
        disc_id: [1, 2, 3, 4, 5],
      },
    ],
  },
  {
    cliente: 'TUBOSCOPE NOV',
    imagen: TUBOSCOPE,
    color: '#D71920',
    proyectos: [
      {
        desc: 'Confeccion de ingenieria de detalle de planta de tratamiento de lodos de perforacion de YPF Loma Campana',
        disc_id: [1],
      },
      {
        desc: 'Confeccion de ingenieria de detalle de planta de agua de Flow Back en PC Tecpetrol Fortin de Piedra',
        disc_id: [1],
      },
      {
        desc: 'Construccion de Planta de Agua de Flow Back en PC Tecpetrol Fortin de Piedra',
        disc_id: [2, 3, 4, 5],
      },
      {
        desc: 'Montaje mecanico y electrico de planta de Lodos en Yacimiento Loma Campana',
        disc_id: [3, 4, 5],
      },
    ],
  },
  {
    cliente: 'CAPEX',
    imagen: CAPEX,
    color: '#C7202F',
    proyectos: [
      {
        desc: 'Construccion de bateria La Yesera',
        disc_id: [1, 2, 3, 4, 5],
      },
    ],
  },
  {
    cliente: 'OLDELVAL Oleoductos del Valle S.A.',
    imagen: OLDELVAL,
    color: '#F28C28',
    proyectos: [
      {
        desc: 'Montaje de de Tanque Pulmón de Gas, Odorizador e Instalaciones Asociadas en EB Lago Pellegrini.',
        disc_id: [1, 2, 3, 4, 5],
      },
      {
        desc: 'Ingenieria de detalle y Montaje mecanico, electrico, instrumentacion, civil de caudalimetros de medicion y densitometros de salida de oleoducto Puesto Hernandez Medanito',
        disc_id: [1, 2, 3, 5, 6],
      },
      {
        desc: 'Sistema drenajes sumidero EB MEDANITO. Adecuación Tk 3 para montaje membrana flotante EB ALLEN. Montaje Línea entrada a Tk 3 y mejora entrada de crudo cargador Chevron EB ALLEN. Traslado booster Tk2 a pie Tk 3. Montaje caudalímetros EB MEDANITO y PTO HDEZ. Instalar radares EB Allen; EB Medanito; EB Pto Hdez',
        disc_id: [1, 2, 3, 4, 5, 6],
      },
    ],
  },
  {
    cliente: 'MEGA',
    imagen: MEGA,
    color: '#78BE20',
    proyectos: [
      {
        desc: 'Servicio de instalación de nuevo compresor de aire en planta Loma La Lata.',
        disc_id: [1, 2, 3, 4, 5, 6],
      },
      {
        desc: 'Construccion y montaje de obras para diversos equipos',
        disc_id: [2, 3, 4],
      },
    ],
  },
  {
    cliente: 'CAMUZZI GAS DEL SUR',
    imagen: CAMUZZI,
    color: '#006CB5',
    proyectos: [
      {
        desc: 'Refuerzo Red General Neuquén - Provincia de Neuquén',
        disc_id: [1, 2, 3, 4, 5],
      },
      {
        desc: 'Reformas de plantas reguladores y tramos de gasoductos en VLA-NQN-CHELFORO',
        disc_id: [1, 2, 3, 4, 5, 6],
      },
      {
        desc: 'Renovacion de 100 mts de cañeria de gasoducto - F.M. Chos Malal',
        disc_id: [3],
      },
    ],
  },
  {
    cliente: 'EXXON',
    imagen: EXXON,
    color: '#E1251B',
    proyectos: [
      {
        desc: 'Ingenieria de detalle, montaje mecanico, piping, civil e instrumentacion para el tendido de flow line de 4" mas coneccion de dos pozos productores con puentes de medicion y produccion',
        disc_id: [1, 2, 3, 5, 6],
      },
    ],
  },
  {
    cliente: 'YSUR',
    imagen: YSUR,
    color: '#005DAA',
    proyectos: [
      {
        desc: 'Operaciones de Hot Tap en líneas de gas y petróleo en área planta Fernandez Oro',
        disc_id: [1, 3],
      },
      {
        desc: 'Cambios de 2 tramos de oleoducto de 8" de Planta Fernandez Oro a Planta de entrega de Oldelval SA, en Pk 8,14 y 9,098 con utilizacion de operaciones de hot tap y line stop',
        disc_id: [1, 3],
      },
      {
        desc: 'Desvinculacion de linea de venteo en planta compresora EFO, con utilizacion de operaciones de hot tap y line stop',
        disc_id: [1, 3],
      },
    ],
  },
  {
    cliente: 'DUKE ENERGY (ORAZUL)',
    imagen: DUKE,
    color: '#F58220',
    proyectos: [
      {
        desc: 'Construccion y montaje de muros para llamas de central El Portezuelo',
        disc_id: [1, 2, 4],
      },
      {
        desc: 'Provision y aplicación de pintura en compuertas y bombas auxiliares de sector Portezuelo',
        disc_id: [1, 2],
      },
    ],
  },
  {
    cliente: 'TECPETROL',
    imagen: TECPETROL,
    color: '#D71920',
    proyectos: [
      {
        desc: 'Provision y Montaje de cercos perimetrales en yacimientos Los Bastos, Fortin de Piedra, Los Loros.',
        disc_id: [1, 2],
      },
      {
        desc: 'Construccion de cercos olimpicos en Fortin de Piedra, Agua Salada, Los Ranqueles y Los Toldos',
        disc_id: [2],
      },
    ],
  },
  {
    cliente: 'CARTELLONE S.A',
    imagen: CARTELLONE,
    color: '#F58220',
    proyectos: [
      {
        desc: 'Desarrollo de Ingenieria, Prefabricados de piping y montaje de piping para Planta Cabecera de Bombeo LLL',
        disc_id: [1, 3],
      },
      {
        desc: 'Soldadura de 5000 metros gasoducto 4" Loma Campana Planta de Arena.',
        disc_id: [3, 4],
      },
    ],
  },
  {
    cliente: 'PETROBRAS ARGENTINA S.A',
    imagen: PETROBRAS,
    color: '#008542',
    proyectos: [
      {
        desc: 'Desarrollo de ingenieria de detalle montaje civil, mecanico, piping, electricidad e instrumentacion. Puesta en marcha',
        disc_id: [1, 2, 3, 4, 5, 6],
      },
      {
        desc: 'Ejecucion de lineas de Flow line en diametros 4", 6", 8" a demanda (7000 metros lineales)',
        disc_id: [1, 2, 3, 4],
      },
      {
        desc: 'Construcción tomas a procesos y soportería, Montaje transmisores e instrumentos de campo, Conexión cañerías del instrumento a procesos, Configuración de transmisores, Instalación válvulas control, Conexión eléctrica instrumentos para alimentación, Conexión eléctrica de instrumentos con SCADA, Chequeo de lazo.',
        disc_id: [1, 2, 3, 4, 5, 6],
      },
      {
        desc: 'Modicficacion drenaje y venteo de 14 baterias, e instalacion de valvula de seguridad de Tks de las baterias.',
        disc_id: [1, 3, 4],
      },
      {
        desc: 'Ampliacion baterias 1-3-5-6-7-8 – Puesto Hernandez (RDLS). Se realizaron modificaciones diseño del cuadro de la válvula reguladora, reemplazos de líneas de conducción existentes por cañería en acero inoxidable AISI 316L, colocaron uniones bridadas, reemplazos de líneas de conducción existentes.',
        disc_id: [1, 2, 3, 4],
      },
    ],
  },
  {
    cliente: 'PLUSPETROL',
    imagen: PLUSPETROL,
    color: '#6F2DA8',
    proyectos: [
      {
        desc: 'Montaje de lineas Yacimiento Centenario, Gasoducto de 6" y USP en Puesto Touquet',
        disc_id: [1, 2, 3, 4, 5, 6],
      },
      {
        desc: 'Obras civiles, construccion y montaje de Tk 500 m3, piping de PRFV, piping de gas, instrumentacion y catodica.',
        disc_id: [1, 2, 3, 4, 5, 6],
      },
      {
        desc: 'Diseñar, proveer la ingeniería de detalle y constructiva, construir, montar, precomisionar, comisionar y poner en servicio la Planta Compresora PC4 en Yacimiento Centenario',
        disc_id: [1, 2, 3, 4, 5, 6],
      },
    ],
  },
  {
    cliente: 'AMERICAS PETROGAS ARGENTINA S.A',
    imagen: AMERICAS,
    color: '#F4B000',
    proyectos: [
      {
        desc: 'Ejecución de las obras Eléctricas y de Piping para la construcción de la Usina de Generación Eléctrica - Yacimiento Medanito Sur',
        disc_id: [1, 3, 4, 5, 6],
      },
      {
        desc: 'Construcción de USP “Batería El Jabalí” con tres colectores, dos Separadores bifásicos, tres tanques pulmón de crudo de 160m3, dos bombas tornillo para trasvase. Medición de Producción, implementada con dos mediciones, Cargadero de Camiones, también dispone de derivación a Oleoducto.',
        disc_id: [1, 2, 3, 4, 5, 6],
      },
    ],
  },
  {
    cliente: 'GYP - ENARSA',
    imagen: GYP,
    color: '#00A3E0',
    proyectos: [
      {
        desc: 'Movimientos de suelos, apertura de caminos, construccion de 4 locaciones con bodega y anclaje de riendas en Aguada del Chañar y Bosque Chañar',
        disc_id: [1, 2],
      },
    ],
  },
  {
    cliente: 'OIL MS',
    imagen: OILMS,
    color: '#F58220',
    proyectos: [
      {
        desc: 'Revamping planta de tratamiento. El Huemul 1 - 1° etapa',
        disc_id: [1, 2, 3, 4],
      },
    ],
  },
  {
    cliente: 'BANCO NACION ARGENTINA SUCURSAL NEUQUEN',
    imagen: BANCO,
    color: '#005BAA',
    proyectos: [
      {
        desc: 'Reparaciones varias y aplicación de pintura en sucursal calle Planas de Neuquen',
        disc_id: [2],
      },
    ],
  },
  {
    cliente: 'SCHLUMBERGER',
    imagen: SCHLUMBERGER,
    color: '#00A3E0',
    proyectos: [
      {
        desc: 'Desmontaje civil y mecanico de instalaciones',
        disc_id: [2, 3, 4],
      },
      {
        desc: 'Tareas de abandono de locacion La Invernada LAL-X3',
        disc_id: [2, 3, 4, 5],
      },
    ],
  },
  {
    cliente: 'Shawcor',
    imagen: SHAWCOR,
    color: '#005EB8',
    proyectos: [
      {
        desc: 'Tendido 1000 m de flex pipe en Sierra Barrosa YPF. Reparación en línea de Flex pipe de 4" para PAE',
        disc_id: [3],
      },
    ],
  },
  {
    cliente: 'Pan American Energy',
    imagen: PANAMERICAN,
    color: '#003A70',
    proyectos: [
      {
        desc: 'Servicio de limpieza interna del oleoducto de 6” tramo Planta Lindero Oriental – Planta Centenario',
        disc_id: [6],
      },
    ],
  },
]
