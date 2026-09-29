import { useEffect, useState } from 'react'

const messages = [
  '오늘도 화이팅!',
  '한 줄씩 천천히!',
  '잘하고 있어!',
  '잠깐 쉬어가도 괜찮아!',
]

export function SidebarMascot() {
  const [messageIndex, setMessageIndex] = useState(0)
  const [isMessageVisible, setIsMessageVisible] = useState(false)

  useEffect(() => {
    let hideMessageTimer: ReturnType<typeof setTimeout>

    const showMessage = () => {
      setIsMessageVisible(true)
      hideMessageTimer = setTimeout(() => setIsMessageVisible(false), 3600)
    }

    const firstMessageTimer = setTimeout(showMessage, 1400)
    const messageInterval = setInterval(() => {
      setMessageIndex((currentIndex) => (currentIndex + 1) % messages.length)
      showMessage()
    }, 9000)

    return () => {
      clearTimeout(firstMessageTimer)
      clearTimeout(hideMessageTimer)
      clearInterval(messageInterval)
    }
  }, [])

  return (
    <div className="sidebar-mascot">
      <div aria-live="polite" className={`mascot-speech ${isMessageVisible ? 'is-visible' : ''}`}>
        {messages[messageIndex]}
      </div>
      <img
        alt="응원하는 포메라니안 마스코트"
        className="mascot-gif"
        src={`${import.meta.env.BASE_URL}sidebar-dog.gif`}
      />
    </div>
  )
}
