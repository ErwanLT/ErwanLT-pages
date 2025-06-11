---
layout: default
title: Asgard - Hel
permalink: /projects/asgard/hel
tags: [java, projet, asgard, hel]
---
# Module Hel - Gestion de l'arrêt d'application
<div align="center">
  <img class="portrait" src="{{ '/assets/asgard/img/hel.png' | relative_url }}" alt="Heimdall" />
</div>

Le module Hel est un composant Spring Boot qui fournit des API REST pour gérer l'arrêt d'une application de manière contrôlée. Il offre deux modes d'arrêt : immédiat et programmé.

## Fonctionnalités

- Arrêt immédiat de l'application
- Arrêt programmé avec expression cron
- Auto-configuration Spring Boot
- Intégration transparente dans n'importe quelle application Spring Boot
- Documentation OpenAPI (Swagger) intégrée

## Installation

Ajoutez la dépendance suivante dans votre `pom.xml` :

```xml
<dependency>
    <groupId>fr.eletutour.asgard</groupId>
    <artifactId>hel</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```

## Activation

Le module est désactivé par défaut pour des raisons de sécurité. Pour l'activer, ajoutez la propriété suivante dans votre `application.properties` ou `application.yml` :

```yaml
hel:
  enabled: true
```

⚠️ **Important** : N'activez ce module que si vous avez mis en place une sécurité appropriée dans votre application.

## Documentation API

La documentation OpenAPI est disponible à l'URL : `/swagger-ui.html`

### Endpoints disponibles

#### Arrêt immédiat
- **URL**: `/hel/immediate`
- **Méthode**: POST
- **Description**: Arrête l'application immédiatement après un délai de 1 seconde
- **Processus d'arrêt**:
    1. Arrêt de l'acceptation de nouvelles requêtes
    2. Attente de la fin des requêtes en cours
    3. Fermeture des connexions aux bases de données
    4. Arrêt du serveur web
- **Réponses**:
    - 200 OK: Arrêt initié avec succès
    - 403 Forbidden: Droits insuffisants
    - 503 Service Unavailable: Application déjà en cours d'arrêt

#### Arrêt programmé
- **URL**: `/hel/scheduled`
- **Méthode**: POST
- **Paramètres**:
    - `cronExpression` (requis): Expression cron pour programmer l'arrêt
- **Description**: Programme l'arrêt de l'application selon une expression cron
- **Processus d'arrêt**: Identique à l'arrêt immédiat
- **Réponses**:
    - 200 OK: Arrêt programmé avec succès
    - 400 Bad Request: Expression cron invalide
    - 403 Forbidden: Droits insuffisants
    - 409 Conflict: Un arrêt est déjà programmé

## Utilisation

### Arrêt immédiat

Pour arrêter l'application immédiatement :

```bash
curl -X POST http://localhost:8080/hel/immediate
```

### Arrêt programmé

Pour programmer un arrêt avec une expression cron :

```bash
curl -X POST "http://localhost:8080/hel/scheduled?cronExpression=0 0 0 * * ?"
```

#### Format des expressions cron

Les expressions cron suivent le format standard de Spring avec 6 champs :
```
second minute hour day-of-month month day-of-week
```

Plages de valeurs :
- secondes : 0-59
- minutes : 0-59
- heures : 0-23
- jour du mois : 1-31
- mois : 1-12 ou JAN-DEC
- jour de la semaine : 0-6 ou SUN-SAT

Exemples :
- `0 0 0 * * ?` : tous les jours à minuit
- `0 0 12 * * ?` : tous les jours à midi
- `0 0 0 ? * MON` : tous les lundis à minuit

## Sécurité

⚠️ **Attention** : Ces endpoints permettent d'arrêter l'application. Il est fortement recommandé de :
- Sécuriser ces endpoints avec Spring Security dans votre application
- Limiter l'accès à ces endpoints aux administrateurs uniquement
- Ne pas exposer ces endpoints sur des environnements de production sans protection appropriée
- Configurer votre propre système d'authentification et d'autorisation

Le module Hel ne fournit aucune sécurité par défaut. C'est à la charge du projet hôte de mettre en place les mesures de sécurité appropriées.

## Limitations

- Une seule planification d'arrêt peut être active à la fois
- L'arrêt programmé ne peut être annulé que par un redémarrage de l'application
- L'arrêt immédiat est irréversible une fois initié

## Dépendances

- Spring Boot Web
- Spring Boot Validation
- Spring Boot AutoConfigure
- SpringDoc OpenAPI (Swagger)