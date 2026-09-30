import { useEffect, useState } from 'react'

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY > 240)

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })

    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  if (!isVisible) return null

  return (
    <button aria-label="글 맨 위로 이동" className="scroll-to-top-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} type="button">
      <span aria-hidden="true">↑</span>
    </button>
  )
}
