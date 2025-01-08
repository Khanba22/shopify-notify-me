import { NextResponse } from 'next/server'
import prisma from '../../../db.server'

export async function GET() {
  try {
    const metadata = await prisma.metadata.findFirst()
    
    if (!metadata) {
      return NextResponse.json({ error: 'No metadata found' }, { status: 404 })
    }

    return NextResponse.json(metadata)
  } catch (error) {
    console.error('Error fetching metadata:', error)
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    const metadata = await prisma.metadata.upsert({
      where: { id: 1 },
      update: body,
      create: body,
    })

    return NextResponse.json(metadata)
  } catch (error) {
    console.error('Error updating metadata:', error)
    return NextResponse.json({ error: 'Failed to update metadata' }, { status: 500 })
  }
}

