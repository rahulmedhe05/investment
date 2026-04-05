// Compound growth calculation for investment simulation

export interface Investment {
  id: string;
  userId: string;
  planId: number;
  planName: string;
  investedAmount: number;
  annualRate: number; // e.g., 0.18 for 18%
  lockMonths: number; // lock-in period in months
  startDate: string; // ISO date string
  maturityDate: string; // ISO date string
}

export interface GrowthPoint {
  day: number;
  value: number;
  date: string;
}

/**
 * Calculate current value using compound growth formula:
 * dailyRate = annualRate / 365
 * currentValue = investedAmount * (1 + dailyRate) ^ daysPassed
 */
export function calculateCurrentValue(
  investedAmount: number,
  annualRate: number,
  startDate: string,
  asOfDate?: Date
): number {
  const start = new Date(startDate);
  const now = asOfDate || new Date();
  const daysPassed = Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const dailyRate = annualRate / 365;
  return investedAmount * Math.pow(1 + dailyRate, daysPassed);
}

/**
 * Calculate growth percentage
 */
export function calculateGrowthPercent(
  investedAmount: number,
  currentValue: number
): number {
  return ((currentValue - investedAmount) / investedAmount) * 100;
}

/**
 * Calculate days remaining until maturity
 */
export function calculateDaysRemaining(maturityDate: string): number {
  const maturity = new Date(maturityDate);
  const now = new Date();
  const diff = maturity.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Check if investment is locked (cannot withdraw)
 */
export function isLocked(maturityDate: string): boolean {
  return calculateDaysRemaining(maturityDate) > 0;
}

/**
 * Generate growth chart data points for the duration of an investment
 */
export function generateGrowthData(
  investedAmount: number,
  annualRate: number,
  startDate: string,
  totalDays: number
): GrowthPoint[] {
  const points: GrowthPoint[] = [];
  const start = new Date(startDate);

  for (let day = 0; day <= totalDays; day += Math.max(1, Math.floor(totalDays / 90))) {
    const date = new Date(start);
    date.setDate(date.getDate() + day);
    const value = calculateCurrentValue(investedAmount, annualRate, startDate, date);
    points.push({
      day,
      value: Math.round(value),
      date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    });
  }

  // Always include the final point
  const endDate = new Date(start);
  endDate.setDate(endDate.getDate() + totalDays);
  points.push({
    day: totalDays,
    value: Math.round(calculateCurrentValue(investedAmount, annualRate, startDate, endDate)),
    date: endDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
  });

  return points;
}

/**
 * Investment plans configuration
 */
export const INVESTMENT_PLANS = [
  {
    id: 1,
    name: 'Growth Starter',
    amount: 50000,
    annualRate: 0.18,
    lockMonths: 3,
    lockDays: 90,
    description: 'Perfect for beginners — stable 18% annual simulated returns.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 2,
    name: 'Wealth Accelerator',
    amount: 100000,
    annualRate: 0.21,
    lockMonths: 6,
    lockDays: 180,
    description: 'Maximize growth with 21% annual returns and 6-month compounding.',
    color: 'from-blue-500 to-indigo-500',
  },
];

/**
 * Format currency in INR
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate maturity value
 */
export function calculateMaturityValue(
  investedAmount: number,
  annualRate: number,
  lockDays: number
): number {
  const dailyRate = annualRate / 365;
  return investedAmount * Math.pow(1 + dailyRate, lockDays);
}
