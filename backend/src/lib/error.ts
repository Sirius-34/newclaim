// backend/src/lib/error.ts

export class ExpectedError extends Error {
  isExpected = true
}
