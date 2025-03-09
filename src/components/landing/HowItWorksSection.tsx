// src/components/landing/HowItWorksSection.tsx
export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Sign Up',
      description: 'Create your free account to get started with our services.',
    },
    {
      number: '02',
      title: 'Ask Questions',
      description: 'Get instant answers from our AI legal assistant.',
    },
    {
      number: '03',
      title: 'Generate Documents',
      description: 'Create legal documents with AI assistance.',
    },
    {
      number: '04',
      title: 'Connect with Lawyers',
      description: 'Get professional help when needed.',
    },
  ]

  return (
    <div id="how-it-works" className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
            How It Works
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Simple steps to get legal help
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Follow these simple steps to access our legal services and get the help you need.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {steps.map((step) => (
              <div key={step.title} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <span className="text-lg font-bold">{step.number}</span>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{step.title}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  {step.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}