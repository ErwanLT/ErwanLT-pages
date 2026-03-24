---
layout: "default"
title: "Mise en place du cache dans une application Spring Boot"
permalink: "/springboot/cache/mise-en-place-du-cache-dans-une-application-spring-boot/"
tags: [spring-boot, java, tutoriel, cache]
---
Dans toute application moderne, la performance et la réactivité sont des enjeux majeurs. Les utilisateurs s’attendent à obtenir des réponses rapides, même lorsque les traitements sous-jacents sont coûteux. Le **cache** constitue un outil essentiel pour répondre à ce besoin. Avec [Spring Boot](/springboot/il-etait-une-fois-spring-boot/), il est possible de mettre en place une stratégie de cache efficace en utilisant uniquement des [**annotations**](/springboot/comprendre-les-annotations-dans-spring-boot-guide-et-exemples/).

## Qu’est-ce que le cache ?

Le cache est un mécanisme qui permet de **stocker temporairement des résultats de calcul ou de requêtes** afin de les réutiliser plus tard.

- Lorsqu’une méthode est appelée pour la première fois, son résultat est stocké.
- Aux appels suivants avec les mêmes paramètres, la valeur est directement renvoyée depuis le cache sans exécuter de nouveau la logique métier.

Ce principe permet de réduire les accès répétés à la base de données, d’alléger la charge serveur et de gagner un temps précieux pour l’utilisateur.

## ⚖️ Avantages et inconvénients

### ➕ Avantages

- **Performance accrue** : réduction du temps de réponse.
- **Moins de charge sur la base de données** : moins de requêtes répétitives.
- **Facilité d’intégration avec Spring Boot** grâce aux annotations.

### ➖ Inconvénients

- **Mémoire limitée** : le cache en mémoire peut rapidement saturer si mal utilisé.
- **Données potentiellement obsolètes** : si le cache n’est pas invalidé, on peut afficher des informations périmées.
- **Complexité de gestion** : nécessite une stratégie de mise à jour et d’invalidation adaptée.

## Exemple pratique

### Configuration du cache

Avant d’utiliser nos services, nous définissons un `CacheManager`.  
Même si Spring Boot fournit un `ConcurrentMapCacheManager` par défaut, il est préférable de déclarer explicitement les caches utilisés pour plus de lisibilité et de contrôle.

```java
@Configuration
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager("books");
    }
}
```

Avec cette configuration, Spring saura qu'un cache `books` existe.

### Activer le cache

Dans la classe principal de notre application, nous devons maintenant ajouté l'annotation `@EnableCaching`

```java
@SpringBootApplication
@EnableCaching
public class CacheApplication {
    public static void main(String[] args) {
        SpringApplication.run(CacheApplication.class);
    }
}
```

### Service avec cache

```java
@Service
public class BookService {

    private static final Logger LOG = LoggerFactory.getLogger(BookService.class);

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }
    
    @Cacheable(value = "books", key = "#isbn")
    public Book findBookByIsbn(String isbn) {
        long start = System.currentTimeMillis();

        simulateSlowService(); // simule un traitement lourd
        Book book = bookRepository.findByIsbn(isbn);

        long end = System.currentTimeMillis();
        LOG.info("findBookByIsbn({}) exécuté en {} ms", isbn, (end - start));
        LOG.info("Book : {}", book);
        return book;
    }
    
    @CachePut(value = "books", key = "#book.isbn")
    public Book saveOrUpdateBook(Book book) {
        LOG.info("Mise à jour / ajout du livre [{}] en base et dans le cache", book.getIsbn());
        return bookRepository.save(book);
    }

    @CacheEvict(value = "books", key = "#isbn")
    public void deleteBookByIsbn(String isbn) {
        Optional<Book> book = Optional.ofNullable(bookRepository.findByIsbn(isbn));
        book.ifPresent(b -> {
            bookRepository.delete(b);
            LOG.info("Suppression du livre [{}] en base et invalidation du cache", isbn);
        });
    }

    private void simulateSlowService() {
        try {
            Thread.sleep(3000L); // pause artificielle
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException(e);
        }
    }
}
```

#### Explications des annotations de cache utilisées

- `@Cacheable`
    - Met en cache le résultat d’une méthode.
    - Premier appel → méthode exécutée et résultat stocké.
    - Appels suivants avec la même clé → valeur renvoyée depuis le cache, pas d’exécution.
- `@CachePut`
    - Met à jour le cache **à chaque exécution** de la méthode.
    - Utilisé pour les opérations d’écriture (ajout ou modification).
- `@CacheEvict`
    - Supprime une entrée du cache.
    - Utilisé pour éviter de servir des données obsolètes après une suppression ou modification.
    - Possibilité de vider tout le cache avec `allEntries = true`.

Pour démontrer l'efficacité du cache nous avons ajouté une latence de 3 secondes pour la méthode de recherche.

Au premier appel nous pouvons constater que le temps de réponse est plus long.

[![](https://www.sfeir.dev/content/images/2025/08/image-8-1.png)](https://www.sfeir.dev/content/images/2025/08/image-8-1.png)

Ce qui est démontré par les logs du service

```log
2025-08-21T12:51:54.452+02:00  INFO 73577 --- [nio-8080-exec-1] [                                                 ] fr.eletutour.cache.service.BookService   : findBookByIsbn(9782253006329) exécuté en 3243 ms
2025-08-21T12:51:54.452+02:00  INFO 73577 --- [nio-8080-exec-1] [                                                 ] fr.eletutour.cache.service.BookService   : Book : Book{id=1, isbn='9782253006329', title='Le Petit Prince'}
```

Lors du prochain appel, nous ne rentrerons même pas dans notre méthode, et irons chercher directement l'information souhaité depuis le cache

[![](https://www.sfeir.dev/content/images/2025/08/image-9-1.png)](https://www.sfeir.dev/content/images/2025/08/image-9-1.png)

## Bonnes pratiques

1. Choisir soigneusement les méthodes à mettre en cache.
2. Définir une stratégie d’invalidation (`@CacheEvict`) pour éviter les données obsolètes.
3. Nommer clairement vos caches (`books`, `authors`, ...) pour faciliter la maintenance.
4. Surveiller l’utilisation mémoire pour ne pas saturer la JVM.
5. Éviter le cache sur des données trop volatiles.

## Conclusion

Spring Boot offre une gestion du cache **simple et efficace** grâce aux annotations. Avec un `CacheManager` explicitement déclaré et des logs de temps d’exécution, on visualise clairement les gains de performance.  
Les annotations `@Cacheable`, `@CachePut` et `@CacheEvict` permettent de synchroniser automatiquement le cache avec la base, améliorant la réactivité et l’expérience utilisateur tout en restant facile à maintenir et à faire évoluer.
