# Guide d'utilisation des sous-applications Beavernet

Ce document fournit les instructions pour installer et démarrer les sous-applications de l'intranet Beavernet.

## Applications disponibles

Le dossier `projet` contient les sous-applications suivantes :

- BeaverLaw5002
- BeaverMonitor
- BeavernetCRM
- BeaverPatch
- BeaverScanner
- BeaverTracker
- PaymentNoir

## Instructions d'installation

Pour installer une application spécifique, suivez ces étapes :

```bash
# Remplacez NOM_APP par le nom de l'application
cd projet/NOM_APP
npm install
```

## Instructions de démarrage

Pour démarrer une application après l'installation :

```bash
# Remplacez NOM_APP par le nom de l'application
cd projet/NOM_APP
npm start
```

## Exemples

### Installation et démarrage de BeaverLaw5002

```bash
cd projet/BeaverLaw5002
npm install
npm start
```

### Installation et démarrage de BeaverMonitor

```bash
cd projet/BeaverMonitor
npm install
npm start
```

## Création d'un script shell (à faire manuellement)

Pour automatiser ce processus, vous pouvez créer un script shell comme suit :

1. Créez un fichier `start_beavernet_apps.sh` :

```bash
#!/bin/bash

# Couleurs pour le terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
ORANGE='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${ORANGE}=== Démarrage des applications Beavernet ===${NC}"
echo -e "${BLUE}Ce script va installer et lancer toutes les sous-applications du dossier 'projet'${NC}"

# Créer le dossier de logs s'il n'existe pas
mkdir -p ./logs

# Fonction pour traiter chaque application
install_and_start_app() {
    local app_dir="$1"
    local app_name=$(basename "$app_dir")
    local log_file="./logs/${app_name}.log"
    
    echo -e "\n${YELLOW}===== Traitement de $app_name =====${NC}"
    
    # Vérifier si le dossier existe
    if [ ! -d "$app_dir" ]; then
        echo -e "${RED}[ERREUR] Le dossier $app_dir n'existe pas${NC}"
        return 1
    fi
    
    # Se déplacer dans le dossier de l'application
    cd "$app_dir" || return 1
    
    # Vérifier si package.json existe
    if [ ! -f "package.json" ]; then
        echo -e "${RED}[ERREUR] Fichier package.json non trouvé dans $app_dir${NC}"
        cd - > /dev/null
        return 1
    fi
    
    # Installer les dépendances
    echo -e "${GREEN}[INFO] Installation des dépendances pour $app_name...${NC}"
    npm install > "$log_file" 2>&1
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}[ERREUR] Problème lors de l'installation des dépendances pour $app_name${NC}"
        echo -e "${BLUE}Consultez le fichier $log_file pour plus de détails${NC}"
        cd - > /dev/null
        return 1
    fi
    
    # Démarrer l'application en arrière-plan
    echo -e "${GREEN}[INFO] Démarrage de $app_name...${NC}"
    npm start >> "$log_file" 2>&1 &
    
    # Sauvegarder le PID
    echo $! > "../logs/${app_name}.pid"
    echo -e "${GREEN}[SUCCÈS] Application $app_name démarrée (PID: $!)${NC}"
    
    # Revenir au dossier parent
    cd - > /dev/null
    
    # Ajouter un délai entre le démarrage des applications pour éviter les conflits
    sleep 2
}

# Démarrer toutes les applications dans le dossier "projet"
for app_dir in projet/*/; do
    # Ignorer si ce n'est pas un dossier
    if [ ! -d "$app_dir" ]; then
        continue
    fi
    
    # Traiter chaque application
    install_and_start_app "$app_dir"
done

echo -e "\n${GREEN}===== Toutes les applications ont été traitées =====${NC}"
echo -e "${BLUE}Consultez les fichiers de log dans le dossier ./logs pour plus de détails${NC}"

# Fonction pour arrêter toutes les applications
stop_all_apps() {
    echo -e "\n${YELLOW}Arrêt de toutes les applications...${NC}"
    
    for pid_file in ./logs/*.pid; do
        if [ -f "$pid_file" ]; then
            local pid=$(cat "$pid_file")
            local app_name=$(basename "$pid_file" .pid)
            
            if ps -p "$pid" > /dev/null; then
                kill "$pid"
                echo -e "${GREEN}Application $app_name arrêtée (PID: $pid)${NC}"
            else
                echo -e "${ORANGE}L'application $app_name (PID: $pid) n'est pas en cours d'exécution${NC}"
            fi
            
            rm "$pid_file"
        fi
    done
    
    echo -e "${GREEN}Toutes les applications ont été arrêtées${NC}"
}

# Ajouter un trap pour capturer Ctrl+C
trap 'stop_all_apps; exit 0' INT

echo -e "\n${BLUE}Appuyez sur Ctrl+C pour arrêter toutes les applications${NC}"
echo -e "${BLUE}Les applications tournent maintenant en arrière-plan${NC}"

# Garder le script en vie
while true; do
    sleep 60
done
```

2. Rendez le script exécutable :

```bash
chmod +x start_beavernet_apps.sh
```

3. Exécutez le script :

```bash
./start_beavernet_apps.sh
```

## Notes importantes

- Les ports utilisés par les différentes applications peuvent entrer en conflit. Assurez-vous que chaque application utilise un port unique.
- Les logs sont stockés dans le dossier `logs` pour faciliter le débogage.
- Pour arrêter toutes les applications démarrées par le script, appuyez sur Ctrl+C.