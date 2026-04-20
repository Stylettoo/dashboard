import { SurfaceCard } from './SurfaceCard';
import { SkeletonBlock } from './SkeletonBlock';
import { formatKpiValue } from '../lib/dashboard';

export function KpiGrid({ items, kpis, isLoading, isRefreshing }) {
  return (
    <section className="kpi-grid" aria-label="Indicadores principais">
      {items.map((item, index) => (
        <SurfaceCard
          key={item.key}
          className={`kpi-card fade-in delay-${Math.min(index + 1, 4)}`}
        >
          <div className="kpi-header">
            <span className="kpi-label">{item.label}</span>
            <span className="material-symbols-outlined" aria-hidden="true">
              {item.icon}
            </span>
          </div>

          {isLoading ? (
            <div className="kpi-skeleton">
              <SkeletonBlock height={16} width="46%" />
              <SkeletonBlock height={42} width="70%" />
            </div>
          ) : (
            <>
              <strong className="kpi-value">
                {formatKpiValue(item, kpis[item.key])}
              </strong>
            </>
          )}

          {!isLoading &&
          (kpis[item.key] === null ||
            kpis[item.key] === undefined ||
            kpis[item.key] === '') ? (
            <p className="kpi-empty">Sem dados disponiveis.</p>
          ) : null}

          {isRefreshing ? <span className="refresh-dot" aria-hidden="true" /> : null}
        </SurfaceCard>
      ))}
    </section>
  );
}
