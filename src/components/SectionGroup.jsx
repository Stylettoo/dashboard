export function SectionGroup({ title, description, children }) {
  return (
    <section className="section-group fade-in delay-2">
      <div className="section-group-header">
        <h2>{title}</h2>
        {description ? <p className="section-group-description">{description}</p> : null}
      </div>
      <div className="charts-grid">{children}</div>
    </section>
  );
}
