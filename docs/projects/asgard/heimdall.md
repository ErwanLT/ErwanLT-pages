---
layout: default
title: Asgard - Heimdall
permalink: /projects/asgard/heimdall
tags: [java, projet, asgard, heimdall]
---
# Heimdall - Module de Logging pour Spring Boot
<div align="center">
    <img class="portrait" width="440" src="{{ '/assets/asgard/img/heimdall.png' | relative_url }}" alt="Heimdall" />
</div>

## Description
Heimdall est un module de logging avancé pour les applications Spring Boot qui permet de tracer automatiquement l'exécution des méthodes annotées avec les stéréotypes Spring courants.

## Fonctionnalités

Le module fournit des aspects de logging pour les annotations suivantes :
- `@RestController` : Logging des endpoints REST
- `@Controller` : Logging des contrôleurs MVC
- `@Service` : Logging des services métier
- `@Repository` : Logging des accès aux données
- `@Component` : Logging des composants génériques

Pour chaque type d'annotation, les aspects capturent :
- L'entrée dans la méthode avec les paramètres
- La sortie de la méthode avec le résultat
- Les exceptions éventuelles

## Format des Logs

### RestController
```
🚀 [RestController] Début de l'appel API - Méthode: createUser - Classe: UserController - Paramètres: {"name":"John","age":30}
✅ [RestController] Fin de l'appel API - Méthode: createUser - Classe: UserController - Résultat: {"id":1,"name":"John","age":30}
❌ [RestController] Erreur API - Méthode: createUser - Classe: UserController - Message: User not found
```

### Controller
```
📝 [Controller] Début du rendu de vue - Méthode: showUser - Classe: UserViewController - Paramètres: {"id":1}
📄 [Controller] Fin du rendu de vue - Méthode: showUser - Classe: UserViewController - Vue: user/profile
⚠️ [Controller] Erreur de rendu - Méthode: showUser - Classe: UserViewController - Message: Template not found
```

### Service
```
⚙️ [Service] Début du traitement métier - Méthode: processUser - Classe: UserService - Paramètres: {"name":"John"}
🔧 [Service] Fin du traitement métier - Méthode: processUser - Classe: UserService - Résultat: {"status":"success"}
💥 [Service] Erreur métier - Méthode: processUser - Classe: UserService - Message: Invalid user data
```

### Repository
```
🗄️ [Repository] Début de l'accès aux données - Méthode: findById - Classe: UserRepository - Paramètres: {"id":1}
💾 [Repository] Fin de l'accès aux données - Méthode: findById - Classe: UserRepository - Résultat: {"id":1,"name":"John"}
🚫 [Repository] Erreur d'accès aux données - Méthode: findById - Classe: UserRepository - Message: Database connection failed
```

### Component
```
🔨 [Component] Début de l'exécution - Méthode: validateData - Classe: DataValidator - Paramètres: {"data":"test"}
✨ [Component] Fin de l'exécution - Méthode: validateData - Classe: DataValidator - Résultat: true
💢 [Component] Erreur d'exécution - Méthode: validateData - Classe: DataValidator - Message: Invalid data format
```

## Utilisation

1. Ajoutez la dépendance à votre projet :

```xml
<dependency>
    <groupId>fr.eletutour.asgard</groupId>
    <artifactId>heimdall</artifactId>
    <version>${project.version}</version>
</dependency>
```

## Configuration

### Activation des Aspects

Par défaut, tous les aspects sont désactivés. Vous devez activer explicitement chaque type de logging que vous souhaitez utiliser dans votre `application.yml` :

```yaml
heimdall:
  logging:
    repository:
      enabled: true    # Active le logging des repositories
    service:
      enabled: false   # Désactive le logging des services
    controller:
      enabled: false   # Désactive le logging des controllers
    rest:
      enabled: false   # Désactive le logging des REST controllers
    component:
      enabled: false   # Désactive le logging des composants génériques
```

## Tests

Le module inclut une suite complète de tests unitaires pour chaque aspect :
- Tests du comportement normal (entrée/sortie)
- Tests de gestion des erreurs
- Tests avec différents types de paramètres et résultats

Pour exécuter les tests :
```bash
mvn test
```

## Personnalisation

Chaque aspect peut être personnalisé en étendant la classe `AbstractLoggingAspect` et en surchargeant les méthodes :
- `logEntry` : Personnalisation du format des logs d'entrée
- `logExit` : Personnalisation du format des logs de sortie
- `logError` : Personnalisation du format des logs d'erreur