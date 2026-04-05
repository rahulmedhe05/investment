import { NextRequest, NextResponse } from 'next/server'
import { getUser, calculateCurrentValue, getGrowthPercentage, isLocked, isMatured, getMaturityValue, getDaysRemaining, getDaysPassed } from '@/lib/store'

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const user = getUser(params.userId)
  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
  }

  const investments = user.investments.map((inv) => ({
    ...inv,
    currentValue: calculateCurrentValue(inv),
    growthPercent: getGrowthPercentage(inv),
    maturityValue: getMaturityValue(inv),
    isLocked: isLocked(inv),
    isMatured: isMatured(inv),
    daysRemaining: getDaysRemaining(inv),
    daysPassed: getDaysPassed(inv),
  }))

  const totalInvested = investments.reduce((s, i) => s + i.amount, 0)
  const totalCurrent = investments.reduce((s, i) => s + i.currentValue, 0)
  const totalMaturity = investments.reduce((s, i) => s + i.maturityValue, 0)
  const totalGrowth = totalInvested > 0 ? ((totalCurrent - totalInvested) / totalInvested) * 100 : 0
  const totalProfit = totalCurrent - totalInvested

  return NextResponse.json({
    success: true,
    user: { ...user, investments },
    summary: { totalInvested, totalCurrent, totalGrowth, totalMaturity, totalProfit },
  })
}
