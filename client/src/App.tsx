import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import WhatIsPage from "@/pages/WhatIsPage";
import SignalsPage from "@/pages/SignalsPage";
import ChooseYourPathPage from "@/pages/ChooseYourPathPage";
import PeriodicTablePage from "@/pages/PeriodicTablePage";
import RetreatsPage from "@/pages/RetreatsPage";
import CoachingPage from "@/pages/CoachingPage";
import LabPage from "@/pages/LabPage";
import ConsultingPage from "@/pages/ConsultingPage";
import ResourcesPromptsPage from "@/pages/ResourcesPromptsPage";
import ContactPage from "@/pages/ContactPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <>
      <Header />
      <main className="pt-[72px]">
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/what-is-conscious-communication" component={WhatIsPage} />
        <Route path="/signals" component={SignalsPage} />
        <Route path="/choose-your-path" component={ChooseYourPathPage} />
        <Route path="/periodic-table" component={PeriodicTablePage} />
        <Route path="/retreats" component={RetreatsPage} />
        <Route path="/coaching" component={CoachingPage} />
        <Route path="/lab" component={LabPage} />
        <Route path="/consulting" component={ConsultingPage} />
        <Route path="/resources" component={ResourcesPromptsPage} />
        <Route path="/contact" component={ContactPage} />
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
