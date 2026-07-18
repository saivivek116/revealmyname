import { allEn } from 'human-names'

const normalized = allEn
  .map((name) => name.toUpperCase())
  .filter((name) => /^[A-Z]{3,10}$/.test(name))

export const VALID_NAMES: Set<string> = new Set(normalized)

export const NAME_POOL: string[] = [...VALID_NAMES]
