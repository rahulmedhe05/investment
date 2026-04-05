import { NextRequest, NextResponse } from 'next/server'
import { verifyUser } from '@/lib/store'

export async function POST(req: NextRequest) {
  const { userId, password } = await req.json()
  if (!userId || !password) {
    return NextResponse.json({ success: false, error: 'Investor ID and password are required' }, { status: 400 })
  }
  const user = verifyUser(userId.toUpperCase(), password)
  if (!user) {
    return NextResponse.json({ success: false, error: 'Invalid Investor ID or password' }, { status: 401 })
  }
  return NextResponse.json({ success: true, userId: user.id })
}
