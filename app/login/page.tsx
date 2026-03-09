'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogIn, UserPlus, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setError(error.message)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } else {
      if (!firstName || !lastName) {
        setError("Please enter your first and last name.")
        setLoading(false)
        return
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      })

      if (error) {
        setError(error.message)
      } else {
        setMessage('Registration successful! Please wait for an Admin to approve your account before you can edit your profile.')
      }
    }
    
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] px-4 py-12 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-orange/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-navy/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${isLogin ? 'bg-primary-orange/10 border border-primary-orange/20' : 'bg-blue-500/10 border border-blue-500/20'} transition-colors duration-300`}>
            {isLogin ? <LogIn size={28} className="text-primary-orange" /> : <UserPlus size={28} className="text-blue-400" />}
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Join the Batch'}
          </h1>
          <p className="text-gray-400 font-light">
            {isLogin 
              ? 'Sign in to manage your profile and connect.' 
              : 'Create your account to join the 2018 batch network.'}
          </p>
        </div>

        {/* Form Card */}
        <div className="card-static p-8">
          {/* Toggle Tabs */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-8 border border-white/10">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(null); setMessage(null) }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer ${
                isLogin ? 'bg-primary-orange text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <LogIn size={16} />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(null); setMessage(null) }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer ${
                !isLogin ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <UserPlus size={16} />
              Register
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 text-sm border border-red-500/20">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {message && (
            <div className="flex items-start gap-3 bg-green-500/10 text-green-400 p-4 rounded-xl mb-6 text-sm border border-green-500/20">
              <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" />
              {message}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field" htmlFor="firstName">First Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      id="firstName"
                      className="input-field pl-11"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Mohammed"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <label className="label-field" htmlFor="lastName">Last Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      id="lastName"
                      className="input-field pl-11"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ali"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label className="label-field" htmlFor="email">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="email"
                  className="input-field pl-11"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="label-field" htmlFor="password">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="password"
                  className="input-field pl-11"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                isLogin 
                  ? 'bg-gradient-to-r from-primary-orange to-[#ff9933] shadow-[0_0_20px_rgba(236,124,8,0.3)] hover:shadow-[0_0_30px_rgba(236,124,8,0.5)]' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={loading}
            >
              {loading ? (
                <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : isLogin ? (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Info for registration */}
          {!isLogin && (
            <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
              After registering, an admin will verify you are part of the 2018 batch before your profile goes live.
            </p>
          )}
        </div>

        {/* Bottom link */}
        <p className="text-center mt-6 text-sm text-gray-500">
          {isLogin ? "Don't have an account?" : "Already registered?"}{' '}
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null) }}
            className="text-primary-orange hover:text-primary-orange/80 font-semibold transition-colors cursor-pointer"
          >
            {isLogin ? 'Register here' : 'Sign in'}
          </button>
        </p>

        <p className="text-center mt-4">
          <Link href="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
            &larr; Back to Home
          </Link>
        </p>
      </div>
    </div>
  )
}
