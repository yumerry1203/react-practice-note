import { Link } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { getCategory, studyCategories } from '../data/categoryData'

const posts = import.meta.glob<string>('../content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function removeQuotes(value: string) {
  return value.trim().replace(/^["']|["']$/g, '')
}

function getPostMetadata(content: string, fallbackTitle: string) {
  const frontmatter = content.match(/^---\s*\n([\s\S]*?)\n---/)?.[1]
  const markdownTitle = content.match(/^#\s+(.+)$/m)?.[1]
  const metadata = { title: markdownTitle ?? fallbackTitle, description: '', date: '', tags: [] as string[] }
  let isReadingTags = false

  frontmatter?.split('\n').forEach((line) => {
    const tagItem = line.match(/^\s*-\s+(.+)$/)
    if (isReadingTags && tagItem) {
      metadata.tags.push(removeQuotes(tagItem[1]))
      return
    }

    const field = line.match(/^(title|description|date|tags):\s*(.*)$/)
    if (!field) return
    const [, key, rawValue] = field
    const value = removeQuotes(rawValue)
    isReadingTags = key === 'tags' && value === ''
    if (key === 'title' && value) metadata.title = value
    if (key === 'description') metadata.description = value
    if (key === 'date') metadata.date = value
  })

  return metadata
}

export function StudyLogPage() {
  const studyPosts = Object.entries(posts)
    .map(([path, content]) => {
      const match = path.match(/\/content\/([^/]+)\/([^/]+)\.md$/)
      if (!match) return null
      const [, categorySlug, slug] = match
      const category = getCategory(categorySlug)
      if (!category || !studyCategories.some((item) => item.slug === category.slug)) return null
      return { path, slug, category, ...getPostMetadata(content, slug) }
    })
    .filter((post): post is NonNullable<typeof post> => post !== null)
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <main className="dashboard-shell">
      <Sidebar active="study-log" />
      <section className="dashboard-content category-content study-log-content">
        <nav aria-label="현재 위치" className="breadcrumb"><Link to="/">홈</Link><span>›</span><strong>Study Log</strong></nav>
        <section className="study-log-hero" aria-labelledby="study-log-title">
          <p>STUDY LOG</p>
          <h1 id="study-log-title">Study Log</h1>
          <span>{studyPosts.length}개의 학습 기록</span>
        </section>
        <section aria-labelledby="study-log-posts-title" className="category-posts">
          <header><h2 id="study-log-posts-title">전체 글 <span>{studyPosts.length}</span></h2></header>
          <ul className="post-list">
            {studyPosts.map((post) => (
              <li key={post.path}>
                <Link className="post-list-item" to={`/${post.category.slug}/${post.slug}`}>
                  <div className="post-list-content">
                    <span className={`post-list-category ${post.category.tone}`}>{post.category.name}</span>
                    <h3>{post.title}</h3>
                    {post.description && <p>{post.description}</p>}
                  </div>
                  <div className="post-list-meta">
                    {post.date && <time dateTime={post.date}>{post.date.replaceAll('-', '.')}</time>}
                    <span aria-hidden="true" className="post-list-arrow">→</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  )
}
