---
layout: "default"
title: "Partie 3 - Controllers"
permalink: "/back/java/spring-boot/graphql/partie-3-controllers/"
tags: [back, java, spring-boot, graphql]
date: "2025-01-16"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/partie-3-controllers/"
banner: "https://www.sfeir.dev/content/images/2025/09/20250919_1336_Pixelated-GraphQL-Adventure_simple_compose_01k5gw2ypme8pac2mk6378vcxk.png"
published_at: "2025-01-16"
sfeir_slug: "partie-3-controllers"
sfeir_tags: [Spring Boot, GraphQL]
---
_Jour 3 : construction des entités et des contrôleurs_

Musique de fond pour l'article

---

L’heure est venue de bâtir les fondations de notre [[GraphQL - définition|API GraphQL]] avec Spring Boot. Ce jour, nous allons forger nos entités [Java](https://www.sfeir.dev/back/le-langage-java-definition/), qui se dresseront fièrement en miroir des types définis dans notre schéma. Nous érigerons ensuite nos contrôleurs, équipés des [[Comprendre les annotations dans Spring Boot - guide et exemples|annotations puissantes]] que Spring for GraphQL met à notre disposition.

## Retour au schéma

Souvenez-vous du schéma que nous avons déterré précédemment :

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

notre schéma GraphQL

Notre cap aujourd’hui, c’est de donner vie aux éléments de notre schéma, dans lequel nous avons défini les types `Author` et `Article`, accompagnés de requêtes et de mutations :

- **2 types** : `Author` et `Article`
- **4 requêtes** de lecture (Queries)
- **2 requêtes de création** (Mutations)

Nous disposons de deux options pour organiser nos contrôleurs : soit un contrôleur pour chaque entité (`ArticleController` et `AuthorController`), soit un contrôleur unique pour chaque type de requête (`QueryController` et `MutationController`).  
Pour garder une architecture familière, j’ai opté pour la première option, reflétant ainsi la structure REST que nous connaissons bien.

## Nos entités Java

Voici nos classes d’entité, fidèles reflets de notre schéma.

### Article

```java
@Entity
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String content;
    
    @ManyToOne
    @JoinColumn(name = "author_id")
    private Author author;

    // Constructeur
    ...
    // Getter et Setter
    ...
}
```

classe Article

### Author

```java
@Entity
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String bio;
    
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
    private List<Article> articles = new ArrayList<>();

    // Constructeur
    ...
    // Getter et Setter
    ...
}
```

classe Auteur

Ainsi, nous forgeons notre modèle de données en lui donnant forme et substance, sans complexité inutile.

## Les controllers

### AuthorController

```java
@Controller
public class AuthorController {

    private final AuthorService authorService;

    public AuthorController(AuthorService authorService) {
        this.authorService = authorService;
    }

    @MutationMapping
    public Author createAuthor(@Argument String name, @Argument String bio) {
        return authorService.createAuthor(name, bio);
    }

    @QueryMapping
    public List<Author> getAuthors() {
        return authorService.getAuthors();
    }

    @QueryMapping
    public Author getAuthorById(@Argument Long id) {
        return authorService.getAuthorById(id).orElse(null);
    }
}
```

AuthorController

### ArticleController

```java
@Controller
public class ArticleController {

    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @MutationMapping
    public Article createArticle(@Argument String title, @Argument String content, @Argument Long authorId) {
        return articleService.createArticle(title, content, authorId);
    }

    @QueryMapping
    public List<Article> getArticles() {
        return articleService.getArticles();
    }

    @QueryMapping
    public Article getArticleById(@Argument Long id) {
        return articleService.getArticleById(id).orElse(null);
    }
}
```

ArticleController

### Explications des annotations

Notre levier principal dans cette opération repose sur des annotations clé :

- **@Controller** : Cette annotation marque notre classe pour que Spring la détecte en tant que composant dédié à la gestion des requêtes et mutations GraphQL. Le point d’entrée pour nos requêtes sera `/graphql`.
- **@QueryMapping** : Cette annotation signale une méthode comme représentant une requête GraphQL, connectant directement les méthodes Java à celles spécifiées dans notre schéma (ex : `getAuthors`, `getArticles`).
- **@MutationMapping** : Cette annotation désigne une méthode pour une mutation GraphQL, nous permettant de lier les mutations Java avec celles du schéma GraphQL (`createAuthor`, `createArticle`).

**Nota Bene** : les services et les repositories se construisent comme avec une API REST, sans particularité liée à GraphQL.

---

_Ainsi s’achève notre avancée du jour. L'ossature de notre API GraphQL est en place, et demain, nous soumettrons ces éléments à l'épreuve des terribles tests unitaires afin de garantir que tout fonctionne comme prévu._

## Précédémment
[[Partie 2 - le schéma dans GraphQL]]

## Prochainement
[[Partie 4 - Tests unitaires]]
