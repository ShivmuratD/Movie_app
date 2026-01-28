'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { setSession, useSession } from '@/utils/session'


export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const session = useSession()
  const from = searchParams.get('from') || '/'

  useEffect(() => {
    if (session) {
      router.push(from)
    }
  }, [session, router, from])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'user' && password === '1234') {
      setSession(true)
      router.push(from)
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-700 rounded text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-700 rounded text-white"
            required
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 py-3 rounded font-semibold hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
