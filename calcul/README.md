# Scripts de calcul

Les chiffres du site viennent de ces quatre scripts Python (numpy, scipy, pandas, pvlib).

| Script | Ce qu'il calcule |
| --- | --- |
| `bilan_thermique.py` | Flux solaires absorbés par couche, température du lenticulaire en sandwich (A) et avec lames d'air ventilées (B), tirage naturel |
| `soleil_site.py` | Soleil reçu par chaque face de la vitre à Lombardsijde (51,17357° N, 2,78028° E), vitre parallèle à la digue |
| `journee.py` | Profil heure par heure d'une journée de canicule et part des UV dans le spectre solaire |
| `rosee_humidite.py` | Point de rosée, refroidissement nocturne du verre, eau dans le PMMA, perméation des joints, dessiccant |

Ordre d'exécution : `soleil_site.py` (écrit `jour_juillet.pkl`), puis `journee.py` (écrit `day.json`, repris dans `assets/app.js`).

Modèle en régime établi. Précision estimée : ± 3 K.
