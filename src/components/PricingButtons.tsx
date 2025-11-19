'use client'

interface PricingButtonsProps {
  listingType: 'basic' | 'featured'
}

export default function PricingButtons({ listingType }: PricingButtonsProps) {
  const handleClick = () => {
    // Scroll to the form
    const formSection = document.getElementById('application-heading')
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    
    // Wait for scroll, then select the radio button
    setTimeout(() => {
      const radioButton = document.querySelector(`input[value="${listingType}"]`) as HTMLInputElement
      if (radioButton) {
        radioButton.click()
        radioButton.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 500)
  }

  const buttonClass = listingType === 'basic' 
    ? 'w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors'
    : 'w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors'

  const buttonText = listingType === 'basic' 
    ? 'Select Basic Listing'
    : 'Select Featured Listing'

  return (
    <button 
      onClick={handleClick}
      className={buttonClass}
    >
      {buttonText}
    </button>
  )
}

