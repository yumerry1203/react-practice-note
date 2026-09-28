import { Link, Navigate, useParams } from 'react-router-dom'
import { categories, getCategory } from '../data/categoryData'

const posts = import.meta.glob(
  '../content/**/*.md',
  {
    query: '?raw',
    import: 'default',
    eager: true,
  }
)

export function CategoryPage() {
  const { categorySlug } = useParams()
  const category = getCategory(categorySlug)
  const categoryPosts = Object.keys(posts).filter((path) => 
    path.includes(`/content/${categorySlug}/`)
  )
  const postCount = categoryPosts.length

  if (!category) return <Navigate replace to="/" />

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <header className="site-brand"><strong>YUHYEONG.DEV</strong><span>Frontend Learning Note</span></header>
        <nav aria-label="학습 카테고리" className="sidebar-navigation">
          <Link className="sidebar-link" to="/"><span>⌂</span>홈</Link>
          {categories.map((item) => <Link className={`sidebar-link ${item.slug === category.slug ? 'is-active' : ''}`} key={item.slug} to={`/category/${item.slug}`}><span>{item.icon}</span>{item.name}</Link>)}
        </nav>
      </aside>

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
             <div>
              {categoryPosts.map((path) => {
                const slug = path.split('/').pop()?.replace('.md', '')
                
                return (
                  <div className="border">
                    <Link
                      key={path}
                      to={`/${category.slug}/${slug}`}
                      >
                      {slug}
                    </Link>
                  </div>
                )
              })}
            </div>
          ): (
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
