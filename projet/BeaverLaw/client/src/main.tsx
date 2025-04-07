import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add custom CSS for map markers if they don't exist in base styles
const style = document.createElement('style');
style.textContent = `
  .lost-animal-marker, .found-animal-marker {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .marker-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .bg-danger {
    background-color: #e53935;
  }
  
  .bg-success {
    background-color: #43a047;
  }
  
  .map-popup {
    padding: 8px;
    max-width: 250px;
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
