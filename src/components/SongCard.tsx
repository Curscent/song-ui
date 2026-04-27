import type { Song } from '../api/types';

interface SongCardProps {
  song: Song;
  onDelete: (id: number) => void;
}

export default function SongCard({ song, onDelete }: SongCardProps) {
  // Use CSS accent variables so artwork follows the app theme
  const gradientStyle = {
    background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)'
  };

  return (
    <div className="song-card">
      <div className="song-card-artwork" style={gradientStyle}>
        🎵
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

        <div className="song-card-actions">
          {song.url && (
            <a 
              href={song.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="song-card-link"
            >
              🎧 Listen
            </a>
          )}
          {song.id && (
            <button 
              onClick={() => onDelete(song.id!)}
              className="song-card-delete"
            >
              🗑️ Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}