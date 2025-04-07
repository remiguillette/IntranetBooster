#!/bin/bash

# Couleurs pour le terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
ORANGE='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${ORANGE}=== Installation et Build des applications Beavernet ===${NC}"
echo -e "${BLUE}Ce script va effectuer 'npm install' et 'npm run build' pour toutes les sous-applications du dossier 'projet'${NC}"

# Fonction pour installer les dépendances et builder une application
process_app() {
    local app_dir="$1"
    local app_name=$(basename "$app_dir")

    echo -e "\n${YELLOW}===== Traitement de $app_name =====${NC}"

    # Se déplacer dans le dossier de l'application
    cd "$app_dir" || return 1

    # Vérifier si package.json existe
    if [ ! -f "package.json" ]; then
        echo -e "${RED}[ERREUR] Fichier package.json non trouvé dans $app_dir${NC}"
        cd - > /dev/null
        return 1
    fi

    # Installation des dépendances
    echo -e "${GREEN}[INFO] Installation des dépendances pour $app_name...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}[ERREUR] L'installation des dépendances pour $app_name a échoué.${NC}"
        cd - > /dev/null
        return 1
    fi
    echo -e "${GREEN}[SUCCÈS] Dépendances pour $app_name installées.${NC}"

    # Lancement du build
    echo -e "${GREEN}[INFO] Lancement du build pour $app_name...${NC}"
    npm run build
    if [ $? -ne 0 ]; then
        echo -e "${RED}[ERREUR] Le build pour $app_name a échoué.${NC}"
        cd - > /dev/null
        return 1
    fi
    echo -e "${GREEN}[SUCCÈS] Build pour $app_name terminé.${NC}"

    # Revenir au dossier parent
    cd - > /dev/null

    # Ajouter un délai entre le traitement des applications
    sleep 2
}

# Traiter toutes les applications dans le dossier "projet"
for app_dir in projet/*/; do
    # Ignorer si ce n'est pas un dossier
    if [ ! -d "$app_dir" ]; then
        continue
    fi

    # Traiter l'application
    process_app "$app_dir"
done

echo -e "\n${GREEN}===== Installation et build terminés pour toutes les applications =====${NC}"

echo -e "\n${BLUE}Vous pouvez maintenant déployer les builds situés dans les dossiers 'dist' (ou autre dossier de build spécifié dans chaque projet).${NC}"