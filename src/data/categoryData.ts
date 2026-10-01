export const studyCategories = [
  { slug: 'javascript', name: 'JavaScript', icon: 'JS', tone: 'javascript' },
  { slug: 'react', name: 'React', icon: '⚛', tone: 'react' },
  { slug: 'typescript', name: 'TypeScript', icon: 'TS', tone: 'typescript' },
  { slug: 'frontend', name: 'Frontend', icon: '◇', tone: 'frontend' },
] as const

export const categories = [
  ...studyCategories,
  { slug: 'tech-trends', name: 'Tech Trends', icon: '⌁', tone: 'tech-trends' },
  { slug: 'troubleshooting', name: 'Troubleshooting', icon: '⌕', tone: 'troubleshooting' },
] as const

export function getCategory(slug: string | undefined) {
  return categories.find((category) => category.slug === slug)
}
