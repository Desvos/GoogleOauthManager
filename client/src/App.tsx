import { Switch, Route, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AuthCode from "@/pages/auth-code";
import { useEffect } from "react";

// Create a simple client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  const [location] = useLocation();
  
  // Check if we need to redirect to auth page when we have a code parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    
    if (code && location === "/") {
      // We're on home with a code, redirect to auth
      window.location.href = "/auth" + window.location.search;
    }
  }, [location]);
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthCode} />
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
