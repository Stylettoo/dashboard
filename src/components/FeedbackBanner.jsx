import { SurfaceCard } from './SurfaceCard';

export function FeedbackBanner({
  variant = 'empty',
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <SurfaceCard className={`feedback-banner feedback-${variant}`}>
      <div className="feedback-copy">
        <span className="material-symbols-outlined" aria-hidden="true">
          {variant === 'error' ? 'error' : 'inbox'}
        </span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      {actionLabel && onAction ? (
        <button type="button" className="primary-button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </SurfaceCard>
  );
}
