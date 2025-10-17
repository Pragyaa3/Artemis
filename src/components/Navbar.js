// src/components/Navbar.js
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LogOut, User, Menu, X } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return null

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={user ? "/dashboard" : "/"} className="text-2xl font-bold text-purple-600">
              Artemis 🏹
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-50 transition"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/track" 
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-50 transition"
                >
                  Track Symptoms
                </Link>
                <Link 
                  href="/community" 
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-50 transition"
                >
                  Community
                </Link>
                
                <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <User className="w-5 h-5" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="text-gray-700 hover:text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition"
                >
                  Login
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-purple-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/track" 
                  className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Track Symptoms
                </Link>
                <Link 
                  href="/community" 
                  className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Community
                </Link>
                <div className="pt-2 border-t border-gray-200">
                  <p className="px-3 py-2 text-sm text-gray-600">{user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="block bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}