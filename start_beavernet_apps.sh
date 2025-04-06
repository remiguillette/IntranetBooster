#!/bin/bash

# Couleurs pour le terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
ORANGE='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${ORANGE}=== Démarrage des applications Beavernet ===${NC}"
echo -e "${BLUE}Ce script va démarrer toutes les sous-applications du dossier 'projet'${NC}"

# Fonction pour démarrer une application
start_app() {
    local app_dir="$1"
    local app_name=$(basename "$app_dir")

    echo -e "\n${YELLOW}===== Démarrage de $app_name =====${NC}"

    # Se déplacer dans le dossier de l'application
    cd "$app_dir" || return 1

    # Vérifier si package.json existe
    if [ ! -f "package.json" ]; then
        echo -e "${RED}[ERREUR] Fichier package.json non trouvé dans $app_dir${NC}"
        cd - > /dev/null
        return 1
    fi

    # Démarrer l'application en arrière-plan
    echo -e "${GREEN}[INFO] Démarrage de $app_name...${NC}"
    npm start &

    # Sauvegarder le PID
    local pid=$!
    echo -e "${GREEN}[SUCCÈS] Application $app_name démarrée (PID: $pid)${NC}"

    # Revenir au dossier parent
    cd - > /dev/null

    # Ajouter un délai entre le démarrage des applications
    sleep 2
}

# Démarrer toutes les applications dans le dossier "projet"
for app_dir in projet/*/; do
    # Ignorer si ce n'est pas un dossier
    if [ ! -d "$app_dir" ]; then
        continue
    fi

    # Démarrer l'application
    start_app "$app_dir"
done

echo -e "\n${GREEN}===== Toutes les applications ont été démarrées =====${NC}"

echo -e "\n${BLUE}Appuyez sur Ctrl+C pour terminer le script${NC}"
echo -e "${BLUE}Les applications tournent maintenant en arrière-plan${NC}"

# Garder le script en vie
while true; do
    sleep 60
done