import type { PortableTextContent } from './queries'

/**
 * Extract each paragraph from Portable Text content as a plain string.
 * Blocks with _type !== 'block' (images, etc.) are skipped.
 * Returns an empty array when content is null/undefined.
 *
 * Usage in page components:
 *   const paras = ptToStrings(sanityContent?.body)
 *   const bodyText = paras[0] ?? t('fallbackKey')
 */
export function ptToStrings(content: PortableTextContent | null | undefined): string[] {
  if (!content) return []
  return content
    .filter((block) => block._type === 'block')
    .map((block) => {
      const children = (block.children ?? []) as { text?: string }[]
      return children.map((c) => c.text ?? '').join('')
    })
    .filter(Boolean)
}
