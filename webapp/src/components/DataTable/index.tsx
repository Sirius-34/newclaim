// webapp/src/components/DataTable/index.tsx

import { useMemo, useState } from 'react'
import styles from './index.module.scss'

export type Column<T> = {
  header: string
  accessor: keyof T
  sortable?: boolean
}

export type DataTableProps<T> = {
  data: T[]
  columns: Array<Column<T>>
  pageSize?: number
  onRowDoubleClick?: (row: T) => void
  enableSearch?: boolean
  searchableColumns?: Array<keyof T>
  transformValue?: (key: keyof T, value: unknown) => React.ReactNode
  columnFilterable?: boolean
}

export function DataTable<T>({
  data,
  columns,
  pageSize = 10,
  onRowDoubleClick,
  enableSearch,
  searchableColumns,
  transformValue,
  columnFilterable = false,
}: DataTableProps<T>) {
  const [sortBy, setSortBy] = useState<keyof T | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({})

  const filteredData = useMemo(() => {
    let result = data

    // Глобальный поиск
    if (search && searchableColumns && searchableColumns.length > 0) {
      const lowerSearch = search.toLowerCase()
      result = result.filter((row) =>
        searchableColumns.some((col: keyof T) => {
          const value = row[col]
          return String(value ?? '')
            .toLowerCase()
            .includes(lowerSearch)
        })
      )
    }

    // Фильтрация по колонкам
    if (Object.keys(columnFilters).length > 0) {
      result = result.filter((row) =>
        columns.every((col) => {
          const filter = columnFilters[col.accessor as string]
          if (!filter) {
            return true
          }
          const value = row[col.accessor]
          return String(value ?? '')
            .toLowerCase()
            .includes(filter.toLowerCase())
        })
      )
    }

    return result
  }, [data, search, searchableColumns, columnFilters, columns])

  const sortedData = useMemo(() => {
    if (!sortBy) {
      return filteredData
    }

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]
      if (aValue === bValue) {
        return 0
      }
      if (aValue === undefined || aValue === null) {
        return 1
      }
      if (bValue === undefined || bValue === null) {
        return -1
      }
      return (aValue > bValue ? 1 : -1) * (sortAsc ? 1 : -1)
    })
  }, [filteredData, sortBy, sortAsc])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(filteredData.length / pageSize)

  const handleSort = (accessor: keyof T) => {
    if (sortBy === accessor) {
      setSortAsc(!sortAsc)
    } else {
      setSortBy(accessor)
      setSortAsc(true)
    }
  }

  return (
    <div className={styles.tableWrapper}>
      {enableSearch && (
        <div className={styles.searchWrapper}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Поиск..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
            }}
          />
        </div>
      )}
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.header}
                className={styles.headerCell}
                onClick={() => {
                  col.sortable && handleSort(col.accessor)
                }}
              >
                {col.header}
                {sortBy === col.accessor ? (sortAsc ? ' ▲' : ' ▼') : null}
              </th>
            ))}
          </tr>
          {columnFilterable && (
            <tr>
              {columns.map((col) => (
                <th key={`filter-${String(col.accessor)}`} className={styles.headerCell}>
                  <input
                    type="text"
                    placeholder="Фильтр..."
                    value={columnFilters[col.accessor as string] ?? ''}
                    onChange={(e) => {
                      setColumnFilters({
                        ...columnFilters,
                        [col.accessor]: e.target.value,
                      })
                    }}
                  />
                </th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd}
              onDoubleClick={() => onRowDoubleClick?.(row)}
            >
              {columns.map((col) => (
                <td key={String(col.accessor)} className={styles.cell}>
                  {transformValue ? transformValue(col.accessor, row[col.accessor]) : String(row[col.accessor] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={page === currentPage ? styles.activePage : styles.pageButton}
              onClick={() => {
                setCurrentPage(page)
              }}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
