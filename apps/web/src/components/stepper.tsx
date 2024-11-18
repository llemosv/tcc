import { Check } from 'lucide-react'
import React from 'react'

interface StepperProps {
  steps: string[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="mb-8 flex items-center justify-center">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                index < currentStep - 1
                  ? 'bg-primary text-white'
                  : index === currentStep - 1
                    ? 'bg-primary/20 text-primary'
                    : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index < currentStep - 1 ? <Check size={20} /> : index + 1}
            </div>
            <span
              className={`mt-2 text-xs ${
                index < currentStep - 1
                  ? 'text-primary'
                  : index === currentStep - 1
                    ? 'text-primary/50'
                    : 'text-gray-500'
              }`}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`mx-1 mb-5 h-1 w-32 ${
                index < currentStep - 1 ? 'bg-primary' : 'bg-gray-200'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
