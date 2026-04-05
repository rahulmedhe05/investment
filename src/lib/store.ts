export interface Investment {
  id: string
  amount: number
  annualReturn: number
  startDate: string
  lockPeriod: number // days - minimum lock before early withdrawal
  investmentDuration: number // days - total investment period (365)
  maturityDate: string
  lockEndDate: string
  packageName: string
}

export interface User {
  id: string
  password: string
  name: string
  phone: string
  investments: Investment[]
  createdAt: string
}

export interface AppConfig {
  starterReturn: number
  proReturn: number
  starterLockDays: number
  proLockDays: number
}

// In-memory store
const store: { users: Record<string, User>; config: AppConfig } = {
  users: {},
  config: {
    starterReturn: 18,
    proReturn: 21,
    starterLockDays: 90,
    proLockDays: 180,
  },
}

export function getStore() {
  return store
}

export function getUser(id: string): User | undefined {
  return store.users[id]
}

export function createUser(name?: string, phone?: string, password?: string): User {
  const id = 'WO-' + Math.random().toString(36).substring(2, 8).toUpperCase()
  const pwd = password || Math.random().toString(36).substring(2, 10)
  const user: User = { id, password: pwd, name: name || '', phone: phone || '', investments: [], createdAt: new Date().toISOString() }
  store.users[id] = user
  return user
}

export function updateUser(id: string, data: { name?: string; phone?: string; password?: string }): User | null {
  const user = store.users[id]
  if (!user) return null
  if (data.name !== undefined) user.name = data.name
  if (data.phone !== undefined) user.phone = data.phone
  if (data.password !== undefined) user.password = data.password
  return user
}

export function deleteUser(id: string): boolean {
  if (!store.users[id]) return false
  delete store.users[id]
  return true
}

export function deleteInvestment(userId: string, investmentId: string): boolean {
  const user = store.users[userId]
  if (!user) return false
  const idx = user.investments.findIndex(i => i.id === investmentId)
  if (idx === -1) return false
  user.investments.splice(idx, 1)
  return true
}

export function verifyUser(id: string, password: string): User | null {
  const user = store.users[id]
  if (!user || user.password !== password) return null
  return user
}

export function addInvestment(userId: string, packageType: 'starter' | 'pro'): Investment | null {
  const user = store.users[userId]
  if (!user) return null

  const config = store.config
  const amount = packageType === 'starter' ? 50000 : 100000
  const annualReturn = packageType === 'starter' ? config.starterReturn : config.proReturn
  const lockPeriod = packageType === 'starter' ? config.starterLockDays : config.proLockDays
  const investmentDuration = 365
  const startDate = new Date()
  const maturityDate = new Date(startDate.getTime() + investmentDuration * 86400000)
  const lockEndDate = new Date(startDate.getTime() + lockPeriod * 86400000)

  const investment: Investment = {
    id: 'INV-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    amount,
    annualReturn,
    startDate: startDate.toISOString(),
    lockPeriod,
    investmentDuration,
    maturityDate: maturityDate.toISOString(),
    lockEndDate: lockEndDate.toISOString(),
    packageName: packageType === 'starter' ? 'Starter Package' : 'Pro Package',
  }

  user.investments.push(investment)
  return investment
}

export function getAllUsers(): User[] {
  return Object.values(store.users)
}

export function resetStore() {
  store.users = {}
  store.config = { starterReturn: 18, proReturn: 21, starterLockDays: 90, proLockDays: 180 }
}

export function updateConfig(config: Partial<AppConfig>) {
  Object.assign(store.config, config)
}

export function calculateCurrentValue(investment: Investment): number {
  const now = new Date()
  const start = new Date(investment.startDate)
  const daysPassed = Math.max(0, (now.getTime() - start.getTime()) / 86400000)
  const dailyRate = investment.annualReturn / 100 / 365
  return investment.amount * Math.pow(1 + dailyRate, daysPassed)
}

export function getGrowthPercentage(investment: Investment): number {
  const current = calculateCurrentValue(investment)
  return ((current - investment.amount) / investment.amount) * 100
}

export function isLocked(investment: Investment): boolean {
  return new Date() < new Date(investment.lockEndDate)
}

export function isMatured(investment: Investment): boolean {
  return new Date() >= new Date(investment.maturityDate)
}

export function getMaturityValue(investment: Investment): number {
  const dailyRate = investment.annualReturn / 100 / 365
  return investment.amount * Math.pow(1 + dailyRate, investment.investmentDuration)
}

export function getDaysRemaining(investment: Investment): number {
  const diff = new Date(investment.maturityDate).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / 86400000))
}

export function getDaysPassed(investment: Investment): number {
  const diff = Date.now() - new Date(investment.startDate).getTime()
  return Math.max(0, Math.floor(diff / 86400000))
}
