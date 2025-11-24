import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import WhatIsPage from "@/pages/WhatIsPage";
import SignalsQuizPage from "@/pages/SignalsQuizPage";
import ChooseYourPathPage from "@/pages/ChooseYourPathPage";
import PeriodicTablePage from "@/pages/PeriodicTablePage";
import RetreatsPage from "@/pages/RetreatsPage";
import CoachingPage from "@/pages/CoachingPage";
import TeamPage from "@/pages/TeamPage";
import LabPage from "@/pages/LabPage";
import ConsultingPage from "@/pages/ConsultingPage";
import ResourcesPromptsPage from "@/pages/ResourcesPromptsPage";
import StoriesPage from "@/pages/StoriesPage";
import ReferencesPage from "@/pages/ReferencesPage";
import ContactPage from "@/pages/ContactPage";
import CheckoutPage from "@/pages/CheckoutPage";
import PaymentSuccessPage from "@/pages/PaymentSuccessPage";
import InterviewCoachingPage from "@/pages/InterviewCoachingPage";
import SatelliteScanPage from "@/pages/SatelliteScanPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import CookiePolicyPage from "@/pages/CookiePolicyPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminSubmissionsPage from "@/pages/AdminSubmissionsPage";
import NotFound from "@/pages/not-found";

function Router() {
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
        <Route path="/what-is-conscious-communication" component={WhatIsPage} />
        <Route path="/signals" component={SignalsQuizPage} />
        <Route path="/choose-your-path" component={ChooseYourPathPage} />
        <Route path="/periodic-table" component={PeriodicTablePage} />
        <Route path="/retreats" component={RetreatsPage} />
        <Route path="/coaching" component={CoachingPage} />
        <Route path="/team" component={TeamPage} />
        <Route path="/lab" component={LabPage} />
        <Route path="/consulting" component={ConsultingPage} />
        <Route path="/resources" component={ResourcesPromptsPage} />
        <Route path="/prompts" component={ResourcesPromptsPage} />
        <Route path="/arbora" component={LabPage} />
        <Route path="/stories" component={StoriesPage} />
        <Route path="/references" component={ReferencesPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/interview-coaching" component={InterviewCoachingPage} />
        <Route path="/satellitescan" component={SatelliteScanPage} />
        <Route path="/checkout" component={CheckoutPage} />
        <Route path="/payment-success" component={PaymentSuccessPage} />
        <Route path="/privacy" component={PrivacyPolicyPage} />
        <Route path="/terms" component={TermsOfServicePage} />
        <Route path="/cookies" component={CookiePolicyPage} />
        <Route path="/admin/login" component={AdminLoginPage} />
        <Route path="/admin/submissions" component={AdminSubmissionsPage} />
        <Route component={NotFound} />
      </Switch>
      </main>
      <Footer />
    </>
  );
}

function App() {
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
