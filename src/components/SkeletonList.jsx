import { SkeletonBlock } from './SkeletonBlock';

export function SkeletonList({ rows = 4, card = false }) {
  return (
    <div className={card ? 'skeleton-card-list' : 'skeleton-list'} aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className={card ? 'skeleton-card' : 'skeleton-row'}>
          <SkeletonBlock width={card ? '32%' : '44%'} height={14} />
          <SkeletonBlock width={card ? '88%' : '100%'} height={card ? 18 : 12} />
          {card ? <SkeletonBlock width="66%" height={18} /> : null}
        </div>
      ))}
    </div>
  );
}
