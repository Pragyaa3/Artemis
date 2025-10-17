// src/app/track/page.js
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import PainScale from '@/components/PainScale'
import MultiSelect from '@/components/MultiSelect'
import { Calendar, Save, CheckCircle } from 'lucide-react'

export default function TrackSymptoms() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    pain_level: null,
    pain_location: [],
    pain_type: [],
    bleeding: '',
    mood: '',
    energy_level: 3,
    notes: ''
  })

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const { data, error } = await supabase
        .from('symptoms')
        .insert([
          {
            user_id: user.id,
            date: formData.date,
            pain_level: formData.pain_level,
            pain_location: formData.pain_location,
            pain_type: formData.pain_type,
            bleeding: formData.bleeding,
            mood: formData.mood,
            energy_level: formData.energy_level,
            notes: formData.notes
          }
        ])

      if (error) throw error

      setSuccess(true)
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          date: new Date().toISOString().split('T')[0],
          pain_level: null,
          pain_location: [],
          pain_type: [],
          bleeding: '',
          mood: '',
          energy_level: 3,
          notes: ''
        })
        setSuccess(false)
      }, 2000)
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Track Your Symptoms
          </h1>
          <p className="text-gray-600">
            Your data is private, encrypted, and helps power research that matters.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border-2 border-green-500 rounded-xl p-4 flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">Symptoms saved successfully!</p>
              <p className="text-sm text-green-700">Your data is contributing to research.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-500 rounded-xl p-4">
            <p className="text-red-900 font-semibold">Error: {error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                max={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Pain Level */}
          <PainScale 
            value={formData.pain_level}
            onChange={(level) => setFormData({...formData, pain_level: level})}
          />

          {/* Pain Location */}
          <MultiSelect
            label="Pain Location (select all that apply)"
            options={[
              'Lower Abdomen',
              'Back',
              'Pelvis',
              'Legs',
              'Chest',
              'Head',
              'Other'
            ]}
            value={formData.pain_location}
            onChange={(locations) => setFormData({...formData, pain_location: locations})}
          />

          {/* Pain Type */}
          <MultiSelect
            label="Pain Type (select all that apply)"
            options={[
              'Cramping',
              'Sharp',
              'Dull Ache',
              'Stabbing',
              'Throbbing',
              'Burning',
              'Shooting'
            ]}
            value={formData.pain_type}
            onChange={(types) => setFormData({...formData, pain_type: types})}
          />

          {/* Bleeding */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Bleeding
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {['None', 'Spotting', 'Light', 'Moderate', 'Heavy'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({...formData, bleeding: level})}
                  className={`
                    p-3 rounded-lg border-2 transition-all font-medium
                    ${formData.bleeding === level
                      ? 'bg-red-500 border-red-600 text-white shadow-md'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-red-400'
                    }
                  `}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Mood
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {[
                { label: 'Great', emoji: '😄' },
                { label: 'Good', emoji: '🙂' },
                { label: 'Okay', emoji: '😐' },
                { label: 'Low', emoji: '😔' },
                { label: 'Anxious', emoji: '😰' },
                { label: 'Irritable', emoji: '😤' }
              ].map((mood) => (
                <button
                  key={mood.label}
                  type="button"
                  onClick={() => setFormData({...formData, mood: mood.label})}
                  className={`
                    p-3 rounded-lg border-2 transition-all
                    ${formData.mood === mood.label
                      ? 'bg-purple-500 border-purple-600 text-white shadow-md'
                      : 'bg-white border-gray-300 hover:border-purple-400'
                    }
                  `}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <div className={`text-sm font-medium ${formData.mood === mood.label ? 'text-white' : 'text-gray-700'}`}>
                    {mood.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Energy Level: {formData.energy_level}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.energy_level}
              onChange={(e) => setFormData({...formData, energy_level: parseInt(e.target.value)})}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Exhausted</span>
              <span>Energetic</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={4}
              placeholder="Any other symptoms, triggers, or observations..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving || formData.pain_level === null}
            className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Saving...' : 'Save Symptoms'}</span>
          </button>
        </form>

        {/* Privacy Note */}
        <div className="mt-6 bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
          <p className="text-sm text-purple-900">
            🔒 <strong>Your privacy matters:</strong> Your data is encrypted and anonymous. 
            Only you can see your individual entries. Aggregated data helps researchers 
            without compromising your identity.
          </p>
        </div>
      </div>
    </div>
  )
}