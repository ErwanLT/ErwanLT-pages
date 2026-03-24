---
layout: "default"
title: "Boostez votre application Spring Boot grâce aux design patterns"
permalink: "/back/java/spring-boot/boostez-votre-application-spring-boot-grace-aux-design-patterns/"
tags: [back, java, spring-boot]
date: "2025-12-11"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/boostez-votre-application-spring-boot-grace-aux-design-patterns/"
banner: "https://www.sfeir.dev/content/images/2025/10/20251009_1141_Pixelated-Spring-Boot-Magic_simple_compose_01k745e0pyfevbg6pe31y1f0q4.png"
published_at: "2025-12-11"
sfeir_slug: "boostez-votre-application-spring-boot-grace-aux-design-patterns"
sfeir_tags: [Back, Java, Spring Boot, Design pattern]
---
[[Il était une fois... Spring Boot|Depuis ses débuts, **Spring Boot**]] s’est imposé comme une référence dans le monde [[Il était une fois... Java|Java]] pour sa capacité à simplifier la création d’applications robustes, maintenables et prêtes à l’emploi. Cependant, derrière cette simplicité apparente se cache une architecture pensée avec rigueur, reposant sur des [[Les Design Patterns|**design patterns**]] éprouvés — ces mêmes modèles de conception qui, depuis des décennies, guident les ingénieurs vers un code plus clair, plus souple et plus réutilisable.

Cet article a pour but de **montrer comment** [**les design patterns**](https://www.sfeir.dev/tag/design-pattern/) **peuvent être utilisés consciemment par le développeur** pour renforcer encore les qualités de Spring Boot, mais aussi de **rappeler que le framework lui-même est bâti sur ces principes**, souvent de manière invisible pour l’utilisateur.

## Spring Boot : une mécanique interne fondée sur les design patterns

[Spring Boot n’est pas seulement un outil facilitant la configuration des projets Java](https://www.sfeir.dev/back/back-pourquoi-utiliser-spring-boot/), c’est avant tout une **application magistrale des design patterns**.  
Prenons quelques exemples emblématiques :

- [[Factory|**Le pattern Factory**]] : Lorsqu’on écrit `@Bean` ou `@Component`, on délègue à Spring la responsabilité d’instancier et de gérer les objets. Ce comportement découle directement du **pattern Factory**, où une fabrique centralisée (le _BeanFactory_ ou _ApplicationContext_) se charge de créer les instances nécessaires, tout en contrôlant leur cycle de vie.
- [[Singleton|**Le pattern Singleton**]] : La majorité des beans Spring sont des _singletons_ par défaut. Cela garantit qu’une seule instance de chaque composant est partagée dans le contexte applicatif, favorisant ainsi la cohérence et la performance.
- [[Proxy|**Le pattern Proxy**]] : Le mécanisme d’[AOP (programmation orientée aspects)](https://www.sfeir.dev/back/spring-aop-comprendre-la-programmation-orientee-aspect-dans-spring/) de Spring repose sur la génération de proxies dynamiques. Cela permet d’intercepter les appels de méthode pour y injecter des comportements transverses comme la [sécurité](https://www.sfeir.dev/tag/spring-security/), la gestion des transactions ou la journalisation, sans modifier le code métier.
- **Le pattern Dependency Injection (ou Inversion of Control)** : C’est le cœur même de Spring. Ce modèle consiste à inverser la responsabilité de création et de gestion des dépendances : ce n’est plus l’objet qui crée ses dépendances, mais le conteneur Spring qui les lui fournit. Ce principe renforce la testabilité, la modularité et la clarté du code.

Ainsi, même sans en avoir conscience, tout développeur Spring Boot utilise quotidiennement ces patterns. Pourtant, **les intégrer consciemment dans son propre code** peut permettre de passer d’une application simplement fonctionnelle à une application élégante, évolutive et pérenne.

## [[Pourquoi utiliser les Design Patterns ?|Pourquoi utiliser les design patterns]] dans vos projets Spring Boot ?

Les design patterns ne sont pas de simples artifices de style : ils offrent des **solutions éprouvées à des problèmes récurrents** du développement logiciel.  
Appliqués dans un contexte Spring Boot, ils peuvent :

- **Réduire** le couplage entre les classes.
- **Faciliter** l’évolution du code sans risquer de tout casser.
- **Encourager** la réutilisation de composants.
- **Favoriser** la lisibilité et la compréhension par d’autres développeurs.
- **Structurer** l’application selon des principes solides, indépendants du framework.

En somme, il s’agit d’un **retour aux fondations du génie logiciel** : concevoir avant de coder, et bâtir des systèmes pensés pour durer.

## Quelques patterns particulièrement utiles dans une application Spring Boot

Avant de plonger dans un cas concret de CRUD enrichi, voici une sélection de patterns dont l’application dans un contexte Spring Boot est particulièrement féconde :

- [[Builder|**Builder**]] : idéal pour construire des objets complexes de manière lisible et fluide, notamment dans les DTO ou les entités immuables.
- [[Stratégie|**Strategy**]] : permet de remplacer les chaînes de `if/else` par des stratégies dynamiques injectées, très utile pour la gestion de comportements variés (validation, calculs, conversions…).
- [[Observateur|**Observer**]] : facilite la mise en place de notifications ou d’événements internes à l’application (grâce à `ApplicationEventPublisher` de Spring).
- [[Décorateur|**Decorator**]] : permet d’enrichir un service existant sans modifier son code source — par exemple pour ajouter du logging, de la mise en cache, ou des contrôles supplémentaires.
- **Template Method** : souvent utilisé pour factoriser les étapes communes d’un traitement tout en laissant certaines étapes personnalisables (utile dans les services métiers).

## Vers un CRUD augmenté : l’application concrète des patterns

Pour illustrer concrètement la puissance des _design patterns_ dans un contexte **Spring Boot**, construisons un petit module de **gestion de livres**.

### Le modèle : le pattern _Builder_

Commençons par la classe `Book`.  
Plutôt que d’utiliser des constructeurs surchargés ou des _setters_ à répétition, nous faisons appel au **pattern Builder**.  
Ce modèle permet de construire des objets complexes de manière lisible, fluide et immuable — un principe cher aux conceptions robustes.

```java
public class Book {
    private final long id;
    private final String title;
    private final String author;
    private final String type;
    private final String cote;

    private Book(Builder builder) {
        this.id = builder.id;
        this.title = builder.title;
        this.author = builder.author;
        this.type = builder.type;
        this.cote = builder.cote;
    }

    public static class Builder {
        private long id;
        private String title;
        private String author;
        private String type;
        private String cote;

        public Builder id(long id) {
            this.id = id;
            return this;
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder author(String author) {
            this.author = author;
            return this;
        }

        public Builder type(String type) {
            this.type = type;
            return this;
        }

        public Builder cote(String cote) {
            this.cote = cote;
            return this;
        }

        public Book build() {
            return new Book(this);
        }
    }

    // Getters classiques
    public long getId() { return id; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public String getType() { return type; }
    public String getCote() { return cote; }

    @Override
    public String toString() {
        return "Book{"
                + "id=" + id
                + ", title='" + title + '\''
                + ", author='" + author + '\''
                + ", type='" + type + '\''
                + ", cote='" + cote + '\''
                + '}';
    }
}
```

Notre modèle et son builder

Ici, le _Builder_ permet une création claire :

```java
Book book = new Book.Builder()
    .id(1L)
    .title("L'Étranger")
    .author("Camus")
    .type("Roman")
    .cote("R-CAMU")
    .build();
```

Ce pattern favorise la **sécurité** (objets immuables) et la **lisibilité** (chaînage fluide).

### Le pattern _Factory_ : déléguer la création

Spring repose déjà sur le principe de _Factory_, mais ici nous l’utilisons explicitement dans notre logique métier.  
L’idée est de centraliser la création des livres dans une classe dédiée (`BookFactory`), capable d’intégrer d’autres patterns (comme la _Strategy_).

```java
@Component
public class BookFactory {

    private final BookCoteStrategyFactory coteStrategyFactory;

    public BookFactory(BookCoteStrategyFactory coteStrategyFactory) {
        this.coteStrategyFactory = coteStrategyFactory;
    }

    public Book createBook(long id, String title, String author, String type) {
        BookCoteStrategy strategy = coteStrategyFactory.getStrategy(type);
        String cote = strategy.generateCote(author);

        return new Book.Builder()
                .id(id)
                .title(title)
                .author(author)
                .type(type)
                .cote(cote)
                .build();
    }
}
```

la factory

Ainsi, la création d’un livre ne dépend plus du code client.  
Si demain la logique de génération de cote évolue, il suffira de modifier la _factory_, pas les services.

### Le pattern _Strategy_ : un comportement interchangeable

Nous devons maintenant gérer la **génération de la cote** (code interne) du livre selon son type.  
Le _pattern Strategy_ permet d’externaliser ce comportement dans des classes dédiées, facilement interchangeables.

#### L’interface de stratégie

```java
public interface BookCoteStrategy {
    String generateCote(String author);

    // Identifiant de la stratégie (clé utilisée pour la Map)
    String getType();
}
```

l'interface strategie

#### Implémentations concrètes

```java
@Component
public class BdCoteStrategy implements BookCoteStrategy {
    public String generateCote(String author) {
        return "BD-" + author.substring(0, Math.min(4, author.length())).toUpperCase();
    }
    public String getType() { return "BD"; }
}

@Component
public class RomanCoteStrategy implements BookCoteStrategy {
    public String generateCote(String author) {
        return "R-" + author.substring(0, Math.min(4, author.length())).toUpperCase();
    }
    public String getType() { return "Roman"; }
}

@Component
public class DefaultCoteStrategy implements BookCoteStrategy {
    public String generateCote(String author) {
        return author.substring(0, Math.min(4, author.length())).toUpperCase();
    }
    public String getType() { return "Default"; }
}
```

Les différentes implémentations de notre stratégie

#### La Factory des stratégies

```java
@Component
public class BookCoteStrategyFactory {

    private final Map<String, BookCoteStrategy> strategies;

    public BookCoteStrategyFactory(Map<String, BookCoteStrategy> strategies) {
        this.strategies = strategies;
    }

    public BookCoteStrategy getStrategy(String type) {
        return strategies.values().stream()
                .filter(s -> s.getType().equalsIgnoreCase(type))
                .findFirst()
                .orElseGet(() -> strategies.values().stream()
                        .filter(s -> "Default".equalsIgnoreCase(s.getType()))
                        .findFirst()
                        .orElseThrow(() -> new IllegalStateException("Default strategy not found")));
    }
}
```

**Grâce à Spring, les stratégies sont injectées automatiquement.**

En effet, lorsqu’[[Comprendre les annotations dans Spring Boot - guide et exemples|une classe est annotée]] avec `@Component`, elle devient un **bean Spring** :

- au démarrage, le conteneur Spring scanne le classpath à la recherche de toutes les classes marquées `@Component`, `@Service`, `@Repository` ou `@Controller`.
- pour chaque bean trouvé qui implémente une interface (ici `BookCoteStrategy`), Spring en conserve **une instance unique (singleton par défaut)** et la référence dans le _contexte_.

Ainsi, lorsque Spring rencontre le constructeur suivant :

```java
public BookCoteStrategyFactory(Map<String, BookCoteStrategy> strategies)
```

l sait qu’il doit :

1. **Chercher tous les beans** du type `BookCoteStrategy` dans le contexte,
2. **Créer une Map** où :
    - la clé est le **nom du bean** (par défaut, le nom de la classe avec la première lettre en minuscule, par exemple `bdCoteStrategy`),
    - la valeur est **l’instance du bean** (`BdCoteStrategy`, `RomanCoteStrategy`, `DefaultCoteStrategy`),
3. **Injecter cette Map** dans le constructeur.

Concrètement Spring fait pour nous la chose suivante :

```java
strategies = Map.of(
    "bdCoteStrategy", new BdCoteStrategy(),
    "romanCoteStrategy", new RomanCoteStrategy(),
    "defaultCoteStrategy", new DefaultCoteStrategy()
);
```

Il n’y a donc **aucune configuration manuelle** ni injection multiple à écrire :  
le framework applique automatiquement le principe du **pattern Factory**, couplé à l’**inversion de contrôle** (IoC).

### Le _Service_ et le _Controller_ : un CRUD clair et structuré

#### Le service

```java
@Service
public class BookService {

    private final BookFactory bookFactory;
    private final List<Book> books = new ArrayList<>();
    private final AtomicLong counter = new AtomicLong();

    public BookService(BookFactory bookFactory) {
        this.bookFactory = bookFactory;
    }

    public Book createBook(String title, String author, String type) {
        long id = counter.incrementAndGet();
        Book book = bookFactory.createBook(id, title, author, type);
        books.add(book);
        return book;
    }

    public List<Book> getAllBooks() { return books; }

    public Optional<Book> getBookById(long id) {
        return books.stream().filter(b -> b.getId() == id).findFirst();
    }

    public Optional<Book> updateBook(long id, String title, String author, String type) {
        for (int i = 0; i < books.size(); i++) {
            if (books.get(i).getId() == id) {
                Book updated = bookFactory.createBook(id, title, author, type);
                books.set(i, updated);
                return Optional.of(updated);
            }
        }
        return Optional.empty();
    }

    public boolean deleteBook(long id) {
        return books.removeIf(b -> b.getId() == id);
    }
}
```

le service

#### Le controller [[REST - définition|REST]]

```java
@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService service;

    public BookController(BookService service) {
        this.service = service;
    }

    @PostMapping
    public Book createBook(@RequestParam String title,
                           @RequestParam String author,
                           @RequestParam String type) {
        return service.createBook(title, author, type);
    }

    @GetMapping
    public List<Book> listBooks() {
        return service.getAllBooks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable long id) {
        return service.getBookById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable long id,
                                           @RequestParam String title,
                                           @RequestParam String author,
                                           @RequestParam String type) {
        return service.updateBook(id, title, author, type)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable long id) {
        return service.deleteBook(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
```

le controller

L’ensemble offre une architecture claire, où chaque responsabilité est bien séparée :

- le contrôleur expose l’API,
- le service gère la logique métier,
- la factory et les stratégies construisent les objets.

### Le pattern _Proxy_ : l’AOP pour un logging transversal

Enfin, ajoutons une couche de logging via le **pattern Proxy**, ici implémenté à travers **Spring AOP**.  
Le principe : intercepter les appels aux méthodes de service pour tracer leur exécution sans toucher au code métier.

```java
@Aspect
@Component
public class LoggingAspect {

    private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);

    @Pointcut("within(fr.eletutour.designpattern.service..*)")
    public void serviceMethods() {}

    @Around("serviceMethods()")
    public Object logExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();

        log.info("==> Entering method: {} with arguments: {}", methodName, Arrays.toString(args));

        long startTime = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long endTime = System.currentTimeMillis();

        log.info("<== Exiting method: {} with result: {}. Execution time: {} ms",
                 methodName, result, endTime - startTime);

        return result;
    }
}
```

Ce proxy agit en **décorateur** du service, ajoutant une fonctionnalité transversale (le logging) sans altérer le code métier.  
Une illustration parfaite du principe _open/closed_ : ouvert à l’extension, fermé à la modification.

## Conclusion

L’exemple de ce CRUD de bibliothèque illustre parfaitement comment les _design patterns_, loin d’être de simples exercices théoriques, demeurent des piliers intemporels du développement logiciel.  
Spring, par son architecture même, en est une incarnation moderne : il ne fait pas que supporter les patterns — il les **institutionnalise**.

- Le **Builder** facilite la création d’objets complexes sans exposer les détails internes, améliorant la lisibilité et la robustesse du code.
- La **Factory**, quant à elle, centralise la logique de création et délègue intelligemment la responsabilité du choix à Spring, grâce à l’injection automatique des dépendances.
- Le **Strategy** pattern rend le système extensible et adaptable, permettant de changer le comportement sans modifier le cœur du code.
- Enfin, l’**Aspect** (ou _proxy_) vient compléter cette architecture en ajoutant des comportements transversaux (comme la journalisation ou la sécurité) sans polluer la logique métier.

Ce mariage entre la tradition des _design patterns_ et la philosophie de Spring repose sur une idée simple :

> « Le code doit être ouvert à l’extension, mais fermé à la modification. » — Bertrand Meyer

Chaque pattern que nous avons implémenté honore ce principe.  
Le développeur n’a plus à _lier_ lui-même les composants : il se contente de **décrire l’intention**. Le reste est pris en charge par le conteneur Spring, héritier du principe d’**inversion de contrôle**.

Ainsi, au lieu de “programmer contre des classes”, nous programmons **contre des contrats**, et la flexibilité devient naturelle.  
Ce n’est pas un hasard si ces patterns, nés dans les années 90, trouvent une seconde jeunesse dans l’écosystème Spring : ils partagent une même philosophie — **structurer la complexité** sans renier la clarté.

En définitive, combiner _Builder_, _Factory_, _Strategy_ et _Aspect_ au sein d’une application Spring Boot, c’est renouer avec l’esprit fondateur du développement orienté objet :  
un code clair, modulaire, extensible, et fidèle à la tradition logicielle — celle où chaque ligne a du sens.
