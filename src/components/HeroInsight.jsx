import { SurfaceCard } from './SurfaceCard';
import { SkeletonBlock } from './SkeletonBlock';

export function HeroInsight({
  insight,
  title,
  emptyText,
  isLoading,
  isRefreshing,
}) {
  return (
    <SurfaceCard className="hero-card fade-in delay-1">
      <div className="section-header">
        <div>
          <h2>Resumo</h2>
        </div>

        <div className="status-chip">
          <span className="material-symbols-outlined" aria-hidden="true">
            auto_awesome
          </span>
          {isRefreshing ? 'Atualizando dados' : 'Via API externa'}
        </div>
      </div>

      {isLoading ? (
        <div className="hero-skeleton">
          <SkeletonBlock height={18} width="34%" />
          <SkeletonBlock height={46} width="82%" />
          <SkeletonBlock height={18} width="58%" />
        </div>
      ) : insight ? (
        <div className="hero-copy fade-in delay-2">
          <p className="hero-kicker">{insight.label || title}</p>
          <h3>{insight.title}</h3>
          <p>{insight.description}</p>
        </div>
      ) : (
        <div className="empty-state hero-empty">
          <span className="material-symbols-outlined" aria-hidden="true">
            lightbulb
          </span>
          <p>Nenhum insight retornado pela API ainda.</p>
          <small>{emptyText}</small>
        </div>
      )}
    </SurfaceCard>
  );
}
