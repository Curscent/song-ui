import { useState } from 'react';
import type { Song } from '../api/types';

interface SongCardProps {
  song: Song;
  onDelete: (id: number) => void;
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

export default function SongCard({ song, onDelete }: SongCardProps) {
  const [playing, setPlaying] = useState(false);
  const ytId = getYouTubeId(song.url);

  return (
    <div className="song-card card-mono">
      <div className="song-card-artwork mono-artwork">
        <div className="art-overlay">♪</div>
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
          <div className="yt-player">
            {!playing ? (
              <button className="play-btn" onClick={() => setPlaying(true)}>▶ Play</button>
            ) : (
              <iframe
                width="100%"
                height="220"
                src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                title={song.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
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