import { useMemo, useState } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { HeroInsight } from './components/HeroInsight';
import { KpiGrid } from './components/KpiGrid';
import { ChartSection } from './components/ChartSection';
import { InsightsSection } from './components/InsightsSection';
import { FeedbackBanner } from './components/FeedbackBanner';
import { SurveySwitcher } from './components/SurveySwitcher';
import { ExportReadiness } from './components/ExportReadiness';
import { QuickFactsPanel } from './components/QuickFactsPanel';
import { SectionGroup } from './components/SectionGroup';
import { useSurveyData } from './hooks/useSurveyData';
import {
  buildHeroInsight,
  buildQuickFacts,
  getSurveyConfig,
  surveyOptions,
} from './lib/dashboard';

const PERIOD_OPTIONS = [
  { value: 'all', label: 'Todo o periodo' },
  { value: '30d', label: 'Ultimos 30 dias' },
  { value: '90d', label: 'Ultimos 90 dias' },
  { value: '12m', label: 'Ultimos 12 meses' },
];

function normalizeSearchValue(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function App() {
  const [period, setPeriod] = useState(PERIOD_OPTIONS[0].value);
  const [query, setQuery] = useState('');
  const [surveyType, setSurveyType] = useState('contratante');
  const { data, error, isLoading, isRefreshing, isSyncing, reload, sync } = useSurveyData(period);
  const surveyConfig = useMemo(() => getSurveyConfig(surveyType), [surveyType]);
  const selectedSurvey = data.surveys[surveyType];

  const heroInsight = useMemo(
    () => buildHeroInsight(selectedSurvey, surveyConfig),
    [selectedSurvey, surveyConfig],
  );
  const quickFacts = useMemo(
    () => buildQuickFacts(selectedSurvey, surveyConfig),
    [selectedSurvey, surveyConfig],
  );
  const normalizedQuery = normalizeSearchValue(query);

  const filteredSurvey = useMemo(() => {
    if (!normalizedQuery) {
      return selectedSurvey;
    }

    const nextSurvey = {
      ...selectedSurvey,
      insights: selectedSurvey.insights.filter((insight) =>
        [insight.title, insight.description]
          .filter(Boolean)
          .some((value) => normalizeSearchValue(value).includes(normalizedQuery)),
      ),
    };

    surveyConfig.chartSections.forEach((section) => {
      const sourceItems = selectedSurvey[section.key] || [];
      const sectionMatches = [section.title, section.description]
        .filter(Boolean)
        .some((value) => normalizeSearchValue(value).includes(normalizedQuery));

      nextSurvey[section.key] = sectionMatches
        ? sourceItems
        : sourceItems.filter((item) =>
            normalizeSearchValue(item.label).includes(normalizedQuery),
          );
    });

    return nextSurvey;
  }, [normalizedQuery, selectedSurvey, surveyConfig]);

  const visibleGroups = useMemo(
    () =>
      surveyConfig.chartGroups
        .map((group) => {
          const groupMatches = !normalizedQuery
            ? true
            : [group.title, group.description]
                .filter(Boolean)
                .some((value) => normalizeSearchValue(value).includes(normalizedQuery));

          const sections = group.sections
            .map((sectionKey) =>
              surveyConfig.chartSections.find((candidate) => candidate.key === sectionKey),
            )
            .filter(Boolean)
            .filter((section) => {
              if (groupMatches) {
                return true;
              }

              const items = filteredSurvey[section.key] || [];
              return items.length > 0;
            });

          return {
            ...group,
            sections,
          };
        })
        .filter((group) => group.sections.length > 0),
    [filteredSurvey, normalizedQuery, surveyConfig],
  );

  const searchResultCount = useMemo(() => {
    if (!normalizedQuery) {
      return 0;
    }

    const chartMatches = surveyConfig.chartSections.reduce((total, section) => {
      const items = filteredSurvey[section.key] || [];
      return total + items.length;
    }, 0);

    return chartMatches + filteredSurvey.insights.length;
  }, [filteredSurvey, normalizedQuery, surveyConfig]);

  async function handleSync() {
    const password = window.prompt('Digite a senha para sincronizar os dados agora:');

    if (password === null) {
      return;
    }

    try {
      await sync(password);
    } catch (syncError) {
      window.alert(syncError.message || 'Nao foi possivel sincronizar agora.');
    }
  }

  return (
    <div className="app-shell">
      <div className="app-background" aria-hidden="true" />
      <main className="page">
        <HeaderBar
          query={query}
          period={period}
          periodOptions={PERIOD_OPTIONS}
          isRefreshing={isRefreshing}
          isSyncing={isSyncing}
          onReload={reload}
          onSync={handleSync}
          onPeriodChange={setPeriod}
          onQueryChange={setQuery}
        />

        <div className="content-stack">
          <SurveySwitcher
            options={surveyOptions}
            selected={surveyType}
            onChange={setSurveyType}
          />

          {normalizedQuery ? (
            <FeedbackBanner
              variant="empty"
              title={`Busca ativa por "${query}"`}
              description={
                searchResultCount
                  ? `${searchResultCount} correspondencias encontradas.`
                  : 'Nenhuma correspondencia encontrada.'
              }
              actionLabel="Limpar busca"
              onAction={() => setQuery('')}
            />
          ) : null}

          <section className="executive-grid">
            <HeroInsight
              insight={heroInsight}
              title={surveyConfig.title}
              emptyText={surveyConfig.heroEmptyText}
              isLoading={isLoading}
              isRefreshing={isRefreshing}
            />

            <QuickFactsPanel
              facts={quickFacts}
              isLoading={isLoading}
              isRefreshing={isRefreshing}
            />
          </section>

          {error ? (
            <FeedbackBanner
              variant="error"
              title="Falha ao carregar os dados"
              description={error}
              actionLabel="Tentar novamente"
              onAction={reload}
            />
          ) : null}

          {!error && !isLoading && data.meta.isEmpty ? (
            <FeedbackBanner
              variant="empty"
              title="Dashboard aguardando dados"
              description="Conecte o endpoint do Apps Script para começar a consumir respostas reais."
            />
          ) : null}

          <section className="metrics-stack">
            <div className="metrics-header fade-in delay-2">
              <h2>Indicadores principais</h2>
            </div>

            <KpiGrid
              items={surveyConfig.kpiItems}
              kpis={selectedSurvey.kpis}
              isLoading={isLoading}
              isRefreshing={isRefreshing}
            />
          </section>

          <div aria-label="Visualizacoes do survey" className="groups-stack">
            {visibleGroups.length ? (
              visibleGroups.map((group) => {
                const hasDistribution = group.sections.some(
                  (section) => section.visualization === 'distribution',
                );

                return (
                  <SectionGroup
                    key={group.title}
                    title={group.title}
                    description={group.description}
                  >
                    {group.sections.map((section, index) => (
                      <ChartSection
                        key={section.key}
                        title={section.title}
                        description={section.description}
                        items={filteredSurvey[section.key]}
                        visualization={section.visualization}
                        fullWidth={hasDistribution}
                        order={section.order}
                        responseCount={filteredSurvey.meta.responseCount}
                        isLoading={isLoading}
                        isRefreshing={isRefreshing}
                        delay={index}
                      />
                    ))}
                  </SectionGroup>
                );
              })
            ) : normalizedQuery && !isLoading ? (
              <FeedbackBanner
                variant="empty"
                title="Nenhum resultado encontrado"
                description={`Nada encontrado para "${query}".`}
              />
            ) : null}
          </div>

          <InsightsSection
            insights={filteredSurvey.insights}
            description={surveyConfig.insightDescription}
            isLoading={isLoading}
            isRefreshing={isRefreshing}
          />

          <ExportReadiness
            config={surveyConfig.exportConfig}
            dataset={selectedSurvey.exportConfig}
            surveyLabel={surveyConfig.title}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
