# BEAVERLAW

Système de gestion pour les services de la faune de la police française, permettant le suivi des animaux et l'application des règlements.

## Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
  - [Prérequis](#prérequis)
  - [Cloner le projet](#cloner-le-projet)
  - [Installation des dépendances](#installation-des-dépendances)
  - [Configuration de la base de données MongoDB](#configuration-de-la-base-de-données-mongodb)
  - [Démarrage de l'application](#démarrage-de-lapplication)
- [Structure du projet](#structure-du-projet)
- [Connexion à MongoDB](#connexion-à-mongodb)
  - [Configuration locale](#configuration-locale)
  - [Configuration en production](#configuration-en-production)
- [Licence](#licence)

## Aperçu

BEAVERLAW est une application web de gestion des services de la faune pour les autorités françaises. Le système permet le suivi des animaux, la gestion des avis de recherche, le signalement des animaux perdus/trouvés et l'application des règlements relatifs à la faune.

## Fonctionnalités

- **Tableau de bord** : Vue d'ensemble avec statistiques et activités récentes
- **Gestion des agents** : Ajout et suivi des agents de la faune
- **Gestion des animaux** : Enregistrement et suivi des animaux sous surveillance
- **Animaux perdus/trouvés** : Localisation sur carte et gestion des signalements
- **Avis de recherche** : Publication et suivi des avis de recherche d'animaux
- **Application des règlements** : Suivi des infractions et amendes

## Installation

### Prérequis

- Node.js (v18 ou plus récent)
- npm (v9 ou plus récent)
- Git
- MongoDB (local ou service cloud comme MongoDB Atlas)

### Cloner le projet

```bash
# Cloner le dépôt
git clone https://github.com/votre-utilisateur/beaverlaw.git

# Naviguer dans le dossier du projet
cd beaverlaw
```

### Installation des dépendances

```bash
# Installer les dépendances
npm install
```

### Configuration de la base de données MongoDB

1. Créez un fichier `.env` à la racine du projet avec les informations de connexion à MongoDB:

```
MONGODB_URI=mongodb://username:password@host:port/beaverlaw
```

Pour MongoDB local:
```
MONGODB_URI=mongodb://localhost:27017/beaverlaw
```

Pour MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/beaverlaw
```

### Démarrage de l'application

```bash
# Démarrer l'application en mode développement
npm run dev
```

L'application sera accessible à l'adresse: `http://localhost:5000`

## Structure du projet

```
beaverlaw/
├── client/               # Frontend React
│   ├── src/
│   │   ├── components/   # Composants UI réutilisables
│   │   ├── lib/          # Utilitaires et fonctions partagées
│   │   ├── pages/        # Pages de l'application
│   │   ├── hooks/        # React hooks personnalisés
│   │   └── App.tsx       # Composant racine de l'application
├── server/               # Backend Express
│   ├── index.ts          # Point d'entrée du serveur
│   ├── routes.ts         # Définition des routes API
│   ├── storage.ts        # Interface de stockage
│   └── vite.ts           # Configuration Vite
├── shared/               # Code partagé entre client et serveur
│   └── schema.ts         # Schémas de données et types
├── public/               # Fichiers statiques
└── README.md             # Documentation du projet
```

## Connexion à MongoDB

### Configuration locale

Pour connecter l'application à MongoDB en développement local:

1. Installez MongoDB localement ou utilisez MongoDB Atlas
2. Modifiez le fichier `.env` pour inclure votre URI MongoDB
3. Modifiez le fichier `server/storage.ts` pour remplacer MemStorage par MongoStorage:

```typescript
// Exemple de modification pour utiliser MongoDB au lieu de la mémoire
// Dans server/storage.ts

import { MongoClient } from 'mongodb';

export class MongoStorage implements IStorage {
  private client: MongoClient;
  private db: any;

  constructor() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/beaverlaw';
    this.client = new MongoClient(uri);
    this.connect();
  }

  private async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db();
      console.log('Connected to MongoDB successfully');
    } catch (error) {
      console.error('Failed to connect to MongoDB', error);
    }
  }

  // Implémentez toutes les méthodes de IStorage ici...
  // Par exemple:
  async getUser(id: number): Promise<User | undefined> {
    return this.db.collection('users').findOne({ id });
  }
  
  // ... autres méthodes
}

// Remplacez la ligne suivante:
// export const storage = new MemStorage();
// Par:
export const storage = new MongoStorage();
```

4. Installez le package MongoDB:

```bash
npm install mongodb
```

### Configuration en production

Pour un environnement de production, nous recommandons d'utiliser MongoDB Atlas:

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un cluster et obtenez votre chaîne de connexion
3. Ajoutez les variables d'environnement sur votre plateforme d'hébergement
4. Assurez-vous que le code utilise la configuration de MongoDB en production

## Licence

Ce projet est protégé par droits d'auteur. Tous droits réservés.