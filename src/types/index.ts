export interface Artist {
  id: number
  name: string
  picture_medium: string
  picture_xl: string
  nb_fan: number
}

export interface Album {
  id: number
  title: string
  cover_medium: string
  cover_xl: string
}

export interface Track {
  id: number
  title: string
  preview: string
  duration: number
  rank: number
  artist: Artist
  album: Album
}

export interface SearchResponse {
  data: Track[]
  total: number
}