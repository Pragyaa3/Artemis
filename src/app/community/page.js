// src/app/community/page.js
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { MessageCircle, Users, Heart } from 'lucide-react'

export default function Community() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      router.push('/auth/login')
      return
    }
    setUser(user)
    setLoading(false)
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Community
          </h1>
          <p className="text-gray-600">
            Connect with others who understand your journey.
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-6">🚧</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Community Features Coming Soon
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We're building a safe space for you to share experiences, rate doctors, 
            and connect with others. This will include:
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-purple-50 p-6 rounded-xl">
              <MessageCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Discussion Forums</h3>
              <p className="text-sm text-gray-600">
                Share experiences and ask questions anonymously
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Doctor Reviews</h3>
              <p className="text-sm text-gray-600">
                Rate doctors and flag dismissive behavior
              </p>
            </div>

            <div className="bg-pink-50 p-6 rounded-xl">
              <Heart className="w-12 h-12 text-pink-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Support Groups</h3>
              <p className="text-sm text-gray-600">
                Find condition-specific communities
              </p>
            </div>
          </div>

          <div className="mt-12 bg-purple-50 border-2 border-purple-200 rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-purple-900 mb-2">
              Want to Help Build This?
            </h3>
            <p className="text-purple-800 mb-4">
              We're looking for beta testers and community moderators. 
              Your feedback will shape these features.
            </p>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold">
              Join Beta Waitlist
            </button>
          </div>
        </div>

        {/* Temporary Discussion Prompts */}
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Discussion Prompts (Share Your Story)
          </h2>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              💬 "My doctor dismissed me when..."
            </h3>
            <p className="text-gray-600 text-sm">
              Share your experience. These stories will help build our doctor accountability system.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              💡 "This treatment actually helped me..."
            </h3>
            <p className="text-gray-600 text-sm">
              What worked for you? Help others find relief.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              🔬 "Research questions I want answered..."
            </h3>
            <p className="text-gray-600 text-sm">
              What should researchers focus on? Your questions will guide funding priorities.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}