import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function summarizeArticle(title: string, content: string): Promise<string> {
  const text = content.slice(0, 2000)

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 150,
    messages: [
      {
        role: 'user',
        content: `Summarize this article in 2-3 concise sentences in Traditional Chinese (繁體中文). Focus on the key insight or news value.

Title: ${title}
Content: ${text}

Summary:`,
      },
    ],
  })

  const block = message.content[0]
  if (block.type !== 'text') return ''
  return block.text.trim()
}

export async function summarizeBatch(
  articles: Array<{ id: string; title: string; content: string }>
): Promise<Map<string, string>> {
  const summaries = new Map<string, string>()

  // Process in parallel, max 5 at a time
  const chunks: typeof articles[] = []
  for (let i = 0; i < articles.length; i += 5) {
    chunks.push(articles.slice(i, i + 5))
  }

  for (const chunk of chunks) {
    const results = await Promise.allSettled(
      chunk.map(async (a) => {
        const summary = await summarizeArticle(a.title, a.content || a.title)
        summaries.set(a.id, summary)
      })
    )
    // ignore individual failures
    void results
  }

  return summaries
}
