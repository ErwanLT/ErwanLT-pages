---
layout: "default"
title: "Mise en place de QueryDSL dans une application Spring Boot"
permalink: "/back/java/spring-boot/mise-en-place-de-querydsl-dans-une-application-spring-boot/"
tags: [back, java, spring-boot]
status: "Draft"
---
Dans une application d’entreprise, la gestion des données ne se limite pas à de simples opérations de création, lecture, mise à jour et suppression (CRUD). Les utilisateurs souhaitent souvent rechercher des informations à partir de critères multiples, avec pagination et tri personnalisés.  
Or, si ****JPA**** et ****Spring Data**** facilitent beaucoup de choses, ils atteignent vite leurs limites dès lors que les requêtes deviennent complexes ou dynamiques.

C’est dans ce contexte que ****QueryDSL**** s’impose comme une alternative solide, en offrant une API type-safe et expressive pour écrire des requêtes flexibles.

## Présentation de QueryDSL

****QueryDSL**** est une bibliothèque Java permettant de générer des requêtes SQL ou JPQL de façon ****typée**** et ****fluide****.  
Elle repose sur la génération de classes dites ****Q-types****, correspondant à vos entités JPA. Ces classes exposent les attributs de vos entités sous forme d’objets manipulables directement dans le code.

Exemple simple :

```java
QBook book = QBook.book;

List<Book> books = new JPAQueryFactory(entityManager)
        .selectFrom(book)
        .where(book.title.eq("Le Seigneur des Anneaux"))
        .fetch();
```

Ici, la méthode `book.title.eq(...)` est ****sécurisée au moment de la compilation**** : si l’entité change (changement de nom ou suppression de champ), le compilateur détecte l’erreur.

## ⚖️ Avantages et inconvénients

### ➕ Avantages

- ****Sécurité de typage**** : toute erreur est détectée au build.
- ****Requêtes dynamiques**** : gestion élégante de filtres conditionnels.
- ****Lisibilité**** : syntaxe fluide et proche du SQL.
- ****Intégration avec Spring Data**** : QueryDSL s’insère naturellement dans les repositories Spring.

### ➖ Inconvénients

- ****Courbe d’apprentissage**** : il faut se familiariser avec l’API.
- ****Configuration supplémentaire**** : génération des classes Q via annotation processor.
- ****Verbosité pour les requêtes simples**** : un repository classique est parfois suffisant.

## Installation dans un projet [[Il était une fois... Spring Boot|Spring Boot]]

Pour installer Query-dsl dans votre projet, il suffit d'ajouter les dépendances suivante dans votre fichier `pom.xml``

```xml
<dependency>
    <groupId>com.querydsl</groupId>
    <artifactId>querydsl-jpa</artifactId>
    <version>5.1.0</version>
    <classifier>jakarta</classifier>
</dependency>
<dependency>
    <groupId>com.querydsl</groupId>
    <artifactId>querydsl-apt</artifactId>
    <version>5.1.0</version>
    <classifier>jakarta</classifier>
    <scope>provided</scope>
</dependency>
```

Et configurez le processeur d’annotation dans le plugin `maven-compiler-plugin` :

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <configuration>
        <annotationProcessorPaths>
            <path>
                <groupId>com.querydsl</groupId>
                <artifactId>querydsl-apt</artifactId>
                <version>5.1.0</version>
                <classifier>jakarta</classifier>
            </path>
            <path>
                <groupId>jakarta.persistence</groupId>
                <artifactId>jakarta.persistence-api</artifactId>
                <version>3.1.0</version>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

Après compilation (`mvn clean compile`), les classes Q sont générées dans `target/generated-sources`.

## Cas pratique : requêtes dynamiques avec filtres, pagination et tri

Prenons l’exemple d’une entité `Book`, enrichie avec plusieurs types de champs :

```java
@Entity
public class Book {
    @Id
    @GeneratedValue
    private Long id;
    private String title;
    private String author;
    @Column(name = "`year`")
    private Integer year;
    private LocalDate publicationDate;
    private Double price;

    //getter et setter
}
```

Nous voulons permettre à l’utilisateur de :

- filtrer par titre, auteur, période de publication, prix, etc.
- combiner ces critères librement (requêtes à géométrie variable)
- ajouter pagination et tri dynamiques.

### Méthode de recherche avancée

```java
public Page<Book> searchBooks(String title,
                                  String author,
                                  Integer minYear,
                                  Integer maxYear,
                                  LocalDate publishedAfter,
                                  LocalDate publishedBefore,
                                  Double minPrice,
                                  Double maxPrice,
                                  Pageable pageable) {

    QBook book = QBook.book;
    BooleanBuilder builder = new BooleanBuilder();

    // Filtres dynamiques
    if (title != null && !title.isEmpty()) {
        builder.and(book.title.containsIgnoreCase(title));
    }
    if (author != null && !author.isEmpty()) {
        builder.and(book.author.equalsIgnoreCase(author));
    }
    if (minYear != null) {
        builder.and(book.year.goe(minYear));
    }
    if (maxYear != null) {
        builder.and(book.year.loe(maxYear));
    }
    if (publishedAfter != null) {
        builder.and(book.publicationDate.after(publishedAfter));
    }
    if (publishedBefore != null) {
        builder.and(book.publicationDate.before(publishedBefore));
    }
    if (minPrice != null) {
        builder.and(book.price.goe(minPrice));
    }
    if (maxPrice != null) {
        builder.and(book.price.loe(maxPrice));
    }

    // Tri dynamique
    List<OrderSpecifier<?>> orders = new ArrayList<>();
    pageable.getSort().forEach(order -> {
        PathBuilder<Book> path = new PathBuilder<>(Book.class, "book");
        orders.add(new OrderSpecifier(
                order.isAscending() ? Order.ASC : Order.DESC,
                path.get(order.getProperty(), Comparable.class)
        ));
    });

    // Résultats paginés
    List<Book> results = queryFactory.selectFrom(book)
            .where(builder)
            .orderBy(orders.toArray(new OrderSpecifier[0]))
            .offset(pageable.getOffset())
            .limit(pageable.getPageSize())
            .fetch();

    long total = queryFactory.selectFrom(book)
            .where(builder)
            .fetchCount();

    return new PageImpl<>(results, pageable, total);

}
```

```java
public Page<Book> searchBooks(String title,
                              String author,
                              Integer minYear,
                              Integer maxYear,
                              LocalDate publishedAfter,
                              LocalDate publishedBefore,
                              Double minPrice,
                              Double maxPrice,
                              Pageable pageable)
```

- Les ****paramètres**** représentent des filtres potentiels (titre, auteur, bornes sur l’année, dates de publication, prix).
- Tous sont ****optionnels**** : si la valeur est `null`, le filtre n’est pas appliqué.
- Le paramètre `Pageable` est fourni par Spring Data et contient :
    - la page courante,
    - la taille de page (nombre d’éléments par page),
    - les informations de tri (champ, ascendant/descendant).
- Le retour est un `Page<Book>`, un objet standard de Spring qui contient :
    - les résultats paginés,
    - le nombre total d’éléments correspondant aux filtres,
    - les informations de pagination.

```java
QBook book = QBook.book;
```

`QBook` est la classe générée automatiquement par QueryDSL pour représenter l’entité `Book`.  
Chaque champ (`title`, `author`, `year`, etc.) y est accessible avec des méthodes adaptées (`eq`, `containsIgnoreCase`, `before`, `goe`, etc.).

```java
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBook extends EntityPathBase<Book> {

    private static final long serialVersionUID = -1099649362L;

    public static final QBook book = new QBook("book");

    public final StringPath author = createString("author");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Double> price = createNumber("price", Double.class);

    public final DatePath<java.time.LocalDate> publicationDate = createDate("publicationDate", java.time.LocalDate.class);

    public final StringPath title = createString("title");

    public final NumberPath<Integer> year = createNumber("year", Integer.class);

    public QBook(String variable) {
        super(Book.class, forVariable(variable));
    }

    public QBook(Path<? extends Book> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBook(PathMetadata metadata) {
        super(Book.class, metadata);
    }

}
```

```java
BooleanBuilder builder = new BooleanBuilder();
```

`BooleanBuilder` sert de ****conteneur de conditions****. On y ajoute progressivement des contraintes en fonction des paramètres non nuls.

Exemple pour le titre :

```java
if (title != null && !title.isEmpty()) {
    builder.and(book.title.containsIgnoreCase(title));
}
```

- Si `title` est fourni, on ajoute un filtre "le titre contient la chaîne (sans tenir compte de la casse)".
- Si `title` est `null` ou vide, aucun filtre n’est ajouté.

Idem pour les autres champs :

- `author.equalsIgnoreCase(author)` → auteur exact mais insensible à la casse.
- `year.goe(minYear)` / `year.loe(maxYear)` → année comprise entre deux bornes.
- `publicationDate.after(...)` / `before(...)` → intervalle de dates.
- `price.goe(minPrice)` / `price.loe(maxPrice)` → prix minimum et maximum.

****Résultat**** : une requête qui ne contient ****que les filtres renseignés****, sans qu’on ait besoin d’écrire plusieurs méthodes.

```java
List<OrderSpecifier<?>> orders = new ArrayList<>();
pageable.getSort().forEach(order -> {
    PathBuilder<Book> path = new PathBuilder<>(Book.class, "book");
    orders.add(new OrderSpecifier(
            order.isAscending() ? Order.ASC : Order.DESC,
            path.get(order.getProperty(), Comparable.class)
    ));
});
```

- On récupère les critères de tri demandés depuis `pageable.getSort()`.
- `PathBuilder` permet d’accéder dynamiquement aux propriétés de `Book` à partir de leur nom (`title`, `price`, `publicationDate`…).
- Pour chaque critère, on construit un `OrderSpecifier` :
- - `Order.ASC` si tri ascendant,
    - `Order.DESC` sinon.
- On ajoute ces ordres à la requête.

Ainsi, on peut trier par n’importe quel champ de l’entité sans coder une méthode par cas.

```java
List<Book> results = queryFactory.selectFrom(book)
        .where(builder)
        .orderBy(orders.toArray(new OrderSpecifier[0]))
        .offset(pageable.getOffset())
        .limit(pageable.getPageSize())
        .fetch();
```

- `selectFrom(book)` → sélectionne tous les livres.
- `where(builder)` → applique uniquement les filtres réellement définis.
- `orderBy(...)` → applique le tri défini dynamiquement.
- `offset(...)` → saute les éléments des pages précédentes.
- `limit(...)` → limite le nombre de résultats à la taille de page.
- `fetch()` → exécute la requête et retourne la liste des livres.

```java
long total = queryFactory.selectFrom(book)
        .where(builder)
        .fetchCount();
```

Cette requête ne prend pas en compte la pagination (`offset`/`limit`) :

- elle compte le nombre total de livres correspondant aux critères,
- ce nombre est nécessaire pour que Spring Data calcule correctement le nombre de pages.

```java
return new PageImpl<>(results, pageable, total);
```

- `results` → liste des livres pour la page demandée.
- `pageable` → contient les infos sur la pagination et le tri appliqués.
- `total` → nombre total d’éléments correspondant aux filtres.

L’objet `PageImpl` peut être retourné tel quel à un contrôleur Spring MVC ou utilisé directement dans une vue [[Vaadin - définition|Vaadin]], avec gestion automatique de la pagination.

### Résumé

Cette méthode illustre parfaitement la force de QueryDSL :

- ****Filtres optionnels**** → ajoutés uniquement si le paramètre est présent.
- ****Tri dynamique**** → adaptable à n’importe quel champ.
- ****Pagination**** → ne charge que les données nécessaires.
- ****Robustesse**** → type-safe, aucune concaténation de chaînes JPQL.

## Exemple sans QueryDSL : un `BookRepository` ingérable

Avec ****Spring Data JPA classique****, on serait obligé d’écrire des méthodes dérivées du nom, ou des `@Query`.  
Voici un exemple (tronqué, mais suffisamment long pour montrer l’horreur) :

```java
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    // Recherche par titre
    List<Book> findByTitleContainingIgnoreCase(String title);
    List<Book> findByTitleContainingIgnoreCaseAndAuthorIgnoreCase(String title, String author);
    List<Book> findByTitleContainingIgnoreCaseAndYearGreaterThanEqual(String title, Integer minYear);
    List<Book> findByTitleContainingIgnoreCaseAndYearLessThanEqual(String title, Integer maxYear);
    List<Book> findByTitleContainingIgnoreCaseAndPublicationDateAfter(String title, LocalDate after);
    List<Book> findByTitleContainingIgnoreCaseAndPublicationDateBefore(String title, LocalDate before);
    List<Book> findByTitleContainingIgnoreCaseAndPriceGreaterThanEqual(String title, Double minPrice);
    List<Book> findByTitleContainingIgnoreCaseAndPriceLessThanEqual(String title, Double maxPrice);

    // Recherche par auteur
    List<Book> findByAuthorIgnoreCase(String author);
    List<Book> findByAuthorIgnoreCaseAndYearGreaterThanEqual(String author, Integer minYear);
    List<Book> findByAuthorIgnoreCaseAndYearLessThanEqual(String author, Integer maxYear);
    List<Book> findByAuthorIgnoreCaseAndPublicationDateAfter(String author, LocalDate after);
    List<Book> findByAuthorIgnoreCaseAndPublicationDateBefore(String author, LocalDate before);
    List<Book> findByAuthorIgnoreCaseAndPriceBetween(String author, Double minPrice, Double maxPrice);

    // Recherche par année
    List<Book> findByYearBetween(Integer minYear, Integer maxYear);
    List<Book> findByYearGreaterThanEqual(Integer minYear);
    List<Book> findByYearLessThanEqual(Integer maxYear);

    // Recherche par date de publication
    List<Book> findByPublicationDateAfter(LocalDate after);
    List<Book> findByPublicationDateBefore(LocalDate before);
    List<Book> findByPublicationDateBetween(LocalDate after, LocalDate before);

    // Recherche par prix
    List<Book> findByPriceBetween(Double minPrice, Double maxPrice);
    List<Book> findByPriceGreaterThanEqual(Double minPrice);
    List<Book> findByPriceLessThanEqual(Double maxPrice);

    // Et bien sûr… toutes les combinaisons (titre + auteur + année + date + prix) !
    List<Book> findByTitleContainingIgnoreCaseAndAuthorIgnoreCaseAndYearBetweenAndPriceBetween(
            String title, String author, Integer minYear, Integer maxYear, Double minPrice, Double maxPrice);

    List<Book> findByAuthorIgnoreCaseAndPublicationDateBetweenAndPriceLessThanEqual(
            String author, LocalDate after, LocalDate before, Double maxPrice);

    List<Book> findByTitleContainingIgnoreCaseAndYearGreaterThanEqualAndPublicationDateBefore(
            String title, Integer minYear, LocalDate before);

    // etc... potentiellement des centaines de méthodes nécessaires
}
```

On arrive vite à ****200-300 signatures de méthodes****, car chaque combinaison de filtres doit être explicitement définie.  
C’est ****illisible****, ****impossible à maintenir****, et ça explose le fichier `Repository`.

## Exemple d’un `BookService` sans QueryDSL

Le service qui utilise ce `BookRepository` devient lui aussi un cauchemar :

```java
@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public List<Book> searchBooks(String title, String author,
                                  Integer minYear, Integer maxYear,
                                  LocalDate publishedAfter, LocalDate publishedBefore,
                                  Double minPrice, Double maxPrice) {

        if (title != null && author != null && minYear != null && maxYear != null && minPrice != null && maxPrice != null) {
            return bookRepository.findByTitleContainingIgnoreCaseAndAuthorIgnoreCaseAndYearBetweenAndPriceBetween(
                    title, author, minYear, maxYear, minPrice, maxPrice);
        }

        if (author != null && publishedAfter != null && publishedBefore != null && maxPrice != null) {
            return bookRepository.findByAuthorIgnoreCaseAndPublicationDateBetweenAndPriceLessThanEqual(
                    author, publishedAfter, publishedBefore, maxPrice);
        }

        if (title != null && minYear != null && publishedBefore != null) {
            return bookRepository.findByTitleContainingIgnoreCaseAndYearGreaterThanEqualAndPublicationDateBefore(
                    title, minYear, publishedBefore);
        }

        if (minPrice != null && maxPrice != null) {
            return bookRepository.findByPriceBetween(minPrice, maxPrice);
        }

        if (publishedAfter != null && publishedBefore != null) {
            return bookRepository.findByPublicationDateBetween(publishedAfter, publishedBefore);
        }

        // ...
        // et ainsi de suite, avec des dizaines de if/else pour combiner les critères
        // ...

        return bookRepository.findAll();
    }
}
```

Ici, chaque combinaison doit être codée à la main.  
Résultat : ****duplication énorme****, ****logique complexe****, et gros risque de bug dès qu’on rajoute un nouveau critère.

## Conclusion

Avec QueryDSL, les requêtes complexes deviennent à la fois ****lisibles****, ****sûres**** et ****dynamiques****.  
L’exemple présenté illustre bien la puissance de l’outil : un seul point d’entrée suffit pour gérer une infinité de combinaisons de filtres, avec pagination et tri personnalisables.

Là où JPA classique obligerait à écrire plusieurs méthodes de repository ou à manipuler des chaînes JPQL fragiles, QueryDSL offre une syntaxe expressive et robuste. Certes, il demande une configuration initiale et une petite phase d’apprentissage, mais le gain en flexibilité et en maintenabilité en fait un allié précieux dans les projets Spring Boot ambitieux.
