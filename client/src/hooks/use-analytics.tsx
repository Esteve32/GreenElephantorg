import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { browserMarketingTracker } from '../lib/marketing-tracker';

export const useAnalytics = () => {
  const [location] = useLocation();
  useEffect(() => { void browserMarketingTracker().visit(); }, [location]);
};
