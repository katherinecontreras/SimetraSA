import grua from '../assets/home/section4/Satelites3,5y7/grua.png'
import fondoGrua from '../assets/home/section4/Satelites3,5y7/fondoSatelites.png'
import img1grua from '../assets/home/section4/Satelites3,5y7/img1.png'
import img2grua from '../assets/home/section4/Satelites3,5y7/img2.png'
import img3grua from '../assets/home/section4/Satelites3,5y7/img3.png'
import img4grua from '../assets/home/section4/Satelites3,5y7/img4.png'
import img5grua from '../assets/home/section4/Satelites3,5y7/img5.png'
import img6grua from '../assets/home/section4/Satelites3,5y7/img6.png'
import img7grua from '../assets/home/section4/Satelites3,5y7/img7.png'
import img8grua from '../assets/home/section4/Satelites3,5y7/img8.png'

import tanque from '../assets/home/section4/MontajeLTS/tanque.png'
import fondoTanque from '../assets/home/section4/MontajeLTS/fondoMontaje.png'
import img1tanque from '../assets/home/section4/MontajeLTS/img1.jpeg'
import img2tanque from '../assets/home/section4/MontajeLTS/img2.jpeg'
import img3tanque from '../assets/home/section4/MontajeLTS/img3.jpeg'
import img4tanque from '../assets/home/section4/MontajeLTS/img4.jpeg'
import img5tanque from '../assets/home/section4/MontajeLTS/img5.jpeg'
import img6tanque from '../assets/home/section4/MontajeLTS/img6.jpeg'
import img7tanque from '../assets/home/section4/MontajeLTS/img7.jpeg'
import img8tanque from '../assets/home/section4/MontajeLTS/img8.jpeg'

import plano from '../assets/home/section4/USP7/plano.png'
import fondoPlano from '../assets/home/section4/USP7/fondoUSP7.jpg'

export const PROYECTOS_RECIENTES = [
  {
    id: 'proyecto1',
    title: 'Montaje Lts',
    imgFondo: fondoTanque,
    imgSobreFondo: tanque,
    parrafos: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    ],
    tipoMedia: "Imagenes",
    video: "",
    ubicacion: '251 Loma de la Lata LTS1', 
    coordenadas: [-38.5451, -68.6031],
    imagenes:[img1tanque, img2tanque, img3tanque, img4tanque, img5tanque, img6tanque, img7tanque, img8tanque],
  },
  {
    id: 'proyecto2',
    title: 'Satelite 3,4 & 5',
    imgFondo: fondoGrua,
    imgSobreFondo: grua,
    parrafos: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    ],
    ubicacion: '252 satelites LAS 357 ( yacimiento Laje y Yacimiento Langostura)', 
    coordenadas: [-38.5451, -68.6031],
    tipoMedia: "Imagenes",
    video: "",
    imagenes:[img1grua, img2grua, img3grua, img4grua, img5grua, img6grua, img7grua, img8grua],
  },
  {
    id: 'proyecto3',
    title: 'USPOF',
    imgFondo: fondoPlano,
    imgSobreFondo: plano,
    parrafos: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    ],
    ubicacion: '254 USPO7 Loma de la Lata', 
    coordenadas: [-38.5451, -68.6031],
    tipoMedia: "Nada",
    video: "",
    imagenes:[],
  },
]
