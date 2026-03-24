---
layout: "default"
title: "Découverte des Actuators dans Spring Boot"
permalink: "/back/java/spring-boot/decouverte-des-actuators-dans-spring-boot/"
tags: [back, java, spring-boot]
date: "2026-01-13"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/decouverte-des-actuators-dans-spring-boot/"
banner: "https://www.sfeir.dev/content/images/size/w1304/2025/09/20250906_1627_8-Bit-Actuator-Magic_simple_compose_01k4fpp380e8mrx488rkczgtjj.png"
published_at: "2026-01-13"
sfeir_slug: "decouverte-des-actuators-dans-spring-boot"
sfeir_tags: [Back, Java, Spring Boot, Actuator]
---
Dans un contexte où les applications logicielles ne cessent de croître en complexité, [[Superviser votre application Spring Boot grâce à Prometheus et Grafana|la surveillance et la maintenance]] deviennent des enjeux majeurs. Déployer une application ne suffit pas : il faut pouvoir en vérifier l’état de santé, comprendre son comportement interne et anticiper ses éventuels dysfonctionnements.

Dans le monde [[Il était une fois... Java|Java]], [[Il était une fois... Spring Boot|Spring Boot]] s’est imposé comme un framework de référence, alliant simplicité et richesse fonctionnelle. Parmi les nombreuses fonctionnalités qu’il propose, **Spring Boot Actuator** occupe une place de choix.  
Cette brique, parfois méconnue, fournit une panoplie d’outils pour **observer, diagnostiquer et interagir avec une application en cours d’exécution**, et cela avec une intégration minimale.

Dans de nombreux article autour de [Spring Boot](https://www.sfeir.dev/back/back-spring-boot/) nous vous avons parlé des actuators, aujourd'hui c'est l'heure de les découvrir en détails.

## C’est quoi les Actuators ?

Les _Actuators_ sont des **points d’accès prêts à l’emploi** qui exposent des informations internes sur une application Spring Boot. Ils constituent une interface de supervision permettant aussi bien aux développeurs qu’aux équipes d’exploitation de mieux comprendre l’état de l’application.

### Quand les utiliser ?

Les actuators trouvent leur utilité dès que l’application passe en phase de déploiement sur un environnement partagé (recette, préproduction, production). Lorsqu’il faut superviser une ferme de microservices, vérifier qu’un service est bien en ligne ou encore automatiser des redémarrages via des orchestrateurs comme Kubernetes, les actuators deviennent indispensables.

### Comment fonctionnent-ils ?

Spring Boot met à disposition un ensemble de points d’accès standards. Par exemple :Ces endpoints sont exposés via HTTP ou via JMX, selon la configuration choisie.

- `/actuator/health` → donne l’état de santé de l’application (UP/DOWN).
- `/actuator/metrics` → expose des statistiques (mémoire, CPU, requêtes HTTP, etc.).
- `/actuator/info` → permet d’afficher des informations personnalisées (par exemple le numéro de version ou l’auteur du projet).

### Pourquoi les utiliser ?

Parce qu’ils répondent à des besoins essentiels :

- Vérifier rapidement si une application est en état de fonctionner.
- Suivre des indicateurs techniques (performances, ressources utilisées).
- Intégrer l’application avec des outils de supervision externes ([Prometheus, Grafana](https://www.sfeir.dev/back/superviser-votre-application-spring-boot/), Datadog, etc.).
- Offrir une visibilité métier supplémentaire en exposant des indicateurs personnalisés.

Ainsi, les actuators s’inscrivent dans une démarche de [**production-ready applications** chère à Spring Boot](https://www.sfeir.dev/back/back-pourquoi-utiliser-spring-boot/).

## Y avoir accès dans une application Spring Boot

### Ajout de la dépendance

Pour profiter des actuators, il suffit d’ajouter la dépendance suivante :

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Avec cela, Spring Boot met automatiquement à disposition un ensemble de endpoints à l'adresse suivante : [http://localhost:8080/actuator](http://localhost:8080/actuator) .

```json
{
  "_links": {
    "self": {
      "href": "http://localhost:8080/actuator",
      "templated": false
    },
    "health-path": {
      "href": "http://localhost:8080/actuator/health/{*path}",
      "templated": true
    },
    "health": {
      "href": "http://localhost:8080/actuator/health",
      "templated": false
    }
  }
}
```

actuators par défaut

Cette liste est pour le moment assez réduite, mais nous allons voir comment en exposer d'autre très vite, surtout quand on sait que l'on peut avoir les actuators suivant :

- **`/actuator/beans`** : liste tous les beans gérés par le conteneur Spring.
- **`/actuator/conditions`** : affiche le détail des conditions d’auto-configuration (utilisé pour le diagnostic).
- **`/actuator/configprops`** : expose les propriétés de configuration et leurs valeurs.
- **`/actuator/env`** : affiche l’environnement et les propriétés actives.
- **`/actuator/loggers`** : permet de consulter et de modifier dynamiquement les niveaux de logs.
- **`/actuator/metrics`** : fournit des métriques (CPU, mémoire, HTTP, etc.).
- **`/actuator/scheduledtasks`** : liste les tâches planifiées.
- **`/actuator/mappings`** : affiche la liste des mappings HTTP de l’application (utile pour savoir quelles routes existent).
- **`/actuator/threaddump`** : produit un _thread dump_ de la JVM.
- **`/actuator/heapdump`** : produit un _heap dump_ (à utiliser avec précaution en production).
- **`/actuator/shutdown`** : permet d’arrêter proprement l’application (désactivé par défaut).

---

le **`shutdown`** est un cas spécial : il n’apparaît jamais par défaut, car il est explicitement **désactivé** pour des raisons de sécurité. Pour l’activer, il faut l’ajouter et le rendre accessible.

---

### Configuration des endpoints

Par défaut, seuls quelques actuators sont exposés. Pour contrôler lesquels sont disponibles nous pouvons jouer avec les properties de l'application.

```properties
management.endpoints.web.exposure.include=health,info,metrics
# Pour tout activer (fortement déconseillé en prod) :
# management.endpoints.web.exposure.include=*
```

Au démarrage Spring boot vous indiquera combien d'actuators sont exposé

```log
2025-09-06T17:00:15.758+02:00  INFO 29803 --- [           main] o.s.b.a.e.web.EndpointLinksResolver      : Exposing 13 endpoints beneath base path '/actuator'
```

```json
{
  "_links": {
    "self": {
      "href": "http://localhost:8080/actuator",
      "templated": false
    },
    "beans": {
      "href": "http://localhost:8080/actuator/beans",
      "templated": false
    },
    "caches-cache": {
      "href": "http://localhost:8080/actuator/caches/{cache}",
      "templated": true
    },
    "caches": {
      "href": "http://localhost:8080/actuator/caches",
      "templated": false
    },
    "health": {
      "href": "http://localhost:8080/actuator/health",
      "templated": false
    },
    "health-path": {
      "href": "http://localhost:8080/actuator/health/{*path}",
      "templated": true
    },
    "info": {
      "href": "http://localhost:8080/actuator/info",
      "templated": false
    },
    "conditions": {
      "href": "http://localhost:8080/actuator/conditions",
      "templated": false
    },
    "configprops-prefix": {
      "href": "http://localhost:8080/actuator/configprops/{prefix}",
      "templated": true
    },
    "configprops": {
      "href": "http://localhost:8080/actuator/configprops",
      "templated": false
    },
    "env": {
      "href": "http://localhost:8080/actuator/env",
      "templated": false
    },
    "env-toMatch": {
      "href": "http://localhost:8080/actuator/env/{toMatch}",
      "templated": true
    },
    "loggers": {
      "href": "http://localhost:8080/actuator/loggers",
      "templated": false
    },
    "loggers-name": {
      "href": "http://localhost:8080/actuator/loggers/{name}",
      "templated": true
    },
    "threaddump": {
      "href": "http://localhost:8080/actuator/threaddump",
      "templated": false
    },
    "metrics-requiredMetricName": {
      "href": "http://localhost:8080/actuator/metrics/{requiredMetricName}",
      "templated": true
    },
    "metrics": {
      "href": "http://localhost:8080/actuator/metrics",
      "templated": false
    },
    "sbom": {
      "href": "http://localhost:8080/actuator/sbom",
      "templated": false
    },
    "sbom-id": {
      "href": "http://localhost:8080/actuator/sbom/{id}",
      "templated": true
    },
    "scheduledtasks": {
      "href": "http://localhost:8080/actuator/scheduledtasks",
      "templated": false
    },
    "mappings": {
      "href": "http://localhost:8080/actuator/mappings",
      "templated": false
    }
  }
}
```

on a tout de suite plus de liens

De plus, il est possible de configurer le chemin d’accès :

```properties
management.endpoints.web.base-path=/manage
```

Ainsi, le point `/actuator/health` sera accessible à l’adresse : [http://localhost:8080/manage/health](http://localhost:8080/manage/health)

### Personnaliser certains Actuators

Par défaut `/health` n'indique que le statut de l'application `UP / DOWN` mais on peut lui préciser de nous montrer plus de chose :

```properties
management.endpoint.health.show-details=always
```

Ce qui permet d’obtenir un diagnostic plus détaillé (par exemple l’état du datasource, du système de cache, etc.)

```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "H2",
        "validationQuery": "isValid()"
      }
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 494384795648,
        "free": 397927071744,
        "threshold": 10485760,
        "path": "/springboot-demo/.",
        "exists": true
      }
    },
    "ping": {
      "status": "UP"
    },
    "ssl": {
      "status": "UP",
      "details": {
        "validChains": [],
        "invalidChains": []
      }
    }
  }
}
```

Sur le même principe, `/info` est vide par défaut, mais nous pouvons l'alimenté soit via properties, soit avec les information de build, ou les 2 :

```properties
management.info.env.enabled=true
info.app.name=MaSuperApplication
info.app.version=1.0.0
info.app.description=Application de gestion de bibliothèque
```

```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <executions>
        <execution>
            <goals>
                <goal>build-info</goal>
            </goals>
            <configuration>
                <additionalProperties>
                    <encoding.source>UTF-8</encoding.source>
                    <encoding.reporting>UTF-8</encoding.reporting>
                    <java.version>${java.version}</java.version>
                </additionalProperties>
            </configuration>
        </execution>
    </executions>
</plugin>
```

```json
{
  "app": {
    "name": "MaSuperApplication",
    "version": "1.0.0",
    "description": "Application de gestion de bibliotheque"
  },
  "build": {
    "artifact": "actuator-tutorial",
    "name": "actuator-tutorial",
    "time": "2025-09-07T06:49:19.695Z",
    "version": "7.0.0-SNAPSHOT",
    "group": "fr.eletutour"
  }
}
```

### ⚠️ Sécuriser vos actuator

Il est important de rappeler que ces endpoints peuvent contenir des données sensibles. Il est donc recommandé de restreindre leur accès, n'hésitez pas à lire nos article sur la sécurité pour trouver comment faire.

[[Sécurisez vos API avec Spring Security - Basic Auth]]

[[Sécurisez vos API avec Spring Security - JWT]]

[[Sécurisez vos API avec Spring Security - accès par rôle]]

## Créer ses propres Actuators

Spring Boot permet d’enrichir le système avec des endpoints personnalisés. Cela permet d’exposer des indicateurs métier, comme par exemple le nombre de livres empruntés dans une bibliothèque, ou l’état d’une file d’attente interne.

Pour cela, Spring Boot met à notre disposition [[Comprendre les annotations dans Spring Boot - guide et exemples|l'annotation @Endpoint]].

```java
@Component
@Endpoint(id = "libraryStat")
public class LibraryStat {

    @ReadOperation
    public Map<String, Object> libraryStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("booksTotal", 1200);
        stats.put("booksBorrowed", 320);
        stats.put("activeMembers", 85);
        return stats;
    }

    @WriteOperation
    public String clearCache() {
        // logique de purge du cache
        return "Cache vidé avec succès";
    }
}
```

Une fois compilé et exécuté, cet endpoint sera disponible à l’adresse : `/manage/libraryStat`

```json
{
  "activeMembers": 85,
  "booksBorrowed": 320,
  "booksTotal": 1200
}
```

Et via le @WriteOperation nous pouvons aussi effectuer des opération en écriture via une requête POST.  
De cette manière, l’Actuator devient un véritable outil de pilotage de l’application.

## Conclusion

Les actuators de Spring Boot constituent un **levier puissant pour rendre une application observable et pilotable**. Leur configuration est simple, leur utilité indéniable :

- Ils permettent de suivre en temps réel la santé et les performances d’une application.
- Ils s’intègrent aisément dans des outils de supervision.
- Ils peuvent être enrichis par des indicateurs métiers spécifiques.

En production, leur utilisation doit être combinée à une gestion rigoureuse des accès, car ils révèlent des informations précieuses sur le système.  
Bien employés, ils participent pleinement à la démarche [DevOps](https://www.sfeir.dev/tag/devops/) et facilitent le dialogue entre développeurs et équipes d’exploitation.

Spring Boot Actuator illustre parfaitement la philosophie du framework : **proposer des applications prêtes pour la production, sans complexité superflue**.
