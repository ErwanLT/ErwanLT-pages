---
layout: "default"
title: "Partie 5 - Documentation"
permalink: "/back/java/spring-boot/graphql/partie-5-documentation/"
tags: [back, java, spring-boot, graphql]
date: "2025-01-16"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/partie-5-documentation/"
banner: "https://www.sfeir.dev/content/images/2025/09/20250919_1352_8-Bit-GraphQL-Adventure_simple_compose_01k5gwz6cafd4rqyt1mt50jrpj.png"
published_at: "2025-01-16"
sfeir_slug: "partie-5-documentation"
sfeir_tags: [Spring Boot, GraphQL]
---
_our 5 : le vent souffle dans les voiles et nous arrivons en vue de l'île de la Documentation et de sa jumelle l'île de Graph**i**QL._

---

Le vent souffle doucement dans les voiles, et aujourd'hui, notre quête nous mène à l'île de la Documentation. Après avoir [[Réussir sa migration de Swagger 2 à OpenApi 3|navigué avec succès entre les récifs de Swagger et OpenAPI]] pour cartographier nos [API REST](https://www.sfeir.dev/rest-definition/), il est temps de dresser la carte de nos [[GraphQL - définition|API GraphQL]].  
À ma grande surprise, pas besoin de dépendances supplémentaires pour documenter notre trésor cette fois-ci !

## **Observation initiale : le schéma brut**

Avant de commencer notre travail de documentation, voici la version brute de notre fichier `.graphqls`, dépourvue de toute annotation descriptive :

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

Un schéma fonctionnel, certes, mais **sans âme ni explications** pour éclairer ceux qui viendront après nous.

### Une boussole pour guider : les descriptions en GraphQL

En GraphQL, **les descriptions sont spécifiées en Markdown**. Elles peuvent être ajoutées sur plusieurs éléments :

- Les **types**,
- Les **champs**,
- Les **arguments**.

Elles sont écrites en entourant le texte de triples guillemets (`"""`). Voici quelques règles du capitaine :

1. **Expliquez tout ce qui peut sembler obscur.**
2. **Indiquez les champs obligatoires et leurs rôles.**
3. **Utilisez un langage clair pour que même un moussaillon puisse comprendre.**

### Le schéma après documentation : un trésor cartographié

Voici comment notre schéma évolue une fois enrichi de descriptions :

```graphql
"""
Le type Author
Represente l'auteur d'un ou plusieurs articles
les champs non null sont :
* id
* name
"""
type Author {
    "Identifiant unique de l'auteur"
    id: ID!
    "Le nom de l'auteur"
    name: String!
    "Sa bio"
    bio: String
    "Ses articles"
    articles: [Article]
}

type Article {
    id: ID!
    title: String!
    content: String!
    author: Author!
}

"""
Nos requêtes de lecture d'informations
"""
type Query {
    getAuthors: [Author]
    getAuthorById(id: ID!): Author
    getArticles: [Article]
    getArticleById(id: ID!): Article
}

type Mutation {
    createAuthor("Le nom de l'auteur à créer" name: String!, bio: String): Author
    createArticle(title: String!, content: String!, authorId: ID!): Article
}
```

### Pourquoi ajouter ces descriptions ?

1. **Clarté et simplicité** : les descriptions expliquent immédiatement ce que chaque type, champ ou argument fait.
2. **Réduction des erreurs** : les développeurs comprennent mieux les attentes et limites.
3. **Documentation automatique** : de nombreux outils, comme GraphiQL ou GraphQL Playground, affichent automatiquement ces descriptions dans leur interface.

## Découverte de GraphiQL

En accostant sur les rivages de Spring Boot, j’ai trouvé une interface nommée **GraphiQL**, qui permet de manipuler directement les données de l’API GraphQL depuis un navigateur.  
Interactive et précise, cette boussole technologique m’a montré des trésors cachés dans mon schéma GraphQL et m’a permis d’affronter les erreurs de requêtes avec des messages détaillés.

### Activer GraphiQL

Par défaut, ce bijou n’est pas prêt à être utilisé. J’ai dû graver une rune dans le grimoire `application.properties` :

```properties
spring.graphql.graphiql.enabled=true
```

En redémarrant le navire (l’application), j’ai trouvé GraphiQL à l’adresse suivante : [http://localhost:8080/graphiql](http://localhost:8080/graphiql?ref=sfeir.dev).

[![](https://www.sfeir.dev/content/images/2024/11/image-4.png)](https://www.sfeir.dev/content/images/2024/11/image-4.png)

interface GraphiQL

### Pourquoi utiliser GraphiQL ?

Le maniement de cet outil m’a semblé naturel, comme si un sextant magique m’était tombé entre les mains :

- **Interface interactive** : J’écris mes requêtes et vois instantanément les résultats, comme des cartes vivantes.
- **Documentation intégrée** : Une encyclopédie embarquée pour explorer les types, champs et relations de mon API.
- **Débogage simplifié** : Quand une requête échoue, GraphiQL révèle immédiatement l’erreur, un vrai trésor pour identifier les problèmes.

### La documentation dans GraphiQL

[![](https://www.sfeir.dev/content/images/2024/11/Capture-d-e-cran-2024-11-15-a--17.44.17-2.png)](https://www.sfeir.dev/content/images/2024/11/Capture-d-e-cran-2024-11-15-a--17.44.17-2.png)

[![](https://www.sfeir.dev/content/images/2024/11/Capture-d-e-cran-2024-11-15-a--17.42.20-2.png)](https://www.sfeir.dev/content/images/2024/11/Capture-d-e-cran-2024-11-15-a--17.42.20-2.png)

[![](https://www.sfeir.dev/content/images/2024/11/Capture-d-e-cran-2024-11-15-a--17.42.12-2.png)](https://www.sfeir.dev/content/images/2024/11/Capture-d-e-cran-2024-11-15-a--17.42.12-2.png)

### Commentaires

Pour ancrer des annotations utiles dans le schéma, j’ai utilisé le caractère `#`.  
Ces notes sont invisibles pour les clients, mais elles servent de repères aux développeurs qui parcourent le code.

---

## Comparaison avec REST : Un duel de marins

Avec REST, j’ai dressé des routes fixes pour mes données. Par exemple, en cherchant à ramener les auteurs et leurs articles, voici ce que j’avais construit :

```java
@RestController
@RequestMapping("/authors")
public class RestControllerDemo {
    
    private final AuthorService authorService;

    public RestControllerDemo(AuthorService authorService) {
        this.authorService = authorService;
    }

    @GetMapping
    public List<Author> getAll(){
        return authorService.getAuthors();
    }
}
```

Controller REST

En naviguant vers [http://localhost:8080/authors](http://localhost:8080/authors?ref=sfeir.dev), le résultat obtenu ressemblait à ceci :

```json
[
  {
    "id": "1",
    "name": "Erwan",
    "bio": "bio test",
    "articles": [
      {
        "id": "1",
        "title": "intro à GraphQL",
        "content": "lorem ipsum"
      },
      {
        "id": "2",
        "title": "tester GraphQL",
        "content": "lorem ipsum"
      }
    ]
  },
  {
    "id": "2",
    "name": "Charlotte",
    "bio": "bio test",
    "articles": [
      {
        "id": "3",
        "title": "Tiffany Souterre : l'instinct visionnaire d'une biologiste devenue experte en IA",
        "content": "lorem ipsum"
      }
    ]
  }
]
```

réponse au format JSON

Avec GraphQL, j’ai changé de méthode. Voici une requête complète pour obtenir les mêmes informations :

```graphql
query GetAuthors {
    getAuthors {
        id
        name
        bio
        articles {
            id
            title
            content
        }
    }
}
```

requête GetAuthors complète

### L’intérêt de GraphQL : Naviguer avec précision

En mer, on ne prend que ce qui est nécessaire. GraphQL permet de personnaliser les requêtes pour ne ramener que les informations utiles.  
Par exemple :

```graphql
query GetAuthors {
    getAuthors {
        name
        articles {
            title
        }
    }
}
```

requête GetAuthors personnalisée

Et voici le butin :

```json
{
    "data": {
        "getAuthors": [
            {
                "name": "Erwan",
                "articles": [
                    {
                        "title": "intro à GraphQL"
                    },
                    {
                        "title": "tester GraphQL"
                    }
                ]
            },
            {
                "name": "Charlotte",
                "articles": [
                    {
                        "title": "Tiffany Souterre : l'instinct visionnaire d'une biologiste devenue experte en IA"
                    }
                ]
            }
        ]
    }
}
```

### Problèmes évités avec GraphQL

Contrairement à REST, où j’aurais dû jongler avec des objets intermédiaires ou des [[Comprendre les annotations dans Spring Boot - guide et exemples|annotations]]pour éviter des boucles infinies (comme `Author > Article > Author`), GraphQL gère tout cela avec élégance.

## Conclusion

GraphQL, avec son outil **GraphiQL**, est un vent favorable pour naviguer dans des eaux complexes. Il n’impose pas une route fixe comme REST, mais offre la liberté de choisir la cargaison à chaque voyage. Une véritable révolution pour un pirate avide d’efficacité.

---

_Nous remettons le cap vers le large, où une tempête se prépare, le cyclone Gestion des erreurs est devant nous._

## Précédemment
[[Partie 4 - Tests unitaires]]

## Prochainement

[[Partie 6 - Gestion des erreurs]]
