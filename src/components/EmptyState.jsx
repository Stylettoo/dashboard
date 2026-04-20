export function EmptyState({ icon, title, description }) {
  return (
    <div className="empty-state">
      <span className="material-symbols-outlined" aria-hidden="true">
        {icon}
      </span>
      <p>{title}</p>
      <small>{description}</small>
    </div>
  );
}
