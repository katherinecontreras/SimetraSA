import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { LoadingScreen } from '../layouts/LoadingScreen'
import { RouteTransitionContext } from './useRouteTransition'

const REVEAL_DELAY = 180

function currentPath(location) {
  return `${location.pathname}${location.search}${location.hash}`
}

function scrollToPageTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0

  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    })
  })
}

export function RouteTransitionProvider({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const timersRef = useRef([])
  const [transition, setTransition] = useState({
    active: false,
    isLoaded: false,
    target: null,
  })

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current = []
  }, [])

  const addTimer = useCallback((callback, delay) => {
    const timer = window.setTimeout(callback, delay)
    timersRef.current.push(timer)
  }, [])

  const navigateWithTransition = useCallback(
    (to) => {
      if (to === currentPath(location)) return false

      clearTimers()
      setTransition({
        active: true,
        isLoaded: false,
        target: to,
      })

      return true
    },
    [clearTimers, location],
  )

  useEffect(() => {
    if (!transition.active || transition.target !== currentPath(location)) return

    scrollToPageTop()
    addTimer(() => {
      scrollToPageTop()
      setTransition((current) => (
        current.active ? { ...current, isLoaded: true } : current
      ))
    }, REVEAL_DELAY)
  }, [addTimer, location, transition.active, transition.target])

  useLayoutEffect(() => {
    scrollToPageTop()
  }, [location.pathname, location.search])

  useEffect(() => clearTimers, [clearTimers])

  const value = useMemo(
    () => ({
      isTransitioning: transition.active,
      navigateWithTransition,
    }),
    [navigateWithTransition, transition.active],
  )

  return (
    <RouteTransitionContext.Provider value={value}>
      {children}
      {transition.active && (
        <LoadingScreen
          animateEnter
          isLoaded={transition.isLoaded}
          color="#2B71AC"
          onEnterComplete={() => {
            if (transition.target && transition.target !== currentPath(location)) {
              navigate(transition.target)
            }
          }}
          onExit={() => {
            clearTimers()
            setTransition({
              active: false,
              isLoaded: false,
              target: null,
            })
          }}
        />
      )}
    </RouteTransitionContext.Provider>
  )
}
