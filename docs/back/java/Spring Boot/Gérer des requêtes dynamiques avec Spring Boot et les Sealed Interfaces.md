---
layout: "default"
title: "Gérer des requêtes dynamiques avec Spring Boot et les Sealed Interfaces"
permalink: "/back/java/spring-boot/gerer-des-requetes-dynamiques-avec-spring-boot-et-les-sealed-interfaces/"
tags: [back, java, spring-boot]
date: "2026-03-19"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/gerer-des-requetes-dynamiques-avec-spring-boot-et-les-sealed-interfaces/"
banner: "https://www.sfeir.dev/content/images/size/w1200/2026/03/20260318_1259_Image-Generation_remix_01km0d0q0ee7k8trjxftt0fr74.png"
published_at: "2026-03-19"
sfeir_slug: "gerer-des-requetes-dynamiques-avec-spring-boot-et-les-sealed-interfaces"
sfeir_tags: [Back, Java, Spring Boot]
---
Dans le développement d'[API REST](/definition/rest-definition/), il est courant de rencontrer des scénarios où un point d'entrée unique doit pouvoir accepter des charges utiles (payloads) JSON de structures différentes. Par exemple, un système de commande pourrait recevoir des commandes passées en ligne et des commandes effectuées en magasin, chacune avec des informations spécifiques.

Ce tutoriel explore une solution pour gérer ce type de corps de requête dynamique en utilisant les ****Sealed Interfaces**** de [Java](/back/java/il-etait-une-fois-java/) et les fonctionnalités de ****polymorphisme de Jackson**** dans une application Spring Boot.

## Le problème : un endpoint, plusieurs structures

Imaginons un endpoint `POST /orders`. Ce endpoint doit pouvoir créer une commande, que ce soit :

1. Une ****commande en ligne****, caractérisée par l'email du client et son adresse de livraison.
2. Une ****commande en magasin****, identifiée par l'ID du magasin et un indicateur pour une préparation express.

Plutôt que de créer deux endpoints distincts (`/orders/online` et `/orders/store`), nous souhaitons n'en conserver qu'un seul pour simplifier le contrat d'[API](https://www.sfeir.dev/kesaco-api/).

## La solution : polymorphisme avec Jackson

La clé de notre solution réside dans la manière dont nous allons indiquer à Jackson comment désérialiser le JSON entrant dans le bon objet Java. Pour cela, nous utilisons une interface "scellée" (`sealed interface`) qui servira de contrat de base pour toutes nos commandes.

### Le contrat : la `Command` Sealed Interface

Nous définissons une interface `Command`. Le mot-clé `sealed` nous assure que seules les classes déclarées dans `permits` pourront l'implémenter, ce qui renforce la robustesse de notre modèle.

Grâce [aux annotations](/back/java/spring-boot/comprendre-les-annotations-dans-spring-boot-guide-et-exemples/) Jackson, nous mettons en place le mécanisme de polymorphisme :

- `@JsonTypeInfo`: Indique que l'information de type est contenue dans le JSON lui-même, via une propriété nommée `type`.
- `@JsonSubTypes`: Énumère les correspondances entre les valeurs de la propriété `type` (ex: "online") and les classes Java concrètes (ex: `OnlineCommand.class`).

```java
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = OnlineCommand.class, name = "online"),
        @JsonSubTypes.Type(value = StoreCommand.class, name = "store")
})
public sealed interface Command
        permits OnlineCommand, StoreCommand {
}
```

### Les implémentations concrètes

Nos deux types de commandes sont implémentés sous forme de `records` Java, ce qui nous offre une syntaxe concise pour des objets de données immuables.

```java
public record OnlineCommand(
        String email,
        String deliveryAddress
) implements Command {
}

public record StoreCommand(
        String storeId,
        boolean express
) implements Command {
}
```

### Le point d'entrée : `OrderController`

Le contrôleur devient remarquablement simple. Le endpoint `createOrder` attend un `Command` en `@RequestBody`. Spring Boot et Jackson s'occupent de la désérialisation, et nous n'avons pas à nous soucier du type concret à ce niveau.

Les annotations SpringDoc (`@Operation`, etc.) sont utilisées pour [générer une documentation d'API](/back/java/spring-boot/reussir-sa-migration-de-swagger-2-a-openapi-3/) claire, qui reflète bien la nature polymorphique de l'objet attendu.

```java
@Operation(summary = "Create a new order, which can be an online order or a store order.",
            description = "The type of order is determined by the 'type' field in the request body. " +
                    "Use 'online' for online orders and 'store' for in-store orders.")
@PostMapping
public ResponseEntity<Long> createOrder(
        @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Order details, which vary based on the order type.",
                required = true,
                content = @Content(
                        mediaType = "application/json",
                        schema = @Schema(
                                oneOf = {OnlineCommand.class, StoreCommand.class},
                                discriminatorProperty = "type",
                                discriminatorMapping = {
                                        @DiscriminatorMapping(value = "online", schema = OnlineCommand.class),
                                        @DiscriminatorMapping(value = "store", schema = StoreCommand.class)
                                }
                        )
                )
        )
        @RequestBody Command command) {
    Long id = service.createOrder(command);
    return ResponseEntity.ok(id);
}
```

![](https://www.sfeir.dev/content/images/2025/11/image-14.png)

notre polymorphisme se reflète dans la documentation

### La logique métier : `OrderService` et le Pattern Matching

C'est dans la couche service que la "magie" opère. Grâce aux `sealed interfaces`, nous pouvons utiliser le __pattern matching__ du `switch` de Java. C'est une manière moderne, sûre et lisible de gérer les différents cas, sans avoir recours à des `if/else` et des `instanceof` fastidieux.

Le code est non seulement plus propre, mais le compilateur peut aussi vérifier que tous les cas (`OnlineCommand` et `StoreCommand`) sont bien traités (plus besoin de la branche default).

```java
public Long createOrder(Command command) {

    OrderEntity entity = new OrderEntity();

    switch (command) {
        case OnlineCommand online -> {
            logger.info("Reception d'une commande en ligne");
            entity.setType("online");
            entity.setPayload(serialize(online));
        }
        case StoreCommand store -> {
            logger.info("Reception d'une commande en magasin");
            entity.setType("store");
            entity.setPayload(serialize(store));
        }
    }

    return repository.save(entity).getId();
}
```

## Exemples d'utilisation

Voici comment vous pouvez appeler l'API avec les deux types de charges utiles.

```shell
curl -X POST http://localhost:8080/orders \
-H "Content-Type: application/json" \
-d '{
  "type": "online",
  "email": "customer@example.com",
  "deliveryAddress": "123 Main St, Anytown"
}'
```

création d'une commande en ligne

```shell
curl -X POST http://localhost:8080/orders \
-H "Content-Type: application/json" \
-d '{
  "type": "store",
  "storeId": "STORE-456",
  "express": true
}'
```

création d'une commande en magasin

## Conclusion

En combinant la puissance des `sealed interfaces` de Java pour la modélisation et les annotations de polymorphisme de Jackson, nous avons créé une API robuste, propre et facile à maintenir qui gère des structures de données complexes avec un point d'entrée unique.
