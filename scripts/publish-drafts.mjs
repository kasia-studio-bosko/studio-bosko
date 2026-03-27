/**
 * publish-drafts.mjs
 * Publishes all draft documents in Sanity by copying them to their
 * published counterparts and deleting the draft versions.
 *
 * Run: node scripts/publish-drafts.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env.local')

let token = process.env.SANITY_API_READ_TOKEN
try {
  const env = readFileSync(envPath, 'utf8')
  for (const line of env.split('\n')) {
    const [k, ...v] = line.split('=')
    if (k?.trim() === 'SANITY_API_READ_TOKEN') token = v.join('=').trim()
  }
} catch { /* env file not found */ }

if (!token) {
  console.error('❌  SANITY_API_READ_TOKEN not found in .env.local or environment')
  process.exit(1)
}

const client = createClient({
  projectId: 'ysq1y4zp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

async function main() {
  console.log('\n📋  Fetching all draft documents…\n')

  const drafts = await client.fetch(`*[_id in path("drafts.**")] { _id, _type }`)

  if (drafts.length === 0) {
    console.log('✅  No drafts found — everything is already published.\n')
    return
  }

  console.log(`Found ${drafts.length} draft(s):\n`)

  const transaction = client.transaction()

  for (const draft of drafts) {
    const publishedId = draft._id.replace(/^drafts\./, '')
    console.log(`  → ${draft._type}  ${draft._id}  →  ${publishedId}`)

    // Fetch the full draft document
    const doc = await client.getDocument(draft._id)
    if (!doc) continue

    // Build the published version (strip drafts. prefix from _id)
    const { _id, ...rest } = doc
    const published = { _id: publishedId, ...rest }

    // Upsert the published version and delete the draft
    transaction.createOrReplace(published)
    transaction.delete(draft._id)
  }

  console.log('\n☁️  Committing transaction…')
  await transaction.commit()
  console.log(`\n✅  Published ${drafts.length} document(s) successfully.\n`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
