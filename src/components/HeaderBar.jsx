export function HeaderBar({
  query,
  period,
  periodOptions,
  isRefreshing,
  isSyncing,
  onReload,
  onSync,
  onPeriodChange,
  onQueryChange,
}) {
  return (
    <header className="topbar fade-in">
      <div className="heading-group">
        <div className="brand-mark" aria-hidden="true">
          <span className="material-symbols-outlined">bar_chart</span>
        </div>
        <div>
          <h1>Dashboard de Analise de Survey</h1>
        </div>
      </div>

      <div className="toolbar">
        <label className="input-shell search-shell" aria-label="Buscar">
          <span className="material-symbols-outlined" aria-hidden="true">
            search
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar categorias ou temas"
          />
        </label>

        <label className="input-shell select-shell">
          <span className="material-symbols-outlined" aria-hidden="true">
            calendar_today
          </span>
          <select
            value={period}
            onChange={(event) => onPeriodChange(event.target.value)}
            aria-label="Filtrar periodo"
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className={`ghost-button ${isSyncing ? 'is-loading' : ''}`.trim()}
          onClick={onSync}
          disabled={isSyncing}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            sync
          </span>
          {isSyncing ? 'Sincronizando' : 'Sincronizar'}
        </button>

        <button type="button" className="ghost-button" disabled>
          <span className="material-symbols-outlined" aria-hidden="true">
            ios_share
          </span>
          Exportar
        </button>
      </div>
    </header>
  );
}
