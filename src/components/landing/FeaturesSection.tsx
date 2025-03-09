export default function FeaturesSection() {
  const features = [
    {
      title: 'AI Legal Assistant',
      description: 'Get instant answers to common legal questions with our advanced AI technology trained on extensive legal data.',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: 'Smart Contracts',
      description: 'Generate and review standardized legal contracts with AI assistance and professional oversight when needed.',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Professional Network',
      description: 'Connect with qualified lawyers specialized in your specific legal needs when you require professional legal services.',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div id="features" className="py-24 bg-white">
      <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        <div className="relative">
          <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A Smarter Way to Access Legal Services
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
            Our platform combines cutting-edge AI technology with professional legal expertise 
            to deliver efficient, affordable, and reliable legal services.
          </p>
        </div>

        <div className="relative mt-16 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {features.map((feature, index) => (
            <div key={index} className="mt-10 first:mt-0 lg:mt-0">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-900 text-white">
                  {feature.icon}
                </div>
                <div className="ml-16 pt-0.5">
                  <h3 className="text-lg font-medium text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </div>
              
              {/* Feature detail card */}
              <div className="mt-6 ml-16 bg-gray-50 rounded-lg p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`h-8 w-8 rounded-full ${index === 0 ? 'bg-blue-100' : index === 1 ? 'bg-amber-100' : 'bg-green-100'} flex items-center justify-center`}>
                        <span className={`text-sm font-medium ${index === 0 ? 'text-blue-800' : index === 1 ? 'text-amber-800' : 'text-green-800'}`}>
                          {index === 0 ? 'AI' : index === 1 ? 'SC' : 'PRO'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <span className="text-sm font-medium text-gray-900">
                        {index === 0 ? 'Instant answers' : index === 1 ? 'Standardized templates' : 'Expert consultation'}
                      </span>
                    </div>
                  </div>
                  {index === 0 ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Available Now
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-blue-50 rounded-xl p-8 border border-blue-100 shadow-sm">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900">Why Our Approach Works</h3>
            <p className="mt-2 text-gray-600">The unique three-sided marketplace that benefits everyone</p>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-100 text-blue-900 mb-4 mx-auto">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 className="text-center text-lg font-medium text-gray-900">For Clients</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Lower cost legal services</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>24/7 access to legal information</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Seamless upgrade to professional help</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-amber-100 text-amber-900 mb-4 mx-auto">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-center text-lg font-medium text-gray-900">For Law Firms</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-amber-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Increased client acquisition</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-amber-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Reduced administrative workload</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-amber-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Data monetization opportunities</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-green-100 text-green-900 mb-4 mx-auto">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h4 className="text-center text-lg font-medium text-gray-900">For AI Technology</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Access to valuable legal data</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Distribution channel for products</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Increased equity value</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}