import type { Song } from '../api/types';

interface SongCardProps {
  song: Song;
  onDelete: (id: number) => void;
}

export default function SongCard({ song, onDelete }: SongCardProps) {
  // Generate a color gradient based on song id for variety
  const hues = ['180', '240', '320', '0', '40', '100'];
  const hue = hues[Math.abs((song.id || 0) % hues.length)];
  const gradientStyle = {
    background: `linear-gradient(135deg, hsl(${hue}, 70%, 40%) 0%, hsl(${hue}, 60%, 55%) 100%)`
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