import { NextResponse } from 'next/server'
import { resetStore, getAllUsers, updateConfig, getStore } from '@/lib/store'

export async function POST() {
  resetStore()
  return NextResponse.json({ success: true })
}

export async function GET() {
  const users = getAllUsers()
  const config = getStore().config
  return NextResponse.json({ users, config })
}

export async function PUT(req: Request) {
  const config = await req.json()
  updateConfig(config)
  return NextResponse.json({ success: true, config: getStore().config })
}
