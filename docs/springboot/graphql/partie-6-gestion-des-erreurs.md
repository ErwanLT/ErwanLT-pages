---
layout: "default"
title: "Partie 6 - Gestion des erreurs"
permalink: "/springboot/graphql/partie-6-gestion-des-erreurs/"
tags: [spring-boot, graphql, java, tutoriel]
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/partie-6-gestion-des-erreurs/"
banner: "https://www.sfeir.dev/content/images/2025/09/20250919_1352_8-Bit-GraphQL-Adventure_simple_compose_01k5gwz6cbfzq9e22q5n59htk4.png"
published_at: "2025-01-16"
sfeir_slug: "partie-6-gestion-des-erreurs"
date: "2025-01-16"
---
_Jour 6 : bien que nous ayons tenté de le distancer, le cyclone Gestion des erreurs, est sur nous, espérons pouvoir en sortir indemne._

Musique de fond pour l'article

---

Ahoy, compagnons ! Aujourd’hui, je pose ma plume sur un problème épineux qui touche tout capitaine travaillant avec GraphQL : **la gestion des erreurs**.  
Quand une tempête frappe et que des exceptions se lèvent, [il faut savoir manier le gouvernail pour éviter le naufrage](/springboot/comment-bien-gerer-ses-exceptions-dans-spring-boot/).  
Voici comment j’ai apprivoisé ce défi dans une application Spring Boot.

## Lever le pavillon noir des exceptions

Dans le vaste océan des API GraphQL, il arrive qu’une ressource soit introuvable ou qu’une erreur imprévue surgisse. Pour ne pas abandonner mon équipage (les utilisateurs) à une mer d’incertitudes, j’ai mis en place un **`DataFetcherExceptionResolver`**.

Voici l’arme que j’ai forgée :

```java
@Component
public class MyDataFetcherExceptionResolver extends DataFetcherExceptionResolverAdapter {

    private final Logger LOGGER = LoggerFactory.getLogger(MyDataFetcherExceptionResolver.class);

    @Override
    protected GraphQLError resolveToSingleError(Throwable ex, DataFetchingEnvironment env) {
        LOGGER.error(ex.getMessage());
        if (ex instanceof ArticleNotFoundException) {
            return GraphqlErrorBuilder.newError()
                    .errorType(ErrorType.NOT_FOUND)
                    .message(ex.getMessage())
                    .path(env.getExecutionStepInfo().getPath())
                    .build();
        }
        if (ex instanceof AuthorNotFoundException) {
            return GraphqlErrorBuilder.newError()
                    .errorType(ErrorType.NOT_FOUND)
                    .message(ex.getMessage())
                    .path(env.getExecutionStepInfo().getPath())
                    .build();
        }
        return null;
    }
}
```

Notre Solver d'exception

## Décoder le fonctionnement de cette boussole

### Identifier les tempêtes (exception)

La méthode `resolveToSingleError` agit comme un guetteur en haut du mât. À chaque exception levée, elle scrute si elle correspond à un type spécifique.

- Si un **article** manque à l’appel (`ArticleNotFoundException`), ou si un **auteur** se fait trop discret (`AuthorNotFoundException`), la méthode crée un message d’erreur explicite.

### Construire un message clair

Le message d’erreur est forgé grâce à **`GraphqlErrorBuilder`**, une arme précise qui permet :

- De définir un type d’erreur (`ErrorType.NOT_FOUND`).
- D’ajouter un message détaillant le problème (`ex.getMessage()`).
- De localiser où l’erreur s’est produite dans la requête (grâce à `env`).

### Journal de bord pour l'équipage technique

Chaque erreur est inscrite dans les registres du navire avec un `LOGGER.error`. Cela permet aux développeurs d’avoir une vision claire des obstacles rencontrés.

## Pourquoi une telle vigilance ?

En mer comme en développement, une erreur mal gérée peut semer la confusion. Voici les avantages de cette approche :

- **Messages d’erreurs compréhensibles** : L’utilisateur sait immédiatement ce qui ne va pas, qu’il s’agisse d’un article manquant ou d’un auteur absent.
- **Localisation précise des problèmes** : Le chemin et la localisation de l’erreur dans la requête aident les développeurs à résoudre le problème efficacement.
- **Éviter les messages génériques** : Plutôt que de retourner une erreur 500 incompréhensible, cette approche personnalise la réponse pour chaque situation.

## Une boussole pour éviter le chaos

Voici à quoi aurait ressemblé une réponse d'erreur pour ressource introuvable avant que nous rentrions dans cette tempête :

```json
{
    "errors": [
        {
            "message": "INTERNAL_ERROR for 874e2225-01a7-8aa6-3475-df7c35fc57bd",
            "locations": [
                {
                    "line": 2,
                    "column": 5
                }
            ],
            "path": [
                "getAuthorById"
            ],
            "extensions": {
                "classification": "INTERNAL_ERROR"
            }
        }
    ],
    "data": {
        "getAuthorById": null
    }
}
```

réponse lambda

Après modification, cette dernière est plus concise et plus claire :

```json
{
    "errors": [
        {
            "message": "Author non trouvé pour l'id : 4",
            "locations": [],
            "path": [
                "getAuthorById"
            ],
            "extensions": {
                "classification": "NOT_FOUND"
            }
        }
    ],
    "data": {
        "getAuthorById": null
    }
}
```

## Notes du capitaine

Dans mon exploration, je découvre un aspect surprenant de GraphQL : la gestion des erreurs.  
Contrairement à REST, où les erreurs renvoient des codes d’état HTTP comme 400, 404, 418 ou 500, GraphQL fait les choses différemment.

### Pas de panique, tout est dans le champ `errors`

Peu importe qu’une partie de la requête échoue, GraphQL renverra toujours un code HTTP **200**.  
Pourquoi ? Parce qu’il considère que tant que la requête globale a été analysée et traitée, elle est un succès… même si certaines parties ont généré des erreurs.

[](https://giphy.com/gifs/3ohzdDuZt5d6x6BGlG?ref=sfeir.dev)

Ces erreurs sont encapsulées dans un champ dédié, `errors`, dans la réponse.

### Pourquoi ce choix ?

GraphQL ne veut pas bloquer une requête entière à cause d’une erreur dans une de ses parties. Il me donne ce qu’il peut et me précise où le problème se situe. Grâce au champ `errors`, je peux analyser ce qui s’est mal passé sans perdre toutes les données de ma requête.

## Conclusion

La gestion des erreurs dans une API GraphQL est une étape cruciale pour garantir une expérience utilisateur fluide et une maintenance efficace. Avec Spring Boot, l’utilisation de **`DataFetcherExceptionResolver`** offre une solution élégante et flexible pour gérer les exceptions de manière centralisée. Cela permet de fournir des messages d’erreurs personnalisés, de garder des traces des problèmes rencontrés grâce au logging, et de simplifier le débugage en offrant une localisation précise des erreurs.

## Précédémment
[Partie 5 - Documentation](/springboot/graphql/partie-5-documentation/)
