---
layout: "default"
title: "REST - définition"
permalink: "/definition/rest-definition/"
tags: [kesaco, definition, rest]
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/rest-definition/"
banner: "https://www.sfeir.dev/content/images/2024/10/photo-1586084531072-e03cbf17afa6.jpeg"
published_at: "2024-11-04"
sfeir_slug: "rest-definition"
date: "2024-11-04"
---
Imaginez que vous essayez de donner des directions à quelqu'un dans une ville.  
Pour chaque lieu, vous renseignez l'adresse, et à chaque étape, vous indiquez précisément comment s’y rendre.  
Avec l'architecture **REST**, c'est un peu pareil.  
On organise tout pour que chaque élément du "chemin" soit compréhensible et que chaque requête envoyée soit claire, aboutissant exactement là où elle doit aller.

Mais alors, REST, qu'est-ce que c'est exactement ?

## **Un style architectural avec une histoire**

REST, acronyme de **RE**presentational **S**tate **T**ransfer, est né dans les années 2000 sous la plume de [**Roy Fielding**](https://www.linkedin.com/in/royfielding/?ref=sfeir.dev), un des auteurs de la spécification HTTP.  
[Dans sa thèse](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm?ref=sfeir.dev), il a proposé ce "_style architectural_" pour structurer les échanges d'informations sur le web, en cherchant une méthode simple et universelle qui garantirait la compatibilité et la robustesse des applications web, même en cas d’évolutions ou de montées en charge.

Avant **REST**, de nombreuses applications web reposaient sur des méthodes d’échange lourdes et complexes (comme **SOAP**) ou sur des architectures propriétaires difficiles à étendre.  
**REST** est ainsi venu apporter une solution qui repose sur les protocoles et standards du web (HTTP, URIs), facilitant les échanges entre clients et serveurs et permettant l'interopérabilité.

## Un système d’interaction en cinq verbes

**REST** repose sur une idée simple mais puissante : chaque ressource est représentée par une URL unique, et plusieurs verbes HTTP servent à accomplir les actions principales :

- **GET** : Récupérer des données sans rien modifier, comme lire un article.
- **POST** : Créer une nouvelle ressource, comme publier un nouvel article.
- **PUT** : Mettre à jour une ressource existante en remplaçant toutes ses données, comme réécrire un article.
- **PATCH** : Apporter une modification partielle à une ressource existante, par exemple corriger une faute dans l’article sans changer le reste.
- **DELETE** : Supprimer une ressource, comme retirer un article.

Ce modèle a permis aux développeurs d’écrire des APIs claires et intuitives, rapidement adoptées et partagées par la communauté mondiale.

## **Des données disponibles sous différents formats**

**REST** utilise souvent le format JSON pour transmettre des données, mais il peut aussi utiliser XML ou d’autres formats.  
Le serveur et le client échangent des représentations des ressources plutôt que des objets eux-mêmes.  
Cela rend **REST** flexible, permettant aux applications web et mobiles de récupérer les mêmes informations de différentes manières, tout en s’adaptant aux besoins spécifiques de chaque plateforme.

## Pourquoi choisir REST ?

**REST** s'est imposé pour sa simplicité et son indépendance vis-à-vis des langages et technologies. Cette flexibilité en a fait une norme pour la création d’APIs sur le web et a contribué à l’expansion rapide des applications web et mobiles :

- **Simplicité et standardisation** : Chaque ressource a une adresse unique, et les verbes HTTP permettent d'interagir sans ambiguïté.
- **Indépendance technologique** : REST fonctionne avec de nombreuses technologies ([Java](/back/java/il-etait-une-fois-java/), [Python](https://www.sfeir.dev/kesaco-python/), [Node.js](https://www.sfeir.dev/back/node-js-definition/)) et peut être utilisé pour des clients variés (navigateur, applications mobiles).
- **Stateless** : Chaque requête contient toutes les informations nécessaires pour être comprise et exécutée, permettant une échelle plus large.

**REST** est aujourd’hui l’architecture la plus courante des APIs web, et son impact sur le développement des applications modernes est immense.
