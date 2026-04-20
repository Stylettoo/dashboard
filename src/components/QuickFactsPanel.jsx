import { SurfaceCard } from './SurfaceCard';
import { SkeletonList } from './SkeletonList';
import { EmptyState } from './EmptyState';

export function QuickFactsPanel({ facts, isLoading, isRefreshing }) {
  return (
    <SurfaceCard className="quick-facts-card fade-in delay-2">
      <div className="section-header">
        <div>
          <h2>Leituras rapidas</h2>
        </div>
        {isRefreshing ? (
          <span className="section-badge">
            <span className="material-symbols-outlined" aria-hidden="true">
              sync
            </span>
            Atualizando
          </span>
        ) : null}
      </div>

      {isLoading ? (
        <SkeletonList rows={4} card />
      ) : facts.length ? (
        <div className="quick-facts-list">
          {facts.map((fact) => (
            <article key={`${fact.label}-${fact.value}`} className="quick-fact-item">
              <span className="quick-fact-label">{fact.label}</span>
              <strong className="quick-fact-value">{fact.value}</strong>
              <p className="quick-fact-note">{fact.note}</p>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="insights"
          title="Sem leituras resumidas"
          description="Este painel ganha destaque quando houver dados consolidados."
        />
      )}
    </SurfaceCard>
  );
}
