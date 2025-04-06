
import { spawn } from 'child_process';
import path from 'path';

const PROJECTS = [
  'BeaverLaw5002',
  'BeaverPatch',
  'BeaverMonitor',
  'BeavernetCRM',
  'BeaverDoc',
  'BeaverScanner',
  'PaymentNoir'
];

export function startServices() {
  PROJECTS.forEach(project => {
    const projectPath = path.join(process.cwd(), 'projet', project);
    const npm = spawn('npm', ['start'], {
      cwd: projectPath,
      stdio: 'inherit'
    });

    npm.on('error', (err) => {
      console.error(`Failed to start ${project}:`, err);
    });
  });
}
