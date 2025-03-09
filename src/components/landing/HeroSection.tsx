import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <div className="relative hero-pattern pt-32 pb-24 overflow-hidden">
      <div className="absolute top-20 left-0 w-full h-full bg-gradient-to-b from-[#E3F2FD] to-white opacity-50 -z-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
          <div className="lg:col-span-6">
            <div className="text-center lg:text-left md:max-w-2xl md:mx-auto lg:mx-0">
              <h1 className="text-4xl tracking-tight font-extrabold text-[#0A2463] sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                <span className="block mb-1">Making Legal Services</span>
                <span className="block text-[#247BA0]">Accessible to Everyone</span>
              </h1>
              <p className="mt-6 text-base text-[#334E68] sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                LexAmp brings together AI technology and legal expertise to provide affordable, 
                efficient, and reliable legal solutions. Get instant answers from our AI legal assistant or 
                connect with qualified lawyers when needed.
              </p>
              <div className="mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                <div className="rounded-md shadow">
                  <Link
                    href="/auth"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#0A2463] hover:bg-[#081D52] md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out"
                  >
                    Get Started
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0">
                  <Link
                    href="#how-it-works"
                    className="w-full flex items-center justify-center px-8 py-3 border border-[#0A2463] text-base font-medium rounded-md text-[#0A2463] bg-white hover:bg-[#E3F2FD] md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              
              {/* Trust indicators */}
              <div className="mt-10 py-4 px-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-[#0A2463] mb-3">Empowering Legal Access</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#E3F2FD] flex items-center justify-center">
                      <svg className="h-6 w-6 text-[#1E88E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-[#334E68]">AI-Powered</p>
                      <p className="text-xs text-gray-500">Instant Legal Support</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#E3F2FD] flex items-center justify-center">
                      <svg className="h-6 w-6 text-[#1E88E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-[#334E68]">Secure</p>
                      <p className="text-xs text-gray-500">Confidential Handling</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#E3F2FD] flex items-center justify-center">
                      <svg className="h-6 w-6 text-[#1E88E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-[#334E68]">Professional</p>
                      <p className="text-xs text-gray-500">When You Need More</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:col-span-6 relative">
            <div className="relative mx-auto w-full rounded-xl shadow-lg overflow-hidden lg:max-w-md">
              <div className="relative block w-full bg-white rounded-xl overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 h-64 sm:h-80 w-full relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0A2463] to-[#247BA0] opacity-80"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-6">
                      <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                        <Image 
                          src="/logo.png" 
                          alt="LexAmp Logo" 
                          width={40} 
                          height={40} 
                          className="object-contain" 
                        />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">LexAmp AI Assistant</h3>
                      <p className="text-white/90 text-sm mb-4">Experience our AI-powered legal assistant for instant answers to your legal questions</p>
                      <div className="inline-flex items-center px-4 py-2 rounded-md bg-white text-sm font-medium text-[#0A2463]">
                        Coming Soon
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 border-t border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-[#E3F2FD] flex items-center justify-center">
                        <svg className="h-6 w-6 text-[#1E88E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <div className="flex space-x-1 mb-1">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#1E88E5] animate-pulse delay-100"></div>
                        <div className="h-2.5 w-2.5 rounded-full bg-[#1E88E5] animate-pulse delay-200"></div>
                        <div className="h-2.5 w-2.5 rounded-full bg-[#1E88E5] animate-pulse delay-300"></div>
                      </div>
                      <p className="text-sm text-[#334E68]">
                        Ask legal questions and get instant answers, or connect with a lawyer when needed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Badge */}
            <div className="absolute -bottom-4 -right-4 transform rotate-3 bg-[#247BA0] text-white px-6 py-2 rounded-lg shadow-md">
              <p className="text-sm font-medium">Launching Q2 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}