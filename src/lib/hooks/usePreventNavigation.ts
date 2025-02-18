import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function usePreventNavigation(shouldPrevent: boolean) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!shouldPrevent) return;

    let isPreventingNavigation = true;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isPreventingNavigation) {
        e.preventDefault();
        e.returnValue = 'You have an ongoing game. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    const preventNavigation = () => {
      if (isPreventingNavigation) {
        const confirmation = window.confirm('You have an ongoing game. Are you sure you want to leave? All progress will be lost.');
        if (!confirmation) {
          router.push(pathname); // Stay on current page
          return false;
        }
        isPreventingNavigation = false;
        return true;
      }
      return true;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.onpopstate = preventNavigation;

    // Push current state to prevent immediate back
    window.history.pushState(null, '', window.location.href);

    return () => {
      isPreventingNavigation = false;
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.onpopstate = null;
    };
  }, [shouldPrevent, router, pathname]);
}