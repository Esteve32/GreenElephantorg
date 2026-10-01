import { useLocation, useSearch } from 'wouter';
import { siteLanguage } from '@shared/site-language';
export function useSiteLanguage() { const [path] = useLocation(); return siteLanguage(path, useSearch()); }
