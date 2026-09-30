import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../data/categoryData'
import { Button } from './Button'
import { Input } from './Input'
import { Modal } from './Modal'
import { SelectBox } from './SelectBox'
import { SidebarMascot } from './SidebarMascot'
import { Textarea } from './Textarea'

const posts = import.meta.glob<string>('../content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function getRecentPosts() {
  return Object.entries(posts)
    .map(([path, content]) => {
      const routeMatch = path.match(/\/content\/([^/]+)\/([^/]+)\.md$/)
      const frontmatter = content.match(/^---\s*\n([\s\S]*?)\n---/)?.[1] ?? ''
      const title = frontmatter.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1]
      const date = frontmatter.match(/^date:\s*["']?(.+?)["']?\s*$/m)?.[1] ?? ''

      if (!routeMatch) return null

      const [, category, slug] = routeMatch
      return { category, date, path, slug, title: title ?? slug }
    })
    .filter((post): post is NonNullable<typeof post> => post !== null)
    .filter((post) => !post.date.startsWith('Last Updated ·'))
    .sort((a, b) => {
      if (!a.date) return 1
      if (!b.date) return -1

      return b.date.localeCompare(a.date)
    })
    .slice(0, 4)
}

export function List() {
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)
  const getPostCount = (categorySlug: string) => Object.keys(posts).filter((path) => path.includes(`/content/${categorySlug}/`)).length
  const recentPosts = getRecentPosts()

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <header className="site-brand"><strong>YUHYEONG.DEV</strong><span>Frontend Dev Note</span></header>
        <nav aria-label="학습 카테고리" className="sidebar-navigation">
          <a className="sidebar-link is-active" href="#top"><span>⌂</span>홈</a>
          {categories.map((category) => <Link className="sidebar-link" key={category.slug} to={`/category/${category.slug}`}><span>{category.icon}</span>{category.name}</Link>)}
        </nav>
        <SidebarMascot />
      </aside>

      <section className="dashboard-content" id="top">
        <section className="dashboard-hero" aria-labelledby="dashboard-title">
          <div>
            <p>YUHYEONG.DEV</p>
            <h1 id="dashboard-title">Frontend Dev Note</h1>
            <p className="dashboard-description">프론트엔드 개발 과정에서 학습한 개념과 실무 경험을 다시 정리하고, 구현 및 트러블슈팅 과정을 기록하는 개인 개발 노트입니다.</p>
            <Button className="dashboard-write-button is-hidden" onClick={() => setIsRecordModalOpen(true)}>✎ 글 작성하기 <span aria-hidden="true">→</span></Button>
          </div>
          <div aria-hidden="true" className="hero-illustration"><img alt="" className="hero-laptop-image" src={`${import.meta.env.BASE_URL}dashboard-laptop.png`} /></div>
        </section>

        <section aria-label="카테고리 목록" className="category-grid">
          {categories.map((category) => {
            const postCount = getPostCount(category.slug)

            return <Link aria-label={`${category.name} 카테고리 보기`} className={`category-card ${category.tone}`} key={category.slug} to={`/category/${category.slug}`}><span className="category-icon">{category.icon}</span><h2>{category.name}</h2><p>{postCount}개의 글</p><span aria-hidden="true" className="category-arrow">→</span></Link>
          })}
        </section>

        <section aria-labelledby="recent-posts-title" className="recent-posts">
          <header><span aria-hidden="true">▤</span><h2 id="recent-posts-title">최근 글</h2></header>
          {recentPosts.length > 0 ? (
            <ul className="recent-post-list">
              {recentPosts.map((post) => (
                <li key={post.path}>
                  <Link to={`/${post.category}/${post.slug}`}>
                    <strong>{post.title}</strong>
                    {post.date && <time dateTime={post.date}>{post.date.replaceAll('-', '.')}</time>}
                  </Link>
                </li>
              ))}
            </ul>
          ) : <div className="empty-posts">아직 작성된 글이 없어요.</div>}
        </section>
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
