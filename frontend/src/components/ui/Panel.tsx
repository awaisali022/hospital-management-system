import type { ComponentPropsWithoutRef, PropsWithChildren } from 'react';
import { cn } from '../../lib/cn';

type PanelProps = PropsWithChildren<ComponentPropsWithoutRef<'section'>>;

export function Panel({ children, className, ...rest }: PanelProps) {
  return (
    <section
      className={cn('glass-panel p-5', className)}
      {...rest}
    >
      {children}
    </section>
  );
}
