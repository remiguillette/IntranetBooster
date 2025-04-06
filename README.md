# Beavernet - Portail Intranet Moderne

Beavernet est un portail intranet moderne conçu pour une navigation efficace entre différents services et applications via un système de redirection de ports. L'interface utilisateur est attrayante avec un thème sombre et ludique mettant en vedette une mascotte de castor.

![Beavernet](client/src/assets/beaver.png)

## Table des matières

- [Aperçu du projet](#aperçu-du-projet)
- [Architecture](#architecture)
- [Sous-projets](#sous-projets)
- [Installation](#installation)
- [Scripts disponibles](#scripts-disponibles)
- [Gestion des utilisateurs](#gestion-des-utilisateurs)
- [Déploiement](#déploiement)
- [Contribuer](#contribuer)
- [Licence](#licence)

## Aperçu du projet

Beavernet est un portail intranet centralisé qui permet aux utilisateurs de naviguer facilement entre différentes applications internes de l'entreprise. Ses principales fonctionnalités incluent :

- Système de navigation par cartes avec design responsive
- Thème sombre interactif avec une mascotte de castor
- Mécanismes d'authentification sécurisés
- Interface intuitive d'accès aux ports de serveur
- Frontend développé avec TypeScript et React

## Architecture

Le projet est construit avec une architecture moderne de type client-serveur :

### Frontend
- **React** et **TypeScript** pour le développement de l'interface utilisateur
- **Tailwind CSS** et **Shadcn/UI** pour le design et les composants
- **React Query** pour la gestion des requêtes API
- **Wouter** pour le système de routage

### Backend
- **Express.js** pour l'API REST
- **Stockage en mémoire** pour la persistance des données (peut être étendu à une base de données PostgreSQL)
- **Express-session** pour la gestion des sessions
- **Zod** pour la validation des données

### Structure des fichiers
```
beavernet/
├── client/               # Code du frontend
│   ├── src/              
│   │   ├── assets/       # Images et ressources
│   │   ├── components/   # Composants React
│   │   ├── hooks/        # Hooks personnalisés
│   │   ├── lib/          # Utilitaires et services
│   │   ├── pages/        # Pages de l'application
│   │   ├── types/        # Types TypeScript
│   │   ├── App.tsx       # Composant principal
│   │   └── main.tsx      # Point d'entrée
├── server/               # Code du backend
│   ├── index.ts          # Point d'entrée serveur
│   ├── routes.ts         # Routes API
│   ├── storage.ts        # Logique de stockage
│   └── vite.ts           # Configuration Vite
├── shared/               # Code partagé
│   └── schema.ts         # Schémas de données
└── projet/               # Sous-projets/applications
    ├── BeaverLaw5002/    
    ├── BeaverPatch/      
    ├── BeaverMonitor/    
    ├── BeavernetCRM/     
    ├── BeaverScanner/    
    ├── BeaverTracker/    
    └── PaymentNoir/      
```

## Sous-projets

Beavernet intègre plusieurs applications internes, chacune accessible via son propre port :

| Application | Description | Port |
|-------------|-------------|------|
| Tableau de bord | Statistiques et rapports | 80 |
| BeaverLaw5002 | Système de gestion juridique | 3000 |
| BeaverPatch | Gestion des mises à jour | 3003 |
| BeavernetCRM | Gestion des clients | 3002 |
| BeaverMonitor | Surveillance des systèmes | 3001 |
| BeaverDoc | Scanner de documents | 5000 |
| BeaverScanner | Scanner de plaques d'immatriculation | 4200 |
| PaymentNoir | Système de paiement sécurisé | 5173 |

Chaque application a sa propre icône et sa description affichées dans l'interface utilisateur.

## Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/votre-nom/beavernet.git
cd beavernet
```

2. Installer les dépendances :
```bash
npm install
```

3. Démarrer l'application en mode développement :
```bash
npm run dev
```

L'application sera accessible à l'adresse [http://localhost:5000](http://localhost:5000).

## Scripts disponibles

- `npm run dev` : démarre l'application en mode développement
- `npm run build` : compile l'application pour la production
- `npm run start` : démarre l'application en mode production
- `npm run check` : vérifie les types TypeScript
- `npm run db:push` : met à jour le schéma de la base de données (si configurée)

## Gestion des utilisateurs

### Utilisateurs par défaut

Le système est préconfiguré avec deux utilisateurs par défaut :

1. **Administrateur** :
   - Email : admin@beavernet.fr
   - Mot de passe : password
   - Nom : Jean Dupont

2. **Utilisateur test** :
   - Email : remiguillette@gmail.com
   - Mot de passe : password
   - Nom : Remi Guillette

### Ajouter de nouveaux utilisateurs

Pour ajouter de nouveaux utilisateurs, vous pouvez :

1. **Via l'API** : Envoyer une requête POST à `/api/register` avec le format suivant :
```json
{
  "username": "email@exemple.com",
  "password": "mot_de_passe",
  "displayName": "Nom Complet",
  "initials": "NC"
}
```

2. **Via le code** : Ajouter directement dans le fichier `server/storage.ts` en modifiant la méthode `constructor()` de la classe `MemStorage` :
```typescript
this.createUser({
  username: "nouveau@utilisateur.com",
  password: "mot_de_passe",
  displayName: "Nouveau Utilisateur",
  initials: "NU"
});
```

### Modifier les mots de passe

Pour modifier les mots de passe des utilisateurs existants, vous pouvez modifier directement dans le fichier `server/storage.ts`. 

**Note de sécurité** : Dans un environnement de production, il est recommandé d'implémenter un système de hachage des mots de passe avec bcrypt ou une technologie similaire.

## Déploiement

Le projet est configuré pour être déployé sur Replit. La configuration de déploiement se trouve dans le fichier `.replit` :

```
[deployment]
deploymentTarget = "autoscale"
build = ["npm", "run", "build"]
run = ["npm", "run", "start"]
```

## Contribuer

1. Forker le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Commiter vos changements (`git commit -m 'Ajout d'une fonctionnalité incroyable'`)
4. Pousser vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.