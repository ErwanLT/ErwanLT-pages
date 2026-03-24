---
layout: "default"
title: "Versioning des API dans Spring Boot - Guide Complet"
permalink: "/back/java/spring-boot/versioning-des-api-dans-spring-boot-guide-complet/"
tags: [back, java, spring-boot]
date: "2025-11-26"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/versioning-des-api-dans-spring-boot-guide-complet/"
banner: "https://www.sfeir.dev/content/images/2025/09/20250909_1239_Pixelated-API-Time-Travel_simple_compose_01k4q0tn62fdh8nkmxs443wwa2.png"
published_at: "2025-11-26"
sfeir_slug: "versioning-des-api-dans-spring-boot-guide-complet"
sfeir_tags: [Back, Java, Spring Boot, versioning, API]
---
Le versioning des API est devenu un enjeu majeur dans l’évolution d’applications modernes. Les [APIs REST](/definition/rest-definition/) assurent la communication entre services, applications front-end, mobiles ou tierces.  
Avec le temps, les besoins évoluent : nouveaux champs, formatage différent, amélioration de la structure des réponses… autant de changements qui risquent de casser les clients existants si aucune stratégie de versioning n’est en place.

C’est pourquoi [Spring Boot](/back/java/spring-boot/il-etait-une-fois-spring-boot/) offre plusieurs mécanismes solides et complémentaires pour maintenir des APIs robustes et évolutives.

## Pourquoi versionner une API ?

### Objectifs principaux :

- **Assurer la compatibilité ascendante** : une nouvelle version ne doit jamais casser les anciennes.
- **Faire évoluer progressivement vos services**, avec possibilité d'expérimentation.
- **Clarifier les usages pour les consommateurs** : chaque version est identifiable et documentée.
- **Gérer plusieurs types de clients** (web, mobile, partenaires externes).

## Les approches classiques de versioning dans Spring Boot

Spring Boot propose depuis longtemps trois grandes approches :

1. Version dans l’URL
2. Version en paramètre de requête
3. Version dans les headers HTTP

Pour illustrer ces différentes stratégies, nous utiliserons plusieurs versions d’un modèle `User`.

```java
public class UserV1 {
    private String name;
    public UserV1(String name) { this.name = name; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}

public class UserV2 {
    private String firstName;
    private String lastName;
    public UserV2(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
}

public class UserV3 extends UserV2 {
    private int age;
    public UserV3(String firstName, String lastName, int age) {
        super(firstName, lastName);
        this.age = age;
    }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
}
```

### Versioning via URL

L’URL contient la version :  
`/api/user/v1`, `/api/user/v2`, etc.

Exemple :

```java
@GetMapping("/v1")
public UserV1 getUserV1() {
    return new UserV1("John Doe");
}
```

### Avantages

- Très explicite
- Facile à tester
- Idéal pour les APIs publiques

### Inconvénients

- Multiplication des endpoints
- Moins flexible en cas de nombreuses versions

### Versioning via Query Parameter

La version est transmise comme paramètre :  
`GET /api/user?version=1`

### Exemple :

```java
@GetMapping(params = "version=1")
public UserV1 getUserQueryV1() { ... }
```

### Avantages

- L’URL principale reste stable
- Simple à mettre en place

### Inconvénients

- Moins RESTful
- Moins intuitif pour certains clients ou caches HTTP

### Versioning via Header HTTP

Le client envoie un header du type :  
`X-API-VERSION: 1`

### Exemple :

```java
@GetMapping(path = "/header", headers = "X-API-VERSION=1")
public UserV1 getUserHeaderV1() { ... }
```

### Avantages

- URLs propres
- Très utilisé dans les systèmes internes

### Inconvénients

- Plus difficile à tester sans outils dédiés
- Moins transparent pour les développeurs juniors

## Tableau comparatif des approches

|Approche|Exemple|Avantages|Inconvénients|
|---|---|---|---|
|URL|`/api/user/v1`|Explicite, simple|Multiplication des endpoints|
|Query param|`/api/user?version=1`|URL stable|Moins RESTful|
|Header|`X-API-VERSION: 1`|Propre, flexible|Test plus complexe|

## Nouveauté : Versioning directement dans les [annotations](/back/java/spring-boot/comprendre-les-annotations-dans-spring-boot-guide-et-exemples/) Spring (Spring Boot 4 & Spring Framework 7)

Depuis Spring Framework 7, une nouvelle approche a pointé le bout de son nez :  
👉 **le versioning directement intégré dans les annotations de mapping**.

Cette méthode est plus centralisée et réduit la duplication d’URL ou de règles de routing.

### Exemple :

```java
@GetMapping(path = "/user", version = "4")
public UserV4 getUserV4() { ... }

@GetMapping(path = "/user", version = "5")
public UserV5 getUserV5() { ... }
```

### Points forts

- La version est déclarée au même endroit que la route.
- Le code est plus lisible et moins répétitif.
- La documentation OpenAPI reflète automatiquement les différentes versions.
- Les URLs restent stables → idéal pour les clients mobiles.

### Configuration nécessaire

Seulement besoin de spécifié le nom du header portant la version

```java
spring.mvc.apiversion.use.header=API-Version
```

## Bonnes pratiques pour un versioning durable

### 1. Favoriser la compatibilité ascendante

Ne cassez aucune version existante sans période de transition.

### 2. Documenter chaque version

OpenAPI / Swagger 3.1 est devenu indispensable.

### 3. Déprécier progressivement

Annoncer une version comme deprecated 6 à 12 mois avant suppression.

### 4. Éviter la prolifération de versions

Au-delà de 3 versions actives en parallèle, les coûts explosent.

### 5. Automatiser les tests multi-versions

Testcontainers + Spring Cloud Contract font merveille.
