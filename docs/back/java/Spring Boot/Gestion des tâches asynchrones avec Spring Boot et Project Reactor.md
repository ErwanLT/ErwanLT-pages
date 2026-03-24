---
layout: "default"
title: "Gestion des tâches asynchrones avec Spring Boot et Project Reactor"
permalink: "/back/java/spring-boot/gestion-des-taches-asynchrones-avec-spring-boot-et-project-reactor/"
tags: [back, java, spring-boot]
status: "Draft"
---
Cet article explore comment utiliser [[Il était une fois... Spring Boot|**Spring Boot**]] avec [**Project Reactor**](https://projectreactor.io/) pour implémenter des traitements asynchrones et réactifs dans une application Java. Il montre comment configurer Reactor, utiliser les types `Mono` et `Flux` pour les opérations non bloquantes, et intégrer ces flux réactifs dans une API Spring WebFlux performante.  
Nous abordons également un exemple concret (appels HTTP asynchrones ou traitement de fichiers en arrière-plan), avec un code complet et annoté, ainsi que les bonnes pratiques pour gérer les erreurs réactives et optimiser les performances.

## Introduction

La programmation **réactive** permet de construire des applications non bloquantes et asynchrones qui gèrent efficacement des flux de données et le back-pressure. Les systèmes réactifs sont conçus pour les charges _faible-latence_ et _haut-débit_, répondant de manière élastique et résiliente aux pics de trafic.  
Contrairement à Spring MVC (un thread par requête bloquante), Spring WebFlux utilise l’I/O non bloquante : un petit pool de threads peut traiter des milliers de requêtes simultanées.

Les cas d’usage typiques des tâches asynchrones incluent, par exemple :

- **Appels HTTP externes** (consommer des APIs tierces sans bloquer le thread principal).
- **Traitement de fichiers volumineux** (lecture/écriture de gros fichiers CSV en arrière-plan).
- **Envoi d’emails ou notifications** (longues opérations de réseau).
- **Traitement de données en continu** (streaming d’événements en temps réel).

La nature non bloquante du modèle réactif permet de mieux utiliser les ressources (CPU/mémoire) pour ces scénarios, en répondant à plus d’utilisateurs simultanés avec moins de threads.  
Par exemple, un système de trading haute fréquence ou une application de streaming temps réel tirera parti du modèle réactif pour rester performant sous forte concurrence.

## Qu’est-ce que Project Reactor ?

Project Reactor est une librairie Java développée par **Pivotal (aujourd’hui VMware)**, conçue pour gérer la **programmation réactive**.  
Elle implémente la spécification **Reactive Streams**, qui définit 4 interfaces fondamentales (Publisher, Subscriber, Subscription, Processor) pour gérer des flux de données asynchrones de manière **non bloquante** et **backpressurée** (contrôle du débit).

Grâce à Reactor, on peut manipuler ces flux comme on le ferait avec les [**Streams Java 8**](https://www.sfeir.dev/back/api-stream-definition/), mais avec des capacités supplémentaires :

- Gestion native de l’asynchronicité.
- Support de millions d’événements en parallèle.
- Contrôle précis de la consommation des données (backpressure).
- Intégration étroite avec Spring (notamment **Spring WebFlux**).

## Prérequis

Avant de commencer, il est nécessaire de créer un projet Spring Boot et d’ajouter la dépendance WebFlux.

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

Cette dépendance intègre Spring Boot, le framework Spring WebFlux et Reactor Core (et utilise par défaut Netty comme serveur réactif).  
Il suffit ensuite d’[[Comprendre les annotations dans Spring Boot - guide et exemples|annoter votre application]] avec `@SpringBootApplication`, WebFlux s’auto-configure automatiquement. Aucun autre préparatif n’est nécessaire côté serveur web , ni dans le fichier de configuration `application.properties` à moins de vouloir personnaliser le port, les timeouts, ...  
L’essentiel est donc d’inclure **`spring-boot-starter-webflux`** pour activer le stack réactif

## Concepts de base de Project Reactor

### Mono et Flux

- Mono = représente un flux contenant **zéro ou un élément**. Idéal pour une réponse unique (par exemple : retour d’un objet ou d’un statut).
- Flux = représente un flux contenant **0, N** . Parfait pour le streaming ou le traitement de collections.

```java
Mono<String> mono = Mono.just("Bonjour Reactor");
Flux<Integer> flux = Flux.range(1, 5);
```


### Bloquant vs Non Bloquant

- **Programmation bloquante** : un thread attend la fin d’une opération (exemple : accès à une base de données synchrone).
- **Programmation non bloquante** : un thread initie une tâche et peut s’occuper d’autre chose pendant que la tâche s’exécute (exemple : appel HTTP réactif).

Cette différence est la clé pour améliorer la **scalabilité** et réduire la consommation de ressources.

## Configuration de Spring WebFlux

Pour créer une [API](https://www.sfeir.dev/kesaco-api/) réactive, on utilise typiquement les mêmes annotations Spring MVC (`@RestController`, `@GetMapping`, etc.), mais les méthodes renvoient `Mono<T>` ou `Flux<T>` au lieu d’un objet direct ou d’un `ResponseEntity`. Par exemple, un contrôleur réactif peut ressembler à :

```java
@RestController
@RequestMapping("/api")
public class ReactiveController {

    private final WebClient webClient = WebClient.create("https://jsonplaceholder.typicode.com");

    @GetMapping("/posts/{id}")
    public Mono<Post> getPost(@PathVariable String id) {
        return webClient.get()
                .uri("/posts/{id}", id)
                .retrieve()
                .onStatus(HttpStatusCode::isError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "API call failed")))
                .bodyToMono(Post.class);
    }

    @GetMapping("/posts")
    public Flux<Post> getPosts() {
        return webClient.get()
                .uri("/posts")
                .retrieve()
                .onStatus(HttpStatusCode::isError, response -> Mono.error(new ResponseStatusException(response.statusCode(), "API call failed")))
                .bodyToFlux(Post.class);
    }
}
```

Dans cet exemple : la méthode `getPost` renvoie un `Mono<Post>` issu d’un appel HTTP asynchrone (via `WebClient`), et `getPosts` renvoie un `Flux<Post>` . Remarquons l’utilisation de **WebClient** : c’est le client HTTP non bloquant de Spring WebFlux.

### Configuration des threads (Schedulers)

Le modèle réactif repose sur des _Schedulers_ pour gérer les threads. Par défaut, Reactor utilise un scheduler optimisé pour les opérations non bloquantes (comme Netty). Si vous avez des opérations **bloquantes** (par exemple un appel synchrone à une base de données ou à un service externe), il faut les déporter sur un scheduler adapté.  
Par exemple :

```java
@GetMapping("/posts/{id}/enriched")
public Mono<Post> getEnrichedPost(@PathVariable String id) {
    return getPost(id)
            .flatMap(post -> Mono.fromCallable(() -> enrichPostBlocking(post))
                    .subscribeOn(Schedulers.boundedElastic())
            );
}


private Post enrichPostBlocking(Post post) {
    try {
        Thread.sleep(1000);
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
    return new Post(
            post.userId(),
            post.id(),
            "[Enriched] " + post.title(),
            post.body()
    );
}
```

Le guide de Project Reactor recommande ainsi de créer un `Mono` à partir de l’appel bloquant (via `Mono.fromCallable`) et d’utiliser `.subscribeOn(Schedulers.boundedElastic())` pour exécuter ce bloc sur un thread dédié (un thread pool élastique pour les tâches bloquantes).

De même, on peut utiliser `.publishOn(scheduler)` pour basculer explicitement le scheduler à un autre point de la chaîne réactive.  
Cette gestion fine des threads évite de bloquer le pool principal et permet de mélanger harmonieusement code réactif et tâches traditionnelles.

## Gestion des erreurs

Lorsqu’on effectue des appels HTTP asynchrones avec `WebClient`, il est crucial de [gérer correctement les erreurs](https://www.sfeir.dev/back/comment-bien-gerer-ses-erreur-dans-springboot/) renvoyées par l’API distante.  
Avec Reactor, cela se fait grâce à la méthode **`.onStatus`**, qui intercepte les réponses en erreur (4xx, 5xx).

```java
@GetMapping("/posts/{id}")
public Mono<Post> getPost(@PathVariable String id) {
    return webClient.get()
            .uri("/posts/{id}", id)
            .retrieve()
            .onStatus(HttpStatusCode::isError, response ->
                Mono.error(new ResponseStatusException(
                        response.statusCode(),
                        "API call failed"
                ))
            )
            .bodyToMono(Post.class);
}
```

- `HttpStatusCode::isError` capture toute réponse **4xx ou 5xx**.
- `Mono.error(...)` permet de renvoyer une exception claire (`ResponseStatusException`) qui pourra être traitée plus haut dans la chaîne réactive ou par un contrôleur advice global.
- En cas de succès, la réponse est désérialisée dans un `Mono<Post>`.

## Conclusion

Spring WebFlux (avec Project Reactor) est particulièrement adapté aux applications **IO-intensives et très concurrentes**, qui bénéficient du modèle non bloquant et de la gestion du back-pressure. Il permet de faire **plus avec moins de ressources** : plus de requêtes traitées par seconde, sans multiplication excessive de threads.  
En revanche, pour une application simple CRUD ou peu chargée, le modèle réactif apporte de la complexité (apprentissage, débogage, logs asynchrones) sans forcément d’avantage net.

En résumé, **choisissez WebFlux/Reactor** lorsque vos cas d’usage nécessitent du streaming réactif (services en temps réel, microservices à haute charge, IoT, etc.), sinon **prenez Spring MVC classique** pour sa simplicité et sa maturité. Les deux piles coexistent dans Spring, mais chaque approche a ses limites : WebFlux pour des scénarios non bloquants, MVC pour le reste.
