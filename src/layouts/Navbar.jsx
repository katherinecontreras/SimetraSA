/**
 * Barra de navegación fija, transparente, sobre el contenido.
 * Por debajo de 640px: logo + hamburguesa; el panel se despliega desde arriba.
 * A partir de sm: enlaces en fila y Postulate.
 *
 * Desktop: el texto hace lerp con `navLightBlend`. En móvil el menú va sobre
 * el overlay oscuro: enlaces, Postulate e icono (menú abierto) en blanco fijo.
 */

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

import { useHomeNavTheme } from '../context/HomeNavThemeContext'
import iconLogo from '../assets/IconLogo.png'

const ACCENT_BLUE = '#6CBFE0'

const fontNav =
  'font-[family-name:var(--font-subtitle)] text-[0.95rem] font-medium tracking-wide '

const fontNavMobileMenu = `${fontNav} text-white`

/** Píxeles bajo el botón Postulate; overlay desde top=0 hasta acá. */
const MOBILE_MENU_DIM_EXTRA = 16

/** Línea acento: entra desde la izquierda; al soltar hover se encoge con origen izq. (efecto derecha→izquierda). */
const navItemUnderline =
  'pointer-events-none absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100'

/** Lerp 0 = dark, 1 = light vía `color-mix` (mismo criterio que el overlay). */
function colorMix(t, toLight, toDark) {
  const a = Math.max(0, Math.min(1, t))
  return `color-mix(in srgb, ${toLight} ${(a * 100).toFixed(2)}%, ${toDark} ${((1 - a) * 100).toFixed(2)}%)`
}

const RGB_DARK = 'rgb(15 23 42 / 0.9)'
const RGB_LIGHT = 'rgb(255 255 255)'

function navForeground(t) {
  return colorMix(t, RGB_LIGHT, RGB_DARK)
}

function hamburgerColor(t) {
  return colorMix(t, 'rgb(255 255 255)', 'rgb(15 23 42)')
}

function postulateTextColor(t) {
  return colorMix(t, 'rgb(255 255 255)', 'rgb(15 23 42)')
}

function MenuIcon({ open, barColor }) {
  return (
    <span className="relative block h-5 w-5" aria-hidden>
      <span
        className={`absolute left-0 top-1 h-0.5 w-5 origin-center rounded-full transition ${
          open ? 'top-1/2 -translate-y-1/2 rotate-45' : ''
        }`}
        style={{ backgroundColor: barColor }}
      />
      <span
        className={`absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 rounded-full transition ${
          open ? 'scale-0 opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundColor: barColor }}
      />
      <span
        className={`absolute bottom-1 left-0 h-0.5 w-5 origin-center rounded-full transition ${
          open ? 'bottom-1/2 top-auto translate-y-1/2 -rotate-45' : ''
        }`}
        style={{ backgroundColor: barColor }}
      />
    </span>
  )
}

export function Navbar() {
  const { pathname } = useLocation()
  const { navLightBlend: t, navReloadHomeOnClick } = useHomeNavTheme()
  const menuId = useId()
  const [mobileOpen, setMobileOpen] = useState(false)
  const postulateBlockRef = useRef(null)
  const menuRootRef = useRef(null)
  const [mobileDimHeight, setMobileDimHeight] = useState(0)

  const measureMobileDim = useCallback(() => {
    if (!postulateBlockRef.current) return
    const b = postulateBlockRef.current.getBoundingClientRect()
    if (b.bottom < 2) return
    setMobileDimHeight(
      Math.min(Math.ceil(b.bottom + MOBILE_MENU_DIM_EXTRA), window.innerHeight),
    )
  }, [])

  const linkStyle = useMemo(() => ({ color: navForeground(t) }), [t])
  const headerStyle = useMemo(
    () => ({
      paddingTop: 'max(0.5rem, env(safe-area-inset-top, 0px))',
      backgroundColor: 'transparent',
    }),
    [],
  )
  const postStyle = useMemo(
    () => ({
      backgroundColor: ACCENT_BLUE,
      color: postulateTextColor(t),
    }),
    [t],
  )
  const barColor = useMemo(() => hamburgerColor(t), [t])
  /** Sobre el overlay, icono y textos móviles fijos en blanco; con menú cerrado el icono sigue al tema de la home. */
  const mobileHamburgerColor = mobileOpen ? '#ffffff' : barColor
  const postulateMobileStyle = useMemo(
    () => ({ backgroundColor: ACCENT_BLUE, color: '#ffffff' }),
    [],
  )

  const closeMenu = useCallback(() => {
    setMobileOpen(false)
    setMobileDimHeight(0)
  }, [])

  const handleHomeClick = useCallback(
    (event) => {
      if (!navReloadHomeOnClick) {
        closeMenu()
        return
      }

      event.preventDefault()
      closeMenu()
      if (pathname === '/') {
        window.location.reload()
        return
      }
      window.location.assign('/')
    },
    [closeMenu, navReloadHomeOnClick, pathname],
  )

  useLayoutEffect(() => {
    if (!mobileOpen) return
    const run = () => {
      measureMobileDim()
    }
    run()
    const a = requestAnimationFrame(() => {
      run()
      requestAnimationFrame(run)
    })
    return () => cancelAnimationFrame(a)
  }, [mobileOpen, measureMobileDim])

  useEffect(() => {
    if (!mobileOpen) return
    const el = postulateBlockRef.current
    const menuRoot = menuRootRef.current
    const ro = new ResizeObserver(() => measureMobileDim())
    if (el) ro.observe(el)
    if (menuRoot) ro.observe(menuRoot)
    const onWin = () => measureMobileDim()
    window.addEventListener('resize', onWin)
    onWin()
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', onWin)
    }
  }, [mobileOpen, measureMobileDim])

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)')
    const onChange = () => {
      if (mq.matches) {
        setMobileOpen(false)
        setMobileDimHeight(0)
      }
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMobileOpen(false)
      setMobileDimHeight(0)
    })
    return () => cancelAnimationFrame(id)
  }, [pathname])

  return (
    <header
      className="pointer-events-none fixed top-0 left-0 z-11000 w-full transition-colors duration-300"
      style={headerStyle}
    >
      <AnimatePresence>
        {mobileOpen && (
          <Motion.div
            key="nav-mobile-backdrop"
            role="presentation"
            className="pointer-events-auto fixed top-0 left-0 z-0 w-full max-w-full bg-black/70 sm:hidden"
            style={{ height: mobileDimHeight > 0 ? mobileDimHeight : 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={closeMenu}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <div className="pointer-events-auto relative z-20 flex h-14 w-full max-w-full items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center"
          onClick={handleHomeClick}
          aria-label="Inicio, Simetra"
        >
          <img
            src={iconLogo}
            alt="Simetra"
            className="h-8 w-auto object-contain sm:h-9"
            width={120}
            height={40}
            decoding="async"
          />
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-end gap-6 sm:flex sm:gap-8"
          aria-label="Principal"
        >
          <ul className="flex flex-nowrap items-center gap-5 sm:gap-8">
            <li>
              <Link
                to="/"
                className={`${fontNav} group relative inline-block`}
                style={linkStyle}
                onClick={handleHomeClick}
              >
                Home
                <span
                  className={navItemUnderline}
                  style={{ backgroundColor: ACCENT_BLUE }}
                  aria-hidden
                />
              </Link>
            </li>
            <li>
              <Link
                to="/proyects"
                className={`${fontNav} group relative inline-block`}
                style={linkStyle}
              >
                Proyectos
                <span
                  className={navItemUnderline}
                  style={{ backgroundColor: ACCENT_BLUE }}
                  aria-hidden
                />
              </Link>
            </li>
            <li>
              <Link
                to="/contacto"
                className={`${fontNav} group relative inline-block`}
                style={linkStyle}
              >
                Contacto
                <span
                  className={navItemUnderline}
                  style={{ backgroundColor: ACCENT_BLUE }}
                  aria-hidden
                />
              </Link>
            </li>
          </ul>
          <Link
            to="/postulacion"
            className="shrink-0 rounded-lg px-4 py-2 text-center text-sm font-semibold shadow-sm transition-[color] duration-100 hover:brightness-95 active:scale-[0.99] font-(family-name:--font-subtitle)"
            style={postStyle}
          >
            Postulate
          </Link>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md sm:hidden"
          onClick={() => {
            setMobileOpen((o) => {
              if (o) setMobileDimHeight(0)
              return !o
            })
          }}
          aria-expanded={mobileOpen}
          aria-controls={menuId}
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <MenuIcon open={mobileOpen} barColor={mobileHamburgerColor} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <Motion.div
            id={menuId}
            key="mobile-panel"
            className="pointer-events-auto relative z-10 sm:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 36, mass: 0.5 }}
            style={{ overflow: 'hidden' }}
            onAnimationComplete={measureMobileDim}
          >
            <Motion.div
              ref={menuRootRef}
              className="mt-0 bg-transparent px-4 pb-8 pt-3"
              data-mobile-menu
              initial={{ y: -12, opacity: 0.85 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              onAnimationComplete={measureMobileDim}
            >
              <ul className="flex flex-col items-center gap-5 pt-1 text-center">
                <li className="flex w-full justify-center">
                  <Link
                    to="/"
                    className={`${fontNavMobileMenu} group relative inline-block`}
                    onClick={handleHomeClick}
                  >
                    Home
                    <span
                      className={navItemUnderline}
                      style={{ backgroundColor: ACCENT_BLUE }}
                      aria-hidden
                    />
                  </Link>
                </li>
                <li className="flex w-full justify-center">
                  <Link
                    to="/proyects"
                    className={`${fontNavMobileMenu} group relative inline-block`}
                    onClick={closeMenu}
                  >
                    Proyectos
                    <span
                      className={navItemUnderline}
                      style={{ backgroundColor: ACCENT_BLUE }}
                      aria-hidden
                    />
                  </Link>
                </li>
                <li className="flex w-full justify-center">
                  <Link
                    to="/contacto"
                    className={`${fontNavMobileMenu} group relative inline-block`}
                    onClick={closeMenu}
                  >
                    Contacto
                    <span
                      className={navItemUnderline}
                      style={{ backgroundColor: ACCENT_BLUE }}
                      aria-hidden
                    />
                  </Link>
                </li>
              </ul>
              <div
                ref={postulateBlockRef}
                className="mx-auto flex w-full max-w-xs justify-center pt-6"
              >
                <Link
                  to="/postulacion"
                  onClick={closeMenu}
                  className="w-full rounded-lg px-6 py-3 text-center text-sm font-semibold shadow-sm font-(family-name:--font-subtitle)"
                  style={postulateMobileStyle}
                >
                  Postulate
                </Link>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}