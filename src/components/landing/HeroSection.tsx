import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-b from-white to-blue-50 pt-24 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/pattern-bg.png')] opacity-5"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
          <div className="lg:col-span-6">
            <div className="text-center lg:text-left md:max-w-2xl md:mx-auto lg:mx-0">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                <span className="block mb-1">Transforming</span>
                <span className="block text-blue-900">Legal Services</span>
                <span className="block text-2xl font-semibold text-amber-700 mt-2">AI-Powered & Professional</span>
              </h1>
              <p className="mt-3 text-base text-gray-700 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Access affordable legal expertise instantly through our AI-driven platform, and connect with qualified lawyers when needed. We're building a bridge between modern technology and traditional legal services.
              </p>
              <div className="mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                <div className="rounded-md shadow">
                  <Link
                    href="/auth"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out"
                  >
                    Get Started
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0">
                  <Link
                    href="#how-it-works"
                    className="w-full flex items-center justify-center px-8 py-3 border border-blue-900 text-base font-medium rounded-md text-blue-900 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start items-center space-y-4 sm:space-y-0 sm:space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center border-2 border-white text-xs text-blue-800 font-medium">
                        {i}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">Trusted by law firms</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm text-gray-600">4.9/5 client satisfaction</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:col-span-6 relative">
            <div className="relative mx-auto w-full rounded-lg shadow-lg overflow-hidden lg:max-w-md">
              <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                <img
                  className="w-full"
                  src="/hero-image.jpg"
                  alt="Legal professionals working together"
                />
                <div className="absolute inset-0 bg-blue-900 opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg className="h-6 w-6 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          Get instant legal advice through our AI assistant or connect with professional lawyers for complex matters.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center transform rotate-12">
                <span className="text-white font-bold text-sm text-center leading-tight">Join as a<br />Law Firm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}