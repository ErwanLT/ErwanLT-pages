---
layout: "default"
title: "Spring Data REST - créer des API sans controllers"
permalink: "/back/java/spring-boot/spring-data-rest-creer-des-api-sans-controllers/"
tags: [back, java, spring-boot]
date: "2026-03-17"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/spring-data-rest-creer-des-api-sans-controllers/"
banner: "https://www.sfeir.dev/content/images/size/w1304/2026/03/20260311_1847_Magical-API-Garden_simple_compose_01kkf04zcafg7at2z8gsh8wh2v.png"
published_at: "2026-03-17"
sfeir_slug: "spring-data-rest-creer-des-api-sans-controllers"
sfeir_tags: [Back, Java, Spring Boot, API]
---
# Spring Data REST - créer des API sans controllers

Créer une [API REST](/definition/rest-definition/) en [Spring Boot](/back/java/spring-boot/il-etait-une-fois-spring-boot/), c'est souvent une succession de contrôleurs, DTO, services, tests, documentation. C'est robuste, mais pas toujours nécessaire.

Spring Data REST propose une alternative simple : exposer directement les repositories Spring Data sous forme d'API REST, sans écrire un seul controller. Le gain de temps est réel, à condition d'accepter un contrat plus implicite.

Dans cet article, on construit un exemple complet, puis on pose clairement les limites : quand c'est un super outil, et quand il faut revenir à des controllers classiques.

## Quand Spring Data REST est pertinent

- back-office interne ou POC rapide
- admin technique d'un domaine métier stable
- API simple de type CRUD où la logique métier est faible

Et à l'inverse : dès que le contrat API doit être très précis, [versionné](/back/java/spring-boot/versioning-des-api-dans-spring-boot-guide-complet/) ou fortement sécurisé, on bascule plus souvent sur des controllers et des DTO.

## Mise en place minimale

Avec Spring Boot, il suffit d'ajouter le starter Spring Data REST (souvent déjà présent via `spring-boot-starter-data-jpa`).

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-rest</artifactId>
</dependency>
```

## Un exemple concret

On part d'un domaine ultra simple : `Book` et `Author`.

```java
@Entity
public class Author {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    // getters/setters
}

@Entity
public class Book {

    @Id
    @GeneratedValue
    private Long id;

    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    private Author author;

    // getters/setters
}
```

Ensuite, un repository suffit.

```java
@RepositoryRestResource(path = "books")
public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByTitleContainingIgnoreCase(String title);
}
```

Spring Data REST expose automatiquement :

- `GET /books`
- `GET /books/{id}`
- `POST /books`
- `PUT /books/{id}`
- `DELETE /books/{id}`
- `GET /books/search/findByTitleContainingIgnoreCase?title=java`

Le tout en HAL, avec pagination et liens hypermédia intégrés.

## Mode lecture seule

Il est courant d'exposer certains repositories en lecture seule.

### Option 1 : désactiver les méthodes au niveau du repository

```java
@RepositoryRestResource(path = "books")
public interface BookRepository extends JpaRepository<Book, Long> {

    @Override
    @RestResource(exported = false)
    <S extends Book> S save(S entity);

    @Override
    @RestResource(exported = false)
    void deleteById(Long id);
}
```

### Option 2 : configurer l'exposition globalement

```java
@Configuration
public class RestExposureConfig implements RepositoryRestConfigurer {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        config.getExposureConfiguration()
                .forDomainType(Book.class)
                .withItemExposure((metadata, httpMethods) -> httpMethods.disable(HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE))
                .withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE));
    }
}
```

Cette approche est utile pour des catalogues ou des référentiels.

## Lecture / écriture contrôlée

Si l'API est publique, on veut souvent limiter ce qui est exposé :

- masquer des champs sensibles
- restreindre des relations
- éviter la modification de certains attributs

Spring Data REST offre plusieurs leviers :

- `@JsonIgnore` ou `@JsonProperty(access = Access.READ_ONLY)`
- projections (pour exposer seulement un sous-ensemble)
- événements repository (`@HandleBeforeCreate`, etc.) pour valider et enrichir

Exemple de projection :

```java
@Projection(name = "summary", types = Book.class)
public interface BookSummary {
    String getTitle();
    Author getAuthor();
}
```

Appel :

`GET /books?projection=summary`

```json
{
    "_embedded": {
        "books": [
            {
                "title": "Refactoring",
                "_links": {
                    "self": {
                        "href": "http://localhost:8094/api/books/1"
                    },
                    "book": {
                        "href": "http://localhost:8094/api/books/1"
                    },
                    "author": {
                        "href": "http://localhost:8094/api/books/1/author"
                    }
                }
            },
            {
                "title": "Clean Code",
                "_links": {
                    "self": {
                        "href": "http://localhost:8094/api/books/2"
                    },
                    "book": {
                        "href": "http://localhost:8094/api/books/2"
                    },
                    "author": {
                        "href": "http://localhost:8094/api/books/2/author"
                    }
                }
            },
            {
                "title": "Effective Java",
                "_links": {
                    "self": {
                        "href": "http://localhost:8094/api/books/3"
                    },
                    "book": {
                        "href": "http://localhost:8094/api/books/3"
                    },
                    "author": {
                        "href": "http://localhost:8094/api/books/3/author"
                    }
                }
            },
            {
                "title": "Clean Architecture",
                "_links": {
                    "self": {
                        "href": "http://localhost:8094/api/books/4"
                    },
                    "book": {
                        "href": "http://localhost:8094/api/books/4"
                    },
                    "author": {
                        "href": "http://localhost:8094/api/books/4/author"
                    }
                }
            },
            {
                "title": "test",
                "_links": {
                    "self": {
                        "href": "http://localhost:8094/api/books/5"
                    },
                    "book": {
                        "href": "http://localhost:8094/api/books/5"
                    },
                    "author": {
                        "href": "http://localhost:8094/api/books/5/author"
                    }
                }
            }
        ]
    },
    "_links": {
        "self": {
            "href": "http://localhost:8094/api/books?projection=summary&page=0&size=20"
        },
        "profile": {
            "href": "http://localhost:8094/api/profile/books"
        },
        "search": {
            "href": "http://localhost:8094/api/books/search"
        }
    },
    "page": {
        "size": 20,
        "totalElements": 5,
        "totalPages": 1,
        "number": 0
    }
}
```

## Documentation OpenAPI / Swagger

Oui, c'est compatible. Il suffit d'ajouter le starter Springdoc qui comprend Spring Data REST.

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.6.0</version>
</dependency>
```

On retrouve ensuite les endpoints dans Swagger UI (`/swagger-ui.html`).

C'est particulièrement utile si on a déjà lu [Réussir sa migration de Swagger 2 à OpenApi 3](/back/java/spring-boot/reussir-sa-migration-de-swagger-2-a-openapi-3/).

## Ce que Spring Data REST ne fait pas bien

- **Contrat API explicite** : tout change dès qu'on renomme un repository ou un champ.
- **Versioning** : possible, mais moins naturel que dans un controller dédié. Voir [Versioning des API dans Spring Boot - Guide Complet](/back/java/spring-boot/versioning-des-api-dans-spring-boot-guide-complet/).
- **Validation fine** : on peut brancher la validation, mais le contrôle sur le cycle HTTP est plus limité qu'un controller classique. Voir [Validation Spring Boot - du standard au sur-mesure](/back/java/spring-boot/validation-spring-boot-du-standard-au-sur-mesure/).
- **Sécurité granulaire** : faisable, mais nécessite de bien connaître les événements repository et les `@PreAuthorize`.
- **Ergonomie des réponses** : le format HAL est puissant, mais pas toujours désiré côté front.

En clair : c'est excellent pour du CRUD rapide, mais pas pour un contrat API public strict.

## En résumé

Spring Data REST permet d'obtenir une API complète en quelques minutes, sans controllers, avec pagination, recherche, et documentation automatique. C'est un accélérateur net pour un back-office ou un produit interne.

Mais si vous cherchez un contrat stable, versionné, très contrôlé ou optimisé pour un client spécifique, un controller reste souvent la bonne solution.

Et comme toujours : on choisit l'outil, pas l'inverse.
