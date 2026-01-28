import { NextResponse } from 'next/server'
import { fetchWithRetry } from '../../../lib/tmdb'
import { Config } from '@/type'


export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const res = await fetchWithRetry(`${process.env.TMDB_BASE}/configuration`)
    const data = await res.json() as {
      images: {
        base_url: string
        poster_sizes: string[]
        backdrop_sizes: string[]
      }
    }
    return NextResponse.json({
      images: data.images,
    }, { 
      headers: { 'Cache-Control': 'public, max-age=86400' } 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Config fetch failed' }, { status: 500 })
  }
}
