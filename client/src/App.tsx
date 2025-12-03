import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import CreateClip from "./pages/CreateClip";
import ClipPreview from "./pages/ClipPreview";
import { useAuth } from "./_core/hooks/useAuth";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Landing />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/landing" component={Landing} />
      <Route path="/app/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/app/create" component={() => <ProtectedRoute component={CreateClip} />} />
      <Route path="/app/preview" component={() => <ProtectedRoute component={ClipPreview} />} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
