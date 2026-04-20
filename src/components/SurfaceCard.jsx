import { forwardRef } from 'react';

export const SurfaceCard = forwardRef(function SurfaceCard(
  { children, className = '' },
  ref,
) {
  return (
    <section ref={ref} className={`surface-card ${className}`.trim()}>
      {children}
    </section>
  );
});
