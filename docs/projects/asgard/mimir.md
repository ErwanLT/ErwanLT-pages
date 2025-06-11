---
layout: default
title: Asgard - Mimir
permalink: /projects/asgard/mimir
tags: [java, projet, asgard, mimir]
---
# Mimir - Documentation API pour Spring Boot
<div align="center">
  <img class="portrait" src="{{ '/assets/asgard/img/mimir.png' | relative_url }}" alt="Heimdall" />
</div>

Module de documentation automatique pour Spring Boot, inspiré par Mimir, le dieu de la sagesse et de la connaissance dans la mythologie nordique.

## Fonctionnalités

### Documentation Automatique
- Génération automatique de documentation au format Markdown
- Support des annotations OpenAPI pour documenter les classes et méthodes :
  - `@Tag` : Documentation des classes et contrôleurs
  - `@Operation` : Documentation des méthodes
  - `@Parameter` : Documentation des paramètres
  - `@ApiResponse` : Documentation des réponses
- Génération de documentation structurée avec :
  - Description de la classe
  - Tags
  - Documentation des méthodes
  - Documentation des paramètres
  - Documentation des réponses
- Validation des annotations au démarrage
- Formatage automatique du Markdown
- Logging des opérations

### Génération de Diagrammes UML
- Génération automatique de diagrammes de classes avec Mermaid
- Support des relations :
  - Héritage
  - Implémentation d'interfaces
  - Associations
- Visualisation des modificateurs d'accès (public, protected, private)
- Génération des méthodes et attributs
- Intégration dans la documentation Markdown

### API REST
- Endpoints pour la génération de documentation :
  - `/mimir/generate/class` : Documentation d'une classe spécifique
  - `/mimir/generate/package` : Documentation de toutes les classes d'un package
- Documentation OpenAPI intégrée
- Réponses au format JSON
- Gestion des erreurs

## Installation

Ajoutez la dépendance suivante à votre `pom.xml` :

```xml
<dependency>
    <groupId>fr.eletutour.asgard</groupId>
    <artifactId>mimir</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```

## Configuration

Le module peut être configuré via les propriétés Spring Boot :

```yaml
mimir:
  enabled: true
  output:
    path: ./output
  documentation:
    output-dir: docs/
    format: markdown
    languages:
      - java
      - kotlin
```

## Utilisation

### Documentation des Classes et Méthodes

Utilisez les annotations OpenAPI pour documenter vos classes et méthodes :

```java
@Tag(name = "MonController", description = "Description du contrôleur")
@RestController
public class MonController {
    
    @Operation(
        summary = "Description courte de la méthode",
        description = "Description détaillée de la méthode"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Opération réussie"
    )
    public ResponseEntity<String> maMethode(
        @Parameter(description = "Description du paramètre") String param
    ) {
        // ...
    }
}
```

### Structure des annotations OpenAPI

#### Pour les classes :
- `@Tag` :
  - `name` : Nom du tag
  - `description` : Description détaillée

#### Pour les méthodes :
- `@Operation` :
  - `summary` : Résumé de l'opération
  - `description` : Description détaillée
- `@ApiResponse` :
  - `responseCode` : Code de réponse HTTP
  - `description` : Description de la réponse

#### Pour les paramètres :
- `@Parameter` :
  - `description` : Description du paramètre

### Utilisation de l'API REST

#### Générer la documentation d'une classe
```bash
curl -X POST "http://localhost:8080/mimir/generate/class?className=com.example.MaClasse"
```

#### Générer la documentation d'un package
```bash
curl -X POST "http://localhost:8080/mimir/generate/package?packageName=com.example"
```

## Tests

Le module inclut une suite complète de tests unitaires pour vérifier :
- La génération correcte de la documentation
- La gestion des annotations OpenAPI
- Le formatage du contenu
- La génération des diagrammes UML
- Les cas d'erreur
- Les endpoints REST
