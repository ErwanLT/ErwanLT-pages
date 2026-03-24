---
layout: "default"
title: "Accélérer son application Spring Boot grâce à l’asynchrone"
permalink: "/back/java/spring-boot/accelerer-son-application-spring-boot-grace-a-l-asynchrone/"
tags: [back, java, spring-boot]
date: "2026-03-17"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/accelerer-son-application-spring-boot-grace-a-lasynchrone/"
banner: "https://www.sfeir.dev/content/images/size/w1304/2025/08/20250822_1631_Pixelated-Async-Juggler_simple_compose_01k392xdsfecr9eb49jbpt4snw.png"
published_at: "2026-03-17"
sfeir_slug: "accelerer-son-application-spring-boot-grace-a-lasynchrone"
sfeir_tags: [Back, Java, Spring Boot, Asynchrone]
---
Dans les applications modernes, la réactivité est devenue essentielle. Qu’il s’agisse de lancer des calculs intensifs ou d’interroger des API externes, il est préférable de ne pas bloquer le fil principal.  
[[Il était une fois... Spring Boot|Spring Boot]], combiné avec `CompletableFuture`, offre un moyen simple et efficace pour gérer ces traitements asynchrones. Contrairement à l’utilisation d’un système de messagerie comme Kafka ou RabbitMQ, cette approche reste légère et parfaitement adaptée pour des scénarios internes.

## Prérequis

Il est nécessaire d'activer d’activer l’asynchronisme dans la classe principale ou dans une configuration via [[Comprendre les annotations dans Spring Boot - guide et exemples|l'annotation]] `@EnableAsync`.

```java
@SpringBootApplication
@EnableAsync
public class AsyncApplication {
    public static void main(String[] args) {
        SpringApplication.run(AsyncApplication.class);
    }
}
```

## Configuration de l’asynchronisme

### Définir un `TaskExecutor`

Spring utilise un exécuteur pour gérer le pool de threads. Voici une configuration classique :

```java
@Configuration
public class AsyncConfig {

    @Bean
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);
        executor.setMaxPoolSize(8);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("Async-");
        executor.initialize();
        return executor;
    }
}
```

Ici on spécifie à notre Executor les information suivantes :

- 4 threads minimum
- 8 thread maximum
- La taille de la file d'attente si tout les threads sont occupés
- Le préfix de chaque threads (utile pour le débug)

## Utilisation de `CompletableFuture`

### Service asynchrone simple

Un service annoté avec `@Async` retourne directement un `CompletableFuture` :

```java
@Async
public CompletableFuture<String> getStock(Long productId) {
    LOGGER.info("get stock");
    simulateDelay();
    return CompletableFuture.completedFuture("Stock: Disponible");
}
```

Attend 2 minutes ! Si c'est directement un `CompletableFuture`, pourquoi dois je le spécifier explicitement ?

La réponse tient à la **différence entre l’exécution asynchrone et le type de retour** :

- `@Async` seule ne change pas le type de retour
    - Quand tu annotes une méthode avec `@Async`, Spring exécute cette méthode dans un thread séparé.
    - **Mais si tu ne renvoies pas un `Future` ou `CompletableFuture`, tu ne peux pas récupérer le résultat de manière non bloquante.**
- `CompletableFuture` permet de manipuler le résultat
    - Si tu veux récupérer un résultat ou combiner plusieurs appels asynchrones, il faut **un type qui supporte la complétion future**.
    - `CompletableFuture` te permet :
        - d’attendre la fin (`join()` ou `get()`),
        - de combiner plusieurs tâches (`allOf`, `anyOf`),
        - de gérer les erreurs (`exceptionally`, `handle`).

### Combiner plusieurs tâches

Il est possible de combiner plusieurs tâches pour attendre leur achèvement avec `allOf` :

```java
public CompletableFuture<String> generateAllReports() {
    CompletableFuture<String> report1 = generateReport("Finance");
    CompletableFuture<String> report2 = generateReport("Ventes");
    CompletableFuture<String> report3 = generateReport("RH");

    return CompletableFuture.allOf(report1, report2, report3)
            .thenApply(v -> String.join(", ",
                    report1.join(), report2.join(), report3.join()));
}
```

## Exemple concret

Imaginons une boutique en ligne. Pour afficher la page d’un produit, il faut :

- récupérer son **prix** via un service de tarification,
- récupérer le **stock** disponible via un service logistique,
- récupérer les **avis clients** via un service externe.

Si chaque appel prend environ 1,5 seconde :

- en séquentiel → 4,5 s
- en asynchrone → 1,5 s (le temps du plus lent)

Voyons comment mettre ça en place.

### Le service asynchrone

```java
@Service
public class ProductAsyncService {

    private final Logger LOGGER = LoggerFactory.getLogger(ProductAsyncService.class);

    @Async
    public CompletableFuture<String> getPrice(Long productId) {
        LOGGER.info("get price for product {}", productId);
        simulateDelay();
        // Simuler une erreur pour un produit spécifique afin de tester la gestion d'erreur
        if (productId.equals(1L)) {
            LOGGER.error("Erreur simulée pour le produit 1");
            throw new RuntimeException("Erreur lors de la récupération du prix");
        }
        return CompletableFuture.completedFuture("Prix: 199€");
    }

    @Async
    public CompletableFuture<String> getStock(Long productId) {
        LOGGER.info("get stock");
        simulateDelay();
        return CompletableFuture.completedFuture("Stock: Disponible");
    }

    @Async
    public CompletableFuture<String> getReviews(Long productId) {
        LOGGER.info("get reviews");
        simulateDelay();
        return CompletableFuture.completedFuture("Avis: ★★★★☆");
    }

    private void simulateDelay() {
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
```

Pour démontrer le bon fonctionnement de l'asynchrone, chaque méthode à un temps de **latence de 1,5 secondes**, si elles étaient appelé de manière séquentielle nous aurions un **temps de traitement avoisinant les 4,5 secondes**.

### Le service orchestrateur

```java
@Service
public class ProductService {

    private final ProductAsyncService asyncService;

    public ProductService(ProductAsyncService asyncService) {
        this.asyncService = asyncService;
    }

    public CompletableFuture<String> getFullProductDetails(Long productId) {
        CompletableFuture<String> price = asyncService.getPrice(productId)
                .exceptionally(ex -> "Prix indisponible");
        CompletableFuture<String> stock = asyncService.getStock(productId)
                .exceptionally(ex -> "Stock indisponible");
        CompletableFuture<String> reviews = asyncService.getReviews(productId)
                .exceptionally(ex -> "Avis indisponibles");

        return CompletableFuture.allOf(price, stock, reviews)
                .thenApply(v -> String.join(" | ",
                        price.join(), stock.join(), reviews.join()));
    }

    public CompletableFuture<String> getFullProductDetailsOrFailFast(Long productId) {
        CompletableFuture<String> price = asyncService.getPrice(productId);
        CompletableFuture<String> stock = asyncService.getStock(productId);
        CompletableFuture<String> reviews = asyncService.getReviews(productId);

        return CompletableFuture.allOf(price, stock, reviews)
                .thenApply(v -> String.join(" | ",
                        price.join(), stock.join(), reviews.join()));
    }
}
```

Ici les 2 méthodes font la même chose ou presque :

- `getFullProductDetails` est une implémentation de **succès partiel**, si une opération échoue, ce n'est pas grave on continue avec les autres
- `getFullProductDetailsOrFailFast` est une implémentation de type t**out ou rien**, Si un seul des appels asynchrones échoue, on considère que l'opération globale a échoué et on retourne une erreur globale.
    - Pas de `exceptionally` ici, le `CompletableFuture` qui sera renvoyé au controller sera dans un état d'exception et sera géré par notre [[Comment bien gérer ses exceptions dans Spring Boot|controller advice qui renverra le code erreur adéquat]].

---

Pourquoi avoir 2 services ?  
Spring gère `@Async` via **un proxy dynamique**. Cela signifie que **les appels internes d’une même classe ne passent pas par le proxy** et restent synchrones.

En découpant en **deux services** :

1. **ProductAsyncService** → contient les méthodes `@Async` exécutées dans des threads séparés.
2. **ProductService** → orchestre et combine les résultats.

✅ Avantages :

- Les méthodes asynchrones sont bien exécutées **en parallèle**,
- Le code reste **clair et testable**,
- On évite les pièges liés aux appels internes dans la même classe.

En résumé : **séparer l’orchestration de l’exécution asynchrone garantit que l’asynchronisme fonctionne réellement**.

---

### Le controller REST

```java
@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/{id}/details")
    public CompletableFuture<String> getProductDetails(@PathVariable Long id) {
        return productService.getFullProductDetails(id);
    }

    @GetMapping("/{id}/details-fail-fast")
    public CompletableFuture<String> getProductDetailsOrFailFast(@PathVariable Long id) {
        return productService.getFullProductDetailsOrFailFast(id);
    }
}
```

Point d'entré de notre API c'est par lui que nous récupérerons les résultat de nos appels.  
Il nous reste maintenant plus qu'à tester nos 2 appels :

[![](https://www.sfeir.dev/content/images/2025/08/image-13-1.png)](https://www.sfeir.dev/content/images/2025/08/image-13-1.png)

[![](https://www.sfeir.dev/content/images/2025/08/image-15-1.png)](https://www.sfeir.dev/content/images/2025/08/image-15-1.png)

## Conclusion

L’utilisation de `CompletableFuture` avec Spring Boot et `@Async` permet de gérer efficacement des tâches longues ou parallèles sans complexité excessive.  
Cette approche convient parfaitement aux scénarios où un **asynchronisme léger** est suffisant.

Pour des cas plus poussés (streams massifs, événements distribués), il conviendra d’examiner des alternatives comme **Spring WebFlux** ou l’intégration avec des systèmes de messagerie ([[Intégration de Kafka dans une application Spring Boot|Kafka]], RabbitMQ).
