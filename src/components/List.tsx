import { useState } from 'react'
import { Link } from 'react-router-dom'
import { dailyQuotes, practiceGroups } from '../data/practiceData'
import { Button } from './Button'
import { Input } from './Input'
import { Modal } from './Modal'
import { SelectBox } from './SelectBox'
import { Textarea } from './Textarea'

function getDailyQuote() {
  const today = new Date()
  const dateKey = today.getFullYear() * 372 + (today.getMonth() + 1) * 31 + today.getDate()

  return dailyQuotes[dateKey % dailyQuotes.length]
}

export function List() {
  const dailyQuote = getDailyQuote()
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)
  const practiceOptions = practiceGroups.flatMap((group) => group.practices).map((practice) => ({
    label: practice.title,
    value: practice.path,
  }))

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
            <img src={`${import.meta.env.BASE_URL}logo-3d.png`} alt="" />
          </div>
        </div>

        <section className="practice-section" aria-labelledby="practice-title">
          <div className="section-heading">
            <div><p className="eyebrow">LEARNING LOG</p><h2 id="practice-title">실습 목록</h2></div>
            <Button onClick={() => setIsRecordModalOpen(true)} variant="outline">+ 기록 등록</Button>
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
      <Modal
        footer={
          <>
            <Button onClick={() => setIsRecordModalOpen(false)} variant="plain">취소</Button>
            <Button>등록</Button>
          </>
        }
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="기록 등록하기"
      >
        <form className="record-form">
          <Input id="record-title" label="타이틀" placeholder="실습 제목을 입력해 주세요" />
          <Input id="record-subtitle" label="소제목" placeholder="짧은 소제목을 입력해 주세요" />
          <Input defaultValue={new Date().toISOString().slice(0, 10)} id="record-date" label="날짜" type="date" />
          <Textarea id="record-description" label="디스크립션" placeholder="실습 내용을 짧게 설명해 주세요" rows={3} />
          <SelectBox id="record-practice" label="실습 컨텐츠" options={practiceOptions} />
          <Textarea id="record-summary" label="오늘의 핵심 내용" placeholder="오늘 배운 핵심 내용을 기록해 주세요" rows={5} />
        </form>
      </Modal>
    </main>
  )
}
