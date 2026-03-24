---
layout: "default"
title: "Gérer et superviser ses applications avec Spring Boot Admin"
permalink: "/back/java/spring-boot/gerer-et-superviser-ses-applications-avec-spring-boot-admin/"
tags: [back, java, spring-boot]
date: "2025-06-20"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/gerer-et-superviser-ses-applications-avec-spring-boot-admin/"
banner: "https://www.sfeir.dev/content/images/2025/08/20250827_1301_Pixelated-Spring-Boot-Admin_simple_compose_01k3njwycafj1s227vaaxe37a9.png"
published_at: "2025-06-20"
sfeir_slug: "gerer-et-superviser-ses-applications-avec-spring-boot-admin"
sfeir_tags: [Back, Java, Spring Boot, Monitoring]
---
Dans un écosystème d'applications distribuées, la supervision et la gestion des services deviennent des enjeux critiques pour assurer leur performance et leur disponibilité.  
Spring Boot Admin est une solution [open-source](https://www.sfeir.dev/tag/opensource/) qui simplifie la surveillance des applications basées sur [Spring Boot](/back/java/spring-boot/il-etait-une-fois-spring-boot/). Si vous avez déjà implémenté Spring Boot Admin et que plusieurs applications clientes lui envoient leurs données, vous savez déjà à quel point cet outil peut être puissant.

## Présentation de Spring Boot Admin

Spring Boot Admin est une interface web et une plateforme de monitoring conçue pour superviser et gérer des applications Spring Boot.  
Basé sur les principes de Spring Boot Actuator, il offre une vue centralisée des métriques, des configurations, des journaux (logs), et des états de santé des applications clientes.  
Chaque application cliente expose ses endpoints Actuator, que Spring Boot Admin agrège dans un tableau de bord.

**Les fonctionnalités principales incluent :**

- **Monitoring de la santé** : Vérification en temps réel de l'état des applications (UP, DOWN, etc.).
- **Métriques** : Suivi des performances (CPU, mémoire, threads, etc.).
- **Gestion des logs** : Consultation et modification des niveaux de logs à la volée.
- **Exploration des beans et configurations** : Accès aux informations sur les beans Spring, les propriétés d’environnement, et les mappings d’URL.
- **Notifications** : Intégration avec des systèmes comme Slack ou email pour alerter en cas de problème.

Spring Boot Admin est particulièrement adapté aux architectures microservices, où de nombreuses applications doivent être surveillées simultanément.



![](https://www.sfeir.dev/content/images/thumbnail/spring-boot-admin)

](https://github.com/codecentric/spring-boot-admin?ref=sfeir.dev)

## ⚖️ Avantages et Inconvénients

### ➕ Avantages

- **Facilité d’intégration** : Spring Boot Admin s’intègre nativement avec les applications Spring Boot via Actuator, réduisant les efforts de configuration.
- **Interface utilisateur intuitive** : Le tableau de bord est clair, ergonomique, et accessible même aux non-techniciens.
- **Centralisation** : Une seule interface pour superviser toutes les applications clientes.
- **Personnalisation** : Possibilité d’ajouter des fonctionnalités via des extensions ou des configurations spécifiques.
- **Notifications** : Alertes automatisées pour réagir rapidement aux incidents.

### ➖ Inconvénients

- **Limité à l’écosystème Spring** : Spring Boot Admin est conçu pour les applications Spring Boot, ce qui le rend inadapté pour d’autres technologies.
- **Dépendance à Actuator** : Les applications clientes doivent exposer leurs endpoints Actuator, ce qui peut poser des problèmes de sécurité si mal configuré.
- **Moins robuste pour l’analyse avancée** : Bien qu’efficace pour le monitoring de base, il manque de capacités d’analyse approfondie par rapport à des outils comme [Grafana ou Prometheus](/back/java/spring-boot/superviser-votre-application-spring-boot-grace-a-prometheus-et-grafana/).

## Complémentarité avec Grafana

Spring Boot Admin excelle dans la supervision en temps réel et la gestion des applications, mais il peut être limité pour l’analyse historique ou la visualisation avancée des données.  
C’est là que Grafana entre en jeu. Grafana est une plateforme de visualisation et d’analyse des données qui peut être intégrée avec des sources comme Prometheus, qui collecte les métriques des endpoints Actuator des applications Spring Boot.

### Pourquoi les combiner ?

- **Monitoring en temps réel (Spring Boot Admin)** : Spring Boot Admin fournit une vue instantanée de l’état des applications, avec des fonctionnalités comme la gestion des logs ou la vérification de santé.
- **Analyse historique et visualisation (Grafana)** : Grafana permet de créer des graphiques personnalisés, d’analyser les tendances sur le long terme, et de corréler les métriques de plusieurs sources (bases de données, files de messages, etc.).
- **Alerting avancé** : Grafana offre des options d’alerting plus sophistiquées, comme des seuils personnalisés ou des intégrations avec des outils comme PagerDuty.

## Mise en place

### Pour le server

Créer une application Spring Boot et lui ajouter la dépendance suivante :

```xml
<dependency>
    <groupId>de.codecentric</groupId>
    <artifactId>spring-boot-admin-starter-server</artifactId>
    <version>3.4.5</version>
</dependency>
```

il ne reste plus qu'à rajouter [l'annotation](/back/java/spring-boot/comprendre-les-annotations-dans-spring-boot-guide-et-exemples/)`@EnableAdminServer` dans votre classe main

```java
@EnableAdminServer
@SpringBootApplication
public class SpringBootAdminServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringBootAdminServerApplication.class, args);
    }
}
```

votre interface d'administration sera accessible à l'adresse suivante [http://localhost:xxxx/](http://localhost:8097/?ref=sfeir.dev) (remplacez xxxx par le port sur lequel votre application est démarrée).

[![](https://www.sfeir.dev/content/images/2025/04/image-7.png)](https://www.sfeir.dev/content/images/2025/04/image-7.png)

Pour l'instant comme nous n'avons pas encore enregistré d'application cliente, cette vue est désespérément vide 🥲.

### Pour les clients

Pour enregistrer des applications comme cliente de notre server d'administration, il faut ajouter les dépendances suivantes dans notre fichier pom.xml :

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>de.codecentric</groupId>
    <artifactId>spring-boot-admin-starter-client</artifactId>
    <version>3.4.5</version>
</dependency>
```

Il faut ensuite modifier leurs properties afin qu'elles se connectent à notre server :

```properties
spring.application.name=admin-client

spring.boot.admin.client.url=http://localhost:8097
management.endpoints.web.exposure.include=*
management.endpoint.env.show-values=ALWAYS
management.endpoint.env.sensitive=password,secret,key,token
```

une fois cela fait, notre vue précédente est déjà beaucoup moins vide :

[![](https://www.sfeir.dev/content/images/2025/04/image-8.png)](https://www.sfeir.dev/content/images/2025/04/image-8.png)

Nous retrouvons ici plusieurs informations :

- Le temps écoulé depuis le démarrage de l'application cliente
- Son nom défini par la propriété _spring.application.name_
- Le nombre d'instance de cette dernière
- Sa version
- Son statut UP (vert) / OFFLINE (rouge)

Et si jamais le statut d'une des applications vient à changer, l'on peut facilement en être informé

[![](https://www.sfeir.dev/content/images/2025/04/image-9.png)](https://www.sfeir.dev/content/images/2025/04/image-9.png)

### Administrer les applications

Si l'outil d'administration se limitait à cette simple vue, cela serait bien triste, mais il n'en est rien. Si vous venez à cliquer sur une des tuiles représentant une application cliente, vous aurez accès à une autre vue.

Prenons l'exemple de **spring-batch tutorial** :

[![](https://www.sfeir.dev/content/images/2025/04/image-10.png)](https://www.sfeir.dev/content/images/2025/04/image-10.png)

Nous avons ici accès à plus d'informations qui sont en fait une représentation visuelle des Actuator, et soyons honnêtes, c'est beaucoup plus digeste qu'un json à lire.

Dans le cas de **spring-batch tutorial**, [nous avions précédemment programmé des tâches](/back/java/spring-boot/planifier-des-taches-avec-spring-batch/), nous pouvons les retrouver dans le sous-menu **Tâches programmées**.

[![](https://www.sfeir.dev/content/images/2025/04/image-11.png)](https://www.sfeir.dev/content/images/2025/04/image-11.png)

### Ajout de Notifications (Optionnel)

Les notifications sont essentielles pour réagir rapidement aux incidents, comme un changement d'état de santé d'une application (par exemple, passage de **UP** à **DOWN**) ou des problèmes de performance.  
Spring Boot Admin prend en charge plusieurs canaux de notification, notamment l'**email**, **Slack**, **Microsoft Teams**, **Telegram**, ou même des **webhooks personnalisés**.

Prenons par exemple le cas de Slack : voici les étapes pour paramétrer les notifications :

1. Créer un webhook Slack
2. Accédez à votre espace de travail Slack :
    - Connectez-vous à votre espace de travail Slack via un navigateur ou l’application.
3. Créer une application Slack :
    - Allez sur [api.slack.com/apps](https://api.slack.com/apps?ref=sfeir.dev) et cliquez sur Create New App.
    - Choisissez **From scratch**, donnez un nom à l’application (par exemple, **SpringBootAdminNotifications**), et sélectionnez votre espace de travail.
4. Activer les webhooks entrants :
    - Dans le menu de gauche, allez à Features > Incoming Webhooks.
    - Activez le toggle **Activate Incoming Webhooks**.
    - Cliquez sur **Add New Webhook** to Workspace en bas de la page.
    - Sélectionnez le canal Slack où les notifications seront envoyées (par exemple, `#notifications`) et autorisez l’accès.
    - Copiez l'URL du webhook.
5. Configurer les notifications dans votre application server.

```properties
spring.boot.admin.notify.slack.enabled=true
spring.boot.admin.notify.slack.webhook-url=https://hooks.slack.com/services/votre/webhook
spring.boot.admin.notify.slack.channel=notifications
spring.boot.admin.notify.slack.username=SpringBootAdmin
spring.boot.admin.notify.slack.message=*#{instance.registration.name}* is now *#{event.statusInfo.status}* (Health: #{event.statusInfo.details.message ?: 'N/A'})
```

**Explications des propriétés :**

- **enabled** : Active les notifications Slack (true).
- **webhook-url** : L’URL du webhook Slack que vous avez copiée.
- **channel** : Le nom du canal Slack où envoyer les messages (par exemple, notifications). Vous pouvez aussi utiliser un ID de canal ou un nom d’utilisateur (par exemple, @utilisateur).
- **username** : Le nom affiché pour le bot qui envoie les messages dans Slack.
- **message** : Le format du message envoyé.

Il ne vous reste plus qu'à redémarrer votre application et maintenant dès qu'une application cliente changera de statut, vous recevrez une notification sur le canal dédié de votre espace Slack.

[![](https://www.sfeir.dev/content/images/2025/04/image-12.png)](https://www.sfeir.dev/content/images/2025/04/image-12.png)

## Conclusion

Spring Boot Admin est un outil incontournable pour les développeurs et administrateurs travaillant dans l’écosystème Spring Boot. Sa simplicité d’utilisation, son interface intuitive et ses fonctionnalités de monitoring en temps réel en font une solution idéale pour superviser des applications distribuées.

Bien qu’il présente quelques limites, notamment pour l’analyse avancée, son intégration avec des outils comme Grafana et Prometheus permet de combler ces lacunes.

En combinant Spring Boot Admin pour la gestion opérationnelle et Grafana pour l’analyse stratégique, vous obtenez une solution de supervision robuste et complète. Si vous avez déjà implémenté Spring Boot Admin, vous êtes bien placé pour tirer parti de ses capacités et continuer à optimiser la gestion de vos applications.
