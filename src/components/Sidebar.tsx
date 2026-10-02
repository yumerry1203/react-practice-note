import { Link } from 'react-router-dom'
import { studyCategories } from '../data/categoryData'
import { SidebarMascot } from './SidebarMascot'

type SidebarProps = {
  active?: 'home' | 'study-log' | 'tech-trends' | 'projects' | 'troubleshooting'
  activeCategory?: string
}

const iconPath = (name: string) => `${import.meta.env.BASE_URL}icons/${name}.svg`

export function Sidebar({ active, activeCategory }: SidebarProps) {
  const isStudyLogActive = active === 'study-log' || Boolean(activeCategory)

  return (
    <aside className="dashboard-sidebar">
      <header className="site-brand">
        <Link aria-label="NAYUHYEONG 홈으로 이동" className="site-brand-link" to="/">
          <span aria-hidden="true" className="site-brand-mark">N</span>
          <span className="site-brand-copy">
            <strong>NAYUHYEONG</strong>
            <span>Frontend Dev Note</span>
          </span>
        </Link>
      </header>
      <nav aria-label="메인 메뉴" className="sidebar-navigation">
        <Link className={`sidebar-link ${active === 'home' ? 'is-active' : ''}`} to="/"><img alt="" className="sidebar-menu-icon sidebar-home-icon" src={`${import.meta.env.BASE_URL}icons/home.png`} />홈</Link>
        <div className={`sidebar-study-group ${isStudyLogActive ? 'is-active' : ''}`}>
          <Link className={`sidebar-link sidebar-study-link ${isStudyLogActive ? 'is-active' : ''}`} to="/study-log"><img alt="" className="sidebar-menu-icon" src={iconPath('study-log')} />Study Log</Link>
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
        <Link className={`sidebar-link ${active === 'tech-trends' ? 'is-active' : ''}`} to="/category/tech-trends"><img alt="" className="sidebar-menu-icon" src={iconPath('tech-trends')} />Tech Trends</Link>
        <Link className={`sidebar-link ${active === 'projects' ? 'is-active' : ''}`} to="/category/projects"><img alt="" className="sidebar-menu-icon" src={iconPath('file')} />Projects</Link>
        <Link className={`sidebar-link ${active === 'troubleshooting' ? 'is-active' : ''}`} to="/category/troubleshooting"><img alt="" className="sidebar-menu-icon" src={iconPath('troubleshooting')} />Troubleshooting</Link>
      </nav>
      <SidebarMascot />
    </aside>
  )
}
