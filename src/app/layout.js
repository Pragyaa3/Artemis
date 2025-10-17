// src/app/layout.js
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Artemis - Women\'s Health Research Platform',
  description: 'Track symptoms. Fund research. Hold healthcare accountable.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}