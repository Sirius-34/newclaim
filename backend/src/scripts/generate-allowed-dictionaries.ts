// /backend/src/scripts/generate-allowed-dictionaries.ts

import fs from 'fs'
import path from 'path'
import { createPrismaClient } from '../../src/lib/prisma'

const prisma = createPrismaClient()

async function generateAllowedTables() {
  const rows = await prisma.$queryRawUnsafe<Array<{ table_name: string }>>(
    `SELECT table_name FROM information_schema.tables
     WHERE table_schema = 'public'
     AND table_type = 'BASE TABLE'
     AND (table_name LIKE 'spr%' OR table_name = 'User')`
  )

  const list = rows.map((r) => `"${r.table_name}"`).sort()
  const content = `// AUTO-GENERATED from schema.prisma — DO NOT EDIT MANUALLY\nexport const allowedTables = [\n  ${list.join(',\n  ')}\n];\n`

  const outputPath = path.resolve(__dirname, '../../src/router/admin/getAllDictionaries/_allowedTables.ts')
  fs.writeFileSync(outputPath, content)

  // eslint-disable-next-line no-console
  console.log(`✅ allowedTables generated at: ${outputPath}`)
  process.exit(0)
}

generateAllowedTables().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('❌ Generation error:', err)
  process.exit(1)
})
