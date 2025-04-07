import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import AnimalManagement from "@/pages/AnimalManagement";
import LostFound from "@/pages/LostFound";
import WantedNotices from "@/pages/WantedNotices";
import Regulations from "@/pages/Regulations";
import AgentManagement from "@/pages/AgentManagement";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/animals" component={AnimalManagement} />
        <Route path="/lost-found" component={LostFound} />
        <Route path="/wanted" component={WantedNotices} />
        <Route path="/regulations" component={Regulations} />
        <Route path="/agents" component={AgentManagement} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
