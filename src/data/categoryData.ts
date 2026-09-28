export const categories = [
  { slug: 'javascript', name: 'JavaScript', icon: 'JS', tone: 'javascript' },
  { slug: 'react', name: 'React', icon: '⚛', tone: 'react' },
  { slug: 'typescript', name: 'TypeScript', icon: 'TS', tone: 'typescript' },
  { slug: 'frontend', name: 'Frontend', icon: '◇', tone: 'frontend' },
  { slug: 'projects', name: 'Projects', icon: '□', tone: 'projects' },
  { slug: 'troubleshooting', name: 'Troubleshooting', icon: '⌕', tone: 'troubleshooting' },
] as const

export function getCategory(slug: string | undefined) {
  return categories.find((category) => category.slug === slug)
}
