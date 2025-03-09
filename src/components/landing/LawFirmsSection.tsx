import Link from 'next/link'

export default function LawFirmsSection() {
  const benefits = [
    {
      title: "Client Acquisition",
      description: "Connect with pre-qualified clients seeking your specific legal expertise. Convert leads more efficiently with our AI pre-screening.",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: "Smart Triage System",
      description: "Let our AI handle basic inquiries and paperwork, freeing your time for high-value legal work requiring your expertise.",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: "Data Monetization",
      description: "Generate passive revenue through our data-for-equity model while improving the AI systems that support your practice.",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Digital Presence",
      description: "Establish your online reputation and increase visibility to clients searching for your specific legal expertise.",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
    },
  ];

  const steps = [
    { number: "01", title: "Register", description: "Create your law firm profile with basic credentials" },
    { number: "02", title: "Verify", description: "Complete verification with your license information" },
    { number: "03", title: "Setup", description: "Customize your profile and areas of expertise" },
    { number: "04", title: "Connect", description: "Start receiving inquiries from potential clients" }
  ];

  return (
    <div id="law-firms" className="py-16 bg-gradient-to-br from-[#0A2463] to-[#102A43] text-white overflow-hidden">
      <div className="relative">
        <div className="absolute top-0 right-0 w-1/3 h-full dot-pattern opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-2/3 dot-pattern opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-[#1E88E5] font-semibold tracking-wide uppercase">
              Partner With Us
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl">
              Join Our Network of Legal Professionals
            </p>
            <p className="mt-4 max-w-2xl text-xl text-blue-100 lg:mx-auto">
              Grow your practice, streamline client acquisition, and focus on what you do best - providing expert legal counsel.
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="relative bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-colors">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#1E88E5] text-white">
                    {benefit.icon}
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium">{benefit.title}</h3>
                    <p className="mt-2 text-base text-blue-200">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20">
            <h3 className="text-xl font-bold text-center mb-10">How to Join Our Platform</h3>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {steps.map((step) => (
                  <div key={step.number} className="bg-white/5 rounded-lg p-6 relative hover:bg-white/10 transition-colors">
                    <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-[#1E88E5] flex items-center justify-center text-white font-bold">
                      {step.number}
                    </div>
                    <h4 className="text-lg font-medium mb-2 mt-2">{step.title}</h4>
                    <p className="text-blue-100">{step.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 p-6 bg-white/5 rounded-lg">
                <h4 className="text-lg font-bold mb-2">Early Adopter Benefits</h4>
                <p className="text-blue-100 mb-4">Law firms that join during our launch phase receive special benefits:</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-[#1E88E5] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Priority listing placement</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-[#1E88E5] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Reduced commission rates</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-[#1E88E5] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Template co-development</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link 
              href="/auth/firm" 
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#0A2463] bg-[#1E88E5] hover:bg-[#1976D2] md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out"
            >
              Register Your Law Firm
            </Link>
            <p className="mt-4 text-sm text-blue-200">
              Already have an account? <Link href="/auth" className="text-[#90CAF9] hover:text-white">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}