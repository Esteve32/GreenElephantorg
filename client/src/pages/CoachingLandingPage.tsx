import { useLocation } from 'wouter';
import { SEO } from '@/components/SEO';
import { coachingPage, renderCoachingPage, BEGINNER_FAQ } from '@shared/coaching-pages';
import { pageMetadata } from '@shared/page-metadata';
import NotFound from './not-found';
import './homepage.css';
import './landing-pages.css';

export default function CoachingLandingPage() {
  const [path] = useLocation();
  const page = coachingPage(path);
  if (!page) return <NotFound />;
  return <><SEO {...pageMetadata(path)} faqItems={[...page.faq, BEGINNER_FAQ]} />
    <div lang="en" className="ge-site" dangerouslySetInnerHTML={{ __html: renderCoachingPage(page) }} />
  </>;
}
