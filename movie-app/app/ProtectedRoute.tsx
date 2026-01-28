'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoginPage from './login/page'
import { useSession } from '../utils/session'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session === false) {
      router.push('/login')
    }
  }, [session, router])

  if (session === null || session === false) {
    return <LoginPage />
  }

  return <>{children}</>
}
