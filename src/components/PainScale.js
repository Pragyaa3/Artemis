// src/components/PainScale.js
'use client'

export default function PainScale({ value, onChange }) {
  const painLevels = [
    {
      level: 0,
      label: "No Pain",
      description: "Living normally, no discomfort",
      color: "bg-green-500",
      emoji: "😊"
    },
    {
      level: 1,
      label: "Mild",
      description: "Noticeable but can work/function normally",
      color: "bg-yellow-400",
      emoji: "🙂"
    },
    {
      level: 2,
      label: "Moderate",
      description: "Work/activities are impaired but possible",
      color: "bg-orange-400",
      emoji: "😟"
    },
    {
      level: 3,
      label: "Severe",
      description: "Cannot work or leave bed",
      color: "bg-red-500",
      emoji: "😣"
    },
    {
      level: 4,
      label: "Emergency",
      description: "Requires immediate medical attention",
      color: "bg-red-700",
      emoji: "😰"
    }
  ]

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-900 mb-3">
        Pain Level (Functional Impact)
      </label>
      
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {painLevels.map((pain) => (
          <button
            key={pain.level}
            type="button"
            onClick={() => onChange(pain.level)}
            className={`
              relative p-4 rounded-xl border-2 transition-all
              ${value === pain.level 
                ? `${pain.color} border-gray-900 shadow-lg transform scale-105` 
                : 'bg-white border-gray-200 hover:border-gray-400'
              }
            `}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{pain.emoji}</div>
              <div className={`font-bold text-sm mb-1 ${value === pain.level ? 'text-white' : 'text-gray-900'}`}>
                {pain.level} - {pain.label}
              </div>
              <div className={`text-xs ${value === pain.level ? 'text-white opacity-90' : 'text-gray-600'}`}>
                {pain.description}
              </div>
            </div>
            
            {value === pain.level && (
              <div className="absolute top-2 right-2">
                <div className="bg-white rounded-full p-1">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 italic">
        This scale focuses on how pain affects your daily life, not arbitrary numbers.
      </p>
    </div>
  )
}