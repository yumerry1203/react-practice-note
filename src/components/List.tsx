import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../data/categoryData'
import { Button } from './Button'
import { Input } from './Input'
import { Modal } from './Modal'
import { SelectBox } from './SelectBox'
import { Textarea } from './Textarea'

const posts = import.meta.glob('../content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export function List() {
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)
  const getPostCount = (categorySlug: string) => Object.keys(posts).filter((path) => path.includes(`/content/${categorySlug}/`)).length

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <header className="site-brand"><strong>YUHYEONG.DEV</strong><span>Frontend Learning Note</span></header>
        <nav aria-label="학습 카테고리" className="sidebar-navigation">
          <a className="sidebar-link is-active" href="#top"><span>⌂</span>홈</a>
          {categories.map((category) => <Link className="sidebar-link" key={category.slug} to={`/category/${category.slug}`}><span>{category.icon}</span>{category.name}</Link>)}
        </nav>
      </aside>

      <section className="dashboard-content" id="top">
        <section className="dashboard-hero" aria-labelledby="dashboard-title">
          <div><p>YUHYEONG.DEV</p><h1 id="dashboard-title">Frontend Learning Note</h1><Button onClick={() => setIsRecordModalOpen(true)}>✎ 글 작성하기 <span aria-hidden="true">→</span></Button></div>
          <div aria-hidden="true" className="hero-illustration"><div className="hero-desk"><span className="hero-screen" /><span className="hero-cup" /><span className="hero-book" /></div></div>
        </section>

        <section aria-label="카테고리 목록" className="category-grid">
          {categories.map((category) => {
            const postCount = getPostCount(category.slug)

            return <Link aria-label={`${category.name} 카테고리 보기`} className={`category-card ${category.tone}`} key={category.slug} to={`/category/${category.slug}`}><span className="category-icon">{category.icon}</span><h2>{category.name}</h2><p>{postCount}개의 글</p><span aria-hidden="true" className="category-arrow">→</span></Link>
          })}
        </section>

        <section aria-labelledby="recent-posts-title" className="recent-posts"><header><span aria-hidden="true">▤</span><h2 id="recent-posts-title">최근 글</h2></header><div className="empty-posts">아직 작성된 글이 없어요.</div></section>
      </section>

      <Modal footer={<><Button onClick={() => setIsRecordModalOpen(false)} variant="plain">취소</Button><Button>등록</Button></>} isOpen={isRecordModalOpen} onClose={() => setIsRecordModalOpen(false)} title="기록 등록하기">
        <form className="record-form">
          <Input id="record-title" label="타이틀" placeholder="제목을 입력해 주세요" />
          <Input id="record-subtitle" label="소제목" placeholder="소제목을 입력해 주세요" />
          <Input defaultValue={new Date().toISOString().slice(0, 10)} id="record-date" label="날짜" type="date" />
          <Textarea id="record-description" label="디스크립션" placeholder="설명을 입력해 주세요" rows={3} />
          <SelectBox id="record-category" label="카테고리" options={categories.map((category) => ({ label: category.name, value: category.slug }))} />
          <Textarea id="record-summary" label="오늘의 핵심 내용" placeholder="핵심 내용을 입력해 주세요" rows={5} />
        </form>
      </Modal>
    </main>
  )
}
