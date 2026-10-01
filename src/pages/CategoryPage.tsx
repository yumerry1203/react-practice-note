import { Link, Navigate, useParams } from 'react-router-dom'
import { getCategory } from '../data/categoryData'
import { Sidebar } from '../components/Sidebar'

const posts = import.meta.glob(
  '../content/**/*.md',
  {
    query: '?raw',
    import: 'default',
    eager: true,
  }
)

function removeQuotes(value: string) {
  return value.trim().replace(/^["']|["']$/g, '')
}

function getPostMetadata(content: string, fallbackTitle: string) {
  const frontmatter = content.match(/^---\s*\n([\s\S]*?)\n---/)?.[1]
  const markdownTitle = content.match(/^#\s+(.+)$/m)?.[1]
  const metadata = {
    title: markdownTitle ?? fallbackTitle,
    description: '',
    date: '',
    tags: [] as string[],
  }

  if (!frontmatter) return metadata

  let isReadingTags = false

  frontmatter.split('\n').forEach((line) => {
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
    if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
      metadata.tags = value.slice(1, -1).split(',').map((tag) => removeQuotes(tag)).filter(Boolean)
    }
  })

  return metadata
}

export function CategoryPage() {
  const { categorySlug } = useParams()
  const category = getCategory(categorySlug)
  if (!category) return <Navigate replace to="/" />

  const categoryPosts = Object.entries(posts)
    .filter(([path]) => path.includes(`/content/${category.slug}/`))
    .map(([path, content]) => {
      const slug = path.split('/').pop()?.replace('.md', '') ?? ''

      return { path, slug, ...getPostMetadata(content, slug) }
    })
    .sort((a, b) => {
      if (!a.date) return 1
      if (!b.date) return -1

      return b.date.localeCompare(a.date)
    })
  const postCount = categoryPosts.length

  return (
    <main className="dashboard-shell">
      <Sidebar active={category.slug === 'troubleshooting' ? 'troubleshooting' : category.slug === 'tech-trends' ? 'tech-trends' : 'study-log'} activeCategory={['javascript', 'react', 'typescript', 'frontend'].includes(category.slug) ? category.slug : undefined} />

      <section className="dashboard-content category-content">
        <nav aria-label="현재 위치" className="breadcrumb"><Link to="/">홈</Link><span>›</span><strong>{category.name}</strong></nav>
        <section className={`category-hero ${category.tone}`} aria-labelledby="category-title">
          <span className="category-hero-icon">{category.icon}</span>
          <div><h1 id="category-title">{category.name}</h1><p>{ postCount}개의 글</p></div>
          <span aria-hidden="true" className="category-hero-mark">{category.icon}</span>
        </section>
        <section aria-labelledby="category-posts-title" className="category-posts">
          <header><h2 id="category-posts-title">전체 글 <span>{ postCount }</span></h2></header>
          {postCount > 0 ? (
            <ul className="post-list">
              {categoryPosts.map((post) => (
                <li key={post.path}>
                  <Link className="post-list-item" to={`/${category.slug}/${post.slug}`}>
                    <div className="post-list-content">
                      <h3>{post.title}</h3>
                      {post.description && <p>{post.description}</p>}
                      {post.tags.length > 0 && (
                        <div className="post-list-tags">
                          {post.tags.map((tag) => <span key={tag}>{tag}</span>)}
                        </div>
                      )}
                    </div>
                    <div className="post-list-meta">
                      {post.date && <time dateTime={post.date}>{post.date.replaceAll('-', '.')}</time>}
                      <span aria-hidden="true" className="post-list-arrow">→</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="category-empty">
              <strong>아직 작성된 글이 없어요.</strong>
              <span>첫 번째 기록을 작성해 보세요.</span>
            </div>
          )}
         
        </section>
      </section>
    </main>
  )
}
