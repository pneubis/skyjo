# Skyjo Multijoueur - Plan de développement

## Design
- **Style**: Minimaliste, fond sombre, cartes colorées
- **Palette de couleurs**:
  - Fond: #1a1a2e (bleu nuit)
  - Cartes face cachée: #4a4a6a
  - Cartes négatives (-2,-1): #2ecc71 (vert)
  - Cartes zéro: #3498db (bleu)
  - Cartes faibles (1-4): #f1c40f (jaune)
  - Cartes moyennes (5-8): #e67e22 (orange)
  - Cartes hautes (9-12): #e74c3c (rouge)
  - Texte: #ffffff
  - Accent: #9b59b6 (violet)

## Architecture (1 seul fichier index.html)
- **index.html**: Contient tout (HTML + CSS inline + JS inline)
  - PeerJS via CDN pour WebRTC peer-to-peer
  - QRCode.js via CDN pour génération QR code
  - Écrans: Menu → Lobby → Jeu → Scores

## Règles Skyjo implémentées
- 150 cartes: 5x(-2), 10x(-1), 15x(0), 10x(1-12)
- 2-8 joueurs
- Distribution: 12 cartes par joueur en grille 3x4, toutes face cachée
- Début: chaque joueur retourne 2 cartes, celui avec la plus haute somme commence
- Tour: piocher (pioche ou défausse) puis placer ou défausser
- Si pioche depuis pioche: peut remplacer une carte OU défausser et retourner une face cachée
- Si pioche depuis défausse: DOIT remplacer une carte
- Colonne de 3 cartes identiques → éliminée (les 3 cartes vont à la défausse)
- Fin de manche: quand un joueur a toutes ses cartes visibles, un dernier tour pour les autres
- Score: si le joueur qui termine n'a pas le plus bas score, son score est doublé
- Fin de partie: quand un joueur atteint 100 points

## Fichiers
1. **index.html** - Fichier unique contenant tout le jeu
