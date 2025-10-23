// src/app/dashboard/page.js
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle, Download, Calendar, TrendingUp, Activity } from 'lucide-react'
import { format } from 'date-fns'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [symptoms, setSymptoms] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEntries: 0,
    avgPainLevel: 0,
    lastEntry: null
  })

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

      // Get symptoms
      const { data: symptomsData } = await supabase
        .from('symptoms')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      setSymptoms(symptomsData || [])
      calculateStats(symptomsData || [])
    } catch (error) {
      console.error('Error:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (symptomsData) => {
    if (symptomsData.length === 0) {
      setStats({ totalEntries: 0, avgPainLevel: 0, lastEntry: null })
      return
    }

    const totalPain = symptomsData.reduce((sum, s) => sum + (s.pain_level || 0), 0)
    const avgPain = (totalPain / symptomsData.length).toFixed(1)

    setStats({
      totalEntries: symptomsData.length,
      avgPainLevel: avgPain,
      lastEntry: symptomsData[0]?.date
    })
  }

  const exportToCSV = () => {
    if (symptoms.length === 0) return

    const headers = ['Date', 'Pain Level', 'Pain Location', 'Pain Type', 'Bleeding', 'Mood', 'Energy Level', 'Notes']
    const rows = symptoms.map(s => [
      s.date,
      s.pain_level,
      s.pain_location?.join('; ') || '',
      s.pain_type?.join('; ') || '',
      s.bleeding || '',
      s.mood || '',
      s.energy_level || '',
      s.notes || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `artemis-symptoms-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const getChartData = () => {
    return symptoms
      .slice(0, 14)
      .reverse()
      .map(s => ({
        date: format(new Date(s.date), 'MMM dd'),
        pain: s.pain_level || 0
      }))
  }

  const getPainLevelLabel = (level) => {
    const labels = ['No Pain', 'Mild', 'Moderate', 'Severe', 'Emergency']
    return labels[level] || 'Unknown'
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
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {profile?.full_name || 'Warrior'} 🏹
            </h1>
            <p className="text-gray-600">
              {symptoms.length > 0 
                ? `You've tracked ${symptoms.length} ${symptoms.length === 1 ? 'entry' : 'entries'}. Keep going!`
                : 'Start your journey by tracking your first symptom.'
              }
            </p>
          </div>
          
          {symptoms.length > 0 && (
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 bg-white border-2 border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition"
            >
              <Download className="w-5 h-5" />
              <span>Export Data</span>
            </button>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Link href="/track">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer text-white">
              <div className="flex items-center justify-between mb-2">
                <PlusCircle className="w-8 h-8" />
                <div className="text-3xl">+</div>
              </div>
              <h3 className="font-semibold text-lg">Track Today</h3>
              <p className="text-sm opacity-90">Log your symptoms</p>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-blue-600" />
              <div className="text-3xl font-bold text-blue-600">{stats.totalEntries}</div>
            </div>
            <h3 className="font-semibold text-gray-900">Total Entries</h3>
            <p className="text-sm text-gray-600">Tracked so far</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div className="text-3xl font-bold text-orange-600">{stats.avgPainLevel}</div>
            </div>
            <h3 className="font-semibold text-gray-900">Avg Pain Level</h3>
            <p className="text-sm text-gray-600">Out of 4</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-green-600" />
              <div className="text-lg font-bold text-green-600">
                {stats.lastEntry ? format(new Date(stats.lastEntry), 'MMM dd') : 'N/A'}
              </div>
            </div>
            <h3 className="font-semibold text-gray-900">Last Entry</h3>
            <p className="text-sm text-gray-600">Most recent</p>
          </div>
        </div>

        {symptoms.length > 0 ? (
          <>
            {/* Pain Trend Chart */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Pain Trend (Last 14 Days)
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        return (
                          <div className="bg-white p-3 border-2 border-purple-600 rounded-lg shadow-lg">
                            <p className="font-semibold">{payload[0].payload.date}</p>
                            <p className="text-purple-600">
                              Pain: {getPainLevelLabel(payload[0].value)}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pain" 
                    stroke="#9333ea" 
                    strokeWidth={3}
                    dot={{ fill: '#9333ea', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Entries */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Recent Entries
              </h2>
              <div className="space-y-4">
                {symptoms.slice(0, 10).map((symptom) => (
                  <div 
                    key={symptom.id}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-400 transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {format(new Date(symptom.date), 'EEEE, MMMM dd, yyyy')}
                        </p>
                        <p className="text-sm text-gray-600">
                          Pain Level: <span className="font-semibold">{getPainLevelLabel(symptom.pain_level)}</span>
                        </p>
                      </div>
                      <div className={`
                        px-3 py-1 rounded-full text-sm font-semibold
                        ${symptom.pain_level === 0 ? 'bg-green-100 text-green-700' : ''}
                        ${symptom.pain_level === 1 ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${symptom.pain_level === 2 ? 'bg-orange-100 text-orange-700' : ''}
                        ${symptom.pain_level >= 3 ? 'bg-red-100 text-red-700' : ''}
                      `}>
                        {symptom.pain_level}/4
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 mt-3 text-sm">
                      {symptom.pain_location && symptom.pain_location.length > 0 && (
                        <div>
                          <span className="font-semibold text-gray-700">Location:</span>
                          <span className="ml-2 text-gray-600">{symptom.pain_location.join(', ')}</span>
                        </div>
                      )}
                      {symptom.bleeding && (
                        <div>
                          <span className="font-semibold text-gray-700">Bleeding:</span>
                          <span className="ml-2 text-gray-600">{symptom.bleeding}</span>
                        </div>
                      )}
                      {symptom.mood && (
                        <div>
                          <span className="font-semibold text-gray-700">Mood:</span>
                          <span className="ml-2 text-gray-600">{symptom.mood}</span>
                        </div>
                      )}
                    </div>
                    
                    {symptom.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Notes:</span> {symptom.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Data Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start tracking your symptoms to see insights and patterns.
            </p>
            <Link 
              href="/track"
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              Track Your First Entry
            </Link>
          </div>
        )}

        {/* Mission Reminder */}
        <div className="mt-8 bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
          <h3 className="font-semibold text-purple-900 mb-2">
            🏹 Your Impact
          </h3>
          <p className="text-purple-800">
            Every symptom you track contributes to better understanding of women's health. 
            Your anonymous data will help researchers identify patterns and develop better treatments.
          </p>
        </div>
      </div>
    </div>
  )
}