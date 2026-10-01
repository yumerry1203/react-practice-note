import { Link } from 'react-router-dom'
import { studyCategories } from '../data/categoryData'
import { SidebarMascot } from './SidebarMascot'

type SidebarProps = {
  active?: 'home' | 'study-log' | 'tech-trends' | 'projects' | 'troubleshooting'
  activeCategory?: string
}

export function Sidebar({ active, activeCategory }: SidebarProps) {
  const isStudyLogActive = active === 'study-log' || Boolean(activeCategory)

  return (
    <aside className="dashboard-sidebar">
      <header className="site-brand">
        <strong>YUHYEONG.DEV</strong>
        <span>Frontend Dev Note</span>
      </header>
      <nav aria-label="메인 메뉴" className="sidebar-navigation">
        <Link className={`sidebar-link ${active === 'home' ? 'is-active' : ''}`} to="/"><span>⌂</span>홈</Link>
        <div className={`sidebar-study-group ${isStudyLogActive ? 'is-active' : ''}`}>
          <Link className={`sidebar-link sidebar-study-link ${isStudyLogActive ? 'is-active' : ''}`} to="/study-log"><span>▤</span>Study Log</Link>
          <div className="sidebar-study-depth" aria-label="Study Log 카테고리">
            {studyCategories.map((category) => (
              <Link
                className={`sidebar-depth-link ${activeCategory === category.slug ? 'is-active' : ''}`}
                key={category.slug}
                to={`/category/${category.slug}`}
              >
                <span aria-hidden="true">{category.icon}</span>
                {category.name}
              </Link>
            ))}
          </div>
        </div>
        <Link className={`sidebar-link ${active === 'tech-trends' ? 'is-active' : ''}`} to="/category/tech-trends"><span>⌁</span>Tech Trends</Link>
        <Link className={`sidebar-link ${active === 'projects' ? 'is-active' : ''}`} to="/category/projects"><span>□</span>Projects</Link>
        <Link className={`sidebar-link ${active === 'troubleshooting' ? 'is-active' : ''}`} to="/category/troubleshooting"><span>⌕</span>Troubleshooting</Link>
      </nav>
      <SidebarMascot />
    </aside>
  )
}
