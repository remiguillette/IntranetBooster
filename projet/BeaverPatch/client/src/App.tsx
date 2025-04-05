import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { AgentPositionProvider } from "@/lib/contexts/AgentPositionContext";
import { AppProvider } from "@/lib/AppContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AgentPositionProvider>
      <Router />
      <Toaster />
    </AgentPositionProvider>
  );
}

export default App;
