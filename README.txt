PWA — COLLÈGE ACTIF, AVENIR POSITIF
Version maquette validée — septembre 2026

CONTENU
- index.html : page unique de la PWA
- styles.css : mise en forme responsive
- app.js : navigation, rubriques, favoris et idées
- resources.js : contenus issus des 44 pages du Padlet
- assets/ : photographies d’illustration
- logo-caap.png : logo du dispositif
- Padlet-source-integrale.pdf : archive source intégrale
- manifest.webmanifest + sw.js : installation PWA / fonctionnement hors ligne
- google-apps-script.gs : connexion optionnelle à un dossier Google Drive
- config.js : configuration du flux distant

MISE EN LIGNE GITHUB PAGES
1. Décompresser le ZIP.
2. Déposer tout le contenu du dossier caap_pwa à la racine du dépôt GitHub.
3. GitHub > Settings > Pages > Deploy from a branch > main / root.
4. Attendre la publication puis ouvrir l’URL fournie par GitHub Pages.

MISE À JOUR DES DOCUMENTS
Le fichier google-apps-script.gs permet de publier un flux JSON depuis Google Drive. Une fois l’URL du Web App inscrite dans config.js, les nouveaux documents peuvent être chargés automatiquement sans modifier l’interface.

MISE À JOUR DES PHOTOS
----------------------
Les photos de l'accueil et de la page Ressources sont modifiables sans toucher à l'application.
Voir GUIDE-PHOTOS.txt. Le fichier photos.js permet aussi de changer les chemins des images.
Le bandeau d'accueil utilise assets/hero-home.png à ses proportions naturelles, sans recadrage ni agrandissement.
