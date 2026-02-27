Jeu de type Skyjo complet en un seul fichier index.html autonome (HTML5 + CSS + JavaScript) jouable sur PC et smartphone

1.Implémenter toutes les règles officielles de Skyjo : 150 cartes (-2 à 12), distribution de 12 cartes par joueur (grille 3x4), pioche/défausse, retournement de cartes, élimination de colonnes identiques, calcul des scores, fin de manche et fin de partie (100 points)
2.Multijoueur en temps réel via PeerJS (WebRTC peer-to-peer, pas besoin de serveur) - jusqu'à 8 joueurs
3.Système de lobby : création de partie par l'hôte, génération d'un QR code pour rejoindre (via bibliothèque qrcode.js en CDN), affichage des joueurs connectés
4.UI minimaliste et responsive optimisée pour navigateur mobile Android/ios : cartes visuelles avec couleurs selon valeur, animations simples, interface tactile
5.Le fichier sera directement hébergeable sans aucune dépendance locale
---------------------------

améliorations apportées (voir les issues des versions) 
Celles à venir (minifier code) : 

- mettre plus en avant le joueur lorsque c’est son tour
- s'il reste dernière carte à retourner, annoncer les points faits avant retournement définitif
- choisir les cartes d'origine (UI)
- ajouter des animations de cartes
- ajouter des sons 
- reconnexion automatique si mise en veille ou perte de réseau ou rechargement de page (fenetre contextuelle : recharger et revenir au début ou reprendre)
- Tableau des scores persistant
- autres modes de jeu (changer les cartes, IA, time attack, help retour en arriere)
