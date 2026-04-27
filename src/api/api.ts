import type { Song } from './types'; // Pointing to types.ts with mandatory 'type' keyword
const API_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/pascua/songs';

export const getSongs = async (): Promise<Song[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch songs');
  return response.json();
};

export const addSong = async (song: Song): Promise<Song> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(song),
  });
  if (!response.ok) throw new Error('Failed to add song');
  return response.json();
};

export const deleteSong = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, { 
    method: 'DELETE' 
  });
  if (!response.ok) throw new Error('Failed to delete song');
};