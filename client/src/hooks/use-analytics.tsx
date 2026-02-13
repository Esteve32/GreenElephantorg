import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { trackPageView, trackReferrer } from '../lib/analytics';

export const useAnalytics = () => {
  const [location] = useLocation();
  const prevLocationRef = useRef<string>(location);
  const referrerTrackedRef = useRef(false);
  
  useEffect(() => {
    if (!referrerTrackedRef.current) {
      trackReferrer();
      referrerTrackedRef.current = true;
    }
  }, []);
  
  useEffect(() => {
    if (location !== prevLocationRef.current) {
      trackPageView(location);
      prevLocationRef.current = location;
    }
  }, [location]);
};
