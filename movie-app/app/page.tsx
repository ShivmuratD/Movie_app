import { ApiResponse } from '@/type'
import Link from 'next/link'

async function getMovies(q: string = 'batman', page: number = 1): Promise<ApiResponse> {
  const res = await fetch(`${process.env.BASE_URL}/api/movies/search?q=${encodeURIComponent(q)}&page=${page}`, {
    next: { revalidate: 60 }
  })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

// export default async function Home({
//   searchParams,
// }: {
//   searchParams: { q?: string; page?: string }
// }) {
//   const q = searchParams.q || ''
//   const page = parseInt(searchParams.page || '1')
//   let movies: ApiResponse | null = null
//   let error = ''

//   try {
//     movies = await getMovies(q || 'popular', page)
//   } catch (err) {
//     error = 'Failed to load movies. Try again.'
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold mb-8">Movie Explorer</h1>
        
//         <form className="mb-8">
//           <input
//             name="q"
//             defaultValue={q}
//             placeholder="Search movies..."
//             className="w-full p-4 bg-gray-800 rounded-lg text-xl"
//           />
//           <input type="hidden" name="page" defaultValue="1" />
//         </form>

//         {error && (
//           <div className="bg-red-900 p-4 rounded mb-4 text-center">
//             {error}
//           </div>
//         )}

//         {!error && movies && (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//               {movies.results.map((movie) => (
//                 <div key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden">
//                   {movie.posterurl && (
//                     <img src={movie.posterurl} alt={movie.title} className="w-full h-72 object-cover" />
//                   )}
//                   <div className="p-4">
//                     <h3 className="font-bold text-lg mb-2">{movie.title}</h3>
//                     <p className="text-gray-400 mb-2">{movie.release_date}</p>
//                     <p className="text-sm line-clamp-3">{movie.overview}</p>
//                     <div className="mt-4 flex justify-between items-center">
//                       <span className="text-yellow-400 font-semibold">
//                         {movie.vote_average.toFixed(1)}
//                       </span>
//                       <Link
//                         href={`/movies/${movie.id}`}
//                         className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
//                       >
//                         Details
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {movies.results.length === 0 && (
//               <div className="text-center py-12 text-gray-400">
//                 No movies found. Try another search.
//               </div>
//             )}

//             {movies.total_pages > 1 && (
//               <div className="flex justify-center gap-2">
//                 {Array.from({ length: Math.min(10, movies.total_pages) }, (_, i) => i + 1).map((p) => (
//                   <Link
//                     key={p}
//                     href={`/?q=${encodeURIComponent(q)}&page=${p}`}
//                     className={`px-3 py-2 rounded ${
//                       page === p
//                         ? 'bg-blue-600'
//                         : 'bg-gray-800 hover:bg-gray-700'
//                     }`}
//                   >
//                     {p}
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   )
// }
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  // ✅ FIXED: Await searchParams before accessing
  const { q = '', page = '1' } = await searchParams
  const currentPage = parseInt(page)
  
  let movies: ApiResponse | null = null
  let error = ''

  try {
    movies = await getMovies(q || 'popular', currentPage)
  } catch (err) {
    error = 'Failed to load movies. Try again.'
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Movie Explorer</h1>
        
        {/* ✅ Fixed form */}
        <form action="/" className="mb-8">
          <div className="flex gap-2">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search movies..."
              className="flex-1 p-4 bg-gray-800 rounded-lg text-xl"
            />
            <input type="hidden" name="page" defaultValue="1" />
            <button 
              type="submit"
              className="bg-blue-600 px-6 py-4 rounded-lg font-semibold hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-900 p-4 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {!error && movies && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {movies.results.map((movie) => (
                <div key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden">
                  {movie.posterurl && (
                    <img 
                      src={movie.posterurl} 
                      alt={movie.title} 
                      className="w-full h-72 object-cover" 
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{movie.title}</h3>
                    <p className="text-gray-400 mb-2">{movie.release_date}</p>
                    <p className="text-sm line-clamp-3 mb-4">{movie.overview}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-yellow-400 font-semibold">
                        ⭐ {movie.vote_average.toFixed(1)}
                      </span>
                      <Link
                        href={`/movies/${movie.id}`}
                        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-sm font-semibold"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {movies.results.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No movies found. Try another search.
              </div>
            )}

            {movies.total_pages > 1 && (
              <div className="flex justify-center gap-2 mb-8">
                {Array.from({ length: Math.min(10, movies.total_pages) }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/?q=${encodeURIComponent(q || 'popular')}&page=${p}`}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      currentPage === p
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                    }`}
                  >
                    {p}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
