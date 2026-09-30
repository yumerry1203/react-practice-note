export interface ProjectFile {
  id: string
  name: string
  slug: string
  date: string
}

export interface ProjectFolder {
  id: string
  name: string
  files: ProjectFile[]
}

export const projectData: ProjectFolder[] = [
  {
    id: 'money-log',
    name: 'Money Log — 개인 지출 관리 서비스',
    files: [],
  },
]
