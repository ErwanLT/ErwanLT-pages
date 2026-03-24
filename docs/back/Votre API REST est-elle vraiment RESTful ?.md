---
layout: "default"
title: "Votre API REST est-elle vraiment RESTful ?"
permalink: "/back/votre-api-rest-est-elle-vraiment-restful/"
tags: [back]
date: "2025-04-02"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/votre-api-rest-est-elle-vraiment-restful/"
banner: "https://www.sfeir.dev/content/images/2025/01/photo-1596665857902-b972a1edd3c0.jpeg"
published_at: "2025-04-02"
sfeir_slug: "votre-api-rest-est-elle-vraiment-restful"
sfeir_tags: [Back, API, REST]
---
Si je vous disais que la très grande majorité des [[REST - définition|API REST]] ne sont pas **RESTful**, seriez-vous surpris ?

Avant de plonger dans les niveaux de maturité des API, il est essentiel de comprendre la différence entre **REST** et **RESTful**.

- **REST (REpresentational State Transfer)** : C’est un style architectural proposé par **Roy Fielding** en 2000.  
    Il définit un ensemble de principes pour concevoir des systèmes distribués, en utilisant les standards du Web.  
    REST repose sur l’idée que les ressources (entités manipulées par l’API) doivent être accessibles via des identifiants uniques (URI), et que les opérations sur ces ressources doivent être effectuées à l’aide de méthodes HTTP (`GET`, `POST`, `PUT`, `DELETE`, etc.).
- **RESTful** : Une API est dite RESTful lorsqu’elle respecte les principes de REST, c’est-à-dire qu’elle expose des ressources via des URI bien définies, utilise correctement les méthodes HTTP, et adopte des conventions standard pour le retour de données et les codes de statut HTTP.

Cependant, toutes les API qui se revendiquent RESTful ne le sont pas forcément de manière complète.  
C’est ici qu’intervient le **modèle de maturité de Richardson**, qui permet d’évaluer à quel point une API se rapproche d’une véritable implémentation RESTful.

[![](https://www.sfeir.dev/content/images/2025/01/image-6.png)](https://www.sfeir.dev/content/images/2025/01/image-6.png)

Modèle de maturité de Richardson

Nous allons maintenant voir un peu plus en détail ce à quoi correspondent ces niveaux de maturité.

## Les niveaux de maturité des API selon le modèle de Richardson

Le modèle de maturité de Richardson est un cadre défini par [Leonard Richardson](https://www.linkedin.com/in/leonardr/?ref=sfeir.dev) pour évaluer le niveau de conformité d’une API aux principes **REST**. Il se décompose en quatre niveaux, allant de **0** à **3**, où chaque niveau ajoute une couche de conformité supplémentaire.

### Niveau 0 : Les API RPC sur HTTP

Ce niveau correspond aux API qui utilisent HTTP comme simple moyen de transport sans exploiter les conventions REST.  
Les API de **niveau 0** exposent souvent une unique URI, par exemple `/api`, et toutes les opérations sont effectuées à l’aide de la même méthode HTTP (souvent `POST`) avec des actions spécifiques définies dans le corps de la requête.  
Ce niveau peut également être appelé **Swamp of POX**, soit le « domaine du Plain Old XML » car c'est celui utilisé par [[SOAP - définition|SOAP]].

**Exemple :**

```
POST /api HTTP/1.1
Content-Type: application/json

{
  "action": "createUser",
  "data": {
    "name": "Alice",
    "email": "alice@example.com"
  }
}
```

Requête POST de niveau 0

Ce type d’API ressemble à des services RPC (Remote Procedure Call), mais ne respecte pas encore les principes REST, car il n’utilise ni les URI ni les méthodes HTTP de manière appropriée.
Requête POST de niveau 0

Ce type d’API ressemble à des services RPC (Remote Procedure Call), mais ne respecte pas encore les principes REST, car il n’utilise ni les URI ni les méthodes HTTP de manière appropriée.

### Niveau 1 : Les URI individualisées

Au **niveau 1**, les API commencent à exploiter correctement les URI pour identifier des ressources distinctes.  
Chaque ressource a sa propre URI unique, mais les méthodes HTTP ne sont pas encore pleinement utilisées.

**Exemple :**

```
POST /users HTTP/1.1
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com"
}
```

Requête POST de niveau 1

Ici, chaque entité (également appelée ressource) possède une URI propre. Cependant, une seule méthode HTTP (souvent `POST`) est utilisée, même pour des actions qui pourraient être mieux représentées par d’autres méthodes comme `GET` ou `DELETE`.

### Niveau 2 : Utilisation correcte des méthodes HTTP

Les API de **niveau 2** respectent à la fois la notion de ressources distinctes et utilisent les méthodes HTTP de manière appropriée.  
Les opérations courantes sur les ressources sont effectuées avec les méthodes HTTP standard :

- **GET** pour récupérer des ressources,
- **POST** pour créer de nouvelles ressources,
- **PUT** ou **PATCH** pour mettre à jour des ressources existantes,
- **DELETE** pour supprimer des ressources.

**Exemple :**

```
GET /users/1 HTTP/1.1
DELETE /users/1 HTTP/1.1
```

Diverse requêtes de niveau 2

Cela permet une meilleure compréhension des opérations par les clients de l’API et exploite les conventions standard du protocole HTTP.

### Niveau 3 : Utilisation de HATEOAS

Le **niveau 3**, le plus élevé de maturité, introduit le concept de HATEOAS (Hypermedia As The Engine Of Application State).  
Une API de niveau 3 fournit, en plus des données, des liens hypermédia permettant de naviguer dynamiquement dans l’application.  
C'est ce dernier niveau qui fait que peu d’API sont pleinement RESTful !

**Exemple :**

```
GET /users/1 HTTP/1.1
```

Requête GET

```json
{
  "id": 1,
  "name": "Alice",
  "email": "alice@example.com",
  "links": [
    { "rel": "self", "href": "/users/1" },
    { "rel": "friends", "href": "/users/1/friends" },
    { "rel": "delete", "href": "/users/1", "method": "DELETE" }
  ]
}
```

Réponse de niveau 3

Avec HATEOAS, un client peut naviguer dans l’API en suivant les liens fournis dans les réponses. Cela permet de découpler davantage le client de l’implémentation de l’API, en rendant la navigation dynamique.

## Pourquoi les API REST ne sont pas toujours RESTful

Nombre d'API revendiquent être RESTful, mais s'arrêtent souvent au **niveau 2** du modèle de maturité de Richardson. Les raisons peuvent être multiples :

- **Complexité supplémentaire** : Implémenter une API de niveau 3 demande plus d'efforts, notamment pour fournir des hyperliens et maintenir leur cohérence.
- **Manque de connaissance** : Certains développeurs ne connaissent pas le concept de HATEOAS ou ne voient pas son utilité.
- **Besoins spécifiques** : Dans la majorité des cas, le niveau de maturité 2 suffit pour répondre aux besoins fonctionnels de l’API.

## Conclusion

Le modèle de maturité de Richardson offre une grille d’évaluation précieuse pour déterminer à quel point une API respecte les principes REST.  
Bien que le **niveau 3 soit idéal**, atteindre le **niveau 2 constitue déjà une bonne pratique** pour offrir une API claire, standardisée et facile à utiliser.  
Lors de la conception de vos prochaines API, pensez à évaluer leur niveau de maturité et à décider jusqu’où vous souhaitez aller en fonction des besoins de vos utilisateurs.
