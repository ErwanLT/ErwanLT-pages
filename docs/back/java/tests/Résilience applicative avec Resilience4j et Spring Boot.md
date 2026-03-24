---
layout: "default"
title: "Résilience applicative avec Resilience4j et Spring Boot"
permalink: "/back/java/tests/resilience-applicative-avec-resilience4j-et-spring-boot/"
tags: [back, java, tests]
date: "2026-02-04"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/resilience-applicative-avec-resilience4j-et-spring-boot/"
banner: "https://www.sfeir.dev/content/images/size/w1200/2026/03/20260317_0733_Image-Generation_simple_compose_01kkx7ydr6f1nsya7aqv2wfhph.png"
published_at: "2026-02-04"
sfeir_slug: "resilience-applicative-avec-resilience4j-et-spring-boot"
sfeir_tags: [Back, Java, Spring Boot, Resilience]
---
Dans un monde où les applications sont de plus en plus distribuées et dépendantes de services externes, la **résilience** devient une qualité essentielle. Une [API](https://www.sfeir.dev/kesaco-api/) lente, un microservice indisponible ou une surcharge momentanée peuvent rapidement impacter l’expérience utilisateur.

Pour faire face à ces défis, les frameworks modernes proposent des solutions robustes permettant de limiter les défaillances en cascade et de protéger les systèmes critiques.

Deux approches complémentaires existent :

- **Tolérance aux pannes** : savoir comment l’application réagit lorsqu’une anomalie survient. C’est ce que l’on peut explorer avec des outils comme [[Introduisez du chaos dans votre application Spring Boot|**Chaos Monkey for Spring Boot**]], qui injecte volontairement des pannes pour tester la robustesse d’un système.
- **Résilience applicative** : mettre en place des mécanismes de protection qui permettent de continuer à fonctionner malgré des défaillances. C’est précisément ce que propose **Resilience4j**, avec des patterns tels que le _Circuit Breaker_, le _Retry_ ou encore le _Time Limiter_.

Dans cet article, nous allons nous concentrer sur **Resilience4j** et voir comment l’intégrer dans une application [[Il était une fois... Spring Boot|**Spring Boot**]], avec des exemples concrets pour chacun de ses principaux modules.

## Présentation de Resilience4j

Resilience4j est une bibliothèque légère de résilience inspirée de [**Hystrix**](https://github.com/Netflix/Hystrix) (aujourd’hui obsolète). Elle fournit plusieurs patterns bien connus :

- **Circuit Breaker** : éviter les appels répétés à un service en panne.
- **Retry** : réessayer automatiquement un appel qui a échoué.
- **Rate Limiter** : limiter le nombre d’appels pour éviter une surcharge.
- **Bulkhead** : cloisonner les ressources pour éviter qu’un composant saturé ne bloque tout le système.
- **Time Limiter** : imposer une durée maximale à un appel.

L’intégration avec [Spring Boot](https://www.sfeir.dev/back/back-pourquoi-utiliser-spring-boot/) est facilitée grâce [[Comprendre les annotations dans Spring Boot - guide et exemples|aux annotations]] (`@CircuitBreaker`, `@Retry`, etc.) et une configuration centralisée via `application.properties`.

## ⚖️ Avantages et inconvénients

### ➕ Avantages

- Léger et modulaire (on utilise uniquement les modules nécessaires).
- Intégration native avec Spring Boot et Spring Cloud.
- Compatible avec les outils de monitoring (Actuator, [[Superviser votre application Spring Boot grâce à Prometheus et Grafana|Prometheus, Grafana]]).
- Fallbacks explicites permettant d’assurer un retour fonctionnel.

### ➖ Inconvénients

- La multiplication des décorateurs peut complexifier la lecture du code.
- Mauvaise configuration des paramètres (seuils trop stricts ou trop permissifs) peut nuire aux performances.
- Ne remplace pas une architecture robuste côté backend : c’est une couche de protection, pas une solution miracle.

## Installation dans un projet Spring Boot

Pour ajouter Resilience4j à un projet Spring Boot 3, il suffit de déclarer la dépendance Maven suivante dans votre `pom.xml` :

```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot3</artifactId>
    <version>2.3.0</version>
</dependency>
```

Puis, configurer les mécanismes désirés dans `application.properties`.  
Exemple de configuration pour chaque module :

```properties
# CircuitBreaker
resilience4j.circuitbreaker.instances.backendA.slidingWindowSize=10
resilience4j.circuitbreaker.instances.backendA.failureRateThreshold=50
resilience4j.circuitbreaker.instances.backendA.waitDurationInOpenState=5s

# Retry
resilience4j.retry.instances.backendB.maxAttempts=3
resilience4j.retry.instances.backendB.waitDuration=1s

# RateLimiter
resilience4j.ratelimiter.instances.backendC.limitForPeriod=2
resilience4j.ratelimiter.instances.backendC.limitRefreshPeriod=10s

# Bulkhead
resilience4j.bulkhead.instances.backendD.maxConcurrentCalls=1

# TimeLimiter
resilience4j.timelimiter.instances.backendE.timeoutDuration=1s
```

## Exemples pratiques

Nous allons maintenant parcourir chaque concept un par un.

### Circuit Breaker

Le **circuit breaker** agit comme un **fusible intelligent** : il évite qu’un service indisponible ou trop lent ne dégrade toute l’application.

Lorsqu’un certain nombre d’appels échouent (erreurs ou timeouts), le circuit passe en **OPEN** et bloque immédiatement les appels suivants, renvoyant une réponse de repli (_fallback_).

```java
@CircuitBreaker(name = "backendA", fallbackMethod = "fallback")
public String fetchData() {
    LOGGER.info("Attempting to fetch data...");
    // Simulate a failing service
    if (counter.incrementAndGet() % 3 != 0) {
        LOGGER.warn("Backend service is unavailable, throwing exception.");
        throw new RuntimeException("Backend service is unavailable");
    }
    LOGGER.info("Successfully fetched data from backend.");
    return "Data from backend";
}

public String fallback(RuntimeException t) {
    LOGGER.error("Fallback response due to: {}", t.getMessage());
    return "Fallback response: " + t.getMessage();
}
```

Ici, le service échoue deux fois sur trois.

- Si le nombre d’échecs dépasse le seuil défini (50%), le circuit passe en **OPEN**.
- Dans cet état, les appels ne sont plus envoyés au backend mais directement redirigés vers le **fallback**.

#### Les état du Circuit Breaker

On peut comparer le **CircuitBreaker** à un **interrupteur électrique** :

- **CLOSED (fermé)** : L’interrupteur laisse passer le courant (les appels).  
    Tous les appels sont transmis normalement au service.
- **OPEN (ouvert)** : L’interrupteur coupe le courant.  
    Aucun appel ne passe, on renvoie directement la réponse de fallback.
- **HALF-OPEN (à moitié ouvert)** : L’interrupteur autorise un petit flux de courant.  
    Concrètement, quelques appels « test » sont autorisés :
    - s’ils réussissent, on repasse en **CLOSED** (le service est de nouveau fiable),
    - s’ils échouent, on reste en **OPEN** pour protéger le système.

### Retry

Le **retry** permet de retenter automatiquement un appel qui échoue.

```java
@Retry(name = "backendB", fallbackMethod = "retryFallback")
public String retryableFetchData() {
    LOGGER.info("Attempting to fetch data with retry... (attempt {})", retryCounter.get() + 1);
    // Simulate a service that fails twice then succeeds
    if (retryCounter.incrementAndGet() < 3) {
        LOGGER.warn("Retryable service is unavailable, throwing exception.");
        throw new RuntimeException("Retryable service is unavailable");
    }
    LOGGER.info("Successfully fetched data with retry.");
    retryCounter.set(0); // Reset for next independent call
    return "Data from retryable backend";
}

public String retryFallback(RuntimeException t) {
    LOGGER.error("Retry fallback response after all retries failed, due to: {}", t.getMessage());
    retryCounter.set(0); // Reset for next independent call
    return "Retry fallback response: " + t.getMessage();
}
```

**Configuration** : 3 tentatives avec 1 seconde d’attente entre chaque essai.

- Le service échoue deux fois puis réussit à la troisième tentative.
- Si toutes échouent, on appelle `retryFallback`.

### Rate Limiter

Le **rate limiter** limite le nombre d’appels autorisés dans une fenêtre de temps donnée.

```java
@RateLimiter(name = "backendC", fallbackMethod = "rateLimiterFallback")
public String rateLimitedFetchData() {
    LOGGER.info("Attempting to fetch data with rate limiter...");
    return "Data from rate-limited backend";
}

public String rateLimiterFallback(io.github.resilience4j.ratelimiter.RequestNotPermitted t) {
    LOGGER.error("Rate limit exceeded, fallback response due to: {}", t.getMessage());
    return "Rate limit fallback response: " + t.getMessage();
}
```

**Configuration** : 2 appels toutes les 10 secondes.

- Au-delà, une exception `RequestNotPermitted` est levée et le fallback renvoie une réponse alternative.

---

#### Détour par Bucket4j

Si le _Rate Limiter_ de Resilience4j est parfaitement adapté à des scénarios simples (protection d’un endpoint sensible, limitation d’accès utilisateur), il reste assez basique dans sa configuration.

Pour des cas d’usage plus avancés, on peut se tourner vers **Bucket4j**, une bibliothèque dédiée au _rate limiting_.

J’ai d’ailleurs écrit un article complet sur **Bucket4j**, disponible ici :

[[Limiter les appels à son API REST avec Bucket4j]]

### Bulkhead

Le **bulkhead** isole les ressources pour empêcher la saturation globale.

```java
@Bulkhead(name = "backendD", fallbackMethod = "bulkheadFallback")
public String bulkheadFetchData() throws InterruptedException {
    LOGGER.info("Attempting to fetch data with bulkhead...");
    Thread.sleep(3000); // Simulate a slow call
    LOGGER.info("Successfully fetched data with bulkhead.");
    return "Data from bulkhead backend";
}

public String bulkheadFallback(io.github.resilience4j.bulkhead.BulkheadFullException t) {
    LOGGER.error("Bulkhead is full, fallback response due to: {}", t.getMessage());
    return "Bulkhead fallback response: " + t.getMessage();
}
```

**Configuration** : un seul appel concurrent autorisé.

- Si un second appel arrive pendant que le premier n’est pas terminé, il est immédiatement redirigé vers `bulkheadFallback`.

### Time Limiter

Le **time limiter** interrompt un appel trop long.

```java
@TimeLimiter(name = "backendE")
public CompletableFuture<String> timeLimitedFetchData() {
    return CompletableFuture.supplyAsync(() -> {
        LOGGER.info("Attempting to fetch data with time limiter...");
        try {
            Thread.sleep(3000); // Simulate a very slow call
        } catch (InterruptedException e) {
            // The future is cancelled, this exception is expected
            LOGGER.warn("Slow call was interrupted.");
            throw new RuntimeException(e);
        }
        LOGGER.info("This will not be logged due to the timeout.");
        return "Data from time-limited backend";
    });
}
```

Dans ce cas particulier j'ai préféré mettre le fallback directement dans le controller

```java
@GetMapping("/timelimit-data")
public CompletableFuture<String> getTimeLimitedData() {
    return backendService.timeLimitedFetchData()
        .exceptionally(ex -> "Time limiter fallback response: " + ex.getMessage());
}
```

Mais on aurait très bien put avoir une méthode de fallback comme les autres exemple dans le service.

**Configuration** : délai maximum de 1 seconde.

- Comme l’appel dure 3 secondes, il sera systématiquement interrompu et renverra une réponse via le fallback.

## Conclusion

Avec Resilience4j, il est simple de protéger son application contre les défaillances des services externes :

- Le **circuit breaker** évite d’user un service en panne.
- Le **retry** donne une seconde chance aux appels.
- Le **rate limiter** empêche la surcharge.
- Le **bulkhead** cloisonne les ressources.
- Le **time limiter** coupe les appels trop longs.

L’intégration avec **Spring Boot** est naturelle grâce aux annotations et à la configuration centralisée.

Bien configurés, ces mécanismes apportent une véritable robustesse aux applications distribuées. Ils doivent néanmoins être utilisés avec discernement pour éviter une complexité excessive ou des effets secondaires indésirables.
