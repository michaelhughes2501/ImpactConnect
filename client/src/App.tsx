import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Chat from "./pages/chat";
import Landing from "./pages/landing";
import IntegrationsPage from "@/pages/integrations";
import IntegrationsCallback from "@/pages/integrations-callback";
import { useAuth } from "@/hooks/use-auth";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Landing />;
  }

  return (
    <Switch>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/discover">
        <Home key="discover" initialTab="discover" />
      </Route>
      <Route path="/matches">
        <Home key="matches" initialTab="matches" />
      </Route>
      <Route path="/messages">
        <Home key="messages" initialTab="messages" />
      </Route>
      <Route path="/profile">
        <Home key="profile" initialTab="profile" />
      </Route>
      <Route path="/resources">
        <Home key="resources" initialTab="resources" />
      </Route>
      <Route path="/chat/:matchId" component={Chat} />
      <Route path="/integrations" component={IntegrationsPage} />
      <Route path="/integrations/callback" component={IntegrationsCallback} />
      <Route component={NotFound} />
    </Switch>
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
