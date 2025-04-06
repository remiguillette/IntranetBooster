import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

/**
 * Crée un middleware de proxy authentifié pour accéder aux applications sur différents ports
 * @param port Le port de l'application cible
 * @returns Un middleware Express
 */
export function createAuthenticatedProxy(port: number) {
  // Middleware de vérification d'authentification
  const authCheck = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).send(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Accès non autorisé - Beavernet</title>
          <style>
            body {
              font-family: 'Roboto', sans-serif;
              background-color: #121212;
              color: #f89422;
              margin: 0;
              padding: 0;
              display: flex;
              flex-direction: column;
              min-height: 100vh;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 2rem;
              flex-grow: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
            }
            h1 {
              color: #f89422;
              margin-bottom: 1rem;
            }
            p {
              color: #e0e0e0;
              margin-bottom: 2rem;
            }
            .btn {
              background-color: #f89422;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 0.25rem;
              text-decoration: none;
              font-weight: 500;
              transition: background-color 0.2s;
            }
            .btn:hover {
              background-color: #e07c10;
            }
            .icon {
              font-size: 5rem;
              margin-bottom: 2rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">🔒</div>
            <h1>Accès non autorisé</h1>
            <p>Vous devez être connecté pour accéder à cette ressource.</p>
            <a href="/" class="btn">Se connecter</a>
          </div>
        </body>
        </html>
      `);
    }
    next();
  };

  // Configuration du proxy
  const proxyOptions = {
    target: `http://localhost:${port}`,
    changeOrigin: true,
    ws: true, // Support WebSocket
    pathRewrite: {
      [`^/proxy/${port}`]: '/', // Réécrit /proxy/3000 en /
    },
    logLevel: 'silent',
    onProxyReq: (proxyReq: any, req: Request) => {
      // Ajouter des en-têtes personnalisés si nécessaire
      proxyReq.setHeader('X-Authenticated-User', String(req.session.userId));
    },
  };

  return [authCheck, createProxyMiddleware(proxyOptions)];
}