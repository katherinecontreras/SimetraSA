import { createContext, useContext } from 'react'

export const RouteTransitionContext = createContext(null)

export function useRouteTransition() {
  const ctx = useContext(RouteTransitionContext)
  if (!ctx) {
    return {
      isTransitioning: false,
      navigateWithTransition: () => false,
    }
  }
  return ctx
}
