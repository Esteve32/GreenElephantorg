import { useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useHashScroll } from "@/hooks/useHashScroll";
import { useAnalytics } from "@/hooks/use-analytics";
import { initGA } from "@/lib/analytics";

const pagesWithCustomFooter = ['/resources', '/prompts'];

function shouldHideGlobalFooter(location: string): boolean {
  return pagesWithCustomFooter.some(path => 
    location === path || location.startsWith(path + '#') || location.startsWith(path + '?')
  );
}
import HomePage from "@/pages/HomePage";
import WhatIsPage from "@/pages/WhatIsPage";
import SignalsQuizPage from "@/pages/SignalsQuizPage";
import ChooseYourPathPage from "@/pages/ChooseYourPathPage";
import PeriodicTablePage from "@/pages/PeriodicTablePage";
import RetreatsPage from "@/pages/RetreatsPage";
import CoachingPage from "@/pages/CoachingPage";
import ConsultingPage from "@/pages/ConsultingPage";
import ResourcesPromptsPage from "@/pages/ResourcesPromptsPage";
import StoriesPage from "@/pages/StoriesPage";
import ConnectPage from "@/pages/ConnectPage";
import CalendarPage from "@/pages/CalendarPage";
import CheckoutPage from "@/pages/CheckoutPage";
import PaymentSuccessPage from "@/pages/PaymentSuccessPage";
import InterviewCoachingPage from "@/pages/InterviewCoachingPage";
import ScanPage from "@/pages/ScanPage";
import ProgramsPage from "@/pages/ProgramsPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import CookiePolicyPage from "@/pages/CookiePolicyPage";
import AIPolicyPage from "@/pages/AIPolicyPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminSubmissionsPage from "@/pages/AdminSubmissionsPage";
import DashboardPage from "@/pages/DashboardPage";
import ForExecutiveAssistantsPage from "@/pages/ForExecutiveAssistantsPage";
import ForCEOsPage from "@/pages/ForCEOsPage";
import ForVirtualAssistantsPage from "@/pages/ForVirtualAssistantsPage";
import ExecutiveCoachingAssessmentPage from "@/pages/ExecutiveCoachingAssessmentPage";
import WebinarPage from "@/pages/WebinarPage";
import FlowCheckPage from "@/pages/FlowCheckPage";
import DecodePage from "@/pages/DecodePage";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  const hideGlobalFooter = shouldHideGlobalFooter(location);
  
  useHashScroll();
  useAnalytics();

  return (
    <>
      <a 
        href="#main" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
        data-testid="link-skip-to-main"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="pt-[72px]">
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/scan" component={ScanPage} />
        <Route path="/programs" component={ProgramsPage} />
        <Route path="/what-is-conscious-communication" component={WhatIsPage} />
        <Route path="/signals" component={SignalsQuizPage} />
        <Route path="/choose-your-path" component={ChooseYourPathPage} />
        <Route path="/periodic-table" component={PeriodicTablePage} />
        <Route path="/retreats" component={RetreatsPage} />
        <Route path="/coaching" component={CoachingPage} />
        <Route path="/consulting" component={ConsultingPage} />
        <Route path="/resources" component={ResourcesPromptsPage} />
        <Route path="/prompts" component={ResourcesPromptsPage} />
        <Route path="/stories" component={StoriesPage} />
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
        <Route path="/flow-check" component={FlowCheckPage} />
        <Route path="/decode" component={DecodePage} />
        <Route component={NotFound} />
      </Switch>
      </main>
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
