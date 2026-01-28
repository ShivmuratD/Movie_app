import { NextRequest } from 'next/server'

const TMDB_BASE = 'https://api.themoviedb.org/3'
const TMDB_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN!

// export async function fetchWithRetry(url: string, options: RequestInit = {}) {
//   try {
//     const res = await fetch(url, {
//       ...options,
//       headers: {
//         ...options.headers,
//         Authorization: `Bearer ${TMDB_TOKEN}`,
//         'Content-Type': 'application/json',
//       },
//     })

//     if (res.status === 429) {
//       await new Promise(resolve => setTimeout(resolve, 2000))
//       return fetchWithRetry(url, options)
//     }

//     return res
//   } catch (error) {
//     throw new Error('TMDB API error')
//   }
// }


// lib/tmdb.ts - FULL MOCK MODE (Replace fetchWithRetry)
export async function fetchWithRetry(url: string, options: RequestInit = {}) {
  console.log('🎬 Mock TMDB:', url)
  

  if (url.includes('/configuration')) {
    return new Response(JSON.stringify({
      images: {
        base_url: 'https://image.tmdb.org/t/p/',
        poster_sizes: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
        backdrop_sizes: ['w300', 'w780', 'w1280', 'original']
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }


  if (url.includes('/search/movie')) {
    const query = new URLSearchParams(url.split('?')[1]).get('query') || 'batman'
    return new Response(JSON.stringify({
      page: 1,
      total_pages: 3,
      total_results: 45,
      results: [
        {
          id: 123,
          title: `${query.charAt(0).toUpperCase() + query.slice(1)} (2025)`,
          release_date: '2025-01-15',
          overview: `Mock overview for ${query}. This is a test movie for your Movie Explorer app.`,
          poster_path: '/abc123.jpg',
          backdrop_path: '/backdrop123.jpg',
          vote_average: 8.2
        }
      ]
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }

  if (url.includes('/movie/')) {
    const id = url.match(/movie\/(\d+)/)?.[1] || '123'
    return new Response(JSON.stringify({
      id: parseInt(id),
      title: `Mock Movie ${id}`,
      release_date: '2025-01-15',
      overview: 'Complete mock movie details with trailers and cast. Your app works perfectly!',
      poster_path: '/poster456.jpg',
      backdrop_path: '/backdrop456.jpg',
      vote_average: 7.8,
      genres: [
        { id: 28, name: 'Action' },
        { id: 12, name: 'Adventure' }
      ],
      runtime: 142,
      credits: {
        cast: [
          { name: 'Actor 1', profile_path: '/actor1.jpg' },
          { name: 'Actor 2', profile_path: '/actor2.jpg' },
          { name: 'Actor 3', profile_path: null }
        ]
      },
      videos: {
        results: [
          { key: 'dQw4w9WgXcQ', site: 'YouTube' }, 
          { key: 'abc123', site: 'YouTube' }
        ]
      }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }

  if (Math.random() < 0.1) {
    return new Response(JSON.stringify({ status_code: 429 }), { status: 429 })
  }

  throw new Error('Mock error - replace with real TMDB token')
}
