SPRINT 2
LIVRABLE DU VENDREDI 24 FÉVRIER 2017
ÉQUIPE 24 - FACTORY/24

//// NOUVELLES FONCTIONNALITÉS ////

1 - SUDOKU
    1.1 - Ajout et suppression de numéro dans une case du Sudoku
    1.2 - Validation immédiate du numéro (et avertissement au joueur)
    1.3 - Service de génération de grilles par des promesses
    1.4 - Demande d'un sudoku selon le niveau de difficulté spécifié
    1.5 - Affichage d'un chronomètre (possibilité de le cacher)
    1.6 - Réinitialisation de la partie

2 - CURLING
    2.1 - Implémentation de la physique du jeu (spin, vitesse, friction)
    2.2 - Implémentation de la collision des pierres
    2.3 - Ajout de caméras sur la scène (vue orthogonale et vue en perspective)
    2.4 - Changement de la caméra en tout temps (touches et bouton)

3 - SCRABBLE
    3.1 - Validation du nom du joueur pour toute la session
    3.2 - Choix de parties (à 2, 3 ou 4 joueurs)
    3.3 - Jumelage automatique
    3.4 - Message d'attente pendant le jumelage automatique
    3.5 - Annulation d'une partie
    3.6 - Création de parties en parallèle
    3.7 - Développement d'une interface minimale (plateau de jeu, chevalet, boîte de communication, panneau informatif)

//// INSTRUCTIONS ////

0 - SCRIPT D'AUTOMATISATION NPM INSTALL
    0.1 - À partir de la racine du projet : sh npminstall.sh (ne fonctionne pas sur Windows)

1- VÉRIFICATION DU CODE AVEC TSLINT
    1.1 - À partir des répertoires /server ou /client des trois modules : npm run lint

2 - SUDOKU *** À noter que le serveur doit être sur localhost:3002 (par défaut) ***
    2.1 - Des tests sont disponibles sur le client et le serveur : npm test
    2.2 - client : npm start | serveur : npm start
    2.3 - Il est possible de demander une grille facile ou difficile. Vous pouvez jouer et faire valider votre grille.

3 - CURLING *** À noter que le serveur doit être sur localhost:3002 (par défaut) ***
    3.1 - Des tests sont disponibles sur le client : npm test
    3.2 - client : npm start
    3.3 - Il est possible de changer la caméra par les touches du clavier ou le bouton sur le HUD.

4 - SCRABBLE *** À noter que le serveur doit être sur localhost:3000 (par défaut) ***
    4.1 - Des tests sont disponibles sur le client et sur le serveur: npm test
    4.2 - serveur : npm start
    4.3 - client(s) : npm start (pour autant de clients que vous voulez)
    4.4 - Il est possible de choisir un nom unique et un type de partie. Dès le jumelage terminé, les clients seront redirigés vers la page de jeu.
    
    Pages du jeu : 
    localhost:xxxx/startPage (Page d'accueil. Le dialogue de la salle d'attente y est inclu)
    localhost:xxxx/game (Interface minimale de jeu avec un chat interactif)
