---
layout: "default"
title: "Les profils dans Spring Boot"
permalink: "/back/java/spring-boot/les-profils-dans-spring-boot/"
tags: [back, java, spring-boot]
date: "2026-03-01"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/les-profils-dans-spring-boot/"
banner: "https://www.sfeir.dev/content/images/size/w1200/2026/01/20260121_1752_Image-Generation_simple_compose_01kfgqgvjkfcctb1t88fxvk717.png"
published_at: "2026-03-01"
sfeir_slug: "les-profils-dans-spring-boot"
sfeir_tags: [Back, Java, Spring Boot]
---
Dans toute application [[Il était une fois... Spring Boot|Spring Boot]] un tant soit peu sérieuse, une question finit toujours par se poser :

> Comment adapter le comportement de l’application selon l’environnement ?

Développement, tests, intégration, production…  
Les contraintes changent, les ressources aussi, et pourtant le code reste le même.

La réponse historique de Spring à ce problème tient en un mot : ****les profils****.

Derrière les fichiers `application-dev.properties`, `application-prod.yml` ou `application-test.properties` se cache un mécanisme fondamental, simple en apparence, mais structurant pour toute application Spring Boot bien conçue.

## Le problème : une application, plusieurs contextes

Sans profils, la gestion des environnements repose souvent sur des pratiques risquées :

- Des commentaires activés/désactivés manuellement dans la configuration.
- Des fichiers dupliqués et renommés au dernier moment.
- Des blocs `if (env == "prod")` dispersés dans le code métier.

Ces pratiques fonctionnent… jusqu’au jour où elles ne fonctionnent plus.

Spring a très tôt posé un principe clair :

> ****Le code ne doit pas connaître l’environnement dans lequel il s’exécute.****

Ce sont les profils qui incarnent ce principe.

## Qu’est-ce qu’un profil Spring ?

Un ****profil Spring**** est une étiquette logique qui permet d’activer ou désactiver :

- des fichiers de configuration,
- des beans,
- des comportements applicatifs.

Un profil ne représente pas uniquement un environnement technique.  
Il représente un ****contexte d’exécution****.

Exemples courants :

- `dev`
- `test`
- `prod`
- `local`
- `integration`

## Les fichiers `application-xxx.properties`

Spring Boot charge automatiquement les fichiers de configuration selon les profils actifs.

### Convention de nommage

```text
application.properties
application-dev.properties
application-test.properties
application-prod.properties
```

- `application.properties` contient la configuration ****commune****
- les fichiers suffixés surchargent uniquement ce qui diffère

### Exemple

```properties
# application.properties
spring.application.name=demo-app

# application-dev.properties
spring.datasource.url=jdbc:h2:mem:testdb

# application-prod.properties
spring.datasource.url=jdbc:postgresql://db/prod
```

Le mécanisme est simple, lisible, et prévisible.  
C’est précisément pour cela qu’il est si puissant.

## Activer un profil

### Via les propriétés (Configuration statique)

Dans votre `application.properties` de base :

```properties
spring.profiles.active=dev
```

### Via les variables d'environnement (Idéal pour Docker/Cloud)

C'est la méthode recommandée pour la production.

```bash
export SPRING_PROFILES_ACTIVE=prod
java -jar my-app.jar
```

### Via les arguments de la ligne de commande

Pratique pour un test rapide en local.

```bash
java -jar my-app.jar --spring.profiles.active=test
```

## Profils et beans conditionnels

C'est ici que les profils deviennent vraiment puissants. Ils permettent de conditionner l'existence même d'un composant Java grâce à [[Comprendre les annotations dans Spring Boot - guide et exemples|l'annotation]] `@Profile`.

### ****Exemple : Le service d'envoi d'emails****

On ne veut pas envoyer de vrais emails pendant le développement.

```java
public interface EmailService {
    void send(String message);
}

@Profile("dev")
@Service
public class MockEmailService implements EmailService {
    @Override
    public void send(String message) {
        System.out.println("[DEV - LOG ONLY] " + message);
    }
}

@Profile("prod")
@Service
public class SmtpEmailService implements EmailService {
    @Override
    public void send(String message) {
        // Logique réelle d'envoi SMTP
    }
}
```

****Le bénéfice :**** Le reste de votre application s'injecte un `EmailService` sans jamais savoir s'il s'agit d'un simulateur ou du vrai service.

## Les 3 règles d'or pour bien utiliser les profils

- ****Le profil "par défaut" doit être fonctionnel**** : Configurez `application.properties` pour que n'importe quel développeur puisse cloner le projet et le lancer en local sans erreur.
- ****N'abusez pas du code conditionnel**** : Si vous commencez à mettre des `@Profile` sur chaque classe, votre code deviendra difficile à tester. Privilégiez les interfaces.
- ****Utilisez l'exclusion**** : L'opérateur `!` est très utile. `@Profile("!prod")` permet d'activer un outil de debug sur tous les environnements sauf en production.

## Conclusion

Les profils Spring Boot ne sont pas qu'un simple gadget de configuration. C'est l'outil qui permet de garantir l'****immuabilité de votre artefact**** : vous compilez votre JAR une seule fois, et c'est le profil injecté au démarrage qui l'adapte à son environnement.
