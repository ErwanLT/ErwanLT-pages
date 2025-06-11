---
layout: default
title: Asgard
permalink: /asgard/
tags:
    - asgard
    - java
    - projet
---
# {{page.title}}

<div align="center">
  <img class="portrait" width="440" src="{{ '/assets/asgard/img/asgard.png' | relative_url }}" alt="Asgard" />
</div>

Asgard est une collection de modules Spring Boot réutilisables, conçus pour simplifier le développement d'applications Java. Chaque module est indépendant et peut être utilisé séparément selon les besoins de votre projet.

## Modules

### [Heimdall]( {{ '/projects/asgard/heimdall' | relative_url }}) - Module de Logging pour Spring Boot

Le module Heimdall est un module de logging avancé qui permet de tracer automatiquement l'exécution des méthodes annotées avec les stéréotypes Spring courants.

**Fonctionnalités principales** :
- Logging automatique pour les annotations Spring :
  - `@RestController` : Logging des endpoints REST
  - `@Controller` : Logging des contrôleurs MVC
  - `@Service` : Logging des services métier
  - `@Repository` : Logging des accès aux données
  - `@Component` : Logging des composants génériques
- Capture automatique des entrées/sorties de méthodes
- Gestion des exceptions
- Logs formatés avec émojis pour une meilleure lisibilité
- Configuration fine par type de composant

**Utilisation typique** :
- Traçage des appels API
- Monitoring des services métier
- Suivi des accès aux données
- Debugging des composants
- Audit des opérations

### [Hel]( {{ '/projects/asgard/hel' | relative_url }} ) - Gestion de l'arrêt d'application

Le module Hel fournit des API REST pour gérer l'arrêt d'une application de manière contrôlée.

**Fonctionnalités principales** :
- Arrêt immédiat de l'application
- Arrêt programmé avec expression cron
- Auto-configuration Spring Boot
- Documentation OpenAPI intégrée

**Utilisation typique** :
- Gestion des arrêts planifiés en production
- Arrêts d'urgence contrôlés
- Maintenance programmée

## Installation

Chaque module peut être installé indépendamment. Consultez le README spécifique de chaque module pour les instructions d'installation détaillées.

Exemple d'installation d'un module :

```xml
<dependency>
    <groupId>fr.eletutour.asgard</groupId>
    <artifactId>hel</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```

ou

```xml
<dependency>
    <groupId>fr.eletutour.asgard</groupId>
    <artifactId>heimdall</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```

## Configuration

Chaque module est auto-configurable et peut être activé/désactivé via les propriétés Spring Boot. Consultez la documentation de chaque module pour les options de configuration disponibles.

## Sécurité

⚠️ **Important** : Les modules Asgard ne fournissent pas de sécurité par défaut. C'est à la charge de l'application hôte de mettre en place les mesures de sécurité appropriées.

Recommandations générales :
- Sécuriser les endpoints avec Spring Security
- Limiter l'accès aux fonctionnalités sensibles
- Configurer l'authentification et l'autorisation
- Utiliser HTTPS en production

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Créer une Pull Request

## Développement

### Prérequis
- Java 21 ou supérieur
- Maven 3.8 ou supérieur
- Docker (pour les tests d'intégration)