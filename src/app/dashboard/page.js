// src/app/dashboard/page.js
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle, Calendar, TrendingUp, Heart } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        router.push('/auth/login')
        return
      }

      setUser(user)

      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profile)
    } catch (error) {
      console.error('Error:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-purple-600 text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.full_name || 'Warrior'} 🏹
          </h1>
          <p className="text-gray-600">
            Your health journey matters. Let's track it together.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/track">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-purple-500">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <PlusCircle className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Track Today</h3>
                  <p className="text-sm text-gray-600">Log your symptoms</p>
                </div>
              </div>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Cycle Day</h3>
                <p className="text-sm text-gray-600">Coming soon</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Patterns</h3>
                <p className="text-sm text-gray-600">Coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="text-center py-12 text-gray-500">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-4">No symptoms tracked yet</p>
            <Link 
              href="/track"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Track Your First Entry
            </Link>
          </div>
        </div>

        {/* Mission Reminder */}
        <div className="mt-8 bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
          <h3 className="font-semibold text-purple-900 mb-2">
            🏹 Remember: Your data powers research
          </h3>
          <p className="text-purple-800">
            Every symptom you track helps researchers understand women's health better. 
            Your anonymous data will contribute to studies that matter to YOU.
          </p>
        </div>
      </div>
    </div>
  )
}