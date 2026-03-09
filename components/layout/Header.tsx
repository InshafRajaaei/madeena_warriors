'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { Menu, X, User, LogOut, ShieldCheck, ChevronRight } from 'lucide-react'

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
        
        setIsAdmin(profile?.is_admin || false)
      }
    }

    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
        if (!session?.user) {
          setIsAdmin(false)
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Directory', path: '/directory' },
    { name: 'Map', path: '/map' },
    { name: 'Gallery', path: '/gallery' },
  ]

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#050A1F]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]' : 'bg-transparent border-b border-transparent'}`}>
      <div className="container-app h-16 md:h-18 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 md:w-11 md:h-11 overflow-hidden rounded-full shadow-[0_0_15px_rgba(236,124,8,0.2)] bg-white/10 backdrop-blur-sm flex items-center justify-center p-0.5 border border-white/20 group-hover:border-primary-orange/60 group-hover:shadow-[0_0_20px_rgba(236,124,8,0.3)] transition-all duration-300">
              <Image src="/logo.png" alt="Madeena Warriors Logo" fill className="object-cover" sizes="44px" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-extrabold text-lg md:text-xl tracking-tight text-white leading-tight">
                Madeena <span className="text-primary-orange drop-shadow-[0_0_8px_rgba(236,124,8,0.5)]">Warriors</span>
              </span>
              <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">Batch 2018</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white sm:hidden">
              M<span className="text-primary-orange">W</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`relative px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                isActive(link.path) 
                  ? 'text-primary-orange bg-primary-orange/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-orange shadow-[0_0_6px_rgba(236,124,8,0.8)]" />
              )}
            </Link>
          ))}

          <div className="w-px h-6 bg-white/10 mx-2" />

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                  isActive('/dashboard') 
                    ? 'text-primary-orange bg-primary-orange/10' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <User size={16} />
                Dashboard
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`flex items-center gap-2 px-3 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                    isActive('/admin')
                      ? 'text-red-400 bg-red-500/10'
                      : 'text-red-400/70 hover:text-red-400 hover:bg-red-500/10'
                  }`}
                >
                  <ShieldCheck size={16} />
                  Admin
                </Link>
              )}
              <button 
                onClick={handleSignOut} 
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 cursor-pointer"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-primary px-5 py-2 text-sm">
              Login / Join
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl text-white hover:bg-white/10 transition-all duration-300"
        >
          <span className={`absolute transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`}><X size={22} /></span>
          <span className={`absolute transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}`}><Menu size={22} /></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`lg:hidden absolute w-full left-0 transition-all duration-500 overflow-hidden ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-[#050A1F]/98 backdrop-blur-xl border-t border-white/10 border-b border-b-white/5">
          <div className="container-app py-6 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-primary-orange bg-primary-orange/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
                <ChevronRight size={16} className="opacity-30" />
              </Link>
            ))}

            <div className="h-px bg-white/10 my-3" />

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive('/dashboard')
                      ? 'text-primary-orange bg-primary-orange/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={18} />
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-500/10 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ShieldCheck size={18} />
                    Admin Area
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 w-full text-left mt-1 cursor-pointer"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="btn-primary mt-3 text-center w-full py-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login / Join the Batch
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
