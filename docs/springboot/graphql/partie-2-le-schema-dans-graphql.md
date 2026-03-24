---
layout: "default"
title: "Partie 2 - le schéma dans GraphQL"
permalink: "/springboot/graphql/partie-2-le-schema-dans-graphql/"
tags: [spring-boot, graphql, java, tutoriel]
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/partie-2-le-schema/"
banner: "https://www.sfeir.dev/content/images/2025/09/20250919_1334_Retro-Pixel-Data-Voyage_simple_compose_01k5gvxp9vfbnb3y4201gp1hv5.png"
published_at: "2025-01-16"
sfeir_slug: "partie-2-le-schema"
date: "2025-01-16"
---
_Journal de bord du capitaine, jour 2 sur l’île de GraphQL :_

Musique de fond pour l'article

---

### Rôle du schéma GraphQL

Aujourd'hui, nous abordons une pierre angulaire de notre expédition : le **schéma [GraphQL](/definition/graphql-definition/)**.  
Cet artefact précieux établit les règles du jeu entre le client et le serveur, agissant tel un **contrat** qui fixe :

- les types de données
- les opérations permises
- les règles de validation.

Grâce à ce schéma, chaque membre de l’équipage sait exactement quelles données sont accessibles et comment les manier.

### Pourquoi ce schéma est-il notre trésor ?

Les richesses du schéma sont nombreuses et précieuses :

- **Documentation vivante** : nul besoin de parchemins compliqués ; le schéma lui-même sert de carte, guidant tout explorateur à travers les routes des données disponibles.
- **Validation et sécurité** : ce schéma impose des contraintes de type et de structure, rendant les requêtes aussi sûres qu’un coffre fermé par sept serrures.
- **Autonomie des développeurs** : chaque membre d’équipage peut, en toute indépendance, explorer et assembler les requêtes dont il a besoin.
- **Réduction des erreurs** : en forçant une structure et des types précis, le schéma réduit les risques d’erreurs et maintient l’ordre parmi les données.

### Un seul schéma pour garder la mer calme

Certains pourraient être tentés de diviser leurs trésors en **plusieurs schémas**. Mais gare !  
Cela augmente la complexité et crée des fragments où certaines données seraient isolées, **rendant la navigation périlleuse**. Pour garder une API claire et maîtrisable, un seul schéma est bien plus sage.

### Notre schéma à nous, capitaine !

Pour notre aventure, nous avons placé le schéma dans un fichier `.graphqls` au cœur de notre embarcation, dans le répertoire `src/main/resources/graphql/`. Ce parchemin y spécifie chaque **type**, **requête** et **mutation** qui constitue notre API. Voici les trésors principaux définis dans notre schéma :

```graphql
type Author {
    id: ID!
    name: String!
    bio: String
    articles: [Article]
}

type Article {
    id: ID!
    title: String!
    content: String!
    author: Author!
}

type Query {
    getAuthors: [Author]
    getAuthorById(id: ID!): Author
    getArticles: [Article]
    getArticleById(id: ID!): Article
}

type Mutation {
    createAuthor(name: String!, bio: String): Author
    createArticle(title: String!, content: String!, authorId: ID!): Article
}
```

schéma graphql

### **Query et Mutation : nos instruments de navigation**

- **Query** : c’est notre longue-vue pour observer le monde sans le modifier, comme l’opération GET dans les API REST.
- **Mutation** : l’équivalent des opérations POST, PUT, et DELETE de REST, Mutation est notre hache pour créer ou modifier le contenu de notre trésor.

### Le symbole du point d'exclamation !

Lorsqu’on voit un `!` dans notre schéma, cela signifie que le type est **non-nul**, comme une règle gravée dans le bois du navire.  
Cela impose une valeur obligatoire pour ce champ, garantissant ainsi des requêtes sûres et sans surprise.

---

_Fin de l’entrée. Prochaine étape : mettons en œuvre ces trésors et préparons-nous à exposer nos données via des controllers_

## Précédemment
[Partie 1 - Mise en place](/springboot/graphql/partie-1-mise-en-place/)

## Prochainement
[Partie 3 - Controllers](/springboot/graphql/partie-3-controllers/)
