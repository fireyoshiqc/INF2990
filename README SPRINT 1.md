SPRINT 1
LIVRABLE DU VENDREDI 3 FÉVRIER 2016
ÉQUIPE 24 - FACTORY/24

//// FEATURES ////

1 - SUDOKU
    1.1 - Affichage de l'interface utilisateur pour le sudoku sur le client (statique) avec certains boutons interactifs
    1.2 - Génération d'un sudoku valide et complet
    1.3 - Vérification d'un sudoku complet
    1.4 - Demande d'une grille de sudoku du serveur à partir du client

2 - CURLING
    2.1 - Affichage d'une skybox
    2.2 - Chargement des modèles sur la scène (pierre de curling, patinoire)
    2.3 - Implémentation de sources de lumière

3 - SCRABBLE
    3.1 - Affichage d'un chat
    3.2 - Interaction sur le chat avec d'autres clients connectés

//// INSTRUCTIONS ////

0 - SCRIPT D'AUTOMATISATION NPM INSTALL
    0.1 - À partir de la racine du projet : sh npminstall.sh (ne fonctionne pas sur Windows)

1 - SUDOKU
    1.1 - Des tests sont disponibles sur le client et le serveur : npm test
    1.2 - client : npm start | serveur : npm start
    1.3 - Il est possible de jouer avec les boutons dans la barre du haut.

2 - CURLING
    2.1 - Des tests sont disponibles sur le client : npm test
    2.2 - client : npm start

3 - SCRABBLE
    3.1 - serveur : npm start
    3.2 - client(s) : npm start (pour autant de clients que vous voulez)
    3.3 - Il est possible de clavarder (les clients ont un identifiant socket.id).
