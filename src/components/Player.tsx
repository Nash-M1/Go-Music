import { useRef } from 'react'
import type { usePlayer } from '../hooks/usePlayer'

type PlayerProps = ReturnType<typeof usePlayer>

export function Player(props: PlayerProps) {
  const { currentTrack, isPlaying, currentTime, duration, volume } = props
  const { togglePlay, seek, setVolume, playNext, playPrev, formatTime } = props

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    seek(pct * duration)
  }

  if (!currentTrack) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800">
      {/* Progress bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 bg-zinc-800 cursor-pointer group"
        onClick={handleSeek}
      >
        <div
          className="h-full bg-green-400 relative transition-none"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center gap-4">

        {/* Track info */}
        <div className="flex items-center gap-3 w-56 flex-shrink-0 min-w-0">
          <img
            src={currentTrack.album.cover_medium}
            alt={currentTrack.album.title}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 shadow-lg"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{currentTrack.title}</p>
            <p className="text-xs text-zinc-400 truncate">{currentTrack.artist.name}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center gap-5">
            {/* Prev */}
            <button onClick={playPrev} className="text-zinc-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
              </svg>
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
            >
              {isPlaying ? (
                <svg className="w-5 h-5 text-zinc-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-zinc-900 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Next */}
            <button onClick={playNext} className="text-zinc-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
              </svg>
            </button>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 w-36 flex-shrink-0 justify-end">
          <svg className="w-4 h-4 text-zinc-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            {volume === 0
              ? <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
              : volume < 0.5
              ? <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07" />
              : <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            }
          </svg>
          <input
            type="range" min={0} max={1} step={0.01}
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="w-24 accent-green-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}