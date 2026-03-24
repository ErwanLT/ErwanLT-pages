---
layout: "default"
title: "Limiter les appels à son API REST avec Bucket4j"
permalink: "/back/java/spring-boot/limiter-les-appels-a-son-api-rest-avec-bucket4j/"
tags: [back, java, spring-boot]
date: "2025-07-21"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/limiter-les-appels-a-son-api-rest-avec-bucket4j/"
banner: "https://www.sfeir.dev/content/images/2025/08/20250828_1012_Pixelated-Rate-Limiting-Scene_simple_compose_01k3qvnc3gex7sh3p0rgx2s6fb.png"
published_at: "2025-07-21"
sfeir_slug: "limiter-les-appels-a-son-api-rest-avec-bucket4j"
sfeir_tags: [Back, Java, Spring Boot, REST, API, Bucket]
---
Une [API REST](/definition/rest-definition/) bien conçue est comme une porte d’entrée : elle doit être accessible, mais pas grande ouverte. Trop d’appels, trop fréquents, peuvent nuire à la stabilité du service, qu’ils soient le fait d’un usage abusif ou simplement de clients mal configurés. Pour prévenir ces situations, on utilise ce qu’on appelle le **rate limiting** : une limitation du nombre de requêtes acceptées sur une période donnée.

Dans cet article, nous allons découvrir **Bucket4j**, une bibliothèque Java qui offre une solution pour implémenter ce mécanisme.

## Pourquoi mettre en place des rate limits ?

Instaurer une limitation de débit sur les appels [API](https://www.sfeir.dev/kesaco-api/) n’est pas une option, c’est une bonne pratique fondamentale. Voici pourquoi :

- 🔒 [**Sécurité**](/back/java/spring-boot/securite/securisez-vos-api-avec-spring-security-basic-auth/) : éviter les abus, les attaques par déni de service ou les scripts malveillants.
- ⚖️ **Équité** : garantir une répartition juste des ressources entre tous les utilisateurs.
- ⚙️ **Robustesse** : protéger les [bases de données](/back/java/spring-boot/migration-et-versioning-de-base-de-donnees-dans-une-application-spring-boot-flyway-vs-liquibase/) et les serveurs d’un trop grand nombre de requêtes simultanées.
- 💰 **Optimisation des coûts** : éviter une facturation excessive sur des services cloud.
- 📊 **Gestion des clients** : offrir différents niveaux de service selon le type de client (standard, premium, etc.).

## Présentation de Bucket4j

**Bucket4j** est une bibliothèque Java légère qui permet de gérer des quotas de requêtes selon le principe du **token bucket** :

- Chaque client dispose d’un _bucket_ (seau) rempli de _tokens_ (jetons).
- Chaque appel consomme un jeton.
- Les jetons sont rechargés à intervalle régulier.
- Si le bucket est vide, la requête est rejetée avec une [erreur 429 (Too Many Requests)](/back/java/spring-boot/comment-bien-gerer-ses-exceptions-dans-spring-boot/).

Avantages de Bucket4j :

- 📦 Aucune dépendance externe obligatoire.
- 💡 Configuration flexible : par adresse IP, par utilisateur, par clé API, etc.
- 🛠️ Intégration simple dans une [application Spring Boot](/back/java/spring-boot/il-etait-une-fois-spring-boot/).

## Implémentation "naïve"

Commençons par une implémentation en mémoire. Elle repose sur un endpoint

- `/hello` : accessible sans authentification, limité à 20 requêtes par heure.

### Le contrôleur `HelloController`

```java
@RestController
@RequestMapping("/hello")
public class HelloController {

    private final Bucket bucket;


    public HelloController() {
        // refillGreedy : recharge le bucket d'un coup à intervalle régulier (ici, 20 tokens toutes les heures).
        Bandwidth limit = Bandwidth
                .builder()
                .capacity(20)
                .refillGreedy(20, Duration.ofHours(1))
                .build();
        this.bucket = Bucket.builder()
                .addLimit(limit)
                .build();
    }
    
    @GetMapping
    public ResponseEntity<String> sayHello() {
        if (bucket.tryConsume(1)) {
            return ResponseEntity.ok("Hello world!");
        } else {
            return ResponseEntity.status(429).body("Trop de requêtes pour cette clé API, merci de réessayer plus tard.");
        }
    }
}
```

Exemple d'implémentation en mémoire avec la stratégie refillGreedy

### Que fait ce code, concrètement ?

- Dès qu’un appel est reçu, un **jeton est consommé**.
- Si le bucket ne contient plus de jeton, l’appel est **refusé avec un statut 429**.
- Chaque bucket se **recharge entièrement** au bout d'une heure.

## Implémentation "naïve++"

Toujours avec une implémentation en mémoire, mais ici nous utiliserons une clé d'API pour notre endpoint :

- `/hello/apikey` : nécessite une clé API et applique une politique de quota selon la clé utilisée.

### Le contrôleur `HelloController`

```java
@RestController
@RequestMapping("/hello")
public class HelloController {

    private final BucketService bucketService;

    public HelloController(BucketService bucketService) {
        this.bucketService = bucketService;
    }

    @GetMapping("/apikey")
    public ResponseEntity<String> sayHelloApiKey(@RequestHeader(value = "X-API-KEY", required = false) String apiKey) {
        if (apiKey == null || apiKey.isBlank()) {
            return ResponseEntity.badRequest().body("Clé API manquante dans le header X-API-KEY");
        }
        Bucket bucket = bucketService.resolveBucket(apiKey);
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if (probe.isConsumed()) {
            return ResponseEntity.ok()
                .header("X-Rate-Limit-Remaining", Long.toString(probe.getRemainingTokens()))
                .body("Hello world! (API key: " + apiKey + ")");
        }
        long waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000;
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
            .header("X-Rate-Limit-Retry-After-Seconds", String.valueOf(waitForRefill))
            .body("Trop de requêtes pour cette clé API, merci de réessayer plus tard.");
    }
}
```

Exemple de restriction par clé d'API

### Le service `BucketService`

Ce service s’occupe d’attribuer un bucket en mémoire à chaque clé API :

```java
@Service
public class BucketService {
    private final Map<String, Bucket> buckets = new HashMap<>();

    public Bucket resolveBucket(String apiKey) {
        // Exemple : deux types de rate limit selon la clé
        if ("VIP-123".equals(apiKey)) {
            return buckets.computeIfAbsent(apiKey, k -> Bucket.builder()
                    .addLimit(Bandwidth.builder().capacity(100).refillGreedy(100, Duration.ofHours(1)).build())
                    .build());
        } else {
            return buckets.computeIfAbsent(apiKey, k -> Bucket.builder()
                    .addLimit(Bandwidth.builder().capacity(10).refillGreedy(10, Duration.ofHours(1)).build())
                    .build());
        }
    }
}
```

### Que fait ce code, concrètement ?

- Dès qu’un appel est reçu, un **jeton est consommé**.
- Si le bucket ne contient plus de jeton, l’appel est **refusé avec un statut 429**.
- Chaque bucket se **recharge entièrement** au bout d'une heure.
- Les appels au deuxième endpoint (`/hello/apikey`) doivent inclure un header `X-API-KEY` :
    - La clé `VIP-123` permet 100 requêtes/heure.
    - Les autres clés sont limitées à 10 requêtes/heure.
- Des **en-têtes HTTP supplémentaires** (`X-Rate-Limit-Remaining`, `X-Rate-Limit-Retry-After-Seconds`) permettent au client de connaître le quota restant ou le temps à attendre.

Les 2 exemples ci-dessus sont dits naïfs car, dans le premier cas, nous devrons dupliquer le code du bucket dans chaque controller, et dans le second cas, nous aurons une forte dépendance au `BucketService` qui sera présent dans tous nos controller, ce qui est loin d'être optimal.

## Implémentation avec Spring AOP

Plutôt que d’intégrer la logique de limitation directement dans chaque contrôleur ou d’appeler systématiquement un service, une autre approche consiste à utiliser [**Spring AOP**](/back/java/spring-boot/spring-aop-comprendre-la-programmation-orientee-aspect-dans-spring/). Cela permet de **centraliser** la vérification du quota et de l’appliquer à n’importe quelle méthode via une simple annotation.

### [l’annotation](/back/java/spring-boot/comprendre-les-annotations-dans-spring-boot-guide-et-exemples/) `@RateLimited`

Nous définissons une annotation personnalisée, qui pourra être appliquée sur toute méthode des controller.  
Elle permet de spécifier une stratégie de limitation : `"api-key"`, `"ip"`, ou `"global"` (valeur par défaut).

```java
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimited {
    /**
     * Type de limite à appliquer : par IP, par API key, etc.
     * Cela permettra d’adapter la logique dans l’aspect.
     */
    String strategy() default "global";
}
```

### L’aspect `RateLimitingAspect`

Cet aspect intercepte les appels aux méthodes annotées avec `@RateLimited`. Il extrait la stratégie, détermine une clé de limitation (en fonction de l’adresse IP ou d’un header), vérifie le quota, et ajoute à la réponse HTTP l’information sur le nombre de jetons restants.

```java
@Aspect
@Component
public class RateLimitingAspect {

    private final BucketService bucketService;

    public RateLimitingAspect(BucketService bucketService) {
        this.bucketService = bucketService;
    }

    @Around("@annotation(RateLimited)")
    public Object checkRateLimit(ProceedingJoinPoint joinPoint) throws Throwable {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();

        // Récupération de l'annotation et de la stratégie
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        RateLimited rateLimited = method.getAnnotation(RateLimited.class);
        String strategy = rateLimited.strategy();

        // Détermination de la clé selon la stratégie
        String key;
        switch (strategy) {
            case "ip" -> key = request.getRemoteAddr();
            case "api-key" -> {
                String apiKey = request.getHeader("X-API-KEY");
                if (apiKey == null || apiKey.isBlank()) {
                    return ResponseEntity.badRequest().body("Clé API manquante dans le header X-API-KEY");
                }
                key = apiKey;
            }
            default -> key = "global";
        }

        Bucket bucket = bucketService.resolveBucket(key);
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

        if (probe.isConsumed()) {
            if (response != null) {
                response.setHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            }
            return joinPoint.proceed();
        }

        long wait = probe.getNanosToWaitForRefill() / 1_000_000_000;
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .header("X-Rate-Limit-Retry-After-Seconds", String.valueOf(wait))
                .body("Quota dépassé, merci de réessayer dans " + wait + " secondes.");

    }
}
```

### Service `BucketService`

Le service suivant centralise la création et le stockage des buckets selon la clé identifiée par l’aspect. Il applique des quotas différenciés : par exemple, une clé `VIP-123` bénéficie d’un quota plus généreux.

```java
@Service
public class BucketService {

    private final Map<String, Bucket> buckets = new HashMap<>();

    /**
     * Résout un bucket pour une clé donnée, quelle que soit son origine (IP, clé API, etc.).
     */
    public Bucket resolveBucket(String key) {
        // Exemple : si la clé est "VIP-123", quota plus généreux
        if ("VIP-123".equals(key)) {
            return buckets.computeIfAbsent(key, k ->
                    Bucket.builder()
                            .addLimit(Bandwidth.builder()
                                    .capacity(100)
                                    .refillGreedy(100, Duration.ofHours(1))
                                    .build())
                            .build());
        } else {
            return buckets.computeIfAbsent(key, k ->
                    Bucket.builder()
                            .addLimit(Bandwidth.builder()
                                    .capacity(10)
                                    .refillGreedy(10, Duration.ofHours(1))
                                    .build())
                            .build());
        }
    }
}
```

### Le contrôleur `HelloController`

Voici comment appliquer le rate limiting sur des endpoints avec différentes stratégies :

```java
@RestController
@RequestMapping("/hello")
public class HelloController {

    @GetMapping
    @RateLimited
    public ResponseEntity<String> sayHello() {
        return ResponseEntity.ok("Hello world!");
    }

    @GetMapping("/by-ip")
    @RateLimited(strategy = "ip")
    public ResponseEntity<String> helloByIp() {
        return ResponseEntity.ok("Hello avec limitation par IP !");
    }

    @GetMapping("/apikey")
    @RateLimited(strategy = "api-key")
    public ResponseEntity<String> sayHelloApiKey(@RequestHeader(value = "X-API-KEY", required = false) String apiKey) {
        return ResponseEntity.ok()
                .body("Hello world! (API key: " + apiKey + ")");

    }
}
```

### ✅ Avantages

- **Transparence** : la logique de rate limiting est totalement externalisée.
- **Réutilisable** : on peut l’appliquer facilement à plusieurs endpoints sans duplication.
- **Flexible** : possibilité d’adapter dynamiquement la stratégie (IP, clé API, etc.).
- **Extensible** : facile d’ajouter de nouveaux types de stratégies ou de configurations.

### ⚠️ Inconvénients

- 💡 **Couche HTTP moins accessible** : l’AOP intervient après la résolution de la route, donc on ne peut pas filtrer certains chemins avant l’appel du contrôleur (comme un `Filter` le ferait).
- 💬 Pas toujours adapté aux erreurs globales.
- 🧪 **Plus complexe à tester** en unitaire : il faut simuler un contexte Spring complet pour que l’aspect fonctionne.

## Implémentation avec OncePerRequestFilter

Une autre manière de limiter le nombre d’appels à une API consiste à intercepter directement les requêtes HTTP **avant qu’elles n’atteignent les contrôleurs**. Spring fournit pour cela une classe utilitaire, `OncePerRequestFilter`, qui garantit qu’un filtre ne s’exécutera **qu’une seule fois par requête**.

Cette méthode permet une application transversale du **rate limiting**, tout en laissant la possibilité d’**exclure certaines routes** (documentation, endpoints techniques) grâce à une liste blanche configurable.

### Le filtre `RateLimitingFilter`

Le filtre ci-dessous applique une politique de limitation à toutes les requêtes, sauf celles explicitement whitelistées (Swagger, Actuator…). Il exige la présence du header `X-API-KEY`, et utilise cette clé pour déterminer le quota applicable.

```java
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final BucketService bucketService;
    // Liste des préfixes d'URI à whitelister (modifiable facilement)
    private static final Set<String> WHITELIST_PATTERNS = Set.of(
        "/actuator/**",
        "/swagger-ui/**",
        "/v3/api-docs/**"
    );
    private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();

    public RateLimitingFilter(BucketService bucketService) {
        this.bucketService = bucketService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String uri = request.getRequestURI();
        return WHITELIST_PATTERNS.stream().anyMatch(pattern -> PATH_MATCHER.match(pattern, uri));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String apiKey = request.getHeader("X-API-KEY");
        if (apiKey == null || apiKey.isBlank()) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            response.getWriter().write("Clé API manquante (header X-API-KEY).");
            return;
        }
        Bucket bucket = bucketService.resolveBucket(apiKey);

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if (probe.isConsumed()) {
            response.setHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            filterChain.doFilter(request, response);
        } else {
            long wait = probe.getNanosToWaitForRefill() / 1_000_000_000;
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setHeader("X-Rate-Limit-Retry-After-Seconds", String.valueOf(wait));
            response.getWriter().write("Quota dépassé. Merci de réessayer dans " + wait + " secondes.");
        }
    }
}
```

Exemple via un Filter

### Ce que fait ce code

- **Vérifie la présence du header `X-API-KEY`** : si absent, renvoie une erreur `400 Bad Request`.
- **Applique une politique de quota** via Bucket4j en fonction de cette clé.
- **Retourne des en-têtes utiles** :
    - `X-Rate-Limit-Remaining` : nombre de requêtes restantes dans la fenêtre actuelle.
    - `X-Rate-Limit-Retry-After-Seconds` : durée d’attente avant de retenter en cas de dépassement.
- **Ignore certaines routes** (comme `/swagger-ui/**`, `/actuator/**`) grâce à un système de pattern matching.

### Avantages

- ✅ **Simplicité d’implémentation** et de compréhension.
- ✅ **Contrôle global** sur toutes les requêtes HTTP.
- ✅ **Facilité d’exclusion de certaines routes** avec une whitelist configurable.
- ✅ Peut être placé avant la sécurité Spring si nécessaire (dans la chaîne de filtres).

### Inconvénients

- ⚠️ **Rigidité** : tout repose ici sur la clé API, sans flexibilité de stratégie (IP, user ID, etc.).
- ⚠️ **Pas déclaratif** : le filtrage s’applique à tous les endpoints par défaut.
- ⚠️ **Couplage à un header spécifique** : nécessite que tous les clients envoient un `X-API-KEY`.

## Conclusion : quelle approche choisir pour limiter les appels à votre API ?

À travers cet article, nous avons exploré trois façons d’implémenter un système de _rate limiting_ avec **Bucket4j** dans une [application Spring Boot](https://www.sfeir.dev/tag/spring-boot/).

Chaque approche a ses mérites et répond à des besoins spécifiques. En voici un résumé :

|Approche|Simplicité|Réutilisabilité|Personnalisation|Centralisation|Ciblage fin|
|---|---|---|---|---|---|
|**Naïve dans le contrôleur**|✅ Très simple|❌ Faible|✅ Possible|❌ Répétitive|✅ Méthode par méthode|
|**Avec Spring AOP**|⚠️ Demande un peu plus de configuration|✅ Élevée|✅ Forte|✅ Oui|✅ Méthode par méthode|
|**Via un filtre HTTP**|✅ Directe|✅ Moyenne|⚠️ Limitée (stratégie figée)|✅ Globale|❌ Pas spécifique à une méthode|

### Quand utiliser quelle approche ?

- **Approche naïve** : adaptée pour les **prototypes**, **démonstrations**, ou pour des besoins **limités à un ou deux endpoints**. Elle devient vite lourde à maintenir à grande échelle.
- **Spring AOP** : la solution la plus **souple** si vous souhaitez :
    - appliquer le _rate limiting_ **au cas par cas** (par méthode),
    - **choisir dynamiquement une stratégie** (IP, clé API…),
    - ou si vous avez une logique de quota qui **dépend du métier** (rôle utilisateur, etc.).
- **Filtre HTTP** : à privilégier si vous voulez :
    - **protéger tous les endpoints** en amont du traitement,
    - **exclure facilement** certains chemins techniques (`/swagger-ui`, `/actuator`…),
    - ou gérer une politique uniforme sur toute l’application, sans avoir à annoter chaque contrôleur.

### Et après ? Des pistes pour aller plus loin

Ce que nous avons présenté ici constitue une **base solide**, mais reste une implémentation **monolithique et en mémoire**. Pour une montée en charge ou un déploiement distribué, plusieurs pistes s’ouvrent :

- **Stockage distribué des buckets** : avec [Redis](/back/java/spring-boot/cache/mise-en-cache-avec-redis-dans-spring-boot/), [Hazelcast](https://hazelcast.com/?ref=sfeir.dev) ou [Ignite](https://ignite.apache.org/?ref=sfeir.dev), pour partager les quotas entre plusieurs instances.
- **Configuration dynamique** : chargement des quotas via une base de données ou une API de configuration (multi-tenancy, plans tarifaires...).
- **Annotations personnalisées enrichies** : avec des stratégies injectables, des délais dynamiques, ou des policies par rôle.
- **Intégration avec Spring Security** : pour combiner authentification/autorisation et limitation par utilisateur authentifié.
