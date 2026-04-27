import { useState, useEffect } from 'react';
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
  const [modalOpen, setModalOpen] = useState(false);
  const [ignoreBackdrop, setIgnoreBackdrop] = useState(false);
  const ytId = getYouTubeId(song.url);
  const thumbnail = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : undefined;

  // Lock background scrolling while modal is open and handle Escape key
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    if (modalOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setModalOpen(false); };
      window.addEventListener('keydown', onKey);
      // ignore backdrop clicks briefly to avoid accidental closes on open
      setIgnoreBackdrop(true);
      timeoutId = setTimeout(() => setIgnoreBackdrop(false), 250);
      return () => {
        document.body.style.overflow = prev;
        window.removeEventListener('keydown', onKey);
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
    return undefined;
  }, [modalOpen]);

  return (
    <div className="song-card card-mono">
      <div
        className="song-card-artwork mono-artwork"
        style={thumbnail ? { backgroundImage: `url(${thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
        onClick={() => { if (ytId) setModalOpen(true); }}
        role={ytId ? 'button' : undefined}
      >
        <div className="art-overlay">♪</div>
        {ytId && <button className="art-play" onClick={(e) => { e.stopPropagation(); setModalOpen(true); }} aria-label="Play">▶</button>}
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
            <button className="play-btn" onClick={() => setModalOpen(true)}>▶ Play</button>
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

      {modalOpen && ytId && (
        <div className="player-modal" role="dialog" aria-modal="true" onClick={(e) => {
          // only close when clicking the backdrop itself and after the ignore window
          if (ignoreBackdrop) return;
          if (e.target === e.currentTarget) setModalOpen(false);
        }}>
          <div className="player-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="player-close" onClick={() => setModalOpen(false)} aria-label="Close">✕</button>
            <div className="player-modal-inner">
              <iframe
                src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                title={song.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}