#!/bin/bash

# Couleurs pour le terminal (optionnel)
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Nom des scripts à exécuter
SCRIPT1="./start_Beavernet.sh"
SCRIPT2="./start_beavernet_apps.sh"

# Vérifier si le premier script existe et est exécutable
if [ -f "$SCRIPT1" ] && [ -x "$SCRIPT1" ]; then
  echo -e "${GREEN}[INFO] Exécution de $SCRIPT1...${NC}"
  "$SCRIPT1" &
  PID1=$!
  echo -e "${GREEN}[SUCCÈS] $SCRIPT1 démarré en arrière-plan (PID: $PID1).${NC}"
else
  echo -e "${RED}[ERREUR] Le script $SCRIPT1 n'existe pas ou n'est pas exécutable.${NC}"
fi

# Vérifier si le deuxième script existe et est exécutable
if [ -f "$SCRIPT2" ] && [ -x "$SCRIPT2" ]; then
  echo -e "${GREEN}[INFO] Exécution de $SCRIPT2...${NC}"
  "$SCRIPT2" &
  PID2=$!
  echo -e "${GREEN}[SUCCÈS] $SCRIPT2 démarré en arrière-plan (PID: $PID2).${NC}"
else
  echo -e "${RED}[ERREUR] Le script $SCRIPT2 n'existe pas ou n'est pas exécutable.${NC}"
fi

echo -e "${GREEN}[INFO] Les scripts ont été lancés en arrière-plan.${NC}"
if [ -n "$PID1" ]; then
  echo -e "${GREEN}[INFO] PID de $SCRIPT1: $PID1${NC}"
fi
if [ -n "$PID2" ]; then
  echo -e "${GREEN}[INFO] PID de $SCRIPT2: $PID2${NC}"
fi
echo -e "${GREEN}Vous pouvez vérifier leur statut avec des outils comme 'ps aux | grep beavernet'.${NC}"

exit 0