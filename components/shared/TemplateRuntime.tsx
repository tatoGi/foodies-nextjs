'use client';

import {usePathname} from 'next/navigation';
import {useEffect} from 'react';

declare global {
  interface Window {
    foodiesBoot?: () => void;
    foodiesDestroy?: () => void;
  }
}

export default function TemplateRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    let timer = 0;

    const run = () => {
      if (cancelled) {
        return;
      }
      if (typeof window.foodiesBoot !== 'function') {
        timer = window.setTimeout(run, 50);
        return;
      }
      window.foodiesBoot();
    };

    timer = window.setTimeout(run, 50);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.foodiesDestroy?.();
    };
  }, [pathname]);

  return null;
}
