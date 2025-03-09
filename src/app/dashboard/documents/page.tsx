'use client'

import { useEffect, useState } from 'react'

export default function DocumentsPage() {
  return (
    <div className="absolute inset-0">
      <iframe
        src="http://localhost:8501"
        className="w-full h-full"
        style={{ border: 'none' }}
        title="Smart Contract System"
        allow="camera;microphone"
      />
    </div>
  )
}
