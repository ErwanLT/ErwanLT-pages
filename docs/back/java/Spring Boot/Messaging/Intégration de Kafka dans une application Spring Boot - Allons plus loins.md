---
layout: "default"
title: "Intégration de Kafka dans une application Spring Boot - Allons plus loins"
permalink: "/back/java/spring-boot/messaging/integration-de-kafka-dans-une-application-spring-boot-allons-plus-loins/"
tags: [back, java, spring-boot, messaging]
status: "Draft"
---
Dans [l'article précédent](/back/java/spring-boot/messaging/integration-de-kafka-dans-une-application-spring-boot/), nous avons vu comment intégré facilement [Kafka](https://www.sfeir.dev/data/kesaco-apache-kafka/) dans une application [spring boot](/back/java/spring-boot/il-etait-une-fois-spring-boot/).

Et à la fin je vous avais donné des pistes pour aller plus loins :

- **Dead Letter Queue & Retry** : gérer les messages en erreur sans bloquer le flux.
- **Idempotence & transactions** : éviter doublons et garantir la cohérence des traitements.
- **Sécurité (SASL/SSL, ACL)** : protéger l’accès aux topics et aux données.
- **Schema Registry** : valider et versionner la structure des messages.
- **Monitoring** : suivre lag, performances et santé du cluster via prometheus et grafana.

Ce sont ces dernières que nous allons explorer au cours de cet article.

## Dead Letter Queue & Retry

Il peut arriver que des erreurs surviennent lors du traitement des messages : données invalides, service tiers indisponible, problème réseau, etc.

Dans ces cas, deux stratégies sont couramment utilisées :

1. **Retry** : réessayer le traitement du message un certain nombre de fois avant de le considérer comme irrécupérable.
2. **Dead Letter Queue (DLQ)** : envoyer les messages en échec dans un topic dédié pour analyse ou re-traitement ultérieur.

### Pourquoi utiliser une DLQ ?

Une **Dead Letter Queue** permet de **ne pas bloquer le flux global**.  
Sans DLQ, un message problématique peut provoquer un blocage complet du consommateur s’il revient sans cesse dans le flux.  
Avec une DLQ :

- Les messages valides continuent d’être traités normalement.
- Les messages en erreur sont isolés dans un topic dédié.
- Un traitement spécifique peut être appliqué sur ces messages (correction, ré-envoi, suppression…).

### Modification de la configuration

Pour mettre en place la DLQ, nous allons reprendre le code du consumer et de la configuration de l'article précédent et les completer.

```java
@Configuration
public class KafkaConsumerConfig {

    @Value("${app.kafka.dlt-topic}")
    private String dltTopic;

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory(
            ConsumerFactory<String, String> consumerFactory,
            KafkaTemplate<String, String> kafkaTemplate) { // Inject KafkaTemplate

        ConcurrentKafkaListenerContainerFactory<String, String> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        
        factory.setConsumerFactory(consumerFactory);
        
        // Active le mode Ack manuel
        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL);

        // Configure le DefaultErrorHandler avec DeadLetterPublishingRecoverer
        // FixedBackOff(0L, 0) signifie pas de re-tentative avant d'envoyer au DLT
        DefaultErrorHandler errorHandler = new DefaultErrorHandler(
            new DeadLetterPublishingRecoverer(kafkaTemplate, (consumerRecord, e) -> {
                // Définir le topic DLQ et la partition (null pour laisser Kafka choisir)
                return new TopicPartition(dltTopic, -1);
            }),
            new FixedBackOff(0L, 0)
        );
        factory.setCommonErrorHandler(errorHandler);

        
        return factory;
    }
}
```

nouvelle version de la configuration

📌 **Points clés**

- **DeadLetterPublishingRecoverer** : publie automatiquement le message en erreur dans le topic DLQ.
- **FixedBackOff(0L, 0)** : pas de retry avant l’envoi en DLQ. Par exemple, `new FixedBackOff(1000L, 3)` ferait 3 tentatives espacées d’1 seconde.
- **Ack manuel** : garantit que le commit d’offset n’est effectué qu’après un traitement réussi.

### Modification du consumer principal

```java
@KafkaListener(
        topics = "${app.kafka.topic}",
        groupId = "${spring.kafka.consumer.group-id}",
        containerFactory = "kafkaListenerContainerFactory"
)
public void listen(String message, Acknowledgment acknowledgment) {
    LOG.info("Message reçu : {}", message);

    if (message.contains("erreur")) {
        LOG.error("Erreur simulée pour le message : {}", message);
        throw new RuntimeException("Erreur de traitement simulée");
    }

    LOG.info("Message traité avec succès : {}", message);
    acknowledgment.acknowledge();
}
```

📌 Ici, nous **simulons une erreur** pour forcer le passage en DLQ.  
L’exception déclenchée est interceptée par notre `DefaultErrorHandler`, qui publie le message dans le topic DLQ.

### Listener pour la DLQ

```java
@KafkaListener(
        topics = "${app.kafka.dlt-topic}",
        groupId = "${spring.kafka.consumer.group-id}",
        containerFactory = "kafkaListenerContainerFactory"
)
public void listenDlt(String message, Acknowledgment acknowledgment) {
    LOG.warn("Message reçu de la DLQ : {}", message);

    try {
        LOG.info("Tentative de re-traitement du message DLQ : {}", message);

        if (message.contains("re-erreur")) {
            throw new RuntimeException("Re-échec simulé");
        }

        LOG.info("Message de la DLQ re-traité avec succès");
        acknowledgment.acknowledge();
    } catch (Exception e) {
        LOG.error("Échec du re-traitement DLQ : {}", message, e);
        acknowledgment.acknowledge();
    }
}
```

📌 Ce listener est dédié au **topic DLQ**.  
Il permet de tenter un **retry manuel** et d’appliquer une logique différente de celle du flux principal.

Avec cette configuration, tout message en erreur est automatiquement envoyé dans un **topic DLQ**, où il peut être surveillé, corrigé ou retraité, tout en laissant le reste du flux Kafka tourner normalement.

## Idempotence & transactions

L’**idempotence** permet de garantir qu’un message produit ne sera pas envoyé plusieurs fois, même en cas de retry côté producer.  
Les **transactions Kafka** vont plus loin : elles permettent de grouper plusieurs opérations (lecture, traitement, écriture) dans une seule unité atomique.

### Concepts Clés

1. **Idempotence du Producteur (Producer Idempotence) :**
    - Garantit que les messages envoyés par un producteur à une seule partition sont livrés exactement une fois, même en cas de retries du producteur.
    - C'est une fonctionnalité intégrée à Kafka, activée par une simple configuration.
2. **Transactions Kafka (Kafka Transactions) :**
    - Permettent d'envoyer des messages à plusieurs topics/partitions de manière atomique, ou d'envoyer des messages et de committer les offsets de consommation de manière  
        atomique avec d'autres opérations (par exemple, des écritures en base de données).
    - C'est la clé pour les garanties "exactement une fois" de bout en bout.
3. **Idempotence au niveau de l'Application (Consumer-Side Idempotence) :**
    - Même avec les transactions Kafka, un consommateur peut toujours recevoir le même message plusieurs fois (par exemple, après un crash et un redémarrage).
    - L'application consommatrice doit être conçue pour détecter et ignorer les messages déjà traités. Cela implique généralement de stocker un identifiant unique du message dans  
        une base de données et de vérifier sa présence avant tout traitement.

### Idempotence & Transactions côté Producer

Lorsque l’on produit des messages vers Kafka, un **retry côté producer** (par exemple en cas de perte réseau) peut générer des doublons dans le topic.  
Pour éviter ce problème, Kafka propose un mode **idempotent**, qui garantit qu’un message sera écrit **une seule fois** même si l’envoi est retenté.

En complément, l’utilisation de **transactions Kafka** permet de grouper plusieurs envois dans une seule unité atomique :

- soit tous les messages de la transaction sont publiés,
- soit aucun ne l’est (rollback automatique).

#### Configuration

Dans `application.properties`, on active l’idempotence et on définit un préfixe pour l’ID transactionnel :

```properties
spring.kafka.producer.properties.enable.idempotence=true
spring.kafka.producer.transaction-id-prefix=tx-sender-
spring.kafka.producer.value-serializer=org.springframework.kafka.support.serializer.JsonSerializer
```

j'ai également ajouté un ùJsonSerializer` car pour cet exemple j'ai fait évoluer le producer pour qu'il envoie un objet au lieu d'un simple String.

- `enable.idempotence=true` configure automatiquement Kafka avec `acks=all`, un nombre illimité de retries et un flux de requêtes sécurisé.
- Le `transaction-id-prefix` doit être unique par instance de producer pour garantir l’isolation des transactions.

#### Implémentation du Producer transactionnel

```java
public void sendMessage(Message message) {
    LOG.info("Envoi du message : {}", message);

    kafkaTemplate.executeInTransaction(kafkaOperations -> {
        kafkaOperations.send(topic, message)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        LOG.error("Erreur lors de l'envoi du message : {}", message, ex);
                    } else {
                        LOG.info("Message envoyé : topic={}, partition={}, offset={}",
                                result.getRecordMetadata().topic(),
                                result.getRecordMetadata().partition(),
                                result.getRecordMetadata().offset());
                    }
                });
        return true;
    });
}
```

- **`executeInTransaction`**  
    Permet de regrouper les envois dans une transaction Kafka.  
    Si une exception est levée, Kafka annule l’envoi et aucun message n’est écrit.
- **Idempotence activée**  
    Même en cas de retry interne au producer, Kafka garantit qu’un message avec le même identifiant de séquence ne sera pas écrit deux fois.
- **Avantage combiné**  
    L’idempotence élimine les doublons à l’intérieur d’une même transaction, et la transaction assure que toutes les opérations incluses réussissent ou échouent ensemble.

### Idempotence & Transactions côté Consumer

L’idempotence côté producer évite les doublons à l’envoi, mais **ce n’est pas suffisant** :

- Un consumer peut redémarrer avant d’avoir commit un offset.
- Un retry automatique (DLQ, réécoute du topic) peut amener à retraiter un même message.

Pour éviter de **traiter deux fois le même message**, il faut mettre en place un contrôle d’unicité côté consumer.

#### Stratégie

Nous allons stocker **l’ID de chaque message traité** dans une base (ici H2 en mémoire pour l’exemple).  
Avant chaque traitement, le consumer vérifie si l’ID est déjà présent :

- **Oui** → on ignore le message.
- **Non** → on traite et on enregistre l’ID.

Cela permet de **garantir l’idempotence même après un redémarrage** ou en cas de relecture depuis la DLQ.

#### Configuration

La configuration n'a pas évoluer depuis la partie précédente, si ce n'est le passage à notre nouvel objet Message.

```java
@Configuration
public class KafkaConsumerConfig {

    @Value("${app.kafka.dlt-topic}")
    private String dltTopic;

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, Message> kafkaListenerContainerFactory( ConsumerFactory<String, Message> consumerFactory,
                                                                                                   KafkaTemplate<String, Message> kafkaTemplate) { // Changé à Message

        ConcurrentKafkaListenerContainerFactory<String, Message> factory = // Changé à Message
                new ConcurrentKafkaListenerContainerFactory<>();
        
        factory.setConsumerFactory(consumerFactory);
        
        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL);
        DefaultErrorHandler errorHandler = new DefaultErrorHandler(
            new DeadLetterPublishingRecoverer(kafkaTemplate, (consumerRecord, e) -> new TopicPartition(dltTopic, -1)),
            new FixedBackOff(0L, 0)
        );
        factory.setCommonErrorHandler(errorHandler);
        
        return factory;
    }
}
```

#### Implémentation du Consumer idempotent

```java
@Transactional
@KafkaListener(
        topics = "${app.kafka.topic}",
        groupId = "${spring.kafka.consumer.group-id}",
        containerFactory = "kafkaListenerContainerFactory"
)
public void listen(Message message, Acknowledgment acknowledgment) {
    if (message == null || message.id() == null) {
        LOG.warn("Received message or message ID is null, cannot process for idempotence.");
        acknowledgment.acknowledge();
        return;
    }

    if (processedMessageRepository.existsById(message.id())) {
        LOG.info("Message with ID {} has already been processed, skipping.", message.id());
        acknowledgment.acknowledge();
        return;
    }

    LOG.info("Message reçu : {}", message);

    // Simuler une erreur pour les messages contenant "erreur"
    if (message.message() != null && message.message().contains("erreur")) {
        LOG.error("Simulating processing error for message: {}", message);
        throw new RuntimeException("Erreur de traitement simulée pour le message: " + message);
    }

    // Traitement du message (si pas d'erreur)
    LOG.info("Message traité avec succès : {}", message);
    processedMessageRepository.save(new ProcessedMessage(message.id()));
    acknowledgment.acknowledge();
}
```

- **Repository `ProcessedMessageRepository`** :  
    Assure la persistance des IDs déjà traités. Ici, H2 est utilisé pour l’exemple, mais en production on utilisera une base persistante (PostgreSQL, MySQL…).
- **Vérification avant traitement** :  
    Si l’ID existe déjà, le message est ignoré immédiatement.
- **Ack manuel** :  
    Empêche Kafka de considérer un message comme traité tant que nous n’avons pas explicitement validé son traitement.
- **Même logique pour la DLQ** :  
    Un listener séparé écoute le topic DLQ, applique la même vérification d’idempotence, et retente le traitement si nécessaire.

## Conclusion

La mise en place combinée de **mécanismes de reprise** (_Retry_ et _Dead Letter Queue_) et de **garanties d’idempotence avec transactions Kafka** permet d’atteindre un haut niveau de fiabilité dans le traitement des messages.

- **DLQ + Retry** offrent un cadre robuste pour gérer les erreurs transitoires ou définitives :
    - Les _retries_ automatiques ou programmés donnent une seconde chance au traitement.
    - La _Dead Letter Queue_ isole les messages problématiques pour analyse ou re-traitement ultérieur.
- **Idempotence & Transactions** sécurisent l’intégrité des données dans un environnement distribué :
    - Côté **producer**, l’option `enable.idempotence=true` et l’usage de transactions garantissent qu’aucun doublon n’est produit et que les envois sont atomiques.
    - Côté **consumer**, la vérification d’ID déjà traités prévient toute double exécution, même après un redémarrage, un retry ou une relecture depuis la DLQ.

En combinant ces approches :

1. **On isole les messages en échec** pour éviter de bloquer le flux global.
2. **On évite la duplication** qui pourrait corrompre les données ou provoquer des effets indésirables.
3. **On garantit la cohérence** des traitements, même en cas de panne ou de scénarios imprévus.

Dans un système distribué, où la défaillance est une possibilité permanente, cette combinaison d’outils est une assurance :  
**le système devient résilient, prévisible et capable de se remettre des aléas sans perte ni incohérence.**
