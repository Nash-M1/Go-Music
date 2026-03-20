import type { Track } from '../types'

interface Props {
  track: Track
  index: number
  isActive: boolean
  isPlaying: boolean
  onPlay: (track: Track) => void
}

export function SongRow({ track, index, isActive, isPlaying, onPlay }: Props) {
  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div
      onClick={() => onPlay(track)}
      className={`flex items-center gap-4 px-4 py-2.5 rounded-xl cursor-pointer group transition-all duration-150
        ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
    >
      {/* Index / Play indicator */}
      <div className="w-8 flex items-center justify-center flex-shrink-0">
        {isActive && isPlaying ? (
          <div className="flex items-end gap-0.5 h-4">
            {[0, 0.15, 0.3].map((delay, i) => (
              <span
                key={i}
                className="w-0.5 bg-green-400 rounded-full"
                style={{
                  animation: `musicbar 0.8s ease-in-out infinite ${delay}s`,
                  height: i === 1 ? '100%' : i === 0 ? '60%' : '40%'
                }}
              />
            ))}
          </div>
        ) : isActive ? (
          <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          <>
            <span className="text-sm text-zinc-500 group-hover:hidden">{index + 1}</span>
            <svg className="w-4 h-4 text-white hidden group-hover:block" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </>
        )}
      </div>

      {/* Album art */}
      <img
        src={track.album.cover_medium}
        alt={track.album.title}
        className="w-11 h-11 rounded-lg object-cover flex-shrink-0 shadow-lg"
      />

      {/* Title + Artist */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${isActive ? 'text-green-400' : 'text-white'}`}>
          {track.title}
        </p>
        <p className="text-xs text-zinc-400 truncate mt-0.5">{track.artist.name}</p>
      </div>

      {/* Album */}
      <p className="hidden md:block text-xs text-zinc-500 truncate w-40 flex-shrink-0">
        {track.album.title}
      </p>

      {/* Duration */}
      <span className="text-xs text-zinc-500 flex-shrink-0 w-10 text-right">
        {fmt(track.duration)}
      </span>
    </div>
  )
}