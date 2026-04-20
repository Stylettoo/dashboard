import { SurfaceCard } from './SurfaceCard';
import { SkeletonList } from './SkeletonList';
import { EmptyState } from './EmptyState';

export function InsightsSection({
  insights,
  description,
  isLoading,
  isRefreshing,
}) {
  return (
    <SurfaceCard className="insights-card fade-in delay-4">
      <div className="section-header">
        <div>
          <h2>Insights</h2>
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

      <p className="section-description">{description}</p>

      {isLoading ? (
        <SkeletonList rows={3} card />
      ) : insights.length ? (
        <div className="insights-grid">
          {insights.map((insight, index) => (
            <article
              className={`insight-item fade-in delay-${Math.min(index + 1, 4)}`}
              key={`${insight.title}-${index}`}
            >
              <div className="insight-icon">
                <span className="material-symbols-outlined" aria-hidden="true">
                  forum
                </span>
              </div>
              <div>
                <h3>{insight.title}</h3>
                <p>{insight.description}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="forum"
          title="Sem agrupamentos"
          description="Conecte a analise de respostas abertas para preencher esta area."
        />
      )}
    </SurfaceCard>
  );
}
