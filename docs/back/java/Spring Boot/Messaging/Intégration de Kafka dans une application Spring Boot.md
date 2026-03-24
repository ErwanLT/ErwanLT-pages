---
layout: "default"
title: "Intégration de Kafka dans une application Spring Boot"
permalink: "/back/java/spring-boot/messaging/integration-de-kafka-dans-une-application-spring-boot/"
tags: [back, java, spring-boot, messaging]
status: "Draft"
---
Dans le monde des architectures distribuées et des applications orientées événements, [**Apache Kafka**](https://www.sfeir.dev/data/kesaco-apache-kafka/) s’est imposé comme l’une des technologies de messagerie les plus fiables et performantes.  
Il est particulièrement adapté aux scénarios nécessitant **une forte résilience**, **une haute capacité de traitement** et **un échange de données en temps réel**.  
Dans cet article, nous allons voir comment intégrer Kafka dans une application [[Il était une fois... Spring Boot|Spring Boot]] à travers un exemple concret comprenant un **producer** (émetteur de messages) et un **consumer** (lecteur de messages).

## Présentation de Kafka

[Apache Kafka](https://www.sfeir.dev/back/how-to-spring-kafka/) est une plateforme distribuée de diffusion de données en streaming, initialement développée par [LinkedIn](https://www.sfeir.dev/data/de-linkedin-a-licorne-technologique-la-trajectoire-exceptionnelle-de-confluent/) et maintenant maintenue par la fondation Apache.  
Son rôle principal est de permettre la publication, le stockage et la consommation de flux d’événements de manière scalable et tolérante aux pannes.

Les concepts clés :

- **Producer** : envoie les messages vers Kafka.
- **Consumer** : lit les messages depuis Kafka.
- **Topic** : canal de communication dans lequel les messages sont stockés.
- **Partition** : subdivision d’un topic permettant le parallélisme.
- **Offset** : position d’un message dans une partition.

Kafka est largement utilisé pour :

- La communication entre microservices.
- La collecte de logs et d’événements.
- Le traitement de données en temps réel.
- L’intégration de systèmes hétérogènes.

## ⚖️ Avantages et inconvénients

### ➕ Avantages

- **Haute performance** : capable de traiter des millions de messages par seconde.
- **Scalabilité horizontale** : possibilité d’ajouter facilement des brokers et des partitions.
- **Tolérance aux pannes** : réplication des données entre les brokers.
- **Durabilité** : messages stockés sur disque et conservés selon la rétention configurée.
- **Flexibilité** : prise en charge de différents modèles de consommation (temps réel, batch, etc.).

### ➖ Inconvénients

- **Courbe d’apprentissage** : nécessite une bonne compréhension des concepts (topics, partitions, offsets…).
- **Administration** : la configuration et la maintenance d’un cluster Kafka peuvent être complexes.
- **Pas un broker traditionnel** : Kafka est orienté flux, pas files d’attente, donc le design applicatif doit être adapté.

## Installation

### Dépendance Maven

Pour commencer, il nous faut ajouter la dépendance suivante à notre fichier `pom.xml`

```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```

### Kafka dans Docker

Depuis les versions récentes, **Kafka** peut être installé sans **Zookeeper** grâce au mode **KRaft**.  
Voici un fichier `docker-compose.yml` minimaliste adapté à ce mode :

```yaml
services:
  kafka:
    image: confluentinc/cp-kafka:latest
    ports:
      - "9092:9092"
    environment:
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: 'broker,controller'
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: 'CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT'
      KAFKA_ADVERTISED_LISTENERS: 'PLAINTEXT://kafka:29092,PLAINTEXT_HOST://localhost:9092'
      KAFKA_CONTROLLER_QUORUM_VOTERS: '1@kafka:9093'
      KAFKA_CONTROLLER_LISTENER_NAMES: 'CONTROLLER'
      KAFKA_LISTENERS: 'PLAINTEXT://0.0.0.0:29092,CONTROLLER://kafka:9093,PLAINTEXT_HOST://0.0.0.0:9092'
      KAFKA_INTER_BROKER_LISTENER_NAME: 'PLAINTEXT'
      CLUSTER_ID: 'MkU3OEVBNTcwNTJENDM2Qk'
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
```

📌 Ici, **aucun Zookeeper** n’est nécessaire : le broker Kafka joue à la fois le rôle de contrôleur et de gestionnaire des métadonnées.

---

Mais au fait Jammy, c'est quoi un Zookeeper ?  
Et bien Fred **Apache ZooKeeper** est un service distribué conçu à l’origine pour coordonner et gérer la configuration des systèmes distribués.  
Dans l’écosystème **Kafka** (jusqu’à la version 2.x), il remplissait plusieurs rôles essentiels :

1. **Gestion des métadonnées Kafka**
    - ZooKeeper stockait les informations sur les topics, les partitions, les leaders, les offsets, etc.
    - Les brokers Kafka allaient interroger ZooKeeper pour savoir _qui fait quoi_ dans le cluster.
2. **Élection du contrôleur**
    - Un **contrôleur Kafka** est un broker particulier qui coordonne la répartition des partitions et gère les bascules (failover) si un broker tombe.
    - ZooKeeper organisait l’élection de ce contrôleur.
3. **Surveillance de l’état du cluster**
    - Via ses **watches**, ZooKeeper informait Kafka en temps réel des changements (ajout/retrait d’un broker, modification de config, etc.).

Et le mode **KRaft** ?  
**KRaft (Kafka Raft)** est le nouveau mode de fonctionnement de Kafka qui remplace ZooKeeper par un protocole interne basé sur Raft pour gérer la coordination et le stockage des métadonnées du cluster.  
Introduit à partir de Kafka 2.8 et devenu le mode par défaut dans les versions récentes, il simplifie l’architecture en supprimant la dépendance à un service externe, réduit la complexité d’administration et améliore la résilience.  
En intégrant directement la gestion du consensus et des métadonnées dans **Kafka**, KRaft permet un déploiement plus léger, plus rapide à démarrer et plus facile à superviser.

---

## Exemple d'utilisation

Dans cette partie, nous allons voir comment envoyer et recevoir des messages Kafka à l’aide de **Spring Boot** et **Spring Kafka**.  
L’exemple repose sur trois éléments :

1. Un **Producer** pour publier les messages.
2. Un **Consumer** pour les lire.
3. Une **configuration** pour ajuster le comportement de consommation.

### Le Producer

Pour envoyer des messages via Kafka, nous avons besoin d'un **producer** :

```java
@Service
public class KafkaProducerService {

    private static final Logger LOG = LoggerFactory.getLogger(KafkaProducerService.class);

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final String topic;

    public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate,
                                @Value("${app.kafka.topic}") String topic) {
        this.kafkaTemplate = kafkaTemplate;
        this.topic = topic;
    }

    public void sendMessage(String message) {
        LOG.info("Envoi du message : {}", message);

        kafkaTemplate.send(topic, message)
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
    }
}
```

- **KafkaTemplate** : c’est l’outil principal fourni par Spring Kafka pour interagir avec le cluster et publier des messages.
- **Injection de la propriété `app.kafka.topic`** : le nom du topic est externalisé dans la configuration, ce qui permet de le changer sans toucher au code.
- **sendMessage** :
    - Journalise le message envoyé.
    - Utilise `kafkaTemplate.send(...)` pour publier le message de manière asynchrone.
    - La méthode `whenComplete` permet d’avoir un retour, qu’il s’agisse d’un succès ou d’une erreur, et de journaliser les métadonnées (topic, partition, offset).

### Le Consumer

Pour recevoir des messages via Kafka, il nous faut un service pouvant les recevoir :

```java
@Service
public class KafkaConsumerService {

    private static final Logger LOG = LoggerFactory.getLogger(KafkaConsumerService.class);

    @KafkaListener(
            topics = "${app.kafka.topic}",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void listen(String message, Acknowledgment acknowledgment) {
        try {
            LOG.info("Message reçu : {}", message);
            // Traitement du message
            acknowledgment.acknowledge(); // Commit manuel de l'offset
        } catch (Exception e) {
            LOG.error("Erreur lors du traitement du message : {}", message, e);
        }
    }
}
```

- **@KafkaListener** : indique à Spring Kafka que cette méthode doit écouter un ou plusieurs topics Kafka.
    - `topics` : externalisé dans la configuration pour plus de flexibilité.
    - `groupId` : identifie le groupe de consommateurs. Tous les consommateurs d’un même groupe se partagent les partitions d’un topic.
    - `containerFactory` : référence à une configuration spécifique permettant ici le commit manuel.
- **Paramètre `Acknowledgment`** : permet de contrôler quand l’offset est confirmé auprès de Kafka, garantissant que le message n’est pas perdu avant traitement.
- **acknowledgment.acknowledge()** : confirme la consommation du message après traitement, utile pour éviter les pertes en cas d’erreur ou de crash pendant le traitement.

### Confirmation

```java
@Configuration
public class KafkaConsumerConfig {

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory(
            ConsumerFactory<String, String> consumerFactory) {
        
        ConcurrentKafkaListenerContainerFactory<String, String> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        
        factory.setConsumerFactory(consumerFactory);
        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL);
        
        return factory;
    }
}
```

- **ConcurrentKafkaListenerContainerFactory** :
    - Fabrique les conteneurs qui gèrent l’exécution [[Comprendre les annotations dans Spring Boot - guide et exemples|des méthodes annotées]] avec `@KafkaListener`.
    - Permet de configurer le mode d’accusé de réception (acknowledgment).
- **AckMode.MANUAL** : désactive le commit automatique des offsets pour laisser le consommateur valider manuellement après traitement. C’est essentiel pour éviter la perte ou la duplication de messages lors d’erreurs.

## Aller plus loin

L’exemple précédent illustre la base de l’intégration de **Kafka** avec **Spring Boot**, mais Kafka offre bien plus de fonctionnalités pour gérer des flux complexes et critiques. Voici quelques pistes pour enrichir notre application que nous pourrions voir lors d'un prochain article :

- **Dead Letter Queue & Retry** : gérer les messages en erreur sans bloquer le flux.
- **Idempotence & transactions** : éviter doublons et garantir la cohérence des traitements.
- **Sécurité (SASL/SSL, ACL)** : protéger l’accès aux topics et aux données.
- **Schema Registry** : valider et versionner la structure des messages.
- **Monitoring** : suivre lag, performances et santé du cluster via [[Superviser votre application Spring Boot grâce à Prometheus et Grafana|Prometheus/Grafana]].

## Conclusion

Kafka est un outil puissant pour gérer la communication asynchrone et les flux de données massifs.  
Avec **Spring Boot** et **Spring Kafka**, son intégration devient beaucoup plus simple, et le passage au mode **KRaft** permet de déployer un cluster minimaliste sans dépendance à Zookeeper.  
Si votre application a besoin de réactivité, de résilience et de haute capacité de traitement, Kafka reste une solution de premier choix… à condition de bien en comprendre les concepts et de le configurer avec soin.
