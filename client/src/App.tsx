import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import PeriodicTablePage from "@/pages/PeriodicTablePage";
import PromptsPage from "@/pages/PromptsPage";
import RetreatsPage from "@/pages/RetreatsPage";
import CoachingPage from "@/pages/CoachingPage";
import ArboraPage from "@/pages/ArboraPage";
import ResourcesPage from "@/pages/ResourcesPage";
import ContactPage from "@/pages/ContactPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <>
      <Header />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/periodic-table" component={PeriodicTablePage} />
        <Route path="/prompts" component={PromptsPage} />
        <Route path="/retreats" component={RetreatsPage} />
        <Route path="/coaching" component={CoachingPage} />
        <Route path="/arbora" component={ArboraPage} />
        <Route path="/resources" component={ResourcesPage} />
        <Route path="/contact" component={ContactPage} />
        <Route component={NotFound} />
      </Switch>
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
