---
layout: "default"
title: "Partie 1 - Mise en place"
permalink: "/back/java/spring-boot/graphql/partie-1-mise-en-place/"
tags: [back, java, spring-boot, graphql]
date: "2025-01-16"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/partie-1-mise-en-place/"
banner: "https://www.sfeir.dev/content/images/2025/09/20250919_1340_GraphQL-Pirate-Adventure_simple_compose_01k5gw7fswfy3bzd744dq9g4gx.png"
published_at: "2025-01-16"
sfeir_slug: "partie-1-mise-en-place"
sfeir_tags: [Spring Boot, GraphQL]
---
_Journal de bord du capitaine, jour 1 dans la mer des technologies modernes :_

musique de fond pour l'article

---

Aujourd’hui, je note dans ce journal les mystères d'une île que l’on nomme **_[GraphQL](/definition/graphql-definition/)_**). Une alternative intrigante aux contrées de [**REST**](https://www.sfeir.dev/rest-definition/), elle promet bien des trésors en permettant aux clients d'exiger exactement les données qu'ils souhaitent, ni plus ni moins.  
Une trouvaille qui pourrait bien réduire la surcharge de données, rendant notre navigation plus efficace et agile.

## Pourquoi mettre le cap sur GraphQL ?

L'attrait de cette île mystérieuse réside dans plusieurs avantages dignes d'un bon capitaine et de son équipage :

- **Optimisation des requêtes :** avec GraphQL, nul besoin de traîner des coffres de données inutiles ! Les clients ne récoltent que les champs dont ils ont véritablement besoin, allégeant ainsi nos précieuses ressources.
- **Relations de données :** imaginez pouvoir explorer toutes les relations entre auteurs et articles d’un simple coup d’œil. Ce qui nécessiterait bien des détours avec REST, peut être obtenu en **une seule requête** avec GraphQL.
- **Schéma auto-documenté :** l’île de GraphQL est cartographiée automatiquement, offrant une documentation qui permet à tout équipage de comprendre ce qui est disponible sans lever le moindre doigt.

## Configurer notre galion Spring Boot pour GraphQL

Pour accoster sur l’île de GraphQL, il nous faut d’abord [préparer notre navire, _Spring Boot_](https://www.sfeir.dev/back/creer-son-projet-spring-boot-de-zero/).  
En passant par Spring Initializr, nous avons sélectionné des fournitures essentielles :

### Spring Initializr

Depuis l'interface de Spring Initializr, sélectionner les dépendances suivantes :

- **Spring Web** : Cette dépendance embarque le soutien pour les routes HTTP, permettant de servir les requêtes nécessaires pour GraphQL.
- **Spring for GraphQL** : L’ingrédient secret qui nous ouvre les portes de cette contrée, avec la possibilité de définir des schémas et de manier des requêtes et mutations d’une simple commande.
- **Spring Data JPA** : Pour manipuler notre base de données comme bon nous semble.
- **H2 Database** : Un petit coffre H2 qui, pour l’instant, suffira pour notre exploration.

[![](https://www.sfeir.dev/content/images/2024/11/image-1.png)](https://www.sfeir.dev/content/images/2024/11/image-1.png)

Spring Initializr

Il ne nous reste maintenant qu'à générer notre projet.

### Nos armes secrètes : les dépendances

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

starter web

Cette dépendance est notre première arme, apportant le support pour bâtir des applications web. Bien que principalement associée aux API REST, elle est essentielle pour que notre navire serve les requêtes HTTP jusqu’à notre île GraphQL. Ce starter configure également un serveur web intégré, généralement Tomcat, pour gérer le transit des requêtes HTTP vers GraphQL.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-graphql</artifactId>
</dependency>
```

starter graphql

L’arme qui donne à notre équipage tout le pouvoir de GraphQL ! Elle simplifie grandement l’intégration de GraphQL dans Spring Boot, en nous permettant de définir des schémas GraphQL et [d’utiliser des annotations](/back/java/spring-boot/comprendre-les-annotations-dans-spring-boot-guide-et-exemples/) comme `@QueryMapping` et `@MutationMapping`.  
Elle donne accès à une interface interactive nommée GraphiQL, qui permet de tester facilement les API GraphQL. Un trésor pour tout explorateur technique.

---

_Journal de bord, fin de l'entrée du jour. Demain, nous mettrons les voiles vers la configuration de nos schémas pour explorer pleinement les mystères de GraphQL et lier auteurs et articles dans cette nouvelle aventure._

## Prochainement

[Partie 2 - le schéma dans GraphQL](/back/java/spring-boot/graphql/partie-2-le-schema-dans-graphql/)
