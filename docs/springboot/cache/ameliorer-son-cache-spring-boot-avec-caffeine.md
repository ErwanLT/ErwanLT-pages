---
layout: "default"
title: "Améliorer son cache Spring Boot avec Caffeine"
permalink: "/springboot/cache/ameliorer-son-cache-spring-boot-avec-caffeine/"
tags: [spring-boot, java, tutoriel, cache]
---
Dans un [article précédent](/springboot/cache/mise-en-place-du-cache-dans-une-application-spring-boot/), nous avons vu comment mettre en place un **cache en mémoire simple** avec [Spring Boot](/springboot/il-etait-une-fois-spring-boot/) en utilisant uniquement le `ConcurrentMapCacheManager`.  
Cette approche est idéale pour comprendre le mécanisme et tester rapidement [les annotations de Spring](/springboot/comprendre-les-annotations-dans-spring-boot-guide-et-exemples/) (`@Cacheable`, `@CachePut`, `@CacheEvict`).

Cependant, dans une application réelle, ce cache présente rapidement des limites :

- **Pas de gestion d’expiration** : une donnée reste en cache jusqu’à éviction manuelle.
- **Pas de limite de taille** : si les données mises en cache sont nombreuses, la mémoire peut saturer.

Pour répondre à ces besoins, Spring Boot permet d’intégrer facilement une solution plus avancée : **Caffeine**.

## Pourquoi Caffeine ?

[Caffeine](https://github.com/ben-manes/caffeine) est une bibliothèque Java moderne et performante de gestion de cache (en plus, c'est [open source](https://www.sfeir.dev/tag/open-source/)). Elle apporte des fonctionnalités essentielles absentes du cache en mémoire basique :

- **Expiration automatique** des entrées (TTL).
- **Limite de taille** avec stratégie d’éviction (**LRU** – Least Recently Used).
- **Performances optimisées** pour des accès très fréquents.
- **Politiques flexibles** : `expireAfterWrite`, `expireAfterAccess`, `refreshAfterWrite`…

[

GitHub - ben-manes/caffeine: A high performance caching library for Java

A high performance caching library for Java. Contribute to ben-manes/caffeine development by creating an account on GitHub.

![](https://www.sfeir.dev/content/images/icon/pinned-octocat-093da3e6fa40-100.svg)GitHubben-manes

![](https://www.sfeir.dev/content/images/thumbnail/caffeine)

](https://github.com/ben-manes/caffeine)

### La stratégie LRU : “Least Recently Used”

Quand le cache atteint sa capacité maximale, il doit choisir quel élément supprimer pour faire de la place.

- Chaque élément garde en mémoire la **dernière fois qu’il a été consulté**.
- Quand il faut faire de la place, on supprime **l’élément qui n’a pas été utilisé depuis le plus longtemps**.
- Cela permet de conserver les données les plus pertinentes, car celles utilisées récemment ont plus de chances d’être redemandées.

**Exemple illustré**

Supposons que notre cache a une capacité de **3 livres**.

- Étape 1 → ajout de A, B et C.
- Étape 2 → on consulte A et B → ils deviennent “récents”.
- Étape 3 → ajout de D → le cache est plein → C est supprimé (car le moins récemment utilisé).

[![](https://www.sfeir.dev/content/images/2025/09/cache.png)](https://www.sfeir.dev/content/images/2025/09/cache.png)

## Mise en place de Caffeine dans votre application

### Dépendances Maven

Dans votre fichier `pom.xml`, ajoutez les dépendances suivantes :

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
</dependency>
```

### Configuration

```java
@Configuration
public class CaffeineCacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager("books");
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .expireAfterWrite(10, TimeUnit.MINUTES) // expiration 10 min
                .maximumSize(500)); // limite de 500 entrées
        return cacheManager;
    }
}
```

Ici, nous définissons :

- une **expiration automatique** des données au bout de 10 minutes,
- un cache limité à **500 objets** avec éviction LRU.

### Service avec cache

Bonne nouvelle : la logique métier ne change pas.  
On continue d’utiliser les mêmes annotations Spring (`@Cacheable`, `@CachePut`, `@CacheEvict`).

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

C’est uniquement le **CacheManager** qui change, pas le code applicatif.

## Comparaison : ConcurrentMap vs Caffeine

|Critère|ConcurrentMapCacheManager|CaffeineCacheManager|
|---|---|---|
|Expiration auto (TTL)|❌ non géré|✅ configurable|
|Taille max|❌ illimitée|✅ configurable|
|Stratégie d’éviction|❌ aucune|✅ LRU|
|Performances|Basique|Optimisé|

## Conclusion

- Avec **ConcurrentMap**, nous avons un cache minimaliste, idéal pour apprendre.
- Avec **Caffeine**, nous bénéficions d’une gestion avancée : **expiration, taille max, éviction intelligente**.
- Le passage de l’un à l’autre est **transparent pour le code métier**, seules les dépendances et la configuration changent.

Caffeine représente ainsi une évolution naturelle vers une solution plus robuste, tout en restant simple à intégrer dans un projet Spring Boot.
