// /backend/src/scripts/generate-foreign-relations.ts

/* eslint-disable no-console */

import fs from 'fs'
import path from 'path'
import { createPrismaClient } from '../../src/lib/prisma'

const prisma = createPrismaClient()

async function generateForeignRelations() {
  const rawRelations = await prisma.$queryRawUnsafe<
    Array<{
      source_table: string
      source_column: string
      target_table: string
      target_column: string
    }>
  >(
    `SELECT
        tc.table_name AS source_table,
        kcu.column_name AS source_column,
        ccu.table_name AS target_table,
        ccu.column_name AS target_column
      FROM
        information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.constraint_schema = kcu.constraint_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.constraint_schema = tc.constraint_schema
      WHERE
        tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public';`
  )

  type ForeignRelation = {
    refTable: string
    refField: string
    displayField: string
  }

  const grouped: Record<string, Record<string, ForeignRelation>> = {}

  for (const rel of rawRelations) {
    if (!grouped[rel.source_table]) {
      grouped[rel.source_table] = {}
    }

    const displayField = await inferDisplayField(rel.target_table)

    grouped[rel.source_table][rel.source_column] = {
      refTable: rel.target_table,
      refField: rel.target_column,
      displayField,
    }
  }

  const content =
    '// AUTO-GENERATED from schema.prisma — DO NOT EDIT MANUALLY\n' +
    'export const tableRelations = ' +
    JSON.stringify(grouped, null, 2) +
    ' as const;\n'

  const outputPath = path.resolve(__dirname, '../../src/router/admin/getAllDictionaries/_tableRelations.ts')
  fs.writeFileSync(outputPath, content)
  console.log(`✅ tableRelations generated at: ${outputPath}`)
  process.exit(0)
}

// по умолчанию — ищем колонку, начинающуюся с "c" и содержащую "Name"
async function inferDisplayField(table: string): Promise<string> {
  const columns = await prisma.$queryRawUnsafe<Array<{ column_name: string }>>(
    `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1`,
    table
  )

  if (!columns.length) {
    console.warn(`⚠️ The table "${table}" has no columns — fallback to "id"`)
  }

  const preferred = columns.find(
    (col) => /^c.*Name$/i.test(col.column_name) || ['name', 'title', 'label'].includes(col.column_name.toLowerCase())
  )

  return preferred?.column_name || 'id'
}

generateForeignRelations().catch((err) => {
  console.error('❌ Generation error:', err)
  process.exit(1)
})
