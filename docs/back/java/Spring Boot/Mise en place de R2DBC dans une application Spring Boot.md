---
layout: "default"
title: "Mise en place de R2DBC dans une application Spring Boot"
permalink: "/back/java/spring-boot/mise-en-place-de-r2dbc-dans-une-application-spring-boot/"
tags: [back, java, spring-boot]
date: "2026-01-27"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/mise-en-place-de-r2dbc-dans-une-application-spring-boot/"
banner: "https://www.sfeir.dev/content/images/size/w1304/2025/09/20250916_1308_Spring-Boot-Data-Storm_remix_01k5939jnjf9k8f36x67mz48rp.png"
published_at: "2026-01-27"
sfeir_slug: "mise-en-place-de-r2dbc-dans-une-application-spring-boot"
sfeir_tags: [Back, Java, Spring Boot, R2DBC, Reactive]
---
Les applications réactives gagnent du terrain : elles permettent de mieux utiliser les ressources, d’avoir un comportement plus prévisible sous forte charge et d’aligner la pile bout-à-bout (API / traitement / IO) sur le paradigme non-bloquant.

C’est dans ce contexte qu’apparaît **R2DBC**, une nouvelle manière de communiquer avec une base relationnelle au sein de [[Il était une fois... Spring Boot|Spring Boot]].

## Présentation de R2DBC

Traditionnellement, les applications qui dialoguent avec une base de données utilisent JDBC, un standard largement répandu. Celui-ci repose sur une approche dite **bloquante** : à chaque requête envoyée à la base, le programme attend la réponse avant de poursuivre.

R2DBC, pour **Reactive Relational Database Connectivity**, adopte une approche différente : il fonctionne de manière **réactive** et **non bloquante**. Concrètement, cela signifie que l’application peut continuer à travailler pendant qu’une requête est traitée par la base de données.  
Cette philosophie s’intègre parfaitement à l’écosystème réactif de Spring (Spring WebFlux) et répond aux besoins d’applications modernes, souvent très sollicitées et devant gérer un grand nombre de connexions simultanées.

## ⚖️ Avantages et inconvénients

### ➕ Avantages

- Une meilleure utilisation des ressources, surtout lorsqu’il y a beaucoup de connexions.
- Une intégration fluide avec Spring WebFlux et le modèle réactif.
- Une solution pensée pour l’avenir, dans un contexte où les systèmes sont de plus en plus distribués.

### ➖ Inconvénients

- Encore relativement jeune par rapport à JDBC, qui reste la référence historique.
- Toutes les bases de données ne proposent pas encore de pilote R2DBC.
- Le changement de paradigme (réactif vs bloquant) demande un petit temps d’adaptation.

## Installation et dépendances

Pour utiliser R2DBC avec Spring Boot, il faut ajouter quelques dépendances dans le fichier `pom.xml`

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-r2dbc</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webflux</artifactId>
    </dependency>
    <dependency>
        <groupId>io.r2dbc</groupId>
        <artifactId>r2dbc-h2</artifactId>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

- `spring-boot-starter-data-r2dbc`Fournit l’intégration Spring Data pour R2DBC.Permet de créer des **repositories réactifs**, similaires aux repositories Spring Data classiques mais adaptés au flux réactif.
- `spring-boot-starter-webflux`Active le support pour Spring WebFlux, le framework réactif de Spring.Nécessaire pour exposer des endpoints HTTP qui fonctionnent de manière non bloquante et peuvent manipuler des flux de données (`Mono` et `Flux`).
- `r2dbc-h2`C’est le pilote R2DBC pour la base H2.Permet à l’application de se connecter à une base H2 en mémoire ou fichier de façon réactive.Le scope `runtime` indique que cette dépendance est seulement nécessaire à l’exécution, pas à la compilation.

---

Ces trois dépendances constituent le minimum pour démarrer une application Spring Boot réactive avec une base relationnelle. Pour d’autres bases (PostgreSQL, MySQL…), il suffira de remplacer `r2dbc-h2` par le pilote correspondant.

---

## Exemple

Prenons un exemple simple : la gestion de personnes dans une base relationnelle.

### La configuration de la base

Spring Boot détecte automatiquement la présence de R2DBC et utilise le fichier `schema.sql` pour préparer les tables nécessaires. Ici, nous avons une table **person** avec un identifiant, un nom et l'age.

```sql
CREATE TABLE person (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL
);
```

### L’entité

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Person {

    @Id
    private Integer id;
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

Cette classe correspond directement à la table en base : chaque enregistrement devient un objet `Person`.

### Le repository

```java
public interface PersonRepository extends ReactiveCrudRepository<Person, Integer> {
}
```

`ReactiveCrudRepository` (Spring Data R2DBC) fournit les opérations courantes réactives : `findAll()` → `Flux<Person>`, `findById(...)` → `Mono<Person>`, `save(...)` → `Mono<Person>`, `deleteById(...)`, etc. L’intégration Spring Data permet de rester au plus proche du modèle repository habituel, mais dans une version réactive.

### Routage fonctionnel

```java
@Configuration
public class RouterConfig {

    @Bean
    public RouterFunction<ServerResponse> routes(PersonHandler personHandler) {
        return route(GET("/api/persons"), personHandler::getAllPersons)
                .andRoute(GET("/api/persons/{id}"), personHandler::getPersonById)
                .andRoute(POST("/api/persons"), personHandler::createPerson);
    }
}
```

Le routeur fonctionnel (WebFlux functional endpoints) définit les routes et mappe chaque requête vers une méthode du handler.

### PersonHandler

```java
@Component
public class PersonHandler {

    private final PersonRepository personRepository;

    public PersonHandler(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public Mono<ServerResponse> getAllPersons(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(APPLICATION_JSON)
                .body(personRepository.findAll(), Person.class);
    }

    public Mono<ServerResponse> getPersonById(ServerRequest request) {
        String idStr = request.pathVariable("id");
        int personId;

        try {
            personId = Integer.parseInt(idStr);
        } catch (NumberFormatException e) {
            return ServerResponse.badRequest()
                    .bodyValue("Invalid ID format: " + idStr);
        }

        return personRepository.findById(personId)
                .flatMap(person -> ServerResponse.ok()
                        .contentType(APPLICATION_JSON)
                        .bodyValue(person))
                .switchIfEmpty(ServerResponse.notFound().build());
    }

    public Mono<ServerResponse> createPerson(ServerRequest request) {
        return request.bodyToMono(Person.class)
                .flatMap(personRepository::save)
                .flatMap(savedPerson ->
                        ServerResponse.created(URI.create("/api/persons/" + savedPerson.getId()))
                                .contentType(APPLICATION_JSON)
                                .bodyValue(savedPerson)
                );
    }
}
```

- **`getAllPersons`** :`personRepository.findAll()` renvoie un `Flux<Person>`.`ServerResponse.ok().body(Flux, Person.class)` construit la réponse HTTP 200 avec un flux JSON (streaming possible selon client).
- **`getPersonById`** :Lecture de la variable de chemin `id`.Protection contre `NumberFormatException` : si l’ID ne peut pas être converti, on renvoie un **400 Bad Request** au lieu d’une `500`. C’est une pratique traditionnelle (valider / sanitizer les inputs).`findById(...)` renvoie `Mono<Person>` ; en cas d’absence on renvoie un **404 Not Found** (`switchIfEmpty(...)`).
- **`createPerson`** :`request.bodyToMono(Person.class)` : désérialise le corps JSON vers un `Mono<Person>`.On sauve avec `personRepository::save` → `Mono<Person>` contenant l’entité persistée (avec l’id éventuellement renseigné par la DB).`ServerResponse.created(URI)` renvoie **201 Created** et positionne l’entête `Location` sur l’URI de la ressource créée ; on renvoie aussi l’entité en JSON via `bodyValue(savedPerson)`.

## Mais ou est mon RestController ?

[![](https://media.tenor.com/ACBGhLB0v0gAAAAC/looney-tunes-telescope.gif)](https://media.tenor.com/ACBGhLB0v0gAAAAC/looney-tunes-telescope.gif)

Dans une application Spring traditionnelle, on expose des [[REST - définition]] avec des classes [[Comprendre les annotations dans Spring Boot - guide et exemples|annotées]] `@RestController` et des méthodes annotées `@GetMapping`, `@PostMapping`, etc.  
Chaque méthode retourne un objet ou une réponse HTTP, et Spring s’occupe de la sérialisation JSON et de la gestion des routes.

Ici, nous utilisons **le routage fonctionnel de Spring WebFlux**, avec des objets `RouterFunction` et des `Handler` :

- **`RouterFunction`** définit les chemins d’accès (URL) et associe chaque chemin à une méthode du handler.
- `**Handler**` contient la logique de traitement de la requête et de génération de la réponse, en mode réactif (`Mono` / `Flux`).

L’avantage principal :

1. **Séparation claire entre routes et logique**
    - Les routes ne connaissent pas la logique métier.
    - Le handler ne connaît pas les URL exactes.
2. **Code entièrement réactif**
    - Les handlers travaillent directement avec `Mono` et `Flux`, sans être contraints par les conventions des annotations `@RestController`.
    - Cela permet un meilleur contrôle sur le flux de données et l’enchaînement des opérations réactives.
3. **Plus flexible et testable**
    - Les routes fonctionnelles sont de simples objets Java : on peut les tester indépendamment des serveurs HTTP.
    - On peut composer des routes de façon dynamique ou conditionnelle, ce qui est plus difficile avec les annotations classiques.

### Conclusion

Avec R2DBC, Spring Boot franchit une nouvelle étape dans la gestion des bases relationnelles. Plus moderne et réactif, il répond aux enjeux actuels des applications qui doivent gérer des flux importants de données et d’utilisateurs.

Toutefois, JDBC reste une valeur sûre et, dans certains cas simples, il peut encore être préférable. Mais pour des applications web modernes, capables de s’adapter à des charges élevées, R2DBC apparaît comme une solution d’avenir.
