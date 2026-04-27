import type { Song } from '../api/types';
import SongCard from './SongCard';

interface SongGridProps {
  songs: Song[];
  onDelete: (id: number) => void;
  onPlay?: (ytId: string | null, title?: string) => void;
}

export default function SongGrid({ songs, onDelete, onPlay }: SongGridProps) {
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
      <div className="library-header">
        <h2>📚 Your Library</h2>
        <div className="library-count">{songs.length} items</div>
      </div>

      <div className="songs-container yt-style">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} onDelete={onDelete} onPlay={onPlay} />
        ))}
      </div>
    </div>
  );
}
