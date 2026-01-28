export interface Movie {
  id: number
  title: string
  release_date: string
  overview: string
  poster_path: string | null
  vote_average: number
  backdrop_path: string | null
  posterurl: string | null
}

export interface ApiResponse {
  page: number
  total_pages: number
  total_results: number
  results: Movie[]
}

export interface MovieDetails {
  id: number
  title: string
  release_date: string
  overview: string
  posterurl: string | null
  poster_path: string | null
  backdrop_path: string | null
  backdropurl: string | null
  vote_average: number
  genres: { id: number; name: string }[]
  runtime: number | null
  cast: { name: string; profile_path: string | null }[]
  videos: { key: string }[]
}
export interface MovieSearchResult {
  id: number
  title: string
  release_date: string
  overview: string
  poster_path: string | null
  vote_average: number
  backdrop_path: string | null
  posterurl: string | null  
}

export interface SearchResponse {
  page: number
  total_pages: number
  total_results: number
  results: MovieSearchResult[]
}


export interface MovieDetailResult {
  id: number
  title: string
  release_date: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  genres: Array<{ id: number; name: string }>
  runtime: number | null


  posterurl: string | null  
  backdropurl: string | null
  cast: Array<{ name: string; profile_path: string | null }>
  videos: Array<{ key: string }>
}


export interface Config {
  images: {
    base_url: string
    poster_sizes: string[]
    backdrop_sizes: string[]
  }
}
