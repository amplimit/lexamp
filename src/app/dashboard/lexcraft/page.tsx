'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'

export default function LexcraftPage() {
  const [iframeHeight, setIframeHeight] = useState('calc(100vh - 200px)')

  useEffect(() => {
    // Function to update iframe height based on window size
    const updateHeight = () => {
      setIframeHeight(`calc(100vh - 200px)`)
    }

    // Set initial height
    updateHeight()

    // Add event listener for window resize
    window.addEventListener('resize', updateHeight)

    // Cleanup
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full overflow-hidden">
        <iframe
          src="http://localhost:8501"
          width="100%"
          height={iframeHeight}
          style={{ border: 'none' }}
          title="Lexcraft Smart Contract System"
          allow="camera;microphone"
        />
      </Card>
    </div>
  )
}
