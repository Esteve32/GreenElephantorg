import { lazy, Suspense, useEffect, useRef } from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FooterImage from "@/components/FooterImage";
import { useHashScroll } from "@/hooks/useHashScroll";
import { useAnalytics } from "@/hooks/use-analytics";
import { initGA } from "@/lib/analytics";
import NotFound from "@/pages/not-found";

const pagesWithCustomFooter = ['/resources', '/prompts', '/connect', '/webinars', '/programs', '/periodic-table'];

function shouldHideGlobalFooter(location: string): boolean {
  return pagesWithCustomFooter.some(path => 
    location === path || location.startsWith(path + '#') || location.startsWith(path + '?')
  );
}

const HomePage = lazy(() => import("@/pages/HomePage"));
const SignalsQuizPage = lazy(() => import("@/pages/SignalsQuizPage"));
const ChooseYourPathPage = lazy(() => import("@/pages/ChooseYourPathPage"));
const PeriodicTablePage = lazy(() => import("@/pages/PeriodicTablePage"));
const RetreatsPage = lazy(() => import("@/pages/RetreatsPage"));
const CoachingPage = lazy(() => import("@/pages/CoachingPage"));
const ResourcesPromptsPage = lazy(() => import("@/pages/ResourcesPromptsPage"));
const ConnectPage = lazy(() => import("@/pages/ConnectPage"));
const CalendarPage = lazy(() => import("@/pages/CalendarPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const PaymentSuccessPage = lazy(() => import("@/pages/PaymentSuccessPage"));
const InterviewCoachingPage = lazy(() => import("@/pages/InterviewCoachingPage"));
const ScanPage = lazy(() => import("@/pages/ScanPage"));
const ProgramsPage = lazy(() => import("@/pages/ProgramsPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("@/pages/TermsOfServicePage"));
const CookiePolicyPage = lazy(() => import("@/pages/CookiePolicyPage"));
const AIPolicyPage = lazy(() => import("@/pages/AIPolicyPage"));
const AdminLoginPage = lazy(() => import("@/pages/AdminLoginPage"));
const AdminSubmissionsPage = lazy(() => import("@/pages/AdminSubmissionsPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const ForExecutiveAssistantsPage = lazy(() => import("@/pages/ForExecutiveAssistantsPage"));
const ForCEOsPage = lazy(() => import("@/pages/ForCEOsPage"));
const ForVirtualAssistantsPage = lazy(() => import("@/pages/ForVirtualAssistantsPage"));
const ExecutiveCoachingAssessmentPage = lazy(() => import("@/pages/ExecutiveCoachingAssessmentPage"));
const WebinarPage = lazy(() => import("@/pages/WebinarPage"));
const WebinarsPage = lazy(() => import("@/pages/WebinarsPage"));
const FlowCheckPage = lazy(() => import("@/pages/FlowCheckPage"));
const DecodePage = lazy(() => import("@/pages/DecodePage"));
const ScanResultsDashboard = lazy(() => import("@/pages/ScanResultsDashboard"));
const EmailControlRoom = lazy(() => import("@/pages/admin/EmailControlRoom"));
const WebinarSessionsAdmin = lazy(() => import("@/pages/admin/WebinarSessionsAdmin"));
const CalendarEventsAdmin = lazy(() => import("@/pages/admin/CalendarEventsAdmin"));

function ScrollToTop() {
  const [location] = useLocation();
  const prevPath = useRef<string>("");

  useEffect(() => {
    const path = location.split("?")[0].split("#")[0];
    if (path !== prevPath.current) {
      prevPath.current = path;
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location]);

  return null;
}

function Router() {
  const [location] = useLocation();
  const hideGlobalFooter = shouldHideGlobalFooter(location);
  
  useHashScroll();
  useAnalytics();

  return (
    <>
      <ScrollToTop />
      <a 
        href="#main" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
        data-testid="link-skip-to-main"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="pt-[72px]">
      <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/scan" component={ScanPage} />
        <Route path="/programs" component={ProgramsPage} />
        <Route path="/what-is-conscious-communication">{() => <Redirect to="/scan" />}</Route>
        <Route path="/signals">{() => <Redirect to="/scan" />}</Route>
        <Route path="/choose-your-path">{() => <Redirect to="/scan" />}</Route>
        <Route path="/periodic-table" component={PeriodicTablePage} />
        <Route path="/retreats" component={RetreatsPage} />
        <Route path="/coaching" component={CoachingPage} />
        <Route path="/consulting">{() => <Redirect to="/programs" />}</Route>
        <Route path="/resources" component={ResourcesPromptsPage} />
        <Route path="/prompts" component={ResourcesPromptsPage} />
        <Route path="/stories">{() => <Redirect to="/connect" />}</Route>
        <Route path="/connect" component={ConnectPage} />
        <Route path="/team">{() => <Redirect to="/connect" />}</Route>
        <Route path="/references">{() => <Redirect to="/connect" />}</Route>
        <Route path="/contact">{() => <Redirect to="/connect" />}</Route>
        <Route path="/calendar" component={CalendarPage} />
        <Route path="/interview-coaching" component={InterviewCoachingPage} />
        <Route path="/satellitescan">{() => <Redirect to="/scan" />}</Route>
        <Route path="/checkout" component={CheckoutPage} />
        <Route path="/payment-success" component={PaymentSuccessPage} />
        <Route path="/privacy" component={PrivacyPolicyPage} />
        <Route path="/terms" component={TermsOfServicePage} />
        <Route path="/cookies" component={CookiePolicyPage} />
        <Route path="/ai-policy" component={AIPolicyPage} />
        <Route path="/admin/login" component={AdminLoginPage} />
        <Route path="/admin/submissions" component={AdminSubmissionsPage} />
        <Route path="/admin">{() => <Redirect to="/admin/login" />}</Route>
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/for-executive-assistants" component={ForExecutiveAssistantsPage} />
        <Route path="/for-ceos" component={ForCEOsPage} />
        <Route path="/for-virtual-assistants" component={ForVirtualAssistantsPage} />
        <Route path="/executive-coaching-assessment" component={ExecutiveCoachingAssessmentPage} />
        <Route path="/webinar" component={WebinarPage} />
        <Route path="/webinars" component={WebinarsPage} />
        <Route path="/flow-check" component={FlowCheckPage} />
        <Route path="/decode" component={DecodePage} />
        <Route path="/decoding">{() => <Redirect to="/decode" />}</Route>
        <Route path="/admin/scan-results" component={ScanResultsDashboard} />
        <Route path="/admin/email-control-room" component={EmailControlRoom} />
        <Route path="/admin/webinar-sessions" component={WebinarSessionsAdmin} />
        <Route path="/admin/calendar-events" component={CalendarEventsAdmin} />
        <Route component={NotFound} />
      </Switch>
      </Suspense>
      </main>
      {!hideGlobalFooter && <FooterImage />}
      {!hideGlobalFooter && <Footer />}
    </>
  );
}

function App() {
  useEffect(() => {
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
