import { useEffect, useMemo, useRef, useState } from 'react';
import { SurfaceCard } from './SurfaceCard';
import { SkeletonList } from './SkeletonList';
import { EmptyState } from './EmptyState';
import {
  formatChartCountLabel,
  formatChartPercentageLabel,
  getBarWidth,
  orderChartItems,
} from '../lib/dashboard';

export function ChartSection({
  title,
  description,
  items,
  visualization = 'ranking',
  fullWidth = false,
  order,
  responseCount = 0,
  isLoading,
  isRefreshing,
  delay = 0,
}) {
  const cardRef = useRef(null);
  const [animate, setAnimate] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const displayItems = visualization === 'distribution'
    ? orderChartItems(items, { order })
    : items;
  const distributionMax = useMemo(
    () =>
      Math.max(
        ...displayItems.map((item) => (typeof item.value === 'number' ? item.value : 0)),
        1,
      ),
    [displayItems],
  );
  const distributionTicks = useMemo(() => {
    const steps = 4;
    return Array.from({ length: steps + 1 }, (_, index) => {
      const value = Number(((distributionMax / steps) * (steps - index)).toFixed(2));
      return value;
    });
  }, [distributionMax]);

  useEffect(() => {
    if (!cardRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.3,
      },
    );

    observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isLoading && isVisible && displayItems.length > 0) {
      const frame = window.requestAnimationFrame(() => setAnimate(true));
      return () => window.cancelAnimationFrame(frame);
    }

    setAnimate(false);
    return undefined;
  }, [displayItems, isLoading, isVisible]);

  return (
    <SurfaceCard
      className={`chart-card ${
        visualization === 'distribution' || fullWidth ? 'chart-card-wide' : ''
      } fade-in delay-${Math.min(delay + 1, 4)}`}
      ref={cardRef}
    >
      <div className="section-header">
        <h2>{title}</h2>
        {isRefreshing ? (
          <span className="section-badge">
            <span className="material-symbols-outlined" aria-hidden="true">
              sync
            </span>
            Atualizando
          </span>
        ) : null}
      </div>

      {description ? <p className="section-description">{description}</p> : null}

      {isLoading ? (
        <SkeletonList rows={5} />
      ) : displayItems.length ? (
        visualization === 'distribution' ? (
          <div className="distribution-chart-shell">
            <div className="distribution-y-axis" aria-hidden="true">
              {distributionTicks.map((tick) => (
                <span key={`${title}-tick-${tick}`} className="distribution-y-tick">
                  {tick.toLocaleString('pt-BR', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </span>
              ))}
            </div>

            <div className="distribution-chart" role="list" aria-label={title}>
              {distributionTicks.map((tick) => (
                <div
                  key={`${title}-grid-${tick}`}
                  className="distribution-grid-line"
                  aria-hidden="true"
                />
              ))}

              {displayItems.map((item) => (
                <article className="distribution-item" key={`${title}-${item.label}`}>
                  <div className="distribution-bar-value">
                    {item.value}
                    <small>{formatChartPercentageLabel(item, responseCount)}</small>
                  </div>

                  <div className="distribution-bar-shell">
                    <div
                      className="distribution-bar"
                      style={{
                        height: animate
                          ? `${Math.max((item.value / distributionMax) * 100, item.value > 0 ? 10 : 2)}%`
                          : '0%',
                      }}
                    />
                  </div>

                  <div className="distribution-item-label">
                    <strong>{item.label}</strong>
                    <span>{formatChartCountLabel(item)}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
        <div className="bar-list" role="list" aria-label={title}>
          {displayItems.map((item) => (
            <article className="bar-row" key={`${title}-${item.label}`}>
              <div className="bar-meta">
                <span>{item.label}</span>
                <div className="bar-summary">
                  <strong>{item.value}</strong>
                  <small>{formatChartCountLabel(item)}</small>
                </div>
              </div>

              <div className="bar-track" aria-hidden="true">
                <div
                  className="bar-fill"
                  style={{
                    width: animate ? `${getBarWidth(item, displayItems)}%` : '0%',
                  }}
                />
              </div>

              <div className="bar-footnote">
                {formatChartPercentageLabel(item, responseCount)}
              </div>
            </article>
          ))}
        </div>
        )
      ) : (
        <EmptyState
          icon="stacked_bar_chart"
          title="Sem dados disponiveis"
          description="Este bloco sera preenchido quando houver respostas."
        />
      )}
    </SurfaceCard>
  );
}
