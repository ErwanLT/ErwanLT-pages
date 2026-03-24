---
layout: "default"
title: "Vers un standard des erreurs HTTP"
permalink: "/springboot/vers-un-standard-des-erreurs-http/"
tags: [back, java, spring-boot, exceptions, erreurs, tutoriel]
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/vers-un-standard-des-erreurs-http/"
banner: "https://www.sfeir.dev/content/images/2026/01/20260125_0653_Image-Generation_simple_compose_01kfsvczxzezyr7x3jp5wg0j08.png"
published_at: "2026-01-30"
sfeir_slug: "vers-un-standard-des-erreurs-http"
date: "2026-01-30"
---
Dans un article précédent, nous avons vu comment éviter l’erreur la plus courante et la plus dangereuse : renvoyer un **200 OK** accompagné d’un message d’erreur.  
Nous avons également mis en place une gestion d’erreurs cohérente grâce à des exceptions personnalisées et à un `@ControllerAdvice`.

[Comment bien gérer ses exceptions dans Spring Boot](/springboot/comment-bien-gerer-ses-exceptions-dans-spring-boot/)
Mais une question demeure :

> **Comment structurer nos réponses d’erreur de façon standard, lisible par les humains _et_ par les machines ?**

C’est précisément à cette question que répond la [**RFC 9457**](https://www.rfc-editor.org/rfc/rfc9457.html?ref=sfeir.dev).

---

_RFC est l'acronyme en anglais pour **Request for Comments (demande de commentaires)**. Les RFC sont une série numérotée de documents officiels décrivant les aspects et spécifications techniques d'Internet ou de différents matériels informatiques_

---

## La RFC 9457 : un format standard pour les erreurs HTTP

La RFC 9457 (anciennement RFC 7807) définit un format standard nommé **Problem Details for HTTP APIs**.  
Son objectif est simple : fournir une représentation uniforme et explicite des erreurs HTTP.

Plutôt que de renvoyer des structures d’erreurs hétérogènes selon les projets, on s’appuie sur un **contrat commun**, fondé sur les standards du web.

Une réponse d’erreur conforme à la RFC 9457 repose sur quelques champs bien définis :

|Champ|Description|
|---|---|
|`type`|URI identifiant le type de problème|
|`title`|Résumé court et lisible du problème|
|`status`|Code HTTP|
|`detail`|Description détaillée de l’erreur|
|`instance`|URI identifiant l’occurrence précise de l’erreur|

Exemple de réponse conforme :

```json
{
  "type": "https://example.com/problems/hello-not-found",
  "title": "Ressource introuvable",
  "status": 404,
  "detail": "Hello 42 non trouvé",
  "instance": "/hello/42"
}
```

## ProblemDetail : l’implémentation [Spring Boot](/springboot/il-etait-une-fois-spring-boot/)

Depuis **Spring Framework 6 / Spring Boot 3**, le framework fournit une implémentation native de ce standard via la classe **`ProblemDetail`**.

Spring ne réinvente rien : il applique la RFC, fidèlement.

```java
ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
problemDetail.setTitle("Ressource introuvable");
problemDetail.setDetail("Hello 42 non trouvé");
```

Cette classe devient la pierre angulaire d’une gestion d’erreurs moderne et normalisée.

### Adapter notre ControllerAdvice

Reprenons notre `HelloException`, mais cette fois-ci, faisons-la dialoguer avec `ProblemDetail`.

```java
@ExceptionHandler(HelloException.class)
public ProblemDetail handleHelloException(HelloException ex, HttpServletRequest request) {
    ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
    problem.setTitle("Hello introuvable");
    problem.setDetail(ex.getMessage());
    problem.setType(URI.create("https://example.com/problems/hello-not-found"));
    problem.setInstance(URI.create(request.getRequestURI()));
    return problem;
}
```

Résultat :

- Une réponse **normée**
- Compréhensible par les clients

### À propos du champ `status` : JSON ou réponse HTTP ?

À la lecture des exemples utilisant `ProblemDetail`, une question légitime peut se poser :  
le champ `status` présent dans le corps JSON correspond-il uniquement à une information descriptive, ou définit-il également le code de la réponse HTTP ?

Avec Spring Boot (depuis Spring Framework 6), la réponse est claire : **les deux sont strictement liés**.  
Lorsque l’on retourne directement un objet `ProblemDetail` depuis un `@ExceptionHandler`, Spring utilise automatiquement la valeur du champ `status` pour définir **le code HTTP réel de la réponse**. Il n’existe donc pas deux statuts distincts — un dans le JSON et un autre dans l’en-tête HTTP — mais une **source unique de vérité**, conforme à la RFC 9457.

Ainsi, un `ProblemDetail` créé via `ProblemDetail.forStatus(HttpStatus.NOT_FOUND)` produira :

- une réponse HTTP avec un code **404**
- un corps JSON contenant `"status": 404`

Ce comportement est volontaire : `ProblemDetail` n’est pas un simple DTO applicatif, mais une représentation normalisée d’une erreur HTTP.  
Spring se charge alors de traduire fidèlement cette description en réponse réseau, sans configuration supplémentaire.

### Enrichir `ProblemDetail` sans casser le standard

La RFC 9457 autorise explicitement l’ajout de champs personnalisés.  
Spring l’exploite via la méthode `setProperty`.

```java
ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
problem.setTitle("Requête invalide");
problem.setDetail("Un ou plusieurs champs sont incorrects");
problem.setProperty("errorCode", "HELLO_001");
problem.setProperty("timestamp", Instant.now());
```

- compatibilité totale avec le standard
- enrichissement métier maîtrisé
- pas de DTO d’erreur parallèle

### Séparer erreur métier et erreur technique

Un point souvent négligé :  
**toutes les erreurs ne doivent pas être exposées de la même manière**.

Bonne pratique :

|Type d’erreur|Exposition|
|---|---|
|Métier|message explicite|
|Technique|message générique|
|Sécurité|message volontairement flou|

Exemple :

```java
problem.setDetail("Une erreur est survenue lors du traitement");
```

Tout en conservant le détail **dans les logs**.

### Intégration avec la documentation (OpenAPI)

`ProblemDetail` s’intègre naturellement avec [Swagger / OpenAPI](https://www.sfeir.dev/back/migrer-de-swagger-2-a-openapi-3/) :

- une seule structure d’erreur
- documentée une fois
- valable pour toute l’API

[Réussir sa migration de Swagger 2 à OpenApi 3](/springboot/reussir-sa-migration-de-swagger-2-a-openapi-3/)

### Pourquoi c’est une évolution naturelle

Adopter `ProblemDetail`, ce n’est pas « faire moderne pour faire moderne ».  
C’est :

- **Respecter les standards HTTP**
- **Uniformiser les réponses d’erreur**
- **Réduire les conventions maison**
- **Faciliter l’intégration côté client**

Autrement dit : revenir à l’essence du web, tout en profitant des apports récents de Spring Boot.

## Conclusion

La gestion des erreurs ne se limite pas à choisir le bon code HTTP.  
Elle consiste à **décrire précisément le problème**, dans un langage commun et standardisé.

Avec la **RFC 9457** et **ProblemDetail**, Spring Boot nous offre aujourd’hui une solution élégante, robuste et pérenne, parfaitement alignée avec l’histoire et les fondements du web.

Après avoir appris à **ne plus renvoyer de faux 200**, il est temps d’apprendre à **parler correctement des erreurs**.
