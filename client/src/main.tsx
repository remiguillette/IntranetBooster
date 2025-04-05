import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add custom styles for Roboto fonts
const style = document.createElement('style');
style.textContent = `
  body {
    font-family: 'Roboto', sans-serif;
    background-color: #121212;
    color: #f89422;
  }

  :root {
    --background: 0 0% 7%;
    --foreground: 32 93% 53%;
    
    --card: 0 0% 12%;
    --card-foreground: 32 93% 53%;
    
    --popover: 0 0% 12%;
    --popover-foreground: 32 93% 53%;
    
    --primary: 32 93% 53%;
    --primary-foreground: 0 0% 100%;
    
    --secondary: 0 0% 18%;
    --secondary-foreground: 0 0% 98%;
    
    --muted: 0 0% 18%;
    --muted-foreground: 240 5% 65%;
    
    --accent: 0 0% 18%;
    --accent-foreground: 0 0% 98%;
    
    --destructive: 0 62% 30%;
    --destructive-foreground: 0 0% 98%;
    
    --border: 0 0% 15%;
    --input: 0 0% 15%;
    --ring: 32 93% 53%;
    
    --radius: 0.5rem;
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
