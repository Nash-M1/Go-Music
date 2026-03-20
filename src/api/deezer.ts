import axios from 'axios'
import type { Track, SearchResponse } from '../types'

const BASE = import.meta.env.DEV
  ? 'https://corsproxy.io/?' + encodeURIComponent('https://api.deezer.com')
  : '/api/deezer'

const deezerAxios = axios.create()

deezerAxios.interceptors.request.use((config) => {
  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
  return config
})

deezerAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', error.message)
    return Promise.reject(error)
  }
)

const buildUrl = (path: string) => {
  if (import.meta.env.DEV) {
    return `https://corsproxy.io/?${encodeURIComponent(`https://api.deezer.com${path}`)}`
  }
  return `/api/deezer${path}`
}

export const getTopCharts = async (): Promise<Track[]> => {
  const { data } = await deezerAxios.get<{ data: Track[] }>(
    buildUrl('/chart/0/tracks?limit=30')
  )
  return data.data
}

export const search = async (query: string): Promise<Track[]> => {
  const { data } = await deezerAxios.get<SearchResponse>(
    buildUrl(`/search?q=${encodeURIComponent(query)}&limit=30`)
  )
  return data.data
}

export const getArtistTopTracks = async (artistId: number): Promise<Track[]> => {
  const { data } = await deezerAxios.get<{ data: Track[] }>(
    buildUrl(`/artist/${artistId}/top?limit=10`)
  )
  return data.data
}

export const api = { getTopCharts, search, getArtistTopTracks }