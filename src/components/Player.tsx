import type { FC } from 'react';

interface PlayerProps {
  ytId?: string | null;
  title?: string;
  compact?: boolean;
}

const Player: FC<PlayerProps> = ({ ytId, title }) => {
  return (
    <div className="player-area">
      <div className="player-inner">
        {ytId ? (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="player-placeholder">Select a song to play</div>
        )}
      </div>
    </div>
  );
};

export default Player;
