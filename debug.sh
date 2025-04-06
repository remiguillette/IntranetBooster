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

for dossier in "${dossiers[@]}"; do
  echo "Dossier trouvé dans le tableau : $dossier"
done

echo "Fin de la vérification du tableau."