import { NextRequest, NextResponse } from 'next/server'
import { addInvestment } from '@/lib/store'

export async function POST(req: NextRequest) {
  const { userId, packageType } = await req.json()
  if (!userId || !['starter', 'pro'].includes(packageType)) {
    return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 })
  }
  const investment = addInvestment(userId, packageType)
  if (!investment) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true, investment })
}
