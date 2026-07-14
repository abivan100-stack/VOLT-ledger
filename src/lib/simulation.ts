/**
 * Ported verbatim from the original prototype's `sunAt`/`conAt`/`simTick`
 * methods (Ledger.dc.html). Math is unchanged from the prototype — Phase 1
 * of VOLT_BUILD_PLAN.md replaces this with a full 24h day model.
 */

export function sunAt(minuteOfDay: number): number {
  const hour = minuteOfDay / 60
  if (hour < 6 || hour > 19) return 0
  return Math.sin((Math.PI * (hour - 6)) / 13)
}

export function consumptionAt(minuteOfDay: number, baseLoad: number): number {
  const morningBump = Math.exp(-(((minuteOfDay - 8 * 60) / 95) ** 2))
  const eveningBump = Math.exp(-(((minuteOfDay - 20 * 60) / 120) ** 2))
  const daytimeBaseline = minuteOfDay > 7 * 60 && minuteOfDay < 19 * 60 ? 0.22 : 0.08
  return baseLoad * (0.5 + 1.05 * morningBump + 1.7 * eveningBump + daytimeBaseline)
}

export function integrateGenerationAndConsumption(
  pv: number,
  baseLoad: number,
  uptoMinute: number,
): { gen: number; con: number } {
  let gen = 0
  let con = 0
  for (let minute = 360; minute < uptoMinute; minute += 10) {
    gen += pv * sunAt(minute) * 0.9 * (10 / 60)
    con += consumptionAt(minute, baseLoad) * (10 / 60)
  }
  return { gen, con }
}

export interface HouseholdTick {
  out: number
  draw: number
  net: number
}

export function tickHousehold(
  pv: number,
  baseLoad: number,
  phaseOffset: number,
  simMinute: number,
): HouseholdTick {
  const sun = sunAt(simMinute)
  const cloud = 0.82 + 0.18 * Math.sin(performance.now() / 9000 + phaseOffset)
  const out = Math.max(0, pv * sun * cloud * (0.95 + 0.1 * Math.random()))
  const eveningBump = simMinute > 17 * 60 ? 0.5 : 0
  const draw = baseLoad * (0.8 + 0.4 * Math.random()) + eveningBump
  return { out, draw, net: out - draw }
}

export function nextCommunityRate(currentRate: number, supply: number, demand: number): number {
  const target = Math.min(7.2, Math.max(4.4, 5.5 + (demand - supply) * 0.3))
  return currentRate + (target - currentRate) * 0.25 + (Math.random() - 0.5) * 0.05
}
