import { useState, useEffect } from 'react'
import { usePlayer } from './hooks/usePlayer'
import { useSearch } from './hooks/useSearch'
import { api } from './api/deezer'
import { TrackList } from './components/TrackList'
import { Player } from './components/Player'
import type { Track } from './types'

type View = 'home' | 'search' | 'recent'

export default function App() {
  const player = usePlayer()
  const search = useSearch()

  const [view, setView] = useState<View>('home')
  const [charts, setCharts] = useState<Track[]>([])
  const [chartsLoading, setChartsLoading] = useState(true)
  const [chartsError, setChartsError] = useState('')

  useEffect(() => {
    api.getTopCharts()
      .then(data => { setCharts(data); player.setQueue(data) })
      .catch(() => setChartsError('Failed to load charts.'))
      .finally(() => setChartsLoading(false))
  }, [])

  useEffect(() => {
    if (search.tracks.length > 0) player.setQueue(search.tracks)
  }, [search.tracks])

  const handlePlay = (track: Track) => player.play(track)
  const goHome = () => { setView('home'); search.setQuery('') }
  const goRecent = () => { setView('recent'); search.setQuery('') }

  const isSearching = search.query.length > 0
  const currentTracks = isSearching ? search.tracks : view === 'recent' ? player.recentlyPlayed : charts
  const currentTitle = isSearching ? `Results for "${search.query}"` : view === 'recent' ? 'Recently Played' : 'Trending Now 🔥'
  const currentLoading = isSearching ? search.loading : view === 'home' ? chartsLoading : false
  const currentError = isSearching ? search.error : view === 'home' ? chartsError : ''

  return (
    <div className={`min-h-screen bg-zinc-950 text-white flex ${player.currentTrack ? 'pb-24' : ''}`}
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col fixed left-0 top-0 bottom-0 z-40 overflow-y-auto">

        {/* Logo */}
        <div className="px-6 py-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-green-400 flex items-center justify-center shadow-lg shadow-green-400/20 flex-shrink-0">
              <svg className="w-6 h-6 text-zinc-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
            <span className="text-white font-black text-xl tracking-tight">Go Music</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 py-5 flex flex-col gap-1">
          <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest px-3 mb-2">Menu</p>
          <button
            onClick={goHome}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left
              ${view === 'home' && !isSearching ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'}`}
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            Home
          </button>

          <button
            onClick={goRecent}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left
              ${view === 'recent' && !isSearching ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'}`}
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            Recently Played
            {player.recentlyPlayed.length > 0 && (
              <span className="ml-auto text-xs bg-green-400/20 text-green-400 rounded-full px-2 py-0.5 font-bold flex-shrink-0">
                {player.recentlyPlayed.length}
              </span>
            )}
          </button>
        </nav>

        {/* Divider */}
        <div className="mx-4 border-t border-zinc-800" />

        {/* Now playing */}
        {player.currentTrack && (
          <div className="px-4 py-5">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Now Playing</p>
            <div className="bg-zinc-800/60 rounded-2xl p-3 flex items-center gap-3">
              <img src={player.currentTrack.album.cover_medium} className="w-11 h-11 rounded-xl object-cover flex-shrink-0 shadow-md" alt="" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{player.currentTrack.title}</p>
                <p className="text-xs text-zinc-400 truncate mt-0.5">{player.currentTrack.artist.name}</p>
                {/* mini equalizer */}
                {player.isPlaying && (
                  <div className="flex items-end gap-0.5 h-3 mt-1.5">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <span key={i} className="w-0.5 bg-green-400 rounded-full"
                        style={{ animation: `musicbar 0.8s ease-in-out infinite ${delay}s`, height: i === 1 ? '100%' : '60%' }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main content — offset by sidebar width */}
      <main className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: '256px' }}>

        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/50 px-8 py-4">
          <div className="relative max-w-2xl">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search.query}
              onChange={e => { search.setQuery(e.target.value); if (e.target.value) setView('search') }}
              placeholder="Search songs, artists..."
              className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-2xl pl-11 pr-10 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:bg-zinc-800 text-sm transition-all"
            />
            {search.query && (
              <button
                onClick={() => { search.setQuery(''); setView('home') }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="px-8 py-8 flex-1">
          {view === 'home' && !isSearching && !chartsLoading && (
            <div className="mb-10">
              <h1 className="text-5xl font-black text-white mb-2 tracking-tight leading-none">
                Good <span className="text-green-400">vibes</span> only.
              </h1>
              <p className="text-zinc-400 text-lg mt-2">Discover and play music you'll love.</p>
            </div>
          )}

          <TrackList
            tracks={currentTracks}
            loading={currentLoading}
            error={currentError}
            query={isSearching ? search.query : ''}
            title={currentTitle}
            currentTrack={player.currentTrack}
            isPlaying={player.isPlaying}
            onPlay={handlePlay}
          />
        </div>
      </main>

      <Player {...player} />

      <style>{`
        @keyframes musicbar {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  )
}