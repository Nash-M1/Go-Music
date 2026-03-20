import type { Track } from '../types'
import { SongRow } from './SongRow'
import { SkeletonList } from './Skeleton'

interface Props {
  tracks: Track[]
  loading: boolean
  error: string
  query: string
  title: string
  currentTrack: Track | null
  isPlaying: boolean
  onPlay: (track: Track) => void
}

export function TrackList({ tracks, loading, error, query, title, currentTrack, isPlaying, onPlay }: Props) {
  if (loading) return <SkeletonList count={10} />

  if (error) return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className="text-zinc-300 font-semibold mb-1">Something went wrong</p>
      <p className="text-zinc-500 text-sm">{error}</p>
    </div>
  )

  if (tracks.length === 0 && query) return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      <p className="text-zinc-300 font-semibold mb-1">No results for "{query}"</p>
      <p className="text-zinc-500 text-sm">Try a different search term</p>
    </div>
  )

  return (
    <div>
      {title && <h2 className="text-xl font-bold text-white mb-4 px-1">{title}</h2>}

      {/* Column headers */}
      <div className="flex items-center gap-4 px-4 py-2 text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800/60 mb-1">
        <div className="w-8 text-center">#</div>
        <div className="w-11" />
        <div className="flex-1">Title</div>
        <div className="hidden md:block w-40">Album</div>
        <div className="w-10 text-right">
          <svg className="w-4 h-4 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        {tracks.map((track, i) => (
          <SongRow
            key={track.id}
            track={track}
            index={i}
            isActive={currentTrack?.id === track.id}
            isPlaying={isPlaying && currentTrack?.id === track.id}
            onPlay={onPlay}
          />
        ))}
      </div>
    </div>
  )
}