import type { FC } from 'react';

interface PlayerProps {
  ytId?: string | null;
  title?: string;
}

const Player: FC<PlayerProps> = ({ ytId, title }) => {
  if (!ytId) return null;

  return (
    <div className="player-area">
      <div className="player-inner">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default Player;
