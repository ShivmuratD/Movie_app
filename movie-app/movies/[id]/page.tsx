import { MovieDetails } from '@/type'
import Image from 'next/image'
import { notFound } from 'next/navigation'

async function getMovie(id: string): Promise<MovieDetails> {
  const res = await fetch(`${process.env.BASE_URL}/api/movies/${id}`, {
    next: { revalidate: 300 }
  })
  if (!res.ok) {
    notFound()
  }
  return res.json()
}

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}) {
  try {
    const movie = await getMovie(params.id)
    return {
      title: `${movie.title} - Movie Explorer`,
      description: movie.overview.slice(0, 160),
    }
  } catch {
    return { title: 'Movie Not Found' }
  }
}

export default async function MoviePage({ params }: { params: { id: string } }) {
  let movie: MovieDetails | null = null
  let error = ''

  try {
    movie = await getMovie(params.id)
  } catch (err) {
    error = 'Movie not found or failed to load.'
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{error}</h1>
          <a href="/" className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700">
            Back to Search
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <a href="/" className="inline-block mb-8 bg-gray-800 px-6 py-3 rounded hover:bg-gray-700">
          ← Back to Search
        </a>
        
        {movie && (
          <div>
            {movie.backdropurl && (
              <Image
                src={movie.backdropurl}
                alt={movie.title}
                width={1200}
                height={400}
                className="w-full h-64 object-cover rounded-lg mb-8"
              />
            )}
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                {movie.posterurl && (
                  <Image
                    src={movie.posterurl}
                    alt={movie.title}
                    width={500}
                    height={750}
                    className="w-full rounded-lg mb-4"
                  />
                )}
              </div>
              
              <div>
                <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
                <p className="text-2xl text-gray-400 mb-6">
                  {movie.release_date} • {movie.runtime ? `${movie.runtime}min` : 'N/A'} • 
                  <span className="text-yellow-400 ml-2">{movie.vote_average.toFixed(1)}/10</span>
                </p>
                
                <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                <p className="text-lg mb-8 leading-relaxed">{movie.overview}</p>
                
                <div className="space-y-6">
                  {movie.genres.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {movie.genres.map(genre => (
                          <span key={genre.id} className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {movie.cast.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Top Cast</h3>
                      <div className="flex flex-wrap gap-4">
                        {movie.cast.map((actor, i) => (
                          <div key={i} className="text-center">
                            {actor.profile_path && (
                              <img
                                src={actor.profile_path}
                                alt={actor.name}
                                className="w-20 h-20 rounded-full object-cover mb-2 mx-auto"
                              />
                            )}
                            <p className="text-sm">{actor.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {movie.videos.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Trailers</h3>
                      <div className="flex gap-4">
                        {movie.videos.slice(0, 2).map((video, i) => (
                          <iframe
                            key={i}
                            width="300"
                            height="169"
                            src={`https://www.youtube.com/embed/${video.key}`}
                            title="Trailer"
                            allowFullScreen
                            className="rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
