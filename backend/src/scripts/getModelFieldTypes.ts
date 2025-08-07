/* eslint-disable no-console */
// backend/scripts/getModelFieldTypes.ts

import fs from 'fs'
import path from 'path'
import { getDMMF } from '@prisma/sdk'

async function main() {
  const schemaPath = path.resolve(__dirname, '../../src/prisma/schema.prisma')

  const dmmf = await getDMMF({ datamodelPath: schemaPath })

  const claimModel = dmmf.datamodel.models.find((model) => model.name === 'Claim')
  if (!claimModel) {
    throw new Error('Model "Claim" not found in schema.prisma')
  }

  const fieldTypes: Record<string, string> = {}
  for (const field of claimModel.fields) {
    fieldTypes[field.name] = field.type
  }

  const outputPath = path.resolve(__dirname, '../../../shared/src/claimFieldTypes.json')
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(fieldTypes, null, 2))

  console.log('✅ claimFieldTypes.json succesfuly generated')
}

main().catch((e) => {
  console.error('❌ Error of generation of the field-types at Claim:', e)
  process.exit(1)
})
