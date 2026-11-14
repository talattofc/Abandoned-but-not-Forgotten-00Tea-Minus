import { memo } from 'react';
import { avatars, type AvatarIconId } from '../../data/avatars';

interface AvatarIconProps {
  id: AvatarIconId;
  size?: number;
  /** Draw the framed rounded tile border. */
  tile?: boolean;
  frameColor?: string;
  frameBg?: string;
  className?: string;
}

export const AvatarIcon = memo(function AvatarIcon({
  id,
  size = 40,
  tile = true,
  frameColor,
  frameBg,
  className = '',
}: AvatarIconProps) {
  const avatar = avatars.find((a) => a.id === id) ?? avatars[0];

  return (
    <div
      style={{
        width: size,
        height: size,
        borderColor: tile ? (frameColor ?? '#2F3956') : 'transparent',
        backgroundColor: tile ? (frameBg ?? '#151C2E') : '#0B1020',
      }}
      className={`overflow-hidden rounded-xl ${tile ? 'border-2' : 'border border-line'} ${className}`}
    >
      <img
        src={avatar.image}
        alt={avatar.name}
        className="h-full w-full object-cover"
      />
    </div>
  );
});
