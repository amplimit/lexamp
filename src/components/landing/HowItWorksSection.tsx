// src/components/landing/HowItWorksSection.tsx
export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Sign Up',
      description: 'Create your free account to access our platform and AI assistant.',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Describe Your Need',
      description: 'Tell our AI assistant about your legal question or document needs.',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Get AI Assistance',
      description: 'Receive instant answers and document generation through our AI system.',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      number: '04',
      title: 'Professional Help (If Needed)',
      description: 'Connect with qualified lawyers when your case requires deeper expertise.',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div id="how-it-works" className="py-16 bg-[#F0F4F8] overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="lg:text-center">
            <h2 className="text-base text-[#1E88E5] font-semibold tracking-wide uppercase">
              How It Works
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-[#0A2463] sm:text-4xl">
              Legal help in minutes, not days
            </p>
            <p className="mt-4 max-w-2xl text-xl text-[#334E68] lg:mx-auto">
              Our platform combines AI technology with legal expertise to provide you with quick and reliable legal assistance.
            </p>
          </div>

          <div className="mt-16">
            <div className="relative">
              {/* Process diagram line */}
              <div className="hidden lg:block absolute top-0 left-1/2 w-0.5 h-full -ml-0.5 bg-[#E3F2FD] z-0"></div>
              
              <div className="space-y-16">
                {steps.map((step, index) => (
                  <div key={step.title} className={`relative lg:flex ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                    {/* Step circle - visible on all screens */}
                    <div className="lg:hidden absolute z-10 left-0 top-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#1E88E5] text-white font-bold">
                      {step.number}
                    </div>
                    
                    {/* Step content - mobile */}
                    <div className="lg:hidden ml-16">
                      <h3 className="text-lg leading-6 font-medium text-[#0A2463]">{step.title}</h3>
                      <p className="mt-2 text-base text-[#334E68]">{step.description}</p>
                    </div>
                    
                    {/* Desktop layout */}
                    <div className="hidden lg:block lg:w-1/2 lg:px-8 lg:py-6">
                      <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${index % 2 === 0 ? 'lg:mr-12' : 'lg:ml-12'}`}>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#1E88E5] text-white">
                            {step.icon}
                          </div>
                          <h3 className="ml-4 text-lg leading-6 font-medium text-[#0A2463]">{step.title}</h3>
                        </div>
                        <p className="mt-4 text-base text-[#334E68]">{step.description}</p>
                      </div>
                    </div>
                    
                    {/* Step circle - desktop only */}
                    <div className="hidden lg:block absolute z-10 left-1/2 top-1/2 -translate-y-1/2 -ml-6 flex items-center justify-center w-12 h-12 rounded-full bg-[#1E88E5] text-white font-bold">
                      {step.number}
                    </div>
                    
                    {/* Empty div for layout */}
                    <div className="hidden lg:block lg:w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Features comparison box */}
          <div className="mt-20 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-8">
              <div className="text-center mb-10">
                <h3 className="text-xl font-bold text-[#0A2463]">How LexAmp Compares</h3>
                <p className="mt-2 text-[#334E68]">See how our platform offers the best of both worlds</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#334E68] uppercase tracking-wider"></th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-[#334E68] uppercase tracking-wider">Traditional Legal Services</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-[#1E88E5] uppercase tracking-wider bg-[#E3F2FD]">LexAmp Platform</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-[#334E68] uppercase tracking-wider">DIY Legal Research</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0A2463]">Cost</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-[#334E68]">$$$</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-[#1E88E5] font-medium bg-[#E3F2FD]">$</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-[#334E68]">Free - $</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0A2463]">Accuracy</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-[#334E68]">High</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-[#1E88E5] font-medium bg-[#E3F2FD]">High</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-[#334E68]">Low - Medium</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0A2463]">Speed</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-[#334E68]">Days - Weeks</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-[#1E88E5] font-medium bg-[#E3F2FD]">Minutes - Hours</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-[#334E68]">Hours - Days</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0A2463]">Personalization</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-[#334E68]">High</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-[#1E88E5] font-medium bg-[#E3F2FD]">Medium - High</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-[#334E68]">Low</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0A2463]">Professional Support</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-[#334E68]">Always</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-[#1E88E5] font-medium bg-[#E3F2FD]">When Needed</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-[#334E68]">None</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}