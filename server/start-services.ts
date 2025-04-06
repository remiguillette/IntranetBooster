
import { spawn } from 'child_process';
import { log } from './vite';
import path from 'path';

export function startServices() {
  const projectsToStart = [
    { name: 'BeaverLaw5002', port: 5002 },
    { name: 'BeaverMonitor', port: 5003 },
    { name: 'BeavernetCRM', port: 5004 },
    { name: 'BeaverPatch', port: 5005 },
    { name: 'BeaverScanner', port: 5006 },
    { name: 'BeaverTracker', port: 5007 },
    { name: 'PaymentNoir', port: 5009 }
  ];

  projectsToStart.forEach(project => {
    const proc = spawn('node', ['dist/index.js'], {
      env: {
        ...process.env,
        PORT: project.port.toString(),
        HOST: '0.0.0.0',
        NODE_ENV: 'production'
      },
      cwd: path.join(process.cwd(), 'projet', project.name)
    });

    proc.stdout.on('data', (data) => {
      log(`[${project.name}] ${data}`, 'service');
    });

    proc.stderr.on('data', (data) => {
      log(`[${project.name}] Error: ${data}`, 'service');
    });
  });
}
