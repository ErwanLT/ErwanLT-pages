---
layout: "default"
title: "Présentation de Postman Flows"
permalink: "/product/presentation-de-postman-flows/"
tags: [product]
date: "2023-09-01"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/product/presentation-postman-flows/"
banner: "https://www.sfeir.dev/content/images/2023/06/Capture-d-e-cran-2023-06-30-a--13.52.52.png"
published_at: "2023-09-01"
sfeir_slug: "presentation-postman-flows"
sfeir_tags: [Product]
---
## Qu'est-ce-que Postman ?

[Postman](https://www.postman.com/?ref=sfeir.dev) est un outil grandement utilisé par la plupart des développeurs pour faciliter le développement et les tests des API.

Dans les grandes lignes, Postman permet de :

- **Définir ses API** : Postman permet aux développeurs de concevoir, de développer et de documenter des API de manière efficace. Son interface permet de créer et de configurer facilement des requêtes HTTP, des en-têtes, des paramètres et des corps de requête.
- **Tester ses API** : Postman facilite également les tests des API. Les développeurs peuvent envoyer des requêtes HTTP aux API pour vérifier leur fonctionnement et leur comportement car il est [important de tester ce que l'on développe](/product/pourquoi-tester-son-code/).
- **Collaborer entre membres d'une même équipe** : Postman permet aux développeurs de collaborer efficacement sur des projets API. Ils peuvent partager des collections d'API avec leur équipe, commenter et annoter des requêtes spécifiques, et même travailler simultanément via la notion de workspace d'équipe.

Globalement Postman est un outil collaboratif visant à faciliter le développement et les tests liés aux API.

## Qu'est-ce-que Postman Flows ?

Postman Flows est une fonctionnalité plus ou moins récente de Postman (la première release étant sortie en novembre 2021) qui permet d'organiser les requêtes HTTP de vos collections en forme de workflow et de visualiser et manipuler le contenu de vos réponses afin de pouvoir consolider la sortie de vos flux.

Exemple de sortie de flux possible :

- un template en markdown avec des variables issues des vos réponses rendu directement dans un bloc.
- des graphiques / gauges
- des tableaux
- des données spécifiques extraites des réponses pour en faire des variables qui seront exploité par d'autres requêtes.
- ...

## Comment activer Postman Flows ?

Pour avoir accès à Postman Flows rien de très compliqué, depuis la barre latéral du client Postman ou de l'application web cliquer sur le bouton de configuration d'espace de travail

[![](https://www.sfeir.dev/content/images/2023/06/image-8.png)](https://www.sfeir.dev/content/images/2023/06/image-8.png)

bouton de configuration de workspace

de là vous n'avez plus qu'à activer Postman Flows en cliquant sur le bouton associé

[![](https://www.sfeir.dev/content/images/2023/06/image-11.png)](https://www.sfeir.dev/content/images/2023/06/image-11.png)

Configuration de la barre latérale

Normalement Flows sera ajouté en raccourci dans votre barre latérale

[![](https://www.sfeir.dev/content/images/2023/06/image-12.png)](https://www.sfeir.dev/content/images/2023/06/image-12.png)

barre latérale de Postman

## L'interface de Postman Flows

[![](https://www.sfeir.dev/content/images/2023/06/flows_interface-1.png)](https://www.sfeir.dev/content/images/2023/06/flows_interface-1.png)

### Barre d'outils

La barre d'outils permet d'accéder rapidement aux options d'édition suivantes

- **Annuler / refaire** : pratique dans le cas ou l'on s'est trompé dans ce que l'on voulait faire.
- **Zoom** : il est bien d'avoir une vue plus large quand on souhaite naviguer dans son workflow.
- **Run** : permet de lancer le workflow à partir de son point de départ le **bloc Start.**
- **+ Block** : ajouter un [bloc](https://www.sfeir.dev/product/presentation-postman-flows/#les-blocs-dans-postman-flows) au workflows : requête / visualisation / variable ...
- **T** : ajouter un texte, il est parfois important de commenter ce qui est fait dans le cadre ou Postman est un outils collaboratif.

### Mini carte

Au fur et à mesure que votre flow va évoluer, il y'a fort à parier que sa taille va vite dépasser ce qui peut être affiché à l'écran, et ça même avec le zoom arrière au maximum.  
C'est là que la mini carte entre en jeu, en effet, cette dernière va vous permettre de naviguer rapidement d'un endroit à l'autre de votre flow.

### Barre latérale

- **Configuration** : affiche les options de configuration pour le bloc sélectionné
- **Fork** : affiche les forks du flow en cours
- **Informations** : affiche les informations du flow

## Les blocs dans Postman Flows

[![](https://www.sfeir.dev/content/images/2023/07/image-1.png)](https://www.sfeir.dev/content/images/2023/07/image-1.png)

Exemple de blocs dans Postman Flows

Dans Postman Flows les blocs sont l'unité de base permettant la construction de vos flows, les blocs sont organisés en fonction de leur rôle.

- **Tâche** : envoyer une requête /attendre X temps
- **Logique** : tester des conditions
- **Boucle** : répéter tâche
- **Sortie** : afficher résultat d'une exécution / logger dans la console de Postman
- **Donnée** :  création de variable de type divers (chaîne de caractère / date / nombre / objet ...)
