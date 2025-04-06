
import { log } from "./vite";
import { spawn } from "child_process";
import path from "path";

const services = [
  { name: "BeaverLaw5002", port: 5003 },
  { name: "BeaverMonitor", port: 5009 },
  { name: "BeavernetCRM", port: 5004 },
  { name: "BeaverPatch", port: 5002 },
  { name: "BeaverScanner", port: 5006 },
  { name: "BeaverTracker", port: 5005 },
  { name: "PaymentNoir", port: 5007 }
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
      env: {
        ...env,
        HOST: '0.0.0.0',
        PORT: service.port.toString(),
        ADDRESS: '0.0.0.0',
        HOSTNAME: '0.0.0.0',
        BIND_ADDRESS: '0.0.0.0'
      },
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
