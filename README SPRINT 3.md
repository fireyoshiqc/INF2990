SPRINT 3
LIVRABLE DU VENDREDI 25 MARS 2017
ÉQUIPE 24 - FACTORY/24

//// NOUVELLES FONCTIONNALITÉS ////

1 - SUDOKU
    1.1 - 

2 - CURLING
    2.1 - 

3 - SCRABBLE
    3.1 - Communication avec le serveur (pour les commandes de jeu)
        3.1.1 - Placement des mots
        3.1.2 - Changer des lettres
        3.1.3 - Passer son tour
        3.1.4 - Aide (accessible, mais vide)
    3.2 - Gestion des tours de jeu
    3.3 - Validation des mots (dictionnaire, placement considérant l'état du jeu)
    3.4 - Gestion de la réserve de lettres
    3.5 - Limitation d'un tour de jeu
    3.6 - Manipulation des lettres sur le chevalet
    3.7 - Messages d'erreur significatifs avec les commandes

//// INSTRUCTIONS ////

0 - SCRIPT D'AUTOMATISATION NPM INSTALL
    0.1 - À partir de la racine du projet : sh npminstall.sh (ne fonctionne pas sur Windows)

1- VÉRIFICATION DU CODE AVEC TSLINT
    1.1 - À partir des répertoires /server ou /client des trois modules : npm run lint

2 - SUDOKU *** À noter que le serveur doit être sur localhost:3002 (par défaut) ***
    2.1 - Des tests sont disponibles sur le client et le serveur : npm test
    2.2 - client : npm start | serveur : npm start
    2.3 - Il est possible de demander une grille facile ou difficile. Vous pouvez faire une partie complète.

3 - CURLING *** À noter que le serveur doit être sur localhost:3002 (par défaut) ***
    3.1 - Des tests sont disponibles sur le client : npm test
    3.2 - client : npm start
    3.3 - Vous jouez en tant que le joueur principal et l'AI (non implémenté). 
          Le déroulement de la partie (lancer, balayage, score) est implémenté. 
          La fin de partie n'est pas implémentée encore.
          L'abandon n'est pas pris en compte.

4 - SCRABBLE *** À noter que le serveur doit être sur localhost:3000 (par défaut) ***
    4.1 - Des tests sont disponibles sur le client et sur le serveur: npm test
    4.2 - serveur : npm start
    4.3 - client(s) : npm start (pour autant de clients que vous voulez)
    4.4 - Dans une salle de jeu, il est possible de jouer et d'effectuer toutes les commandes du jeu.
          Le déroulement de la partie (commandes, tours, réserve) est implémenté.
          Pour manipuler les lettres sur le chevalet, il faut cliquer sur l'input de la boîte de communication et peser sur TAB. Puis, peser les lettres que vous voulez manipuler.
          La fin de partie n'est pas implémentée encore.
          L'abandon n'est pas pris en compte.
