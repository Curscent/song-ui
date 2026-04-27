import type { Song } from '../api/types';
import SongCard from './SongCard';

interface SongGridProps {
  songs: Song[];
  onDelete: (id: number) => void;
}

export default function SongGrid({ songs, onDelete }: SongGridProps) {
  if (songs.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🎶</div>
        <h3>Your collection is empty</h3>
        <p>Start by adding your favorite songs above. Make sure your backend is running!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '32px' }}>📚 Your Library ({songs.length})</h2>
      <div className="songs-container">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
