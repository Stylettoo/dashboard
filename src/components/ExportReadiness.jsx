import { SurfaceCard } from './SurfaceCard';

export function ExportReadiness({ config, dataset, surveyLabel }) {
  const fields = dataset.fields.length ? dataset.fields : config.fields;
  const sheetName = dataset.sheetName || surveyLabel;

  return (
    <SurfaceCard className="export-card fade-in delay-2">
      <div className="section-header">
        <div>
          <h2>{config.title}</h2>
        </div>
        <span className="section-badge">
          <span className="material-symbols-outlined" aria-hidden="true">
            table_view
          </span>
          Aba sugerida: {sheetName}
        </span>
      </div>

      <p className="section-description">{config.description}</p>

      <div className="field-chip-list" aria-label="Campos previstos">
        {fields.map((field) => (
          <span key={field} className="field-chip">
            {field}
          </span>
        ))}
      </div>
    </SurfaceCard>
  );
}
