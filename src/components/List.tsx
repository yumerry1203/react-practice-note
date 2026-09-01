import { Link } from 'react-router-dom'

const august28Practices = [
  { number: '01', icon: '◉', title: '프로필 카드 만들기', description: 'Props와 타입으로 나만의 프로필 카드 구성하기', path: '/user-profile', tone: 'lilac' },
  { number: '02', icon: '✦', title: '상태별 데이터 표시', description: '구별된 공용체로 안전한 UI 상태 다루기', path: '/status-display', tone: 'pink' },
  { number: '03', icon: '⌘', title: '커스텀 버튼 만들기', description: 'HTML 버튼 속성을 확장해 재사용하기', path: '/custom-button', tone: 'peach' },
  { number: '04', icon: '↗', title: '이벤트와 스타일 정밀 조작', description: '입력값과 이벤트를 타입 안전하게 다루기', path: '/input-field', tone: 'lavender' },
]

const practiceGroups = [
  {
    date: '2026.09.01(화)',
    practices: [
      { number: '07', icon: '⌁', title: 'TS 마이그레이션 솔루션', description: '타입 규격으로 안전한 데이터 흐름 만들기', path: '/tax-calculator', tone: 'lavender' },
    ],
  },
  {
    date: '2026.08.31(월)',
    practices: [
      { number: '05', icon: '⌘', title: '제네릭 실습: 마법의 거푸집', description: '하나의 목록으로 서로 다른 타입 다루기', path: '/data-list', tone: 'pink' },
    ],
  },
  { date: '2026.08.28(금)', practices: august28Practices },
]

const dailyQuotes = [
  '완벽한 시작보다, 오늘의 작은 완료가 더 멀리 데려간다.',
  '배운 것을 손으로 만들 때, 지식은 내 것이 된다.',
  '조금씩 쌓인 코드가 결국 나만의 방향을 만든다.',
  '막히는 순간도 이해가 자라는 과정이다.',
  '오늘의 연습은 내일의 자신감을 위한 한 줄이다.',
]

function getDailyQuote() {
  const today = new Date()
  const dateKey = today.getFullYear() * 372 + (today.getMonth() + 1) * 31 + today.getDate()

  return dailyQuotes[dateKey % dailyQuotes.length]
}

export function List() {
  const dailyQuote = getDailyQuote()

  return (
    <main className="workspace-shell">
      <section className="workspace-paper" aria-labelledby="workspace-title">
        <header className="workspace-header">
          <div className="window-dots" aria-hidden="true"><span /><span /><span /></div>
          <p className="workspace-file">workspace.tsx</p>
        </header>

        <div className="workspace-intro">
          <div className="intro-copy">
            <p className="eyebrow">PERSONAL PLAYGROUND</p>
            <h1 id="workspace-title">react 연습 노트</h1>
            <p className="profile-name">Na YuHyeong (28)</p>
            <p className="daily-quote">“{dailyQuote}”</p>
            <div className="intro-tags" aria-label="현재 학습 주제"><span>React</span><span>TypeScript</span><span>Component</span></div>
          </div>
          <div className="intro-logo" aria-hidden="true">
            <img src="/logo-3d.png" alt="" />
          </div>
        </div>

        <section className="practice-section" aria-labelledby="practice-title">
          <div className="section-heading">
            <div><p className="eyebrow">LEARNING LOG</p><h2 id="practice-title">실습 목록</h2></div>
            <span className="practice-count">날짜별 작업 기록</span>
          </div>
          <div className="practice-groups">
            {practiceGroups.map((group) => (
              <section className="practice-day" key={group.date}>
                <h3>{group.date}</h3>
                {group.practices.length > 0 ? (
                  <ul className="practice-grid">
                    {group.practices.map((practice) => (
                      <li key={practice.path}>
                        <Link className={`practice-card ${practice.tone}`} to={practice.path}>
                          <span className="practice-number">{practice.number}</span>
                          <span className="practice-icon" aria-hidden="true">{practice.icon}</span>
                          <span className="practice-content"><strong>{practice.title}</strong><small>{practice.description}</small></span>
                          <span className="practice-arrow" aria-hidden="true">→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : <p className="empty-practice">아직 기록된 실습이 없어요.</p>}
              </section>
            ))}
          </div>
        </section>

        <footer className="workspace-footer"><strong>Keep building.</strong><span>Idea → Component → Practice</span></footer>
      </section>
    </main>
  )
}
