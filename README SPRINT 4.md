SPRINT 4
LIVRABLE DU MERCREDI 19 AVRIL 2017
ÉQUIPE 24 - FACTORY/24

//// NOUVELLES FONCTIONNALITÉS ////

1 - SUDOKU
    1.1 - Affichage des meilleurs temps par un bouton dans le menu du jeu (sidenav)
    1.2 - Modifications mineures à l'interface utilisateur

2 - CURLING
    2.1 - Implémentation d'un ordinateur normal et difficile
    	  2.1.1 - En mode normal : Il rate son coup 1 fois sur 3. Il vise entre la hogline et la backline 2 fois sur 3.
    	  2.1.2 - En mode difficile : Il vise le bouton. Il vise la pierre du joueur adverse la plus proche du bouton (dans la maison). 
                Il modifie sa trajectoire en considérant les pierres comme obstacles.
    2.2 - Modifications mineures à l'interface utilisateur
    2.3 - Sauvegarde de pointages du joueur dans une base de données lorsqu'il gagne une partie
    2.4 - Gestion des abandons en cours de partie
    2.5 - Gestion de fin de parties (animation, message)

3 - SCRABBLE
    3.1 - Communication avec le serveur (pour les commandes de jeu)
          3.1.1 - Aide (accessible et fonctionnelle)
    3.2 - Embelissement de l'interface utilisateur (page d'accueil, salle d'attente, salle de jeu)
    3.3 - Gestion de l'alternance entre les panneaux actifs
    3.4 - Gestion des abandons en cours de partie
    3.5 - Gestion de fin de partie (message, comportement du UI)

//// INSTRUCTIONS ////

0 - SCRIPT D'AUTOMATISATION NPM INSTALL
    0.1 - À partir de la racine du projet : sh npminstall.sh (ne fonctionne pas sur Windows à moins d'avoir Bash/Cygwin)

1 - VÉRIFICATION DU CODE AVEC TSLINT
    1.1 - À partir des répertoires /server ou /client des trois modules : npm run lint

2 - TESTS
    2.1 - Des tests sont disponibles sur le client et le serveur des trois modules : num test

3 - SUDOKU *** À noter que le serveur doit être sur localhost:3002 (par défaut) ***
    3.1 - OUVERTURE
          client : npm start | serveur : npm start

    3.2 - VISITE SUR LE SITE
          3.2.1 - Il est possible de demander une grille facile ou difficile. Vous pouvez faire une partie complète. Bon jeu !
          3.2.2 - En cas de meilleurs temps, votre temps est sauvegardé dans la base de données.
          3.2.3 - ASTUCES
                  À tout moment, il est possible de charger un nouveau Sudoku depuis le "sidenav".
                  À tout moment, il est possible d'ouvrir les meilleurs scores depuis le "sidenav".
                  Pour ouvrir le "sidenav", cliquez sur les trois lignes horizontales en haut à gauche.
                  Faire disparaître le tableau de highscores : cliquer à côté du pop-up.

    3.3 - ACCÈS À LA BASE DE DONNÉES
          Il est possible de voir le contenu de la base de données en se connectant avec les informations qui suivent :  
          3.3.1 - URL : mlab.com, Username : factory24, Password : sudokuDB24 (À MODIFIER)
    
    3.4 - VOIR LE LOG SERVEUR
          Le log de serveur est affiché de façon statique donc il faut refresh la page pour voir les nouvelles actions.
          3.4.1 - URL : localhost:3002/api/log
          3.4.2 - Le IP "1" lors d'une demande correspond à localhost     

4 - CURLING *** À noter que le serveur doit être sur localhost:3001 (par défaut) ***
    4.1 - OUVERTURE
          client : npm start | serveur : npm start

    4.2 - VISITE SUR LE SITE
          4.2.1 - Vous jouez en tant que le joueur principal contre l'ordinateur. Il est possible de choisir deux difficultés : normale ou difficile.
                  Il est possible de finir une partie et de l'abandonner. Bonne chance !
          4.2.2 - En cas de victoire (!= manche nulle), votre score est sauvegardé dans la base de données.
          4.2.3 - ASTUCES
                  À tout moment, il est possible de changer la vue de la caméra (flèches <-/-> ou bouton)
                  À tout moment, il est possible d'ouvrir les meilleurs scores depuis le "sidenav".
                  Pour ouvrir le "sidenav", cliquez sur les trois lignes horizontales en haut à gauche.
                  Faire disparaître le tableau de highscores : cliquer à côté du pop-up.
    
    4.3 - COMMENT LANCER UNE PIERRE ?
          4.3.1 - Sélectionner la direction du spin : Bouton slider ou touches (A/D) + Bouton pour confirmer (ligne direction apparaît).
          4.3.2 - Sélectionner l'angle : Déplacer la souris et cliquer pour confirmer l'angle.
          4.3.3 - Sélectionner la force : Cliquer une deuxième fois et garder enfoncé. Relâcher pour confirmer la force (la pierre est lancée).
    
    4.4 - ACCÈS À LA BASE DE DONNÉES
          Il est possible de voir le contenu de la base de données en se connectant avec les informations qui suivent :  
          4.1.1 - URL : mlab.com, Username : factory24, Password : sudokuDB24 (À MODIFIER)

5 - SCRABBLE *** À noter que le serveur doit être sur localhost:3000 (par défaut) ***
    5.1 - OUVERTURE
          serveur : npm start
          client(s) : npm start (pour autant de clients que vous voulez) ou connectez-vous au serveur dédié avec localhost:3000

    5.2 - VISITE SUR LE SITE
          5.2.1 - Entrer votre nom et sélectionner la capacité de la salle de jeu. Les joueurs se joigneront automatiquement à vous.
          5.2.2 - Dans une salle de jeu, il est possible de jouer et d'effectuer toutes les commandes du jeu.
                  Il est possible de finir une partie et de l'abandonner. Bon jeu !
          5.2.3 - ASTUCES
                  À tout moment, il est possible de consulter les commandes de jeu (taper !aide dans le chat).
                  À tout moment, il est possible de manipuler les lettres sur le chevalet. Il suffit de peser sur "TAB" et de bouger les lettres dans le chevalet.
                  En survolant votre curseur sur une lettre blanche sur le plateau de jeu, un "tooltip" indique la lettre jouée pour le "joker".
