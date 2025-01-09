'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import useAuthStore from '../store/useAuthStore'

const publicPaths = ['/login', '/signup']

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { userData } = useAuthStore()

  useEffect(() => {
    if (!userData && !publicPaths.includes(pathname)) {
      router.push('/login')
    }
    
    if (userData && publicPaths.includes(pathname)) {
      router.push('/')
    }
  }, [userData, pathname, router])

  return <>{children}</>
}

export default AuthGuard
