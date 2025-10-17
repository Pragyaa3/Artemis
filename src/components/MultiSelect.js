// src/components/MultiSelect.js
'use client'

export default function MultiSelect({ label, options, value = [], onChange }) {
  const toggleOption = (option) => {
    if (value.includes(option)) {
      onChange(value.filter(v => v !== option))
    } else {
      onChange([...value, option])
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-900">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = value.includes(option)
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={`
                px-4 py-2 rounded-lg border-2 transition-all font-medium text-sm
                ${isSelected
                  ? 'bg-purple-600 border-purple-600 text-white shadow-md'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-purple-400'
                }
              `}
            >
              {isSelected && (
                <span className="mr-2">✓</span>
              )}
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}