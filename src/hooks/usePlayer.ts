import { useState, useRef, useEffect, useCallback } from 'react'
import type { Track } from '../types'

const RECENT_KEY = 'go-music-recent'

function loadRecent(): Track[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') }
  catch { return [] }
}

function saveRecent(tracks: Track[]) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(tracks))
}

export function usePlayer() {
  const audioRef = useRef<HTMLAudioElement>(new Audio())
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.8)
  const [queue, setQueue] = useState<Track[]>([])
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>(loadRecent)

  useEffect(() => {
    const audio = audioRef.current
    audio.volume = volume

    const onTime = () => setCurrentTime(audio.currentTime)
    const onMeta = () => setDuration(audio.duration)
    const onEnd = () => { setIsPlaying(false); playNext() }

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnd)

    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnd)
    }
  }, [])

  const addToRecent = useCallback((track: Track) => {
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(t => t.id !== track.id)
      const updated = [track, ...filtered].slice(0, 15)
      saveRecent(updated)
      return updated
    })
  }, [])

  const play = useCallback((track: Track) => {
    const audio = audioRef.current
    if (currentTrack?.id === track.id) {
      if (isPlaying) { audio.pause(); setIsPlaying(false) }
      else { audio.play(); setIsPlaying(true) }
      return
    }
    audio.src = track.preview
    audio.play()
    setCurrentTrack(track)
    setIsPlaying(true)
    addToRecent(track)
  }, [currentTrack, isPlaying, addToRecent])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (isPlaying) { audio.pause(); setIsPlaying(false) }
    else { audio.play(); setIsPlaying(true) }
  }, [isPlaying])

  const seek = useCallback((time: number) => {
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }, [])

  const setVolume = useCallback((vol: number) => {
    audioRef.current.volume = vol
    setVolumeState(vol)
  }, [])

  const playNext = useCallback(() => {
    if (!queue.length || !currentTrack) return
    const idx = queue.findIndex(t => t.id === currentTrack.id)
    if (idx < queue.length - 1) play(queue[idx + 1])
  }, [queue, currentTrack, play])

  const playPrev = useCallback(() => {
    if (!queue.length || !currentTrack) return
    const idx = queue.findIndex(t => t.id === currentTrack.id)
    if (idx > 0) play(queue[idx - 1])
  }, [queue, currentTrack, play])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return {
    currentTrack, isPlaying, currentTime, duration,
    volume, queue, recentlyPlayed,
    play, togglePlay, seek, setVolume,
    setQueue, playNext, playPrev, formatTime,
  }
}