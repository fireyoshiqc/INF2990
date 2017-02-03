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
    3.2 - Communication avec d'autres clients connectés sur le chat

//// INSTRUCTIONS ////

0 - SCRIPT D'AUTOMATISATION NPM INSTALL
    0.1 - À partir de la racine du projet : sh npminstall.sh (ne fonctionne pas sur Windows)

1- VÉRIFICATION DU CODE AVEC TSLINT
    1.1 - À partir des répertoires /server ou /client des trois modules : npm run lint

2 - SUDOKU *** À noter que le serveur doit être sur localhost:3002 (par défaut) ***
    2.1 - Des tests sont disponibles sur le client et le serveur : npm test
    2.2 - client : npm start | serveur : npm start
    2.3 - Il est possible de jouer avec les boutons dans la barre du haut.

3 - CURLING *** À noter que le serveur doit être sur localhost:3002 (par défaut) ***
    3.1 - Des tests sont disponibles sur le client : npm test
    3.2 - client : npm start

4 - SCRABBLE *** À noter que le serveur doit être sur localhost:3000 (par défaut) ***
    4.1 - Des tests sont disponibles sur le client et sur le serveur: npm test
    4.2 - serveur : npm start
    4.3 - client(s) : npm start (pour autant de clients que vous voulez)
    4.4 - Il est possible de clavarder (les clients ont un identifiant unique socket.id).
