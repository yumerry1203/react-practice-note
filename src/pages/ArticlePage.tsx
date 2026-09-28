import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useParams } from 'react-router-dom'

function ArticlePage() {
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

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  )
}

export default ArticlePage
