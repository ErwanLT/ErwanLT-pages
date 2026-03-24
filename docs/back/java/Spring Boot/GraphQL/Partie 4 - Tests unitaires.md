---
layout: "default"
title: "Partie 4 - Tests unitaires"
permalink: "/back/java/spring-boot/graphql/partie-4-tests-unitaires/"
tags: [back, java, spring-boot, graphql]
date: "2025-01-16"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/partie-4-tests-unitaires/"
banner: "https://www.sfeir.dev/content/images/2025/09/20250919_1349_8-Bit-Pirate-Adventure_simple_compose_01k5gwtzt0f8y9qykjffy55pcq.png"
published_at: "2025-01-16"
sfeir_slug: "partie-4-tests-unitaires"
sfeir_tags: [Spring Boot, GraphQL]
---
_Jour 4 : La mer commence à s'agiter à l'approche du Cap des bons Tests_

musique de fond pour l'article

---

Arrr ! Notre API a été dressée comme un fier matelot, mais avant de la laisser naviguer dans l'infini des requêtes, nous devons l’éprouver à la manière des vieux loups de mer : avec des tests unitaires.  
Car comme le dirait le capitaine Crochet :

> Après tout, à quoi ressemblerait le monde sans les tests unitaires ?

[![](https://media.tenor.com/GL0L7g7jgUAAAAAC/hook-dustin-hoffman.gif)](https://media.tenor.com/GL0L7g7jgUAAAAAC/hook-dustin-hoffman.gif)

Pas certain de la fin de la citation

En cette journée, notre mission est claire : vérifier que chaque requête et chaque mutation fonctionnent sans faillir. Nous testerons la logique dans nos services et nous nous assurerons que nos contrôleurs manœuvrent les données et gèrent les erreurs avec précision. Nous savons bien ce qu’il advient de ceux qui osent naviguer sans tester leurs canons… et [[L'histoire des bugs informatiques les plus célèbres|ce n’est guère glorieux]].

## Armer le POM pour les tests

Avant de tracer notre carte au trésor des tests, il nous faut renforcer notre navire. Pour ce faire, nous ajoutons une dépendance vitale à notre `pom.xml` :

```xml
<dependency>
    <groupId>org.springframework.graphql</groupId>
    <artifactId>spring-graphql-test</artifactId>
    <scope>test</scope>
</dependency>
```

Ce précieux ajout nous fournit plusieurs outils pour nous permettre de tester nos API GraphQL comme il se doit.

#### GraphQlTester, notre boussole

La dépendance nous apporte notamment **GraphQlTester**, un allié robuste, taillé pour envoyer requêtes et mutations en mer sans se perdre dans les configurations. GraphQlTester est notre compas : il nous permet de simuler les interactions avec notre API, un peu comme MockMvc pour REST. Grâce à lui, nous pouvons :

1. Simuler des requêtes et tester la réponse JSON,
2. Charger uniquement les composants nécessaires pour les tests, allégeant ainsi notre navire,
3. Valider les réponses pour s'assurer que tout fonctionne dans les règles de l’art,
4. Gérer les erreurs éventuelles en évitant que notre navire ne sombre dans les profondeurs des bugs.

## Ecrivons la carte au trésor de notre Test

Voici une classe de test qui nous guide sur cette route tortueuse :

```java
@GraphQlTest(AuthorController.class)
public class AuthorControllerTest {
    @Autowired
    private GraphQlTester graphQlTester;

    @MockBean
    private AuthorService authorService;

    @Test
    void givenNewAuthorData_whenExecuteMutation_thenNewAuthorCreated() {

        when(authorService.createAuthor(anyString(), anyString())).thenReturn(mockAuthor());

        String documentName = "create_author";

        graphQlTester.documentName(documentName)
                .variable("name", "Erwan")
                .variable("bio", "J'aime le code")
                .execute()
                .path("createAuthor.id").hasValue()
                .path("createAuthor.name").entity(String.class).isEqualTo("Erwan")
                .path("createAuthor.bio").entity(String.class).isEqualTo("J'aime le code");
    }

    private Author mockAuthor() {
        Author author = new Author();
        author.setId(1L);
        author.setName("Erwan");
        author.setBio("J'aime le code");
        return author;
    }
}
```

Que pouvons nous voir dans cette classe ?

##### Décodage des symboles sur la carte

Dans notre classe de test, [[Comprendre les annotations dans Spring Boot - guide et exemples|plusieurs annotations]] nous servent de balises dans cette aventure :

- **@GraphQlTest** : Elle fait office de phare, nous guidant pour tester notre `AuthorController`. Elle réduit notre chargement en incluant seulement les composants utiles, rendant nos tests aussi rapides qu’une frégate en pleine tempête.
- **@Autowired** : Injecte notre boussole, **GraphQlTester**, permettant d’envoyer des requêtes GraphQL et de valider les réponses sans hésitation.
- **@MockBean** : Crée une version simulée du service `AuthorService`. Grâce à ce leurre, nous pouvons fixer le cap sans dépendre de la logique réelle, garantissant que notre contrôleur agit comme il se doit.

### `GraphQlTester` en action

`GraphQlTester` est l'équivalent de `MockMvc` pour les [API REST](https://www.sfeir.dev/rest-definition/), il permet aux développeurs d’interagir directement avec les endpoints GraphQL et de valider facilement les réponses JSON, sans avoir à démarrer un serveur Web complet.

**Préparer et envoyer la requête GraphQL**

- Dans notre test, `GraphQlTester` est utilisé pour envoyer une mutation `createAuthor` au contrôleur `AuthorController`. Cette mutation est définie dans un fichier de requête nommé `create_author`, chargé via `.documentName(documentName)`.
- `GraphQlTester` injecte ensuite des variables dynamiques (ici `name` et `bio`) à l'aide de `.variable(...)`, permettant de tester le contrôleur avec différentes données d'entrée sans modifier la requête elle-même.

**Exécuter la mutation**

- En appelant `.execute()`, `GraphQlTester` envoie effectivement la mutation au contrôleur simulé, comme le ferait un vrai client GraphQL.
- Le contrôleur utilise alors le service mocké `authorService` pour traiter la requête et renvoyer une réponse. Grâce au mock (`@MockBean`), nous avons un contrôle total sur ce que retourne le service, ici un auteur avec des données fixes.

**Vérifier la réponse du contrôleur**

- Après l'exécution de la mutation, `GraphQlTester` fournit une API pour inspecter le contenu de la réponse. Dans notre cas :
    - `.path("createAuthor.id").hasValue()` vérifie que le champ `id` est présent dans la réponse.
    - `.path("createAuthor.name").entity(String.class).isEqualTo("Erwan")` et `.path("createAuthor.bio").entity(String.class).isEqualTo("J'aime le code")` valident que le nom et la biographie de l'auteur correspondent aux valeurs attendues.
- Cela permet de vérifier que le contrôleur traite correctement les données entrantes et renvoie une réponse formatée selon les spécifications, même si le service sous-jacent est simulé.

### Utilisation de document

Dans notre test, nous pouvons voir que GraphQlTester utilise un document pour exécuter la requête :

```java
String documentName = "create_author";
graphQlTester.documentName(documentName)
```

Mais à quoi sert donc ce document, et où se trouve t'il ?

Pour la question sur la localisation du document, la réponse est simple : dans un répertoire `graphql-test` présent dans les resources de nos tests.

Les documents `.graphql`, tels que `create_author`, servent de cartes détaillées pour nos expéditions. Plutôt que de graver chaque requête dans notre test, nous faisons appel à un document séparé. Cela a plusieurs avantages :

- **Séparation de la logique des tests et des requêtes**, ce qui rend nos tests plus lisibles,
- **Réutilisabilité des requêtes**, un gain de temps pour chaque aventure à venir,
- **Documentation et lisibilité**, offrant à ceux qui nous succéderont une carte claire de nos exploits.

## Conclusion

L’approche avec `@GraphQlTest` et les documents `.graphql` rend les tests plus clairs et organisés, tout en favorisant la réutilisabilité des requêtes et mutations. En utilisant `GraphQlTester`, on bénéficie d'un contrôle précis sur les réponses JSON, ce qui permet de tester efficacement toutes les parties de l'API GraphQL sans dépendre d'une base de données.

Avec cette structure, nos tests sont modulaires et peuvent facilement évoluer avec les besoins de l'application. Cela garantit une couverture fiable et maintenable pour l'ensemble des API GraphQL de notre projet.

---

_Après avoir franchi le Cap des bons Tests sans embûches, nous mettons le cap sur l’île de la Documentation, prêts à partager nos exploits avec le monde._

## Précédemment
[[Partie 3 - Controllers]]

## Prochainement

[[Partie 5 - Documentation]]
