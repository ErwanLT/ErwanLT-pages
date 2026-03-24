---
layout: "default"
title: "Création d’un système de gestion d’audit avec Spring Boot et Spring Data Envers"
permalink: "/springboot/creation-d-un-systeme-de-gestion-d-audit-avec-spring-boot-et-spring-data-envers/"
tags: [back, java, spring-boot, audit, envers, tutoriel]
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/creation-dun-systeme-de-gestion-daudit-avec-spring-boot-et-spring-data-envers/"
banner: "https://www.sfeir.dev/content/images/size/w1304/2025/08/20250825_0835_Pixel-Audit-Adventure_simple_compose_01k3fywr1sfectcgh9x1cmh5as.png"
published_at: "2026-01-14"
sfeir_slug: "creation-dun-systeme-de-gestion-daudit-avec-spring-boot-et-spring-data-envers"
date: "2026-01-14"
---
Dans un précédent article, nous avons exploré la [**gestion de l’évolution du schéma de base de données** à l’aide d’outils tels que **Flyway** et **Liquibase**](/springboot/migration-et-versioning-de-base-de-donnees-dans-une-application-spring-boot-flyway-vs-liquibase/). Ce travail garantissait la cohérence et la reproductibilité des structures de tables.  
Nous nous intéressons aujourd’hui à un autre aspect tout aussi crucial : **le suivi de l’évolution des données elles-mêmes**.  
Cet article montre comment utiliser [**Spring Boot**](/springboot/il-etait-une-fois-spring-boot/) et **Spring Data Envers**, une extension d’Hibernate Envers, afin de mettre en place un système d’audit des entités.  
Nous verrons la configuration, la gestion des révisions, et la mise en place d’une [API REST](/definition/rest-definition/) pour interroger l’historique des modifications.

## Introduction

Dans un contexte applicatif moderne, la **traçabilité des données** est devenue une exigence incontournable : conformité réglementaire (RGPD, normes financières), sécurité, ou encore besoins métiers (analyse d’historique).  
Plutôt que d'implementer manuellement des tables de suivi, **Hibernate Envers** fournit un mécanisme automatisé de gestion des versions des entités.  
Avec **Spring Data Envers**, cette fonctionnalité s’intègre élégamment dans une [application Spring Boot](https://www.sfeir.dev/back/creer-son-projet-spring-boot-de-zero/).

## Prérequis

Nous n'allons pas partir d'un nouveau projet, mais plutôt de l'état final de l'article sur le Basic Auth :

[Sécurisez vos API avec Spring Security - Basic Auth](/springboot/security/securisez-vos-api-avec-spring-security-basic-auth/)

authentification par Basic auth

Notez que vous pouvez également repartir des autres article de cette série sur la sécurité :

[Sécurisez vos API avec Spring Security - JWT](/springboot/security/securisez-vos-api-avec-spring-security-jwt/)
[Sécurisez vos API avec Spring Security - accès par rôle](/springboot/security/securisez-vos-api-avec-spring-security-acces-par-role/)


Pour commencer, il faut ajouter la dépendance suivante dans le `pom.xml` :

```xml
<dependency>
  <groupId>org.springframework.data</groupId>
  <artifactId>spring-data-envers</artifactId>
</dependency>
```

J'utiliserais également Lombok pour vous économiser les constructeurs, les getters et les setters.

Nous utilisons ici une base **H2 en mémoire**, pratique pour les tests et démonstrations. La configuration se fait dans `application.properties` :

```properties
spring.datasource.url=jdbc:h2:mem:auditdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

Cette configuration lance une base temporaire à chaque démarrage et expose une console d’administration sur `/h2-console`.

## Configuration de Spring Data Envers

### Listener de révision

Hibernate Envers utilise une table spéciale appelée **`revinfo`** pour stocker les informations de révision.  
Nous allons enrichir cette table afin de capturer également **l’utilisateur responsable** de chaque modification, grâce à un **listener**.

```java
public class SecurityRevisionListener implements RevisionListener {

    @Override
    public void newRevision(Object revisionEntity) {
        StockRevisionEntity stockRevisionEntity = (StockRevisionEntity) revisionEntity;
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails) {
            stockRevisionEntity.setUsername(((UserDetails) principal).getUsername());
        } else {
            stockRevisionEntity.setUsername(principal.toString());
        }
    }
}
```

- Ce listener est invoqué à chaque nouvelle révision.
- Il extrait le nom de l’utilisateur courant depuis le `SecurityContextHolder` et le stocke dans l’entité de révision.

### Application principale

```java
@SpringBootApplication
@EnableJpaRepositories(repositoryFactoryBeanClass = EnversRevisionRepositoryFactoryBean.class)
public class AuditTutorialApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuditTutorialApplication.class, args);
    }
}
```

[L’annotation](https://www.sfeir.dev/back/comprendre-les-annotations-dans-spring-boot/) `@EnableJpaRepositories` précise l’utilisation de la factory Envers, permettant ainsi à nos repositories d’accéder aux révisions.

## Exemple pratique : Entité auditable

Voici une entité simple représentant un **stock de produit**.

```java
@Entity
@Getter
@Setter
@Audited
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productName;

    private int quantity;
}
```

- `@Audited` indique à Envers que chaque modification de cette entité doit être historisée.
- Les insertions, mises à jour et suppressions généreront automatiquement des entrées dans la table d’audit.

### Entité de révision personnalisée

```java
@Entity
@Table(name = "revinfo")
@RevisionEntity(SecurityRevisionListener.class)
@Getter
@Setter
public class StockRevisionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @RevisionNumber
    private int id;

    @RevisionTimestamp
    private long timestamp;

    @Column(name = "username", length = 200)
    private String username;
}
```

Cette entité surcharge la table `revinfo` afin de stocker le numéro de révision, l’horodatage, et le nom d’utilisateur.  
C'est elle qui est utilisé par notre **Listener**.

## Gestion des révisions

Spring Data Envers fournit une extension du repository standard : `RevisionRepository`.

```java
@Repository
public interface StockRepository extends JpaRepository<Stock, Long>, RevisionRepository<Stock, Long, Integer> {
}
```

- On hérite des méthodes classiques de `JpaRepository`.
- `RevisionRepository` expose des méthodes comme `findRevisions(id)`, qui permettent de récupérer l’historique complet d’une entité.

## Consulter l’historique

### Contrôleur

```java
@RestController
@RequestMapping("/stocks")
public class StockController {

    private final StockService stockService;
    private final RevisionService revisionService;

    public StockController(StockService stockService, RevisionService revisionService) {
        this.stockService = stockService;
        this.revisionService = revisionService;
    }

    @PostMapping
    public ResponseEntity<StockDto> createStock(@RequestBody CreateStockRequest request) {
        StockDto createdStock = stockService.createStock(request);
        return new ResponseEntity<>(createdStock, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/quantity")
    public ResponseEntity<StockDto> updateStockQuantity(@PathVariable Long id, @RequestBody UpdateStockQuantityRequest request) {
        StockDto updatedStock = stockService.updateStockQuantity(id, request);
        return ResponseEntity.ok(updatedStock);
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<RevisionDto>> getStockHistory(@PathVariable Long id) {
        List<RevisionDto> history = revisionService.getStockHistory(id);
        return ResponseEntity.ok(history);
    }
}
```

### Service

#### Service métier

```java
@Service
public class StockService {

    private final StockRepository stockRepository;

    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    @Transactional
    public StockDto createStock(CreateStockRequest request) {
        Stock stock = new Stock();
        stock.setProductName(request.getProductName());
        stock.setQuantity(request.getQuantity());
        Stock savedStock = stockRepository.save(stock);
        return toDto(savedStock);
    }

    @Transactional
    public StockDto updateStockQuantity(Long id, UpdateStockQuantityRequest request) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock not found with id: " + id));
        stock.setQuantity(request.getNewQuantity());
        Stock updatedStock = stockRepository.save(stock);
        return toDto(updatedStock);
    }

    private StockDto toDto(Stock stock) {
        StockDto dto = new StockDto();
        BeanUtils.copyProperties(stock, dto);
        return dto;
    }
}
```

Notre service métier se concentre sur la logique métier sans s'occuper des révisions, on sépare ici les responsabilités.

#### Service des révisions

```java
@Service
public class RevisionService {

    private final StockRepository stockRepository;

    public RevisionService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    @Transactional(readOnly = true)
    public List<RevisionDto> getStockHistory(Long id) {
        return stockRepository.findRevisions(id).getContent().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private RevisionDto toDto(Revision<Integer, Stock> revision) {
        Stock stockEntity = revision.getEntity();
        StockRevisionEntity revisionMetadata = (StockRevisionEntity) revision.getMetadata().getDelegate();

        return new RevisionDto(
                revision.getRevisionNumber().orElseThrow(() -> new IllegalStateException("Revision number not found")),
                new Date(revisionMetadata.getTimestamp()),
                revision.getMetadata().getRevisionType().name(),
                revisionMetadata.getUsername(),
                toDto(stockEntity)
        );
    }

    private StockDto toDto(Stock stock) {
        StockDto dto = new StockDto();
        BeanUtils.copyProperties(stock, dto);
        return dto;
    }
}
```

## Vérification

Prenons maintenant un outils de requêtage tel que [Postman](https://www.sfeir.dev/product/presentation-postman-flows/) ou [Bruno](https://www.sfeir.dev/back/use-bruno/), et appelons nos endpoints pour voir ce qu'il se passe

Dans un premier temps je vais faire un POST pour créer un stock de ramens avec une quantité de 15, sauf que mince je me suis trompé, c'était un stock de 20 qu'il me fallait, je fait donc un PUT et mon stock se met à jour.  
Maintenant, j'appelle mon enpoint pour avoir l'historique des changements et j'aurais la réponse suivante :

```json
[
    {
        "revisionNumber": 1,
        "revisionDate": "2025-08-25T05:48:40.006+00:00",
        "revisionType": "INSERT",
        "username": "admin",
        "stock": {
            "id": 1,
            "productName": "ramen",
            "quantity": 15
        }
    },
    {
        "revisionNumber": 2,
        "revisionDate": "2025-08-25T06:26:01.912+00:00",
        "revisionType": "UPDATE",
        "username": "admin",
        "stock": {
            "id": 1,
            "productName": "ramen",
            "quantity": 20
        }
    }
]
```

exemple de réponse

## Optimisation et bonnes pratiques

- **Indexation** : ajoutez des index sur les colonnes de `revinfo` (par ex. `timestamp`, `username`) pour accélérer les recherches.
- **Sélection des entités** : n’utilisez `@Audited` que sur les entités critiques, afin de limiter l’impact en stockage.
- **Sécurité** : sécurisez l’accès aux endpoints `/history` avec Spring Security (accès restreint aux administrateurs).
- **Surveillance** : utilisez Spring Boot Actuator pour suivre l’espace disque occupé par les tables d’audit.

## Conclusion

Avec **Spring Boot** et **Spring Data Envers**, la mise en place d’un audit des entités se fait de manière simple et robuste.  
L’approche repose sur :

- une configuration minimale,
- l’annotation `@Audited`,
- et l’utilisation d’un `RevisionRepository` pour interroger l’historique.

Comparée à des solutions manuelles, cette approche est plus fiable et moins sujette aux oublis. Elle se distingue également d’outils tels que [**JaVers**](https://javers.org/?ref=sfeir.dev), qui offrent des fonctionnalités avancées (diff de graphes d’objets, audit JSON), mais au prix d’une intégration différente.

En résumé : **Flyway/Liquibase** permettent de tracer l’évolution du schéma, tandis que **Envers** garantit la traçabilité de la donnée elle-même.
