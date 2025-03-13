// src/app/dashboard/documents/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { FileText, Clock, AlertCircle } from 'lucide-react'

export default function DocumentsPage() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  
  // Simulate loading progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setShowMessage(true), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 30);
    
    return () => clearInterval(timer);
  }, []);
  
  // Animation styles
  const styles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.8; }
      100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes shimmer {
      0% { background-position: -468px 0; }
      100% { background-position: 468px 0; }
    }
    
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .coming-soon-title {
      animation: fadeIn 0.8s ease-out forwards, pulse 3s ease-in-out infinite;
      font-size: 3rem;
      line-height: 1.2;
      font-weight: 800;
      background: linear-gradient(90deg, #3b82f6, #4f46e5, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-size: 200% auto;
      background-position: 0 0;
    }
    
    .coming-soon-subtitle {
      animation: fadeIn 0.8s 0.3s ease-out forwards;
      opacity: 0;
      animation-fill-mode: forwards;
    }
    
    .document-icon {
      animation: float 3s ease-in-out infinite, fadeIn 0.5s ease-out forwards;
    }
    
    .progress-bar-container {
      height: 6px;
      width: 300px;
      background-color: rgba(209, 213, 219, 0.5);
      border-radius: 999px;
      overflow: hidden;
      margin: 2rem auto;
      animation: fadeIn 0.8s 0.6s ease-out forwards;
      opacity: 0;
      animation-fill-mode: forwards;
    }
    
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      border-radius: 999px;
      transition: width 0.2s ease;
    }
    
    .message-box {
      animation: fadeIn 0.8s ease-out forwards;
      opacity: 0;
      animation-fill-mode: forwards;
      max-width: 500px;
      margin: 2rem auto;
      padding: 1.5rem;
      border-radius: 0.5rem;
      background-color: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border-left: 4px solid #3b82f6;
    }
    
    .loading-spinner {
      animation: rotate 1.5s linear infinite;
      width: 24px;
      height: 24px;
      border: 3px solid rgba(59, 130, 246, 0.3);
      border-radius: 50%;
      border-top-color: #3b82f6;
      margin-right: 10px;
    }
  `;
  
  return (
    <>
      <style>{styles}</style>
      <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center text-center px-4">
        
          {/* Icon */}
          <div className="document-icon mb-6 text-blue-600">
            <FileText size={80} strokeWidth={1.5} />
          </div>
          
          {/* Title */}
          <h1 className="coming-soon-title mb-4">Coming Soon</h1>
          
          {/* Subtitle */}
          <p className="coming-soon-subtitle text-gray-600 text-xl mb-8 max-w-lg">
            Our smart contract management system is currently under development and will be available shortly.
          </p>
          
          {/* Progress indicator */}
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Status message */}
          {showMessage && (
            <div className="message-box flex items-start">
              <div className="mr-3 flex-shrink-0 text-blue-500">
                <AlertCircle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Development in Progress</h3>
                <p className="text-gray-600">
                  Our team is working to bring you advanced document management features with AI-powered analysis and smart contract integration.
                </p>
                <div className="mt-4 flex items-center text-sm text-blue-600">
                  <Clock size={16} className="mr-1" />
                  <span>Estimated launch: Q2 2025</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Additional info */}
          <div className="mt-6 text-center flex items-center text-gray-500 text-sm">
            <div className="loading-spinner"></div>
            Preparing your document workspace...
          </div>
        </div>
      </div>
      
      {/* Original iframe (commented out) */}
      {/* 
      <iframe
        src="http://localhost:8501"
        className="w-full h-full"
        style={{ border: 'none' }}
        title="Smart Contract System"
        allow="camera;microphone"
      />
      */}
    </>
  )
}