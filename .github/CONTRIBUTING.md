# Contribuer à Beavernet

Nous sommes ravis que vous envisagiez de contribuer à Beavernet ! Ce document contient des directives pour contribuer au projet.

## Processus de contribution

1. Forker le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Commiter vos changements (`git commit -m 'Ajout d'une fonctionnalité incroyable'`)
4. Pousser vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## Conventions de code

### Style de code
- Utilisez les fonctions fléchées pour les composants React
- Suivez les principes ESLint et Prettier configurés dans le projet
- Utilisez TypeScript pour tous les nouveaux fichiers
- Nommez les fichiers en kebab-case (ex: `my-component.tsx`)

### Conventions de commit
- Utilisez des messages de commit clairs et descriptifs
- Commencez le message par un verbe à l'impératif (ex: "Ajouter", "Corriger", "Mettre à jour")
- Référencez les numéros d'issues quand c'est pertinent

### Structure des composants
- Utilisez les composants Shadcn/UI lorsque c'est possible
- Créez des composants réutilisables dans le dossier `components`
- Les pages complètes doivent être dans le dossier `pages`

## Tests
- Écrivez des tests pour les nouveaux composants et fonctionnalités
- Assurez-vous que tous les tests passent avant de soumettre une PR

## Documentation
- Mettez à jour la documentation lorsque vous ajoutez ou modifiez des fonctionnalités
- Commentez le code complexe pour expliquer son fonctionnement

## Rapporter des bugs
Veuillez utiliser le modèle de rapport de bug pour signaler tout problème rencontré.