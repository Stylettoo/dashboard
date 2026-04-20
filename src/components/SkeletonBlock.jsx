export function SkeletonBlock({ width = '100%', height = 16 }) {
  return <span className="skeleton-block" style={{ width, height }} aria-hidden="true" />;
}
