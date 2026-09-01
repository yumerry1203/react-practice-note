import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface PracticeLayoutProps {
  title: string
  children: ReactNode
}

export function PracticeLayout({ title, children }: PracticeLayoutProps) {
  return (
    <main className="practice-page">
      <section className="practice-notebook" aria-labelledby="practice-page-title">
        <header className="practice-page-header">
          <Link className="back-link" to="/">← 실습 목록으로</Link>
          <span className="page-label">REACT PRACTICE NOTE</span>
          <h1 id="practice-page-title">{title}</h1>
        </header>
        <div className="notebook-content">{children}</div>
      </section>
    </main>
  )
}
