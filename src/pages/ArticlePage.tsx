import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import '../styles/markdown.css'

type ArticleMetadata = {
  title: string
  description: string
  date: string
  tags: string[]
}

function removeQuotes(value: string) {
  return value.trim().replace(/^["']|["']$/g, '')
}

function parseArticle(content: string, fallbackTitle: string) {
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/)
  const body = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, '')
  const markdownTitle = body.match(/^#\s+(.+)$/m)?.[1]
  const metadata: ArticleMetadata = {
    title: markdownTitle ?? fallbackTitle,
    description: '',
    date: '',
    tags: [],
  }

  let isReadingTags = false

  frontmatterMatch?.[1].split('\n').forEach((line) => {
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
      metadata.tags = value
        .slice(1, -1)
        .split(',')
        .map((tag) => removeQuotes(tag))
        .filter(Boolean)
    }
  })

  return {
    metadata,
    markdownContent: body.replace(/^#\s+.*(?:\r?\n)+/, ''),
  }
}

function ArticlePage() {
  const navigate = useNavigate()
  const { category, slug } = useParams()
  const posts = import.meta.glob<string>(
    '../content/*/*.md',
    {
      query: '?raw',
      import: 'default',
      eager: true,
    },
  )

  const path = `../content/${category}/${slug}.md`
  const content = posts[path]

  if (!content) return <p>글을 찾을 수 없습니다.</p>

  const { metadata, markdownContent } = parseArticle(content, slug ?? '게시글')

  return (
    <main className="markdown-page">
      <article className="markdown-content">
        <Button
          aria-label="이전 페이지로 돌아가기"
          className="markdown-back-button"
          onClick={() => navigate(-1)}
          variant="plain"
        >
          <span aria-hidden="true">←</span>
          뒤로가기
        </Button>
        <header className="markdown-header">
          <h1>{metadata.title}</h1>
          {metadata.description && (
            <p className="markdown-description">{metadata.description}</p>
          )}
          <div className="markdown-meta">
            {metadata.tags.length > 0 && (
              <ul aria-label="게시글 태그" className="markdown-tags">
                {metadata.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            )}
            {metadata.date && <time dateTime={metadata.date}>{metadata.date}</time>}
          </div>
        </header>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {markdownContent}
        </ReactMarkdown>
      </article>
    </main>
  )
}

export default ArticlePage
