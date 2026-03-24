---
layout: "default"
title: "GraphQL - définition"
permalink: "/definition/graphql-definition/"
tags: [kesaco, definition, graphql, open source]
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/graphql-definition/"
banner: "https://www.sfeir.dev/content/images/2024/10/Capture-d-e-cran-2024-10-28-a--12.22.41.png"
published_at: "2024-10-28"
sfeir_slug: "graphql-definition"
date: "2024-10-28"
---
Imaginez-vous dans une bibliothèque. Vous avez une liste précise d’informations que vous souhaitez obtenir, mais vous ne voulez pas parcourir tous les livres ni lire les chapitres entiers.  
C’est là qu’intervient [**GraphQL**](https://graphql.org/?ref=sfeir.dev), qui va fonctionner comme un "_assistant personnel_" et vous fournir uniquement les informations dont vous avez besoin, et rien de plus.  
Mais alors, **qu’est-ce que** **GraphQL**, et pourquoi est-il aussi puissant ?

Découvrons-le ensemble dans ce petit article !

## **Un langage de requête issu des besoins modernes**

**GraphQL** a vu le jour en 2012, lorsqu'il a été développé en interne chez [**Facebook**](https://www.sfeir.dev/tendances/facebook-le-plus-ancien-des-reseaux-sociaux-fete-son-anniversaire/).  
À l'époque, le réseau social cherchait un moyen d’améliorer la performance de ses applications mobiles, confrontées à une quantité de données toujours plus massive et complexe. Les limitations des **APIs REST**, qui renvoyaient souvent des données excessives ou insuffisantes, posaient un défi.

**GraphQL** a été conçu pour permettre aux développeurs de récupérer exactement les informations requises, rien de plus, et tout cela en une seule requête.

En 2015, Facebook a publié [**GraphQL**](https://github.com/graphql?ref=sfeir.dev) en [open source](https://www.sfeir.dev/tag/opensource/), en réponse à une forte demande des développeurs du monde entier. Depuis, il a gagné en popularité, notamment dans les applications à grande échelle, comme Shopify, [GitHub](https://www.sfeir.dev/product/avoir-un-profil-github-qui-claque/) ou [Twitter](https://www.sfeir.dev/ia/x-un-an-apres-le-rachat-de-twitter-par-elon-musk-entre-technologie-de-pointe-et-enjeux-de-desinformation/), où la précision et la performance des échanges de données sont cruciales.

## **Un système de requête flexible et précis**

Avec GraphQL, le client envoie une requête unique, construite pour obtenir les données spécifiques nécessaires en une seule fois, sans surplus d’informations :

```graphql
{
  user(id: "1") {
    name
    posts {
      title
      content
    }
  }
}
```

Exemple simple de requête qraphQL

Cette requête retourne uniquement les informations demandées, ce qui limite la surcharge des réseaux et améliore la performance des applications.

### Décomposition de la requête

1. **user(id: "1")** :
    1. Cette partie de la requête demande les informations pour un utilisateur spécifique, identifié ici par `id: "1"`.
    2. GraphQL accepte un **paramètre** (ici `id: "1"`) qui permet de filtrer les données pour obtenir seulement l'utilisateur ayant cet identifiant.
2. **name** :
    1. Ce champ demande le **nom** de l'utilisateur.
    2. Il est placé directement sous `user`, ce qui indique que l'on souhaite récupérer cette information spécifique pour cet utilisateur uniquement.
3. **posts** :
    1. Ce champ demande les **publications** (ou "posts") de cet utilisateur.
    2. `posts` est un champ lié à `user`, indiquant que nous voulons obtenir les publications de cet utilisateur particulier (id: "1").
    3. Ce champ inclut les sous-champs détaillés plus loin dans la requête
4. **title** et **content** :
    1. Ces sous-champs spécifient que, pour chaque publication de l'utilisateur, nous souhaitons obtenir uniquement le **titre** (`title`) et le **contenu** (`content`).
    2. Cela permet d'éviter de récupérer d'autres informations sur les publications qui ne sont pas nécessaires ici.

### Résultat attendu

Si on considère que l'utilisateur ayant `id: "1"` s'appelle "Alice" et a deux publications, la réponse de cette requête pourrait ressembler à ceci :

```json
{
  "data": {
    "user": {
      "name": "Alice",
      "posts": [
        {
          "title": "Premier post",
          "content": "Contenu du premier post"
        },
        {
          "title": "Deuxième post",
          "content": "Contenu du deuxième post"
        }
      ]
    }
  }
}
```

Un exemple de résultat de notre requête

## Pourquoi choisir GraphQL aujourd’hui ?

**GraphQL** s’est rapidement imposé pour répondre aux besoins des applications modernes, caractérisées par des interfaces riches en données et une complexité croissante :

- **Optimisation des requêtes** : Les clients récupèrent uniquement les données nécessaires, ce qui améliore la performance.
- **Flexibilité** : Le client contrôle ce qu’il reçoit, réduisant le besoin de créer de multiples endpoints.
- **Schémas forts et documentation intégrée** : GraphQL fonctionne avec des schémas, validant les requêtes et rendant les APIs faciles à explorer.

GraphQL est ainsi devenu un standard incontournable pour les applications modernes et constitue une alternative puissante aux APIs REST dans des environnements aux besoins de données complexes et variés.
