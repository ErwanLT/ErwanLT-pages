---
layout: "default"
title: "Spring Modulith : du monolith aux modules"
permalink: "/back/java/spring-boot/spring-modulith-du-monolith-aux-modules/"
tags: [back, java, spring-boot]
date: "2026-03-16"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/spring-modulith-du-monolith-aux-modules/"
banner: "https://www.sfeir.dev/content/images/size/w1304/2026/03/20260316_1246_Image-Generation_simple_compose_01kkv7fywbfkna9f8ggswystha.png"
published_at: "2026-03-16"
sfeir_slug: "spring-modulith-du-monolith-aux-modules"
sfeir_tags: [Back, Java, Spring Boot, Architecture, Modulith]
---
Dans le développement Java, de nombreuses applications commencent comme des monolithes simples, mais deviennent rapidement difficiles à maintenir à mesure qu’elles grandissent.  
La modularisation est alors une étape clé pour améliorer la lisibilité, la testabilité et la maintenabilité.

**Spring Modulith** est une solution qui permet de découper un monolithe en modules logiques tout en restant dans le cadre d’un [[Il était une fois... Spring Boot|projet Spring Boot]] classique.

## Présentation de Spring Modulith

Spring Modulith est un **framework léger** qui s’intègre à Spring Boot pour aider les développeurs à structurer leur monolithe en modules. Chaque module peut publier ou écouter des événements, exposer ou cacher certains packages, et disposer d’une documentation automatique. Modulith propose également un **Documenter** pour générer des **diagrammes UML et des Canvas de modules**, facilitant la visualisation de l’architecture.

Les concepts principaux :

- **Modules** : unités logiques regroupant packages et services liés.
- **Événements** : mécanisme de communication entre modules (sans couplage fort).
- **Canvas** : fiche d’identité de chaque module, listant événements, packages et dépendances.

## ⚖️ Avantages et inconvénients

### ➕ Avantages

- **Découpage clair** du monolithe en modules logiques.
- **Réduction du couplage** via des événements.
- **Documentation automatique** (PlantUML, Canvas).
- [[Il était une fois... Spring Boot|Compatible avec Spring Boot]], donc aucune surcouche complexe.
- Facilite la transition vers une architecture microservices si nécessaire.

### ➖ Inconvénients

- Nécessite une **discipline dans le découpage des packages**.
- Les modules restent dans le même projet, donc pas de séparation physique stricte.
- Les événements sont en mémoire : pas de mécanisme de persistance automatique (comme un broker).

## Contrôle des imports et liens avec ArchUnit

Spring Modulith s’appuie sur **ArchUnit** pour analyser les dépendances entre modules. Même si Java autorise les imports directs, Modulith détectera grâce à ArchUnit toute utilisation interdite (par exemple l’accès à une classe située dans un package `internal`).  
Cela permet d’automatiser la vérification de la modularité et de garantir le respect des règles d’architecture au fil des évolutions du code.

[[Maîtrisez votre architecture Spring Boot avec ArchUnit]]

## Mise en place

Pour commencer avec Spring Modulith dans un projet Spring Boot, il suffit d’ajouter les dépendances Maven suivantes :

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.modulith</groupId>
        <artifactId>spring-modulith-starter-core</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.modulith</groupId>
        <artifactId>spring-modulith-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.modulith</groupId>
            <artifactId>spring-modulith-bom</artifactId>
            <version>${spring-modulith.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

Ensuite, la détection des modules et des événements se fait **automatiquement** via la configuration Spring classique.

## Exemple pratique

prenons le projet Spring Boot suivant :

[![](https://www.sfeir.dev/content/images/2025/09/Capture-d---e--cran-2025-09-03-a---12.11.35.png)](https://www.sfeir.dev/content/images/2025/09/Capture-d---e--cran-2025-09-03-a---12.11.35.png)

Nous avons ici 2 modules distincts :

- le module Product
- le module Notification

### Module Product

Le module **Product** gère les produits et publie un événement lors de la création :

```java
@Service
public class ProductService {
    private final ApplicationEventPublisher events;

    public ProductService(ApplicationEventPublisher events) {
        this.events = events;
    }

    public void create(Product product) {
        events.publishEvent(
            new NotificationDTO(new Date(), "SMS", product.getName())
        );
    }
}
```

- `ApplicationEventPublisher` permet de publier un événement (`NotificationDTO`).
- Ici, `ProductService` peut utiliser **`NotificationDTO`** sans enfreindre les règles de modularité, car cette classe est **placée à la racine du module Notification**, ce qui signifie qu’elle fait partie de son API publique.
- Si `NotificationDTO` avait été placé dans un package `internal`, son utilisation dans `ProductService` aurait généré une **violation détectée par Spring Modulith** lors de l’appel à `modules.verify()`.

---

```log
org.springframework.modulith.core.Violations: - Module 'product' depends on non-exposed type fr.eletutour.modulith.notification.internal.model.NotificationType within module 'notification'!
Method <fr.eletutour.modulith.product.ProductService.create(fr.eletutour.modulith.product.Product)> gets field <fr.eletutour.modulith.notification.internal.model.NotificationType.SMS> in (ProductService.java:36)
- Module 'product' depends on non-exposed type fr.eletutour.modulith.notification.internal.model.Notification within module 'notification'!
Method <fr.eletutour.modulith.product.ProductService.create(fr.eletutour.modulith.product.Product)> calls constructor <fr.eletutour.modulith.notification.internal.model.Notification.<init>(java.util.Date, fr.eletutour.modulith.notification.internal.model.NotificationType, java.lang.String)> in (ProductService.java:36)
```

exemple de logs de violations lors des tests.

---

### Module Notification

Le module **Notification** écoute les événements publiés par Product et transforme les DTO en entités internes pour traitement :

```java
@Service
public class NotificationService {
    @EventListener
    public void notificationEvent(NotificationDTO event) {
        Notification notification = toEntity(event);
        LOG.info("Received notification for product {} on {} via {}",
            notification.getProductname(),
            notification.getDate(),
            notification.getType()
        );
    }

    private Notification toEntity(NotificationDTO event) {
        return new Notification(
            event.getDate(),
            NotificationType.valueOf(event.getFormat()),
            event.getProductName()
        );
    }
}
```

- `@EventListener` capture tous les événements de type `NotificationDTO`.
- Transformation du DTO en entité interne pour le traitement, permettant de garder le module **cohérent et isolé**.

### Tests Modulith

Le framework fournit également des outils pour tester et documenter les modules :

```java
@Test
void createApplicationModuleModel() {
    ApplicationModules modules = ApplicationModules.of(Application.class);
    modules.forEach(System.out::println);
}

@Test
void verifiesModularStructure() {
    ApplicationModules modules = ApplicationModules.of(Application.class);
    modules.verify();
}

@Test
void createModuleDocumentation() {
    ApplicationModules modules = ApplicationModules.of(Application.class);
    new Documenter(modules)
        .writeDocumentation()
        .writeIndividualModulesAsPlantUml();
}
```

- `verify()` s’assure que les dépendances entre modules respectent la modularité.
- `Documenter` produit la documentation et les diagrammes pour visualiser les relations entre modules.

La documentation générée se trouvera ensuite dans le repertoire `target/spring-modulith-docs`

[![](https://www.sfeir.dev/content/images/2025/09/image.png)](https://www.sfeir.dev/content/images/2025/09/image.png)

Exemple de documentation générée

[![](https://www.sfeir.dev/content/images/2025/09/image-1.png)](https://www.sfeir.dev/content/images/2025/09/image-1.png)

## Liaison avec la méthodologie DDD

Spring Modulith s’intègre naturellement avec [[DDD - Définition|**Domain-Driven Design**]] **(DDD)** :

- Chaque module peut représenter un **Bounded Context**, encapsulant ses entités, services et événements.
- Les événements Modulith (`NotificationDTO`) correspondent aux **Domain Events** en DDD.
- La modularité renforce le **cohérence du modèle de domaine** et facilite l’évolution indépendante de chaque contexte.

## Conclusion

**Spring Modulith** offre une approche pragmatique pour transformer un monolithe en modules cohérents et bien documentés, tout en restant dans un projet Spring Boot classique.  
Grâce aux événements et aux Canvas, il est possible de visualiser les flux, d’assurer l’indépendance des modules et de faciliter la maintenance sur le long terme.  

C’est une solution idéale pour des applications monolithiques qui souhaitent gagner en clarté, testabilité et évolutivité, tout en respectant les principes de DDD.
