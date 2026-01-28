import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ProtectedRoute from './ProtectedRoute'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TMDB Movie Explorer',
  description: 'Movie search app with SSR',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProtectedRoute>{children}</ProtectedRoute>
      </body>
    </html>
  )
}
