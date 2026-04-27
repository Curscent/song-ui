import { useEffect, useState } from 'react';
import { getSongs, addSong, deleteSong } from './api/api';
import type { Song } from './api/types';
import Layout from './components/Layout';
import SongGrid from './components/SongGrid';

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This state holds the data for the new song being typed in
  const [newSong, setNewSong] = useState<Song>({
    title: '', artist: '', album: '', genre: '', url: ''
  });

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const data = await getSongs();
      setSongs(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch songs. Check your backend/CORS.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault(); 
    try {
      await addSong(newSong);
      fetchSongs(); // Refresh the list to show the new song
      setNewSong({ title: '', artist: '', album: '', genre: '', url: '' }); // Clear the form
    } catch (err) {
      console.error("Error adding song:", err);
      alert('Failed to add song. Check the browser console for errors.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSong(id);
      fetchSongs(); // Refresh the list after deleting
    } catch (err) {
      console.error('Failed to delete song', err);
      alert('Failed to delete song');
    }
  };

  return (
    <Layout>
      <h2>Add to Your Collection</h2>
      
      {/* ADD SONG FORM */}
      <form onSubmit={handleAddSong}>
        <h3>📝 New Song</h3>
        <div className="input-group">
          <input type="text" placeholder="Song Title" required value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})}/>
        </div>
        <div className="input-group">
          <input type="text" placeholder="Artist Name" required value={newSong.artist} onChange={e => setNewSong({...newSong, artist: e.target.value})}/>
        </div>
        <div className="input-group">
          <input type="text" placeholder="Album" required value={newSong.album} onChange={e => setNewSong({...newSong, album: e.target.value})}/>
        </div>
        <div className="input-group">
          <input type="text" placeholder="Genre" required value={newSong.genre} onChange={e => setNewSong({...newSong, genre: e.target.value})}/>
        </div>
        <input type="url" placeholder="Audio/Video URL (YouTube, Spotify, etc.)" required value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})}/>
        <button type="submit">✨ Add to Library</button>
      </form>

      {loading && <p className="loading-text">🎵 Loading your collection...</p>}
      
      {error && (
        <div className="error-message">
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      {!loading && !error && (
        <SongGrid songs={songs} onDelete={handleDelete} />
      )}
    </Layout>
  );
}

export default App;