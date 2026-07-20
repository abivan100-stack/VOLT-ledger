/**
 * Shared net-flow classification, used identically by the household cards
 * and the dossier — previously duplicated as two separate types
 * (HouseholdStatus / DossierStatus) with the same threshold re-derived twice.
 */
export const HOUSEHOLD_STATUSES = ['EXPORTING', 'IMPORTING', 'BALANCED'] as const
export type HouseholdStatus = (typeof HOUSEHOLD_STATUSES)[number]

const NET_THRESHOLD_KW = 0.15

export function statusForNet(net: number): HouseholdStatus {
  if (net > NET_THRESHOLD_KW) return 'EXPORTING'
  if (net < -NET_THRESHOLD_KW) return 'IMPORTING'
  return 'BALANCED'
}
