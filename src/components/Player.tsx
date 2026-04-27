import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';

interface PlayerProps {
  ytId?: string | null;
  title?: string;
  preview?: { id?: string | null; title?: string } | null;
  onClose?: () => void;
}

// Simple loader for YouTube IFrame API
function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).YT && (window as any).YT.Player) return resolve();
    const existing = document.getElementById('yt-api');
    if (existing) {
      const check = setInterval(() => {
        if ((window as any).YT && (window as any).YT.Player) {
          clearInterval(check);
          resolve();
        }
      }, 50);
      return;
    }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.id = 'yt-api';
    document.body.appendChild(tag);
    const check = setInterval(() => {
      if ((window as any).YT && (window as any).YT.Player) {
        clearInterval(check);
        resolve();
      }
    }, 50);
  });
}

const Player: FC<PlayerProps> = ({ ytId, title, preview, onClose }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  // Create/load player when API available and ytId is set
  useEffect(() => {
    let mounted = true;
    if (!ytId) {
      // pause/cleanup if no id
      setIsPlaying(false);
      return () => { mounted = false; };
    }

    setLoading(true);
    loadYouTubeAPI().then(() => {
      if (!mounted) return;

      const YT = (window as any).YT;
      // If a player exists and it's a different video, destroy and recreate to ensure a clean switch.
      if (playerRef.current) {
        try {
          // YT player provides a destroy() method
          playerRef.current.destroy();
        } catch (e) {
          // ignore
        }
        playerRef.current = null;
      }

      // Create a fresh player for the new ytId
      playerRef.current = new YT.Player(containerRef.current!, {
        width: '100%',
        height: '100%',
        videoId: ytId!,
        playerVars: { enablejsapi: 1, autoplay: 1, rel: 0 },
        events: {
          onReady: () => {
            setLoading(false);
            setIsPlaying(true);
          },
          onStateChange: (e: any) => {
            // 1=playing, 2=paused, 0=ended
            if (e.data === 1) setIsPlaying(true);
            else setIsPlaying(false);
          }
        }
      });
    });

    return () => { mounted = false; };
  }, [ytId]);

  const handlePlayPause = () => {
    const p = playerRef.current;
    if (!p) return;
    try {
      if (isPlaying) p.pauseVideo();
      else p.playVideo();
    } catch (e) {
      // fallback: toggle by reloading src to autoplay or clearing src to stop
      const el = containerRef.current?.querySelector('iframe') as HTMLIFrameElement | null;
      if (!el) return;
      if (isPlaying) el.src = '';
      else el.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&enablejsapi=1&rel=0`;
    }
  };

  const handleClose = () => {
    // stop playback and call onClose to clear selection in parent
    try { playerRef.current?.stopVideo?.(); } catch (e) {}
    onClose?.();
  };

  return (
    <div className={`player-area ${loading ? 'player-loading' : ''}`}>
      <div className={`player-inner ${ytId ? 'loaded' : 'empty'}`}>
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
        {!ytId && (
          <div className="player-placeholder">
            {preview && preview.id ? (
              <div className="player-preview">
                <img src={`https://img.youtube.com/vi/${preview.id}/hqdefault.jpg`} alt={preview.title} />
                <div className="player-preview-overlay">
                  <div className="player-preview-title">{preview.title}</div>
                </div>
              </div>
            ) : (
              <div className="player-placeholder-text">Select a song to play</div>
            )}
          </div>
        )}
      </div>

      <div className="player-controls">
        <div className="player-meta">
          <div className="player-meta-title">{title ?? (preview?.title ?? '')}</div>
        </div>
        <div className="player-buttons">
          <button className="btn-play" onClick={handlePlayPause}>{isPlaying ? '▮▮' : '▶'}</button>
          <button className="btn-close" onClick={handleClose}>✕</button>
        </div>
      </div>
    </div>
  );
};

export default Player;
