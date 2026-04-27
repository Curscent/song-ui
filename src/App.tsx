import { useEffect, useState, useMemo } from 'react';
import { getSongs, addSong, deleteSong } from './api/api';
import type { Song } from './api/types';
import Layout from './components/Layout';
import SongGrid from './components/SongGrid';
import Player from './components/Player';

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
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

  const genres = useMemo(() => {
    const set = new Set<string>();
    songs.forEach(s => { if (s.genre) set.add(s.genre); });
    return Array.from(set).sort();
  }, [songs]);

  const filteredSongs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return songs.filter(s => {
      const matchesQ = !q || (s.title + ' ' + s.artist).toLowerCase().includes(q);
      const matchesGenre = !genreFilter || s.genre === genreFilter;
      return matchesQ && matchesGenre;
    });
  }, [songs, searchTerm, genreFilter]);

  const [currentYt, setCurrentYt] = useState<{ id: string | null; title?: string }>(() => ({ id: null }));
  const [preview, setPreview] = useState<{ id?: string | null; title?: string } | null>(null);

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
      <div className="controls-row">
        <div className="search-box">
          <input placeholder="Search by title or artist..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-box">
          <select value={genreFilter} onChange={e => setGenreFilter(e.target.value)}>
            <option value="">All genres</option>
            {genres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      <h2>Add to Your Collection</h2>
      {/* Player + ADD SONG FORM in two-column layout */}
      <div className="form-with-player">
        <Player ytId={currentYt.id} title={currentYt.title} preview={preview} onClose={() => { setCurrentYt({ id: null }); }} />
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
      </div>

      {loading && <p className="loading-text">🎵 Loading your collection...</p>}
      
      {error && (
        <div className="error-message">
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <Player ytId={currentYt.id} title={currentYt.title} preview={preview} onClose={() => { setCurrentYt({ id: null }); }} />
          <SongGrid songs={filteredSongs} onDelete={handleDelete} onPlay={(ytId, title) => { setCurrentYt({ id: ytId, title }); setPreview({ id: ytId, title }); }} />
        </>
      )}
    </Layout>
  );
}

export default App;