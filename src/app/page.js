// src/app/page.js
import Link from 'next/link'
import { ArrowRight, Shield, Users, Database, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Artemis
          </h1>
          <p className="text-2xl text-gray-600 mb-4">
            Your pain is real. Your voice matters.
          </p>
          <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
            Track symptoms. Fund research. Hold healthcare accountable. 
            Building the future of women's reproductive health research.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/auth/signup"
              className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition flex items-center gap-2"
            >
              Start Tracking Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/auth/login"
              className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-50 transition"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="mt-24 bg-white rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            We're Done Being Dismissed
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">7-10</div>
              <p className="text-gray-600">years to diagnose endometriosis</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">190M</div>
              <p className="text-gray-600">women suffer globally</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">2%</div>
              <p className="text-gray-600">of research funding goes to women's health</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            How Artemis Works
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<TrendingUp className="w-12 h-12 text-purple-600" />}
              title="Track Your Reality"
              description="Log symptoms, pain levels, and treatments. Your data, your control."
            />
            <FeatureCard 
              icon={<Database className="w-12 h-12 text-purple-600" />}
              title="Power Research"
              description="Anonymously contribute data to fund studies that matter to YOU."
            />
            <FeatureCard 
              icon={<Users className="w-12 h-12 text-purple-600" />}
              title="Community Voice"
              description="Vote on research priorities. Share experiences. End medical gaslighting."
            />
            <FeatureCard 
              icon={<Shield className="w-12 h-12 text-purple-600" />}
              title="Full Transparency"
              description="See exactly where funding goes. Track research outcomes."
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 bg-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Join the Movement
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Be part of the beta. Help us build the platform women's health research deserves.
          </p>
          <Link 
            href="/auth/signup"
            className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition inline-flex items-center gap-2"
          >
            Get Early Access
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-24">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p>Built with 🏹 for every woman who's been told "it's just cramps"</p>
          <p className="mt-2 text-sm">© 2024 Artemis Health. Your data, your control.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}