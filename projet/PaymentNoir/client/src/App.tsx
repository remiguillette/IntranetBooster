import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import PaymentPage from "@/pages/payment-page";
import PaymentSuccess from "@/pages/payment-success";
import AdminPage from "@/pages/admin-page";
import AdminDashboardPage from "@/pages/admin-dashboard-page";
import AuthPage from "@/pages/auth-page";
import { ProtectedAdminRoute } from "@/components/admin/protected-admin-route";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={PaymentPage} />
      <ProtectedRoute path="/payment-success" component={PaymentSuccess} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin/dashboard">
        <ProtectedAdminRoute>
          <AdminDashboardPage />
        </ProtectedAdminRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
