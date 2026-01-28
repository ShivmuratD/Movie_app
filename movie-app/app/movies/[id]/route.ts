// import { NextRequest, NextResponse } from 'next/server'
// import { fetchWithRetry } from '../../../../lib/tmdb'
// import { MovieDetails } from '../../../../types'

// export const dynamic = 'force-dynamic'

// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//   const id = parseInt(params.id)
//   if (isNaN(id)) {
//     return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
//   }

//   try {
//     const configRes = await fetch(`${process.env.BASE_URL}/api/config`, {
//       cache: 'force-cache',
//     })
//     const config = await configRes.json()

//     const res = await fetchWithRetry(
//       `${process.env.TMDB_BASE}/movie/${id}?append_to_response=videos,credits&language=en-US`
//     )
//     if (!res.ok) {
//       return NextResponse.json({ error: 'Movie not found' }, { status: 404 })
//     }
//     const data = await res.json<MovieDetails>()

//     const posterUrl = data.poster_path ? `${config.images.base_url}w500${data.poster_path}` : null
//     const backdropUrl = data.backdrop_path ? `${config.images.base_url}original${data.backdrop_path}` : null

//     const cast = data.credits?.cast?.slice(0, 5).map(actor => ({
//       name: actor.name,
//       profile_path: actor.profile_path ? `${config.images.base_url}w185${actor.profile_path}` : null,
//     })) || []

//     const videos = data.videos?.results.filter(v => v.site === 'YouTube').map(v => ({ key: v.key })) || []

//     return NextResponse.json({
//       ...data,
//       posterurl: posterUrl,
//       backdropurl: backdropUrl,
//       cast,
//       videos,
//     }, { 
//       headers: { 'Cache-Control': 'public, max-age=300' } // 5min
//     })
//   } catch (error) {
//     return NextResponse.json({ error: 'Details fetch failed' }, { status: 500 })
//   }
// }



// app/api/movies/[id]/route.ts - FIXED
import { fetchWithRetry } from '@/lib/tmdb'
import { MovieDetailResult } from '@/type'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin
    
    // ✅ FIXED: No type argument on json()
    const configRes = await fetch(`${baseUrl}/api/config`, {
      cache: 'force-cache',
      next: { revalidate: 86400 }
    })
    
    if (!configRes.ok) {
      throw new Error('Config fetch failed')
    }
    
    // ✅ FIXED: Type assertion after json()
    const config = await configRes.json() as {
      images: { base_url: string }
    }

    const TMDB_BASE = process.env.TMDB_BASE || 'https://api.themoviedb.org/3'
    
    const res = await fetchWithRetry(
      `${TMDB_BASE}/movie/${id}?append_to_response=videos,credits&language=en-US`
    )
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 })
    }
    

    const rawData = await res.json()


    const posterUrl = rawData.poster_path 
      ? `${config.images.base_url}w500${rawData.poster_path}` 
      : null
    
    const backdropUrl = rawData.backdrop_path 
      ? `${config.images.base_url}original${rawData.backdrop_path}` 
      : null

    const cast = rawData.credits?.cast?.slice(0, 5).map((actor: any) => ({
      name: actor.name,
      profile_path: actor.profile_path 
        ? `${config.images.base_url}w185${actor.profile_path}` 
        : null,
    })) || []

    const videos = rawData.videos?.results
      ?.filter((v: any) => v.site === 'YouTube')
      ?.map((v: any) => ({ key: v.key })) || []

    const response: MovieDetailResult = {
      id: rawData.id,
      title: rawData.title,
      release_date: rawData.release_date,
      overview: rawData.overview,
      poster_path: rawData.poster_path,
      backdrop_path: rawData.backdrop_path,
      vote_average: rawData.vote_average,
      genres: rawData.genres || [],
      runtime: rawData.runtime || null,
      posterurl: posterUrl,
      backdropurl: backdropUrl,
      cast,
      videos,
    }

    return NextResponse.json(response, { 
      headers: { 'Cache-Control': 'public, max-age=300' } 
    })
    
  } catch (error) {
    return NextResponse.json({ error: 'Details fetch failed' }, { status: 500 })
  }
}

