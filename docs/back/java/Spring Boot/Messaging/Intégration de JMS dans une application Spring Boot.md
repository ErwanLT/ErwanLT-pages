---
layout: "default"
title: "Intégration de JMS dans une application Spring Boot"
permalink: "/back/java/spring-boot/messaging/integration-de-jms-dans-une-application-spring-boot/"
tags: [back, java, spring-boot, messaging]
date: "2026-03-17"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/integration-de-jms-dans-une-application-spring-boot/"
banner: "https://www.sfeir.dev/content/images/size/w1304/2025/08/20250828_1248_Pixel-JMS-Integration_simple_compose_01k3r4j9v9fhq8v041tt24t9hs.png"
published_at: "2026-03-17"
sfeir_slug: "integration-de-jms-dans-une-application-spring-boot"
sfeir_tags: [Back, Java, Spring Boot, Messaging, JMS]
---
Dans le monde de l’entreprise, la communication asynchrone entre applications est essentielle pour garantir la résilience, la scalabilité et le découplage des systèmes. Les files de messages jouent ici un rôle primordial en permettant d’échanger des informations de manière fiable, même lorsque les applications ne sont pas disponibles simultanément.

  
L’API **JMS (Java Message Service)** est une spécification standard qui offre un cadre pour cette communication basée sur la messagerie. Dans cet article, nous allons découvrir JMS, ses avantages et ses limites, avant de voir comment l’intégrer concrètement dans une [[Il était une fois... Spring Boot|application **Spring Boot**]] avec **ActiveMQ**.

## Présentation de JMS

MS est une API Java standardisée définissant un modèle de communication asynchrone entre producteurs et consommateurs de messages.  
Deux modèles principaux sont proposés :

- **Point-to-Point (Queues)** : un message est envoyé à une file et consommé par un seul récepteur.
- **Publish/Subscribe (Topics)** : un message est publié sur un sujet et distribué à plusieurs abonnés.

Grâce à ce standard, les développeurs peuvent utiliser différents brokers JMS (ActiveMQ, Artemis, IBM MQ…) sans changer leur code applicatif.

## ⚖️ Avantages et inconvénients

### ➕ Avantages

- **Découplage fort** entre les applications productrices et consommatrices.
- **Résilience** : les messages sont stockés tant qu’ils ne sont pas consommés.
- **Scalabilité** : plusieurs consommateurs peuvent traiter une file en parallèle.
- **Standardisation** : une API unifiée, quel que soit le broker utilisé.

### ➖ Inconvénients

- **Complexité accrue** : gestion des transactions, des redéliveries, des files mortes (DLQ).
- **Coût opérationnel** : un broker JMS doit être installé, configuré et maintenu.
- **Performances limitées** pour certains cas d’usage à très fort volume ([[Intégration de Kafka dans une application Spring Boot|Kafka]] sera alors plus adapté).

## Exemple d’intégration avec Spring Boot et ActiveMQ

### Dépendances Maven

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-activemq</artifactId>
</dependency>
```

Cette dépendance fournit tout le nécessaire pour intégrer **ActiveMQ** avec **Spring JMS**.

### Propriétés de configuration

```properties
# Nom de la file JMS
app.jms.queue-name=message-queue

# URL et credentials du broker ActiveMQ
spring.activemq.broker-url=tcp://localhost:61616
spring.activemq.user=admin
spring.activemq.password=admin

# Nombre maximum de tentatives de redélivrance
app.jms.retry.max-redeliveries=3
```

Ces propriétés permettent de :

- indiquer le **nom de la file** utilisée (`message-queue`),
- configurer la **connexion au broker**,
- définir la **politique de rejeu** (ici, 3 tentatives en cas d’erreur).

### Classe de configuration JMS

```java
@Configuration
@EnableJms
public class JmsConfig {
  @Value("${spring.activemq.broker-url}")
    private String brokerUrl;

    @Value("${spring.activemq.user}")
    private String user;

    @Value("${spring.activemq.password}")
    private String password;

    @Value("${app.jms.retry.max-redeliveries}")
    private int maxRedeliveries;

    ...
}
```

[Les annotations](https://www.sfeir.dev/back/comprendre-les-annotations-dans-spring-boot/) :

- `@Configuration` : indique que cette classe fournit des beans Spring.
- `@EnableJms` : active les annotations JMS comme `@JmsListener`.
- `@Value` injectent les propriétés définies dans `application.properties`.

#### Politique de redélivrance

```java
@Bean
public RedeliveryPolicy redeliveryPolicy() {
    RedeliveryPolicy redeliveryPolicy = new RedeliveryPolicy();
    redeliveryPolicy.setMaximumRedeliveries(maxRedeliveries);
    redeliveryPolicy.setInitialRedeliveryDelay(1000); // 1s avant la 1ere tentative
    redeliveryPolicy.setUseExponentialBackOff(false);
    redeliveryPolicy.setRedeliveryDelay(2000); // 2s entre les tentatives suivantes
    return redeliveryPolicy;
}
```

Cette configuration précise à **ActiveMQ** comment réagir lorsqu’un message ne peut pas être traité correctement par le consommateur.

- `setMaximumRedeliveries(maxRedeliveries)` : fixe le **nombre maximal de tentatives** avant que le message soit placé dans une **Dead Letter Queue (DLQ)**.
- `setInitialRedeliveryDelay(1000)` : attend 1 seconde avant de réessayer une première fois.
- `setRedeliveryDelay(2000)` : impose un délai fixe de 2 secondes entre chaque tentative.
- `setUseExponentialBackOff(false)` : ici, pas de croissance exponentielle du délai.

**Pourquoi mettre une limite au nombre de rejeux ?**

- **Éviter une boucle infinie** : sans limite, un message non traitable serait relu indéfiniment, surchargeant inutilement le broker et les consommateurs.
- **Préserver les ressources** : chaque tentative mobilise des threads, de la mémoire et du CPU. Un message défectueux (ex. format invalide) ne doit pas mettre en péril l’ensemble du système.
- **Faciliter le diagnostic** : en basculant le message dans une **DLQ**, on peut l’analyser a posteriori, comprendre la cause de l’échec (bug applicatif, données corrompues, problème temporaire d’infrastructure) et appliquer une correction ciblée.
- **Respecter la qualité de service** : les autres messages doivent continuer à être traités normalement, sans être bloqués par un seul message problématique.

En pratique, cette limite agit comme un **pare-feu de robustesse** : elle protège l’application contre les scénarios où un message ne pourra jamais être consommé correctement.

#### Connexion au broker

```java
@Bean
public ConnectionFactory connectionFactory(RedeliveryPolicy redeliveryPolicy){
    ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory();
    connectionFactory.setBrokerURL(brokerUrl);
    connectionFactory.setUserName(user);
    connectionFactory.setPassword(password);
    connectionFactory.setRedeliveryPolicy(redeliveryPolicy);
    connectionFactory.setTrustAllPackages(true);
    return connectionFactory;
}
```

Ce bean établit la connexion entre l’application et ActiveMQ, en appliquant la politique de rejeu.

#### Listener JMS

```java
@Bean
public JmsListenerContainerFactory<?> jmsListenerContainerFactory(ConnectionFactory connectionFactory,
                                                                  DefaultJmsListenerContainerFactoryConfigurer configurer) {
    DefaultJmsListenerContainerFactory factory = new DefaultJmsListenerContainerFactory();
    configurer.configure(factory, connectionFactory);
    factory.setSessionTransacted(true);
    return factory;
}
```

Ce bean crée le **contenant** des listeners JMS.

- `@JmsListener` s’appuiera sur cette configuration.
- L’option `setSessionTransacted(true)` garantit que l’échec d’un message provoque son rejeu automatique.

#### Template JMS avec MessageConverter

```java
@Bean
public JmsTemplate jmsTemplate(ConnectionFactory connectionFactory, MessageConverter messageConverter) {
    JmsTemplate jmsTemplate = new JmsTemplate(connectionFactory);
    jmsTemplate.setMessageConverter(messageConverter);
    return jmsTemplate;
}

@Bean
public MessageConverter jacksonJmsMessageConverter() {
    MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
    converter.setTargetType(MessageType.TEXT);
    converter.setTypeIdPropertyName("_type");
    return converter;
}
```

- `MappingJackson2MessageConverter` transforme automatiquement les objets Java (`ChatMessage`) en JSON à l’envoi et reconvertit le JSON en objet Java à la réception.
- `setTargetType(MessageType.TEXT)` : le message JMS sera un **texte** (JSON) plutôt qu’un binaire Java, ce qui facilite la lecture et l’interopérabilité.
- `setTypeIdPropertyName("_type")` : permet au listener JMS de savoir quel type Java recréer à partir du JSON.
- L’injection du converter dans le `JmsTemplate` garantit que tous les messages envoyés et reçus utilisent ce format JSON.

### Service d’envoi (Producteur)

```java
@Service
public class MessageProducerService {

    private static final Logger log = LoggerFactory.getLogger(MessageProducerService.class);

    private final JmsTemplate jmsTemplate;

    @Value("${app.jms.queue-name}")
    private String queueName;

    public MessageProducerService(JmsTemplate jmsTemplate) {
        this.jmsTemplate = jmsTemplate;
    }

    public void sendMessage(ChatMessage chatMessage) {
        jmsTemplate.convertAndSend(queueName, chatMessage);
        log.info("Message envoyé dans la file : {}", chatMessage);
    }
}
```

### Service de réception (Consommateur)

```java
@Service
public class MessageConsumerService {

    private static final Logger log = LoggerFactory.getLogger(MessageConsumerService.class);

    @Value("${app.jms.retry.max-redeliveries}")
    private int maxRedeliveries;

    @JmsListener(destination = "${app.jms.queue-name}", containerFactory = "jmsListenerContainerFactory")
    public void receiveMessage(ChatMessage chatMessage, Message jmsMessage) throws JMSException {
        int deliveryCount = jmsMessage.getIntProperty("JMSXDeliveryCount");
        // Total attempts = 1 (initial) + maxRedeliveries
        int maxDeliveries = maxRedeliveries + 1;

        log.info("Message reçu (tentative {} sur {}): {}", deliveryCount, maxDeliveries, chatMessage);

        if (chatMessage.getContent().contains("ERROR")) {
            if (deliveryCount == maxDeliveries) {
                log.warn("Dernière tentative de rejeu ({} sur {}). Le message sera envoyé à la DLQ en cas d'échec.", deliveryCount, maxDeliveries);
            }
            log.error("Erreur simulée (tentative {} sur {}).", deliveryCount, maxDeliveries);
            throw new MessageProcessingException("Erreur simulée pour déclencher le rejeu.");
        }

        log.info("Message traité avec succès: {}", chatMessage);
    }
}
```

- `@JmsListener` : déclare la méthode comme **consommateur** d’une file JMS.
- `JMSXDeliveryCount` : propriété JMS indiquant combien de fois le message a déjà été tenté.
- Si le contenu contient `"ERROR"`, une exception est volontairement levée pour déclencher un rejeu.
- Après `maxRedeliveries`, le message sera envoyé en **Dead Letter Queue (DLQ)**.

---

Dans le cadre de cet exemple, mon broker ActiveMQ est lancé dans un conteneur docker, ce dernier me permet d'avoir accès à une console d'administration à l'adresse suivante : [http://localhost:8161/admin/index.jsp](http://localhost:8161/admin/index.jsp)

Cette console permet de suivre les différentes queues utilisé ainsi que les message qui y transite, et grâce au message converter, je peux également voir le contenue de ces dernier.

[![](https://www.sfeir.dev/content/images/2025/08/image-22.png)](https://www.sfeir.dev/content/images/2025/08/image-22.png)

[![](https://www.sfeir.dev/content/images/2025/08/image-23.png)](https://www.sfeir.dev/content/images/2025/08/image-23.png)

---

## Alternatives à JMS

Bien que JMS soit un standard robuste, d’autres solutions existent :

- **Apache Kafka** : orienté streaming d’événements, hautement performant et distribué.
- **RabbitMQ** : broker de messages basé sur AMQP, simple à mettre en place et riche en fonctionnalités.
- **SQS (AWS)** ou **Azure Service Bus** : solutions cloud managées, adaptées aux architectures serverless.

Le choix dépend du contexte : JMS reste pertinent dans des environnements Java historiques ou lorsqu’un broker JMS est déjà en place.

## Conclusion

L’intégration de JMS dans une application **Spring Boot** permet de bénéficier d’une communication asynchrone fiable, reposant sur un standard éprouvé. Grâce à l’écosystème Spring, la mise en place est grandement simplifiée : quelques propriétés, une classe de configuration et des [[Comprendre les annotations dans Spring Boot - guide et exemples|services annotés]] suffisent pour envoyer et consommer des messages.
