#!/bin/bash

declare -a dossiers=(
  "BeaverLaw5002"
  "BeaverMonitor"
  "BeavernetCRM"
  "BeaverPatch"
  "BeaverScanner"
  "BeaverTracker"
  "PaymentNoir"
)

initial_dir="$PWD"

echo "-----------------------------------------"
echo "Étape 1: Installation des dépendances (npm install) dans tous les dossiers"
echo "-----------------------------------------"

for dossier_name in "${dossiers[@]}"; do
  app_dir="$initial_dir/projet/$dossier_name"
  echo "Traitement de l'installation pour : $dossier_name"
  if [ -d "$app_dir" ]; then
    cd "$app_dir" || continue
    echo "Exécution de npm install dans $dossier_name..."
    npm install
    if [ $? -ne 0 ]; then
      echo "Erreur: npm install a échoué dans $dossier_name"
    fi
    cd "$initial_dir"
  else
    echo "Avertissement: Le dossier $dossier_name n'existe pas."
  fi
done

echo "-----------------------------------------"
echo "Étape 2: Construction des projets (npm run build) dans tous les dossiers"
echo "-----------------------------------------"

for dossier_name in "${dossiers[@]}"; do
  app_dir="$initial_dir/projet/$dossier_name"
  echo "Traitement de la construction pour : $dossier_name"
  if [ -d "$app_dir" ]; then
    cd "$app_dir" || continue
    echo "Exécution de npm run build dans $dossier_name..."
    npm run build
    if [ $? -ne 0 ]; then
      echo "Erreur: npm run build a échoué dans $dossier_name"
    fi
    cd "$initial_dir"
  else
    echo "Avertissement: Le dossier $dossier_name n'existe pas."
  fi
done

echo "-----------------------------------------"
echo "Installation et construction terminées."
echo "-----------------------------------------"

# Étape 3 (Optionnelle): Démarrage de toutes les applications
echo -e "\n${YELLOW}Option: Démarrage de toutes les applications (en arrière-plan)${NC}"
echo -e "${BLUE}Consultez les logs dans chaque dossier pour vérifier le démarrage.${NC}"

for dossier_name in "${dossiers[@]}"; do
  app_dir="$initial_dir/projet/$dossier_name"
  if [ -d "$app_dir" ]; then
    cd "$app_dir" || continue
    echo "Démarrage de $dossier_name en arrière-plan..."
    npm start &
    cd "$initial_dir"
  fi
done

echo -e "\n${GREEN}Toutes les applications ont été lancées en arrière-plan.${NC}"
echo -e "${BLUE}Vous pouvez utiliser 'jobs' pour lister les processus en arrière-plan ou 'fg %<numero_job>' pour ramener une application au premier plan.${NC}"