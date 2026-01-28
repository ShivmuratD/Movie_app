import { fetchWithRetry } from '@/lib/tmdb'
import { ApiResponse, Movie } from '@/type'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  
  if (!q || q.length < 2) {
    return NextResponse.json({ error: 'Query min length 2' }, { status: 400 })
  }
  if (page > 10) {
    return NextResponse.json({ error: 'Max page 10' }, { status: 400 })
  }

  try {
   
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin
    

    const configRes = await fetch(`${baseUrl}/api/config`, {
      cache: 'force-cache',
      next: { revalidate: 86400 }
    })
    
    if (!configRes.ok) {
      throw new Error('Config fetch failed')
    }
    
 
    const config = await configRes.json() as {
      images: { base_url: string }
    }

   
    const TMDB_BASE = process.env.TMDB_BASE || 'https://api.themoviedb.org/3'
    
    const res = await fetchWithRetry(
      `${TMDB_BASE}/search/movie?query=${encodeURIComponent(q)}&page=${page}&include_adult=false&language=en-US`
    )
    
    if (!res.ok) {
      throw new Error('TMDB search failed')
    }
    
   
    const data = await res.json()

    const results: Movie[] = data.results.map((movie: Movie) => ({
      ...movie,
      posterurl: movie.poster_path ? `${config.images.base_url}w500${movie.poster_path}` : null,
    }))

    
    const response: ApiResponse = {
      page: data.page,
      total_pages: Math.min(data.total_pages || 1, 10),
      total_results: Math.min(data.total_results || 0, 200),
      results,
    }

    return NextResponse.json(response, { 
      headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=30' } 
    })
    
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
