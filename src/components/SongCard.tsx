import type { } from 'react';
import type { Song } from '../api/types';

interface SongCardProps {
  song: Song;
  onDelete: (id: number) => void;
  onPlay?: (ytId: string | null, title?: string) => void;
}

function getYouTubeId(url?: string) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v');
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
  } catch (e) {
    return null;
  }
  return null;
}

export default function SongCard({ song, onDelete, onPlay }: SongCardProps) {
  const ytId = getYouTubeId(song.url);

  return (
    <div className="song-card card-mono">
      <div className="song-card-artwork mono-artwork">
        {/* If we have a YouTube id, show the static thumbnail image (non-playing) */}
        {ytId ? (
          <img
            className="art-thumb"
            src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
            alt={`${song.title} thumbnail`}
            loading="lazy"
          />
        ) : (
          <div className="art-overlay">♪</div>
        )}

        {/* Play button opens the central player; ensure it's on top and clickable */}
        {ytId && (
          <>
            <button className="art-play" onClick={() => onPlay?.(ytId, song.title)} aria-label="Play">▶</button>
            <button className="art-delete" onClick={() => onDelete(song.id!)} aria-label="Remove">✕</button>
          </>
        )}
      </div>

      <div className="song-card-content">
        <h3 className="song-card-title">{song.title}</h3>

        <div className="song-card-meta">
          <div>
            <div className="song-card-meta-label">Artist</div>
            <div className="song-card-meta-item">{song.artist}</div>
          </div>
          <div>
            <div className="song-card-meta-label">Album</div>
            <div className="song-card-meta-item">{song.album}</div>
          </div>
          <div>
            <div className="song-card-meta-label">Genre</div>
            <div className="song-card-meta-item">{song.genre}</div>
          </div>
        </div>

        {ytId ? (
          <div className="yt-player-inline">
            <button className="play-btn" onClick={() => onPlay?.(ytId, song.title)}>▶ Play</button>
          </div>
        ) : (
          song.url && (
            <a href={song.url} target="_blank" rel="noopener noreferrer" className="song-card-link">🎧 Open</a>
          )
        )}

        <div className="song-card-actions mono-actions">
          {song.id && (
            <button 
              onClick={() => onDelete(song.id!)}
              className="song-card-delete"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}