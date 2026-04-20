export function SurveySwitcher({ options, selected, onChange }) {
  return (
    <section className="surface-card survey-switcher fade-in delay-1">
      <div className="section-header">
        <div>
          <p className="eyebrow">Recorte do survey</p>
          <h2>Escolha a visao analisada</h2>
        </div>
      </div>

      <div className="switcher-list" role="tablist" aria-label="Tipo de survey">
        {options.map((option) => {
          const isActive = option.value === selected;

          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`switcher-tab ${isActive ? 'is-active' : ''}`.trim()}
              onClick={() => onChange(option.value)}
            >
              <strong>{option.label}</strong>
              <span>{option.description}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
