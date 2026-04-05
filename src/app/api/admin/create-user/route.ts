import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/store'

export async function POST(req: NextRequest) {
  let name = '', phone = '', password = ''
  try {
    const body = await req.json()
    name = body.name || ''
    phone = body.phone || ''
    password = body.password || ''
  } catch {}
  const user = createUser(name, phone, password)
  return NextResponse.json({ success: true, user })
}
