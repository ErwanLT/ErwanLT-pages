---
layout: "default"
title: "Gérer les erreurs dans Spring Boot : ce qu’il faut dire… et ce qu’il faut taire"
permalink: "/springboot/gerer-les-erreurs-dans-spring-boot-ce-qu-il-faut-dire-et-ce-qu-il-faut-taire/"
tags: [back, java, spring-boot, exceptions, tutoriel]
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/gerer-les-erreurs-dans-spring-boot-ce-quil-faut-dire-et-ce-quil-faut-taire/"
banner: "https://www.sfeir.dev/content/images/size/w1304/2026/02/20260204_1812_Image-Generation_simple_compose_01kgmt7pwkek0rg35mg3gvtzx3.png"
published_at: "2026-02-12"
sfeir_slug: "gerer-les-erreurs-dans-spring-boot-ce-quil-faut-dire-et-ce-quil-faut-taire"
date: "2026-02-12"
---
## Quand “bien structuré” ne suffit plus

Dans les articles précédents, nous avons appris à [ne plus mentir avec les codes HTTP](/springboot/comment-bien-gerer-ses-exceptions-dans-spring-boot/), puis à [structurer nos erreurs à l’aide d’un format standard grâce à la RFC 9457](/springboot/vers-un-standard-des-erreurs-http/) et `ProblemDetail`.

Nos réponses d’erreur sont désormais propres, cohérentes et compréhensibles.  
Elles respectent les standards, parlent le bon [langage HTTP](https://www.sfeir.dev/back/vers-un-standard-des-erreurs-http/) et évitent les bricolages approximatifs.

Pourtant, un piège demeure : croire que ****toutes les erreurs méritent d’être exposées de la même façon****.

Car une [API](/definition/rest-definition/) ne se contente pas de décrire ce qui s’est mal passé.  
Elle ****choisit ce qu’elle révèle****, à qui et dans quel but.

Une erreur n’est jamais neutre :  
C’est un message adressé, avec une intention.

## Toutes les erreurs ne racontent pas la même histoire

### Comprendre l’intention derrière l’erreur

Toutes les erreurs ne disent pas la même chose, parce qu’elles ne répondent pas au même besoin.  
Avant même de penser format ou code HTTP, une question doit être posée :

> Qui est censé agir après cette erreur ?

Prenons trois situations concrètes.

### Erreur métier : le client peut agir

```java
Hello hello = helloRepository.findById(id)
    .orElseThrow(() -> new HelloNotFoundException(id));
```

Ici, tout fonctionne correctement… sauf que la ressource demandée n’existe pas.

C’est une erreur :

- Attendue,
- Compréhensible,
- Parfaitement légitime dans le cycle normal de l’application.

Surtout, c’est une erreur ****actionnable côté client**** :  
Le consommateur peut changer l’identifiant, adapter son parcours ou afficher un message clair à l’utilisateur final.

La réponse peut donc être explicite :

```json
{
  "title": "Hello introuvable",
  "status": 404,
  "detail": "Hello 42 non trouvé"
}
```

On ne révèle rien de sensible.  
On décrit simplement la réalité fonctionnelle du système.

### Erreur technique : le client n’y est pour rien

```java
List<Hello> hellos = helloRepository.findAll();
```

Imaginons maintenant une indisponibilité de la base de données.

- La requête du client est valide.
- Le contrat est respecté.
- Mais l’application est incapable de répondre.

Dans ce cas, exposer le message suivant serait une faute :

```text
org.postgresql.util.PSQLException: Connection refused
```

Ce message :

- N’aide pas le client,
- Révèle l’infrastructure,
- Transforme l’API en outil de debug public.

La réponse doit volontairement rester générique :

```json
{
  "title": "Erreur interne",
  "status": 500,
  "detail": "Une erreur est survenue lors du traitement"
}
```

Le ****diagnostic précis**** appartient aux logs, aux métriques et aux traces.  
Pas à la réponse HTTP.

Le client n’a rien à corriger.  
Il doit simplement savoir que le problème ne vient pas de lui.

### Erreur de sécurité : moins on en dit, mieux c’est

```java
throw new AccessDeniedException("User does not have ROLE_ADMIN");
```

Dire au client exactement pourquoi l’accès est refusé revient à lui donner des indices :

- Rôles existants,
- Règles internes,
- Surface d’attaque potentielle.

Dans ce contexte, le flou n’est pas une faiblesse.  
C’est une ****mesure de protection****.

```json
{
  "title": "Accès refusé",
  "status": 403,
  "detail": "Vous n’êtes pas autorisé à effectuer cette action"
}
```

Le client comprend l’essentiel.  
Le système reste discret.

## Structurer ses exceptions pour garder le contrôle

### La hiérarchisation comme outil de lisibilité

Pour garder la maîtrise de ce qui est exposé, encore faut-il maîtriser ****le type d’exceptions que l’on propage****.

Dans une [application Spring Boot](/springboot/il-etait-une-fois-spring-boot/), les exceptions métier héritent presque toujours de `RuntimeException`.  
Ce choix n’est pas anodin : contrairement aux exceptions vérifiées (`Exception`), une `RuntimeException` peut remonter librement la pile d’appels sans imposer de `try/catch` ni polluer les signatures de méthodes.

Elle exprime un état invalide du domaine, pas un problème technique local à traiter immédiatement.

```java
public abstract class BusinessException extends RuntimeException {
    protected BusinessException(String message) {
        super(message);
    }
}

public class HelloNotFoundException extends BusinessException {
    public HelloNotFoundException(Long id) {
        super("Hello " + id + " non trouvé");
    }
}
```

Cette hiérarchie n’est pas un luxe.  
Elle apporte immédiatement :

- Une lecture claire du type d’erreur,
- Des handlers ciblés et explicites,
- Un comportement homogène dans toute l’application.

Chaque exception raconte ****pourquoi**** elle existe.  
Le reste de l’infrastructure peut alors décider ****comment**** elle sera racontée au client.

## Pourquoi exposer une exception technique brute est une mauvaise idée

### Le client n’est pas votre debugger

Un `NullPointerException`, une `DataAccessException` ou une `IllegalStateException` ne devraient ****jamais**** traverser la frontière HTTP.

```java
@ExceptionHandler(DataAccessException.class)
public ProblemDetail handleDataAccess(DataAccessException ex) {
    log.error("Erreur base de données", ex);

    ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    problem.setTitle("Erreur interne");
    problem.setDetail("Une erreur est survenue lors du traitement");

    return problem;
}
```

Ce schéma établit une séparation saine :

- Le client reçoit une réponse stable et compréhensible,
- L’équipe technique conserve l’intégralité du contexte.

L’API parle proprement.  
Les logs parlent vrai.

## Le filet de sécurité

### Gérer l’inattendu sans paniquer

Même avec une hiérarchie bien pensée, certaines erreurs passeront entre les mailles du filet.

C’est normal.  
Et c’est précisément pour cela qu’un handler global est indispensable.

```java
@ExceptionHandler(Exception.class)
public ProblemDetail handleGenericException(Exception ex) {
    log.error("Erreur inattendue", ex);

    ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    problem.setTitle("Erreur interne");
    problem.setDetail("Une erreur inattendue est survenue");

    return problem;
}
```

Ce handler garantit une chose essentielle :

> Quelle que soit l’erreur, l’API reste cohérente.

Pas de stacktrace qui fuit.  
Pas de réponse incohérente.  
Pas de panique.

## Enrichir ProblemDetail sans fuite d’information

### Aider au diagnostic sans tout exposer

Il est possible d’aider le support et l’exploitation sans exposer de détails techniques.

```java
ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
problem.setTitle("Erreur interne");
problem.setDetail("Une erreur est survenue");
problem.setProperty("traceId", MDC.get("traceId"));
problem.setProperty("timestamp", Instant.now());
```

Le client peut fournir un identifiant précis lors d’un ticket de support.  
L’équipe retrouve immédiatement la trace correspondante dans les logs.

Sans stacktrace.  
Sans dépendance technique révélée.  
Sans fuite d’information.

## Conclusion

### Ce que votre API fait est aussi important que ce qu’elle dit

Bien gérer les erreurs HTTP, ce n’est pas seulement une question de format ou de conformité aux standards.  
C’est une question de ****discernement****.

Tout dire est une facilité.  
Trop dire est une faute.

Une API mature :

- Parle clairement quand le client peut agir,
- Se tait quand l’information devient dangereuse,
- Protège ses entrailles techniques,
- Et reste imperturbable, même face à l’imprévu.

Une bonne gestion des erreurs ne cherche pas à être transparente.  
Elle cherche à être ****juste****.

Savoir exposer une erreur est un savoir-faire.  
Savoir en taire les détails est une preuve de maturité.

Et c’est souvent là que se reconnaissent les API conçues pour durer.
