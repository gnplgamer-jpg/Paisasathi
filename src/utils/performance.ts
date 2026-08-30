import { useEffect } from 'react';

/**
 * Lightweight performance metrics logger for low-end device optimization monitoring.
 * Logs render times and approximate Time-to-Interactive (TTI).
 */
export function usePerformanceLogger(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(2);
      // In a real app, this would be sent to Firebase Performance Monitoring
      console.log(`[Perf Metrics] ⚡ ${componentName} render cycle: ${duration}ms`);
    };
  });

  useEffect(() => {
    if ('performance' in window) {
      try {
        const entries = performance.getEntriesByType('navigation');
        if (entries.length > 0) {
          const navEntry = entries[0] as PerformanceNavigationTiming;
          console.log(`[Perf Metrics] 🚀 App Time-to-Interactive (TTI): ${navEntry.domInteractive}ms`);
        }
      } catch (e) {
        // Fallback for older WebView versions
      }
    }
  }, []);
}
