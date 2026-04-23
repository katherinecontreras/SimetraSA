/**
 * Tema de la barra en home: mezcla 0 = texto/pictos como en hero, 1 = claro
 * (sección oscura o scroll del hero con el overlay negro).
 * `HomePage` publica 0..1 con setNavLightBlend.
 */

import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const HomeNavThemeContext = createContext(null)

export function HomeNavThemeProvider({ children }) {
  const [navLightBlend, setNavLightBlendState] = useState(0)
  const setNavLightBlend = useCallback((v) => {
    const n = typeof v === 'number' && Number.isFinite(v) ? v : 0
    setNavLightBlendState(Math.max(0, Math.min(1, n)))
  }, [])

  const value = useMemo(
    () => ({ navLightBlend, setNavLightBlend }),
    [navLightBlend, setNavLightBlend],
  )
  return (
    <HomeNavThemeContext.Provider value={value}>
      {children}
    </HomeNavThemeContext.Provider>
  )
}

export function useHomeNavTheme() {
  const ctx = useContext(HomeNavThemeContext)
  if (!ctx) {
    return { navLightBlend: 0, setNavLightBlend: () => {} }
  }
  return ctx
}
