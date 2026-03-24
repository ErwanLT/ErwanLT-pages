---
layout: "default"
title: "Transactional Outbox : la pièce manquante entre votre base et Kafka"
permalink: "/back/java/spring-boot/messaging/transactional-outbox-la-piece-manquante-entre-votre-base-et-kafka/"
tags: [back, java, spring-boot, messaging]
status: "Draft"
source: "sfeir.dev"
source_url: ""
banner: ""
---
# Transactional Outbox : la pièce manquante entre votre base et Kafka

Dans [[Intégration de Kafka dans une application Spring Boot|l'article précédent sur Kafka]] puis dans [[Intégration de Kafka dans une application Spring Boot - Allons plus loins|la version avancée]], nous avons vu comment publier et consommer des messages de manière fiable.

Mais en production, une question finit toujours par arriver :

> Comment garantir la cohérence entre une écriture en base et l’envoi d’un événement Kafka ?

Prenons un cas simple : création d’une commande.

- Si la commande est bien enregistrée en base, mais que la publication Kafka échoue, l’écosystème ne voit jamais l’événement.
- Si Kafka publie, mais que la transaction base est rollback, les autres services reçoivent un événement fantôme.

Bienvenue dans le vrai monde des systèmes distribués.

C’est précisément le problème que résout le pattern **Transactional Outbox**.

## Qu’est-ce que le Transactional Outbox ?

Le principe est le suivant :

1. On écrit la donnée métier (ex: `order`) dans la base.
2. Dans **la même transaction**, on écrit un enregistrement dans une table `outbox_events`.
3. Un publisher asynchrone lit les événements `PENDING` de l’outbox.
4. Il publie vers Kafka.
5. Il marque ensuite l’événement en `SENT`.

Tant que la transaction SQL n’est pas validée, aucun événement n’est considéré publiable.

## Pourquoi c’est utile ?

### ✅ Avantages

- Garantit la cohérence **DB ↔ événement** sans 2PC.
- Compatible avec les architectures event-driven.
- Permet de rejouer/inspecter les événements non envoyés.
- Se combine très bien avec [[Comment bien gérer ses exceptions dans Spring Boot|une gestion propre des erreurs]].

### ⚠️ Inconvénients

- Ajoute une table et un composant de publication à maintenir.
- Nécessite une stratégie d’observabilité (lag outbox, retries, backlog), voir [[Superviser votre application Spring Boot grâce à Prometheus et Grafana]].
- L’idempotence côté consumer reste nécessaire, même avec Outbox.

## Implémentation Spring Boot + Kafka

Pour ce tutoriel, on s’appuie sur un module dédié dans le repo de démo :

`integration/messaging-tutorial/transactional-outbox-tutorial`

### Dépendances Maven

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.kafka</groupId>
        <artifactId>spring-kafka</artifactId>
    </dependency>
</dependencies>
```

On garde Spring Data JPA/H2 via le parent du projet.

### Entité métier + entité Outbox

L’entité métier (`CustomerOrder`) représente la donnée fonctionnelle.

L’entité Outbox stocke l’événement à publier :

```java
@Entity
@Table(name = "outbox_events")
public class OutboxEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String aggregateType;

    @Column(nullable = false, length = 64)
    private String aggregateId;

    @Column(nullable = false, length = 120)
    private String eventType;

    @Lob
    @Column(nullable = false)
    private String payload;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OutboxStatus status;

    @Column(nullable = false)
    private Instant createdAt;

    private Instant sentAt;
}
```

Avec l’état :

```java
public enum OutboxStatus {
    PENDING,
    SENT
}
```

### Écriture atomique: commande + outbox

Le point critique est ici : on persiste commande et outbox dans **une seule transaction**.

```java
@Transactional
public UUID createOrder(CreateOrderRequest request) {
    CustomerOrder order = new CustomerOrder();
    order.setCustomerName(request.customerName());
    order.setAmount(request.amount());
    CustomerOrder savedOrder = customerOrderRepository.save(order);

    OrderCreatedEvent event = new OrderCreatedEvent(
            savedOrder.getId(),
            savedOrder.getCustomerName(),
            savedOrder.getAmount(),
            savedOrder.getCreatedAt()
    );

    OutboxEvent outboxEvent = new OutboxEvent();
    outboxEvent.setAggregateType("ORDER");
    outboxEvent.setAggregateId(savedOrder.getId().toString());
    outboxEvent.setEventType("ORDER_CREATED");
    outboxEvent.setStatus(OutboxStatus.PENDING);
    outboxEvent.setPayload(toJson(event));
    outboxEventRepository.save(outboxEvent);

    return savedOrder.getId();
}
```

Ici, pas de publication Kafka immédiate : uniquement de la persistance fiable.

### Publisher planifié

Un composant planifié scanne les événements `PENDING`.

```java
@Scheduled(fixedDelayString = "${app.outbox.publish-delay-ms:3000}")
public void publishPending() {
    outboxEventRepository.findTop50ByStatusOrderByCreatedAtAsc(OutboxStatus.PENDING)
            .forEach(event -> {
                try {
                    outboxPublisherTx.publishOne(event.getId());
                } catch (Exception exception) {
                    LOG.warn("Outbox event {} will be retried later", event.getId(), exception);
                }
            });
}
```

Et la publication atomique sur un événement unique :

```java
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void publishOne(Long outboxEventId) throws Exception {
    OutboxEvent event = outboxEventRepository.findByIdAndStatus(outboxEventId, OutboxStatus.PENDING)
            .orElse(null);

    if (event == null) {
        return;
    }

    kafkaTemplate.send(topic, event.getAggregateId(), event.getPayload())
            .get(10, TimeUnit.SECONDS);

    event.setStatus(OutboxStatus.SENT);
    event.setSentAt(Instant.now());
}
```

### API de démonstration

- `POST /api/orders` : crée une commande et un événement outbox `PENDING`.
- `GET /api/outbox?status=PENDING|SENT` : inspecte la table outbox.

Exemple de requête :

```json
{
  "customerName": "Erwan",
  "amount": 42.50
}
```

## Configuration

```properties
spring.application.name=transactional-outbox-tutorial
server.port=8088

spring.kafka.bootstrap-servers=localhost:9092
app.kafka.topic=order-events
spring.kafka.consumer.group-id=outbox-demo-group

spring.datasource.url=jdbc:h2:mem:outboxdb;DB_CLOSE_DELAY=-1
spring.jpa.hibernate.ddl-auto=update

app.outbox.publish-delay-ms=3000
```

Pour Kafka local, un `docker-compose.yml` est fourni dans le module.

## Tests d’intégration

Deux tests valident le comportement attendu :

1. `OrderServiceIntegrationTest` : vérifie qu’une commande et un événement `PENDING` sont bien persistés ensemble.
2. `OutboxPublisherTxIntegrationTest` : mocke la publication Kafka et vérifie la transition `PENDING -> SENT`.

Ce n’est pas juste “du code qui compile”, c’est du code qui démontre le pattern.

## Bonnes pratiques de prod

- Ajouter un mécanisme de retries/backoff côté publisher (et éventuellement DLQ applicative).
- Exposer des métriques : nombre de `PENDING`, âge max d’un événement, taux d’échec publication.
- Surveiller ces métriques via [[Gérer et superviser ses applications avec Spring Boot Admin]] et [[Superviser votre application Spring Boot grâce à Prometheus et Grafana]].
- Garder des tests d’architecture avec [[Maîtrisez votre architecture Spring Boot avec ArchUnit|ArchUnit]] pour éviter les contournements (publication directe hors outbox).

## Conclusion

Le Transactional Outbox ne rend pas un système “magique”.

En revanche, il donne un cadre robuste pour résoudre un problème classique des architectures distribuées :
**ne jamais laisser la base dire une chose pendant que le bus d’événements en raconte une autre.**

Et si tu veux pousser encore plus loin la robustesse de la chaîne, combine ce pattern avec des tests de chaos via [[Introduisez du chaos dans votre application Spring Boot]] et une stratégie d’idempotence côté consumer.
