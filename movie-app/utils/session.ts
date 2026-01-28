import { useEffect, useState } from 'react'

export function setSession(isLoggedIn: boolean) {
  if (typeof window !== 'undefined') {
    if (isLoggedIn) {
      localStorage.setItem('loggedIn', 'true')
    } else {
      localStorage.removeItem('loggedIn')
    }
  }
}

export function useSession() {
  const [session, setSession] = useState<boolean | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = localStorage.getItem('loggedIn') === 'true'
      setSession(loggedIn)
    }
  }, [])

  return session
}
