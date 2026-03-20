import { useState, useEffect } from 'react'
import { api } from '../api/deezer'
import { useDebounce } from './useDebounce'
import type { Track } from '../types'

export function useSearch() {
  const [query, setQuery] = useState('')
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const debouncedQuery = useDebounce(query, 400)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setTracks([])
      setHasSearched(false)
      return
    }

    const search = async () => {
      setLoading(true)
      setError('')
      setHasSearched(true)
      try {
        const results = await api.search(debouncedQuery)
        setTracks(results)
      } catch {
        setError('Search failed. Please check your connection.')
        setTracks([])
      } finally {
        setLoading(false)
      }
    }

    search()
  }, [debouncedQuery])

  return { query, setQuery, tracks, loading, error, hasSearched }
}