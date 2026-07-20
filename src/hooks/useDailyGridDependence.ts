import { useMemo } from 'react'
import { useEnergyStore, type Household } from '../store/useEnergyStore'
import { dailyGridDependence, type GridDependenceBreakdown } from '../lib/gridDependence'
import type { DayType } from '../lib/simulation'

/**
 * Module-level, single-entry cache. `dailyGridDependence` integrates over
 * 144 timesteps per household — GridDependenceMeter and AutonomyScore both
 * need the identical result in the same render pass. `useMemo` alone can't
 * share work across component instances (each gets its own cache), so this
 * cache sits above both: whichever of the two components renders first
 * actually computes it, the other reuses the result. `households`/`dayType`
 * are only ever new references when the store actually produces new state
 * (via `.map()` in tick()/setDayType()), so reference equality here is exactly
 * as safe as the `useMemo` dependency arrays this replaces.
 */
let cachedHouseholds: Household[] | null = null
let cachedDayType: DayType | null = null
let cachedResult: GridDependenceBreakdown | null = null

function memoizedDailyGridDependence(households: Household[], dayType: DayType): GridDependenceBreakdown {
  if (cachedResult && cachedHouseholds === households && cachedDayType === dayType) {
    return cachedResult
  }
  cachedHouseholds = households
  cachedDayType = dayType
  cachedResult = dailyGridDependence(households, dayType)
  return cachedResult
}

export function useDailyGridDependence(): GridDependenceBreakdown {
  const households = useEnergyStore((state) => state.households)
  const dayType = useEnergyStore((state) => state.dayType)
  return useMemo(() => memoizedDailyGridDependence(households, dayType), [households, dayType])
}
