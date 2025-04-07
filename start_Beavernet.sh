#!/bin/bash

# Couleurs pour le terminal (optionnel)
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Nom du dossier de l'application principale
MAIN_APP_DIR="IntranetBooster"

# Vérifier si le dossier de l'application existe
if [ ! -d "$MAIN_APP_DIR" ]; then
  echo -e "${RED}[ERREUR] Le dossier '$MAIN_APP_DIR' n'existe pas dans le répertoire courant.${NC}"
  exit 1
fi

# Se déplacer dans le dossier de l'application principale
cd "$MAIN_APP_DIR" || {
  echo -e "${RED}[ERREUR] Impossible de se déplacer vers le dossier '$MAIN_APP_DIR'.${NC}"
  exit 1
}

# Vérifier si package.json existe
if [ ! -f "package.json" ]; then
  echo -e "${RED}[ERREUR] Fichier package.json non trouvé dans '$MAIN_APP_DIR'. Assurez-vous d'être dans le bon dossier.${NC}"
  cd - > /dev/null # Retour au répertoire précédent
  exit 1
fi

# Lancer l'application principale en arrière-plan
echo -e "${GREEN}[INFO] Démarrage de l'application principale '$MAIN_APP_DIR' avec 'npm start' en arrière-plan...${NC}"
npm start &

# Récupérer le PID du processus démarré
MAIN_APP_PID=$!
echo -e "${GREEN}[SUCCÈS] Application principale '$MAIN_APP_DIR' démarrée (PID: $MAIN_APP_PID).${NC}"

# Revenir au répertoire parent (optionnel)
cd - > /dev/null

echo -e "${GREEN}[INFO] L'application principale '$MAIN_APP_DIR' tourne en arrière-plan.${NC}"
echo -e "${BLUE}Vous pouvez vérifier son statut avec des outils comme 'ps aux | grep $MAIN_APP_PID' ou 'npm logs'.${NC}"

# Garder le script en vie (optionnel, dépend de vos besoins)
# Si vous voulez que le script continue de s'exécuter (par exemple, pour la journalisation),
# vous pouvez ajouter une boucle ici. Sinon, il se terminera après avoir lancé l'application.
# while true; do
#   sleep 60
# done