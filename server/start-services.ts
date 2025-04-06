
import { log } from "./vite";
import { spawn } from "child_process";
import path from "path";

const services = [
  { name: "BeaverLaw5002", port: 3000 },
  { name: "BeaverMonitor", port: 3001 },
  { name: "BeavernetCRM", port: 3002 },
  { name: "BeaverPatch", port: 3003 },
  { name: "BeaverScanner", port: 4200 },
  { name: "BeaverTracker", port: 5173 },
  { name: "PaymentNoir", port: 6000 }
];

export function startServices() {
  services.forEach(service => {
    const projectPath = path.join(process.cwd(), 'projet', service.name);
    const env = {
      ...process.env,
      PORT: service.port.toString(),
      NODE_ENV: 'production'
    };

    const child = spawn('node', ['dist/index.js'], {
      cwd: projectPath,
      env,
      stdio: 'pipe'
    });

    child.stdout.on('data', (data) => {
      log(`[${service.name}] ${data}`);
    });

    child.stderr.on('data', (data) => {
      log(`[${service.name}] Error: ${data}`);
    });

    log(`Started ${service.name} on port ${service.port}`);
  });
}
