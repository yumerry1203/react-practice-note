import { useState } from 'react'
import { Link } from 'react-router-dom'
import { projectData, type ProjectFolder } from '../data/projectData'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Modal } from '../components/Modal'
import { Sidebar } from '../components/Sidebar'

const projectPosts = import.meta.glob<string>(
  '../content/projects/*/*.md',
  {
    query: '?raw',
    import: 'default',
    eager: true,
  },
)

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

function removeQuotes(value: string) {
  return value.trim().replace(/^["']|["']$/g, '')
}

function getPostInfo(content: string, fallbackName: string) {
  const frontmatter = content.match(/^---\s*\n([\s\S]*?)\n---/)?.[1]
  const markdownTitle = content.match(/^#\s+(.+)$/m)?.[1]
  let title = markdownTitle ?? fallbackName
  let date = ''

  frontmatter?.split('\n').forEach((line) => {
    const field = line.match(/^(title|date):\s*(.*)$/)
    if (!field) return

    const [, key, rawValue] = field
    if (key === 'title') title = removeQuotes(rawValue)
    if (key === 'date') date = removeQuotes(rawValue)
  })

  return { title, date }
}

export function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectFolder[]>(projectData)
  const [expandedProjectIds, setExpandedProjectIds] = useState<string[]>([])
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [projectName, setProjectName] = useState('')

  const projectsWithFiles = projects.map((project) => ({
    ...project,
    files: Object.entries(projectPosts)
      .filter(([path]) => path.includes(`/content/projects/${project.id}/`))
      .map(([path, content]) => {
        const slug = path.split('/').pop()?.replace('.md', '') ?? ''
        const { title, date } = getPostInfo(content, slug)

        return { id: path, name: title, slug, date }
      })
      .sort((a, b) => b.date.localeCompare(a.date)),
  }))

  const toggleProject = (projectId: string) => {
    setExpandedProjectIds((previousIds) => (
      previousIds.includes(projectId)
        ? previousIds.filter((id) => id !== projectId)
        : [...previousIds, projectId]
    ))
  }

  const createProject = () => {
    const name = projectName.trim()
    if (!name) return

    const projectId = createId()
    setProjects((previousProjects) => [...previousProjects, { id: projectId, name, files: [] }])
    setExpandedProjectIds((previousIds) => [...previousIds, projectId])
    setProjectName('')
    setIsProjectModalOpen(false)
  }

  return (
    <main className="dashboard-shell">
      <Sidebar active="projects" />

      <section className="dashboard-content projects-content">
        <nav aria-label="현재 위치" className="breadcrumb"><Link to="/">홈</Link><span>›</span><strong>Projects</strong></nav>
        <header className="projects-header">
          <div>
            <h1><span aria-hidden="true" className="projects-title-mark">✦</span>Projects</h1>
            <p>개인 프로젝트에 대한 개발 기록</p>
          </div>
          <Button className="create-project-button" onClick={() => setIsProjectModalOpen(true)}>+ 프로젝트 만들기</Button>
        </header>

        <section aria-labelledby="project-tree-title" className="project-tree-panel">
          <header><h2 id="project-tree-title">프로젝트 폴더</h2><span>{projectsWithFiles.length}개</span></header>
          {projectsWithFiles.length > 0 ? (
            <ul className="project-tree">
              {projectsWithFiles.map((project) => {
                const isExpanded = expandedProjectIds.includes(project.id)

                return (
                  <li className={isExpanded ? 'is-expanded' : ''} key={project.id}>
                    <button aria-expanded={isExpanded} className="project-folder-button" disabled={project.files.length === 0} onClick={() => toggleProject(project.id)} type="button">
                      <span aria-hidden="true" className="project-folder-icon" />
                      <strong>{project.name}</strong>
                      <span className="project-folder-count">{project.files.length}</span>
                      <span aria-hidden="true" className="project-folder-chevron">⌄</span>
                    </button>
                    {isExpanded && project.files.length > 0 && (
                      <div className="project-folder-contents">
                        <ul className="project-file-list">
                          {project.files.map((file) => <li key={file.id}><Link to={`/projects/${project.id}/${file.slug}`}><span aria-hidden="true" className="project-file-corner" /><strong>{file.name}</strong>{file.date && <time dateTime={file.date}>{file.date.replaceAll('-', '.')}</time>}</Link></li>)}
                        </ul>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="project-tree-empty"><span aria-hidden="true" className="project-folder-icon" /><strong>아직 만든 프로젝트가 없습니다.</strong><p>상단의 프로젝트 만들기 버튼으로 첫 폴더를 추가해 보세요.</p></div>
          )}
        </section>
      </section>

      <Modal footer={<><Button onClick={() => setIsProjectModalOpen(false)} variant="plain">취소</Button><Button disabled={!projectName.trim()} onClick={createProject}>만들기</Button></>} isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} title="프로젝트 만들기">
        <Input autoFocus label="프로젝트 이름" onChange={(event) => setProjectName(event.target.value)} placeholder="예: Frontend Dev Note" value={projectName} />
      </Modal>
    </main>
  )
}
