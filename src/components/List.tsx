import { Link } from 'react-router-dom'
import { Sidebar } from './Sidebar'

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
  const getPostCount = (categorySlug: string) => Object.keys(posts).filter((path) => path.includes(`/content/${categorySlug}/`)).length
  const recentPosts = getRecentPosts()
  const dashboardItems = [
    { name: 'Study Log', icon: '▤', tone: 'study-log', to: '/study-log', count: ['javascript', 'react', 'typescript', 'frontend'].reduce((total, slug) => total + getPostCount(slug), 0) },
    { name: 'Tech Trends', icon: '⌁', tone: 'tech-trends', to: '/category/tech-trends', count: 0 },
    { name: 'Projects', icon: '□', tone: 'projects', to: '/category/projects', count: getPostCount('projects') },
    { name: 'Troubleshooting', icon: '⌕', tone: 'troubleshooting', to: '/category/troubleshooting', count: getPostCount('troubleshooting') },
  ]

  return (
    <main className="dashboard-shell">
      <Sidebar active="home" />

      <section className="dashboard-content" id="top">
        <section className="dashboard-hero" aria-labelledby="dashboard-title">
          <div>
            <p>YUHYEONG.DEV</p>
            <h1 id="dashboard-title">Frontend Dev Note</h1>
            <p className="dashboard-description">프론트엔드 개발 과정에서 학습한 개념과 실무 경험을 다시 정리하고, 구현 및 트러블슈팅 과정을 기록하는 개인 개발 노트입니다.</p>
          </div>
          <div aria-hidden="true" className="hero-illustration"><img alt="" className="hero-laptop-image" src={`${import.meta.env.BASE_URL}dashboard-laptop.png`} /></div>
        </section>

        <section aria-label="카테고리 목록" className="category-grid">
          {dashboardItems.map((item) => {
            return <Link aria-label={`${item.name} 보기`} className={`category-card ${item.tone}`} key={item.name} to={item.to}><span className="category-icon">{item.icon}</span><h2>{item.name}</h2><p>{item.count}개의 글</p><span aria-hidden="true" className="category-arrow">→</span></Link>
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
    </main>
  )
}
