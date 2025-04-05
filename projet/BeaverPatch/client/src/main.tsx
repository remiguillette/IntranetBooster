import { createRoot } from "react-dom/client";
import { QueryClientProvider } from '@tanstack/react-query';
import App from "./App";
import "./index.css";
import { AppProvider } from "./lib/AppContext";
import { queryClient } from "./lib/queryClient";

// Configurer les styles globaux pour le système CAD français
document.documentElement.classList.add("dark");
document.body.classList.add("bg-deep-black", "text-beaver-orange");

// Créer des variables CSS personnalisées pour les couleurs
const style = document.createElement("style");
style.textContent = `
  :root {
    --beaver-orange: #f89422;
    --deep-black: #121212;
    --dark-gray: #1E1E1E;
    --medium-gray: #2D2D2D;
    --status-connected: #4CAF50;
    --status-reconnecting: #FFC107;
    --status-disconnected: #F44336;
  }
  
  input, select, textarea {
    background-color: var(--medium-gray) !important;
    border: 1px solid #3D3D3D !important;
    color: var(--beaver-orange) !important;
  }
  
  input::placeholder, textarea::placeholder {
    color: var(--beaver-orange) !important;
    opacity: 0.6 !important;
  }
  
  input:focus, select:focus, textarea:focus {
    border-color: var(--beaver-orange) !important;
    outline: none !important;
    ring: 2px !important;
    ring-color: var(--beaver-orange) !important;
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </AppProvider>
);
