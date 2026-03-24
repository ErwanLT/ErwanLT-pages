---
layout: "default"
title: "Mise en place de HATEOAS dans Spring Boot  un guide pratique"
permalink: "/back/java/spring-boot/mise-en-place-de-hateoas-dans-spring-boot-un-guide-pratique/"
tags: [back, java, spring-boot]
date: "2025-05-12"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/mise-en-place-de-hateoas-dans-spring-boot-un-guide-pratique/"
banner: "https://www.sfeir.dev/content/images/2025/08/20250827_1248_Retro-Hypermedia-Adventure_simple_compose_01k3nj6hcafddtesrvcd3y8c9n.png"
published_at: "2025-05-12"
sfeir_slug: "mise-en-place-de-hateoas-dans-spring-boot-un-guide-pratique"
sfeir_tags: [Back, Java, Spring Boot, API, HATEOAS]
---
## Introduction à HATEOAS

**HATEOAS**, acronyme de _Hypermedia As The Engine Of Application State_, est un principe clé des architectures RESTful.

Il vise à enrichir les réponses d'une API avec des liens hypermédias, permettant aux clients de naviguer dynamiquement entre les ressources sans avoir à coder en dur les URLs ou à connaître à l'avance la structure complète de l'API.  
En d'autres termes, **HATEOAS** transforme une API en une interface auto-descriptive, où chaque réponse indique au client les actions possibles et les ressources accessibles.

Imaginez une API comme un site web : au lieu de devoir deviner les URLs des pages suivantes, vous suivez des liens (comme "Accueil" ou "Profil").  
**HATEOAS** applique cette idée aux [APIs REST](/definition/rest-definition/), rendant les interactions plus fluides et évolutives.

Dans cet article, nous explorerons **HATEOAS** à travers le prisme de [Spring Boot](/back/java/spring-boot/il-etait-une-fois-spring-boot/), en nous appuyant sur le modèle de maturité de Richardson, ses avantages et inconvénients, son installation, et un exemple concret basé sur une gestion d'auteurs et d'articles.

## Rappel du modèle de maturité de Richardson
[Votre API REST est-elle vraiment RESTful ?](/back/votre-api-rest-est-elle-vraiment-restful/)

Leonard Richardson a proposé un modèle pour évaluer le niveau de maturité des APIs REST, composé de quatre niveaux (de 0 à 3). HATEOAS correspond au niveau le plus élevé :

1. **Niveau 0 - Le marais du POX (Plain Old XML)** : Utilisation de HTTP comme simple transport pour des appels RPC, sans respecter les principes REST (ex. : [SOAP](/definition/soap-definition/).
2. **Niveau 1 - Ressources** : Introduction des ressources individuelles avec des URLs spécifiques (ex. : `/authors/1` au lieu de `/getAuthor?id=1`).
3. **Niveau 2 - Verbes HTTP** : Utilisation appropriée des méthodes HTTP (**GET, POST, PUT, DELETE**) pour interagir avec les ressources, avec des codes de statut HTTP cohérents.
4. **Niveau 3 - HATEOAS** : Ajout de liens hypermédias dans les réponses, permettant au client de découvrir dynamiquement les actions possibles (ex. : un lien "**self**" ou "**delete**").

Une API au niveau 3 est considérée comme pleinement RESTful, car elle maximise la flexibilité et la découvrabilité. Par exemple, une réponse pour un auteur pourrait inclure des liens vers ses articles ou une action de suppression, rendant l'API plus intuitive.

Mais au fait, connaissez-vous la différence entre REST et RESTful ? Si non, je vous encourage à lire l'article suivant :

## ⚖️ Avantages et inconvénients de HATEOAS

### ➕ Avantages

- **Découvrabilité** : Les clients n'ont pas besoin de documentation externe pour naviguer dans l'API ; les liens dans les réponses suffisent.
- **Évolutivité** : Les URLs peuvent changer sans casser les clients, tant que les relations (**rel**) restent cohérentes.
- **Flexibilité** : Les développeurs peuvent ajouter ou modifier des fonctionnalités (ex. : un nouveau endpoint) sans nécessiter de mise à jour côté client.
- **Expérience utilisateur améliorée** : Similaire à la navigation sur un site web, les clients suivent des liens logiques.

### ➖ Inconvénients

- **Complexité accrue** : L'ajout de liens demande un effort supplémentaire dans le code serveur et peut compliquer la logique métier.
- **Surcharge des réponses** : Les réponses JSON deviennent plus volumineuses avec les métadonnées des liens, ce qui peut affecter les performances.
- **Adoption limitée** : Peu de clients exploitent pleinement **HATEOAS**, car beaucoup préfèrent des URLs statiques et une [documentation Swagger](/back/java/spring-boot/reussir-sa-migration-de-swagger-2-a-openapi-3/).
- **Support des méthodes non-GET** : HATEOAS est principalement conçu pour les **GET** ; représenter des actions comme **DELETE** ou **POST** nécessite des conventions supplémentaires.

**HATEOAS** est donc idéal pour les APIs publiques ou complexes, mais peut être excessif pour des projets internes simples.

## Installation dans Spring Boot

Spring Boot facilite l'intégration de HATEOAS grâce au module `spring-boot-starter-hateoas`.  
Voici les étapes pour l'installer :

- Ajouter la dépendance suivante dans votre fichier `pom.xml`

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-hateoas</artifactId>
</dependency>
```

Dépendance spring boot hateoas

Voilà, c'est tout pour l'installation 😀. Simple non ?

## Exemples

Prenons un exemple concret basé sur une API gérant des auteurs (`Author`) et leurs articles (`Article`). Voici comment implémenter HATEOAS :

### Nos entités

```java
@Entity
public class Author extends RepresentationModel<Author> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String bio;
    
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Article> articles = new ArrayList<>();

    // constructeurs + getters et setters
}

@Entity
public class Article extends RepresentationModel<Article> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String content;
    
    @ManyToOne
    @JoinColumn(name = "author_id")
    @JsonBackReference
    private Author author;

    // constructeurs + getters et setters
}
```

Nous pouvons voir que mes entités étendent RepresentationModel<>, cette classe abstraite est fournie par Spring HATEOAS, et inclut des méthodes pour ajouter et gérer des liens (add(), getLinks(), ...).

#### Pourquoi utiliser `RepresentationModel<>` ?

- **Intégration native** : `RepresentationModel<>` est conçu pour représenter une ressource **REST** avec des liens **hypermédias**, ce qui est au cœur de **HATEOAS**.
- **Simplification** : Pas besoin de déclarer manuellement une liste de **Link** ni d'implémenter la méthode `add()`.
- **Cohérence** : Les outils de **Spring HATEOAS** (comme `WebMvcLinkBuilder`) fonctionnent de manière transparente avec **RepresentationModel**.
- **Sérialisation JSON** : Les liens sont automatiquement inclus dans la réponse JSON sous la clé `_links`, suivant les conventions **HATEOAS**.

### Interface `LinkBuilder`

Pour centraliser la logique des liens, nous allons utiliser une interface dédiée ainsi que son implémentation.

```java
public interface LinkBuilder {
    Link authorSelfLink(Long authorId);
    Link authorsListLink();
    Link authorDeleteLink(Long authorId);
    Link articleSelfLink(Long articleId);
    Link articlesListLink();
    Link articleDeleteLink(Long articleId);
}

@Component
public class DefaultLinkBuilder implements LinkBuilder {
    @Override
    public Link authorSelfLink(Long authorId) {
        return linkTo(methodOn(AuthorController.class).getAuthorById(authorId)).withSelfRel();
    }

    @Override
    public Link authorsListLink() {
        return linkTo(methodOn(AuthorController.class).getAuthors()).withRel("authors");
    }

    @Override
    public Link authorDeleteLink(Long authorId) {
        return Link.of(linkTo(methodOn(AuthorController.class).deleteAuthor(authorId)).toUri().toString())
                .withRel("delete")
                .withType("DELETE");
    }

    @Override
    public Link articleSelfLink(Long articleId) {
        return linkTo(methodOn(ArticleController.class).getArticleById(articleId)).withSelfRel();
    }

    @Override
    public Link articlesListLink() {
        return linkTo(methodOn(ArticleController.class).getArticles()).withRel("articles");
    }

    @Override
    public Link articleDeleteLink(Long articleId) {
        return Link.of(linkTo(methodOn(ArticleController.class).deleteArticle(articleId)).toUri().toString())
                .withRel("delete")
                .withType("DELETE");
    }
}
```

Voyons un peu la logique derrière les méthodes `linkTo` et `methodOn` utilisées plusieurs fois ici.

Ces deux méthodes, fournies par **WebMvcLinkBuilder**, sont essentielles pour générer des liens hypermédias de manière dynamique et type-safe dans une application Spring Boot.  
Elles permettent de créer des URLs basées sur les méthodes des controllers, sans avoir à coder en dur les chemins.

**Type-Safe ?** Dans une **API RESTful avec HATEOAS**, les réponses incluent des liens (comme "self", "delete", etc.) pour guider le client.  
Écrire ces URLs manuellement (ex. : "`/authors/1`") est fragile, car cela ne suit pas les changements dans la configuration des routes (ex. : si `@RequestMapping` change). `linkTo` et `methodOn` résolvent ce problème en générant les URLs à partir des définitions des controllers.

### Le service des auteurs

```java
@Service
public class AuthorService {
    private static final String AUTHOR_NOT_FOUND_MESSAGE = "Author non trouvé pour l'id : ";
    private final AuthorRepository authorRepository;
    private final LinkBuilder linkBuilder;


    public AuthorService(AuthorRepository authorRepository, LinkBuilder linkBuilder) {
        this.authorRepository = authorRepository;
        this.linkBuilder = linkBuilder;
    }

    public List<Author> getAuthors() throws AuthorNotFoundException, ArticleNotFoundException {
        List<Author> authors = authorRepository.findAll();
        return authors.stream()
                .map(this::addAuthorLinks)
                .map(this::addArticleLinks)
                .collect(Collectors.toList());
    }

    public Author getAuthorById(Long id) throws AuthorNotFoundException {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new AuthorNotFoundException(AUTHOR_NOT_FOUND_MESSAGE + id));
        return addAuthorLinks(addArticleLinks(author)); // Ajout des liens
    }

    public void createAuthor(String name, String bio) {
        Author author = new Author();
        author.setName(name);
        author.setBio(bio);
        authorRepository.save(author);
    }

    private Author addAuthorLinks(Author author) throws AuthorNotFoundException, ArticleNotFoundException {
        author.add(linkBuilder.authorSelfLink(author.getId()));
        author.add(linkBuilder.authorsListLink());
        author.add(linkBuilder.authorDeleteLink(author.getId()));
        return author;
    }

    private Author addArticleLinks(Author author) {
        author.getArticles().forEach(article -> {
            article.add(linkBuilder.articleSelfLink(article.getId()));
            article.add(linkBuilder.articlesListLink());
            article.add(linkBuilder.articleDeleteLink(article.getId()));
        });
        return author;
    }

    public void deleteAuthor(Long id) {
        var author = authorRepository.findById(id);
        if (author.isPresent()) {
            authorRepository.delete(author.get());
        } else {
            throw new AuthorNotFoundException(AUTHOR_NOT_FOUND_MESSAGE + id);
        }
    }
}
```

Sans grande surprise, dans une application Spring Boot classique, c'est ici que se jouera la logique de notre application :

- Récupérer un auteur en particulier
- Récupérer la liste des auteurs
- Supprimer un auteur
- ...

Mais aussi la construction des liens de ces derniers via le linkBuilder que nous avons déclaré plus tôt.

### Résultat d'une requête

Imaginons maintenant que nous appelons notre endpoint pour récupérer l'auteur avec l'id 1 (GET /authors/1), et bien avec Spring HATEOAS notre réponse aura des liens vers les différentes méthodes possibles concernant ce dernier, ainsi que vers les articles qu'il aurait écrits :

```json
{
    "id": 1,
    "name": "J.K. Rowling",
    "bio": "J.K. Rowling is the author of the much-loved series of seven Harry Potter novels.",
    "articles": [
        {
            "id": 1,
            "title": "Harry Potter",
            "content": "Harry Potter is a series of seven fantasy novels written by British author J. K. Rowling.",
            "_links": {
                "self": {
                    "href": "http://localhost:8086/articles/1"
                },
                "articles": {
                    "href": "http://localhost:8086/articles"
                },
                "delete": {
                    "href": "http://localhost:8086/articles/1",
                    "type": "DELETE"
                }
            }
        }
    ],
    "_links": {
        "self": {
            "href": "http://localhost:8086/authors/1"
        },
        "authors": {
            "href": "http://localhost:8086/authors"
        },
        "delete": {
            "href": "http://localhost:8086/authors/1",
            "type": "DELETE"
        }
    }
}
```

## Conclusion

HATEOAS élève une API Spring Boot au **niveau 3 du modèle de Richardson**, offrant une navigation intuitive et une évolutivité accrue. Bien que sa mise en place demande un effort initial (ajout de dépendances, gestion des liens), **Spring HATEOAS simplifie le processus grâce à des outils comme linkTo et Link**.

**Cependant, HATEOAS n'est pas une solution universelle** : son adoption dépend des besoins du projet. Pour une API publique ou un système complexe, il brille par sa flexibilité. Pour des projets simples ou internes, il peut sembler superflu.  
À vous de peser ses avantages face à sa complexité !
