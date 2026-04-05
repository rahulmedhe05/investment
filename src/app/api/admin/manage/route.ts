import { NextRequest, NextResponse } from 'next/server'
import { deleteUser, deleteInvestment, updateUser } from '@/lib/store'

export async function DELETE(req: NextRequest) {
  const { userId, investmentId } = await req.json()
  if (investmentId) {
    const ok = deleteInvestment(userId, investmentId)
    return NextResponse.json({ success: ok, error: ok ? undefined : 'Investment not found' })
  }
  const ok = deleteUser(userId)
  return NextResponse.json({ success: ok, error: ok ? undefined : 'User not found' })
}

export async function PUT(req: NextRequest) {
  const { userId, name, phone, password } = await req.json()
  const user = updateUser(userId, { name, phone, password })
  if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
  return NextResponse.json({ success: true, user })
}
