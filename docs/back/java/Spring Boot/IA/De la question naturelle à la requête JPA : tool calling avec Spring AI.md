---
layout: "default"
title: "De la question naturelle à la requête JPA : tool calling avec Spring AI"
permalink: "/back/java/spring-boot/ia/de-la-question-naturelle-a-la-requete-jpa-tool-calling-avec-spring-ai/"
tags: [back, java, spring-boot, ia]
status: "Draft"
---
Dans [Et si on intégrait LangChain dans Spring Boot ? Partie 1](/back/java/spring-boot/ia/et-si-on-integrait-langchain-dans-spring-boot-partie-1/), nous avons branché un [LLM](https://www.sfeir.dev/data/comment-demarer-un-projet-llm/).  
Dans [Et si on intégrait LangChain dans Spring Boot ? Partie 2](/back/java/spring-boot/ia/et-si-on-integrait-langchain-dans-spring-boot-partie-2/) nous avons commencé à parler de tools.

Mais entre “j’ai un chatbot qui répond” et “j’ai une IA utile dans mon API”, il y a un fossé.

Ce fossé, c’est la ****fiabilité factuelle****.

Parce qu’un modèle qui répond bien, ça impressionne.  
Un modèle qui répond juste, c’est autre chose.

Dans cet article, on va voir comment passer de la question naturelle à une requête métier réelle, avec :

- [Spring Boot](/back/java/spring-boot/il-etait-une-fois-spring-boot/)
- Spring AI + [Ollama](https://www.sfeir.dev/back/votre-premier-llm-en-5-minutes-avec-ollama/)
- une base H2
- des tools backend annotés
- une [API REST](/definition/rest-definition/) simple (`/api/library/ask`)

Le principe est limpide :

> le LLM ne lit pas directement ta base.  
> il appelle des outils exposés par ton backend.

Et c’est précisément ce qui transforme “un assistant sympa” en “une capacité logicielle sérieuse”.

## Le problème qu’on résout vraiment

Si on envoies juste un prompt au modèle :

- il peut reformuler très bien,
- il peut répondre vite,
- [il peut aussi inventer des données](/ia/ia-degenerative-quand-l-algorithme-est-malade/).

Dès que on lui demandes :

- “Combien y a-t-il de livres ?”
- “Trouve-moi tous les romans fantasy”
- “Liste les livres de Martin Fowler”

…on veux une réponse ****adossée à la base****, pas à son imagination statistique.

C’est exactement la même logique que dans pour la gestion des erreurs:  
la forme compte, mais le fond (la vérité métier) compte davantage.

## Ce qu’on construit

Un mini domaine “bibliothèque” :

- `Author` (1)
- `Book` (N)

Et un `Book` enrichi avec :

- un `LiteraryGenre` (`FANTASY`, `ROMANCE`, `SCIENCE_FICTION`, `THRILLER`, `PHILOSOPHY`)
- un `BookType` (`ROMAN`, `BANDE_DESSINEE`, `NOUVELLE`, `ESSAI`)

Pourquoi ces enums sont importantes ?  
Parce qu’elles permettent au modèle d’appeler des tools ****sémantiquement clairs**** :

- `find_books_by_genre`
- `find_books_by_type`
- `count_books`

On n’est plus sur un “prompt flou”, on est sur des capacités métier explicites.

## Dépendances minimales

Pour ce use case, le strict nécessaire est le modèle Ollama côté Spring AI.

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-starter-model-ollama</artifactId>
</dependency>
```

Pas besoin de vector store tant qu’on ne fait pas de [RAG](https://www.sfeir.dev/ia/kesaco-larchitecture-rag/).  
Ici, le backend Java fait le travail métier (JPA + service + tools).

## Le pattern architecturel
Ce pattern est généralement appelé **Tool Calling** (ou **Function Calling**).  
Le LLM agit comme un orchestrateur capable d’appeler des capacités applicatives exposées par le backend.

Le flux réel est le suivant :

1. L’utilisateur envoie une question naturelle.
2. Le service IA envoie cette question au modèle avec les tools disponibles.
3. Le modèle décide d’appeler (ou non) un tool.
4. Le tool exécute du code métier (service + repository).
5. Le résultat est renvoyé au modèle.
6. Le modèle formule la réponse finale.

Dit autrement :

- le modèle ****oriente****,
- ton backend ****garantit****.

Ce pattern est très complémentaire de la gestion de requête dynamique vue dans un article précédent :  
intentions variées, exécution contrôlée.

## Les tools : l’API métier du LLM

Le cœur de la démo est là.  
Ce n’est pas un “helper”, c’est un contrat d’orchestration.

```java
@Component
public class LibraryTools {

    @Tool(name = "count_books", description = "Compter le nombre total de livres")
    public long countBooks() {
        return libraryService.countBooks();
    }

    @Tool(name = "find_books_by_author", description = "Trouver les livres d'un auteur")
    public List<BookView> findBooksByAuthor(
            @ToolParam(description = "Nom complet ou partiel de l'auteur") String authorName) {
        return libraryService.findBooksByAuthor(authorName);
    }

    @Tool(name = "find_books_by_genre", description = "Trouver des livres par genre")
    public List<BookView> findBooksByGenre(
            @ToolParam(description = "FANTASY, ROMANCE, SCIENCE_FICTION, THRILLER, PHILOSOPHY") String genre) {
        return libraryService.findBooksByGenre(parseGenre(genre));
    }
}
```

### Ce qu’il faut retenir

- `@Tool` expose une capacité.
- `@ToolParam` documente l’intention attendue.
- Le modèle choisit le tool.
- Le backend fait l’exécution réelle.

En pratique, plus les names/descriptions sont propres, plus le modèle choisit bien le tool qui sera utilisé.

## Le service IA : moins de magie, plus de contrat

Le service IA devient très compact :

```java
@Service
public class LibraryAiService {

    public String ask(String question) {
        return chatClient.prompt()
                .system("Tu es un assistant de bibliothèque. Utilise les tools pour les questions factuelles.")
                .tools(libraryTools)
                .user(question)
                .call()
                .content();
    }
}
```

### Pourquoi ce code est intéressant

- Pas de routeur artisanal.
- Pas de parsing JSON fragile.
- Pas de “si la question contient X alors Y”.
- Le LLM orchestre nativement les tools.

## L’API REST

Le contrôleur reste volontairement simple :

```java
@RestController
@RequestMapping("/api/library")
public class LibraryController {

    @GetMapping("/ask")
    public AskResponse ask(@RequestParam String question) {
        return new AskResponse(question, libraryAiService.ask(question));
    }
}
```

Simplicité utile :

- entrée unique (`question`)
- pipeline IA isolé dans un service
- [testabilité propre avec mock](https://www.sfeir.dev/back/croquons-du-mockito/) du service IA

## Le vrai carburant de la démo : le dataset

Un article sur tool-calling avec 4 lignes en base, c’est frustrant.

Ici, on charge un vrai dataset :

- auteurs connus (Fowler, Evans, Tolkien, Herbert, Christie, etc.)
- genres et types variés
- volume enrichi pour monter à 60 livres

Ce point change tout :

- le modèle a de vrais cas de décision
- les queries deviennent crédibles
- les démos “roman vs essai vs BD” sont parlantes

## Observabilité : vérifier ce que fait vraiment le modèle

Sans logs, on “croit” que le modèle appelle un tool.  
Avec logs, on le ****prouve****.

```java
@Tool(name = "find_books_by_type", description = "Trouver des livres par type")
public List<BookView> findBooksByType(
        @ToolParam(description = "Type de livre, ex: ROMAN, BANDE_DESSINEE, NOUVELLE, ESSAI") String type) {

    logger.info("Tool called: find_books_by_type with type='{}'", type);

    try {
        BookType normalizedType = BookType.valueOf(normalizeEnumToken(type));
        logger.info("Normalized type: {}", normalizedType);

        var books = libraryService.findBooksByType(normalizedType);

        logger.info("find_books_by_type returned {} books", books.size());
        return books;

    } catch (Exception e) {
        logger.warn("Invalid type '{}' - returning empty result", type);
        return Collections.emptyList();
    }
}

@Tool(name = "count_books", description = "Compter le nombre total de livres")
public long countBooks() {
    logger.info("Tool called: count_books");

    var count = libraryService.countBooks();

    logger.info("count_books returned {}", count);
    return count;
}
```

Par exemple :

- tool choisi
- argument reçu
- taille du résultat
- durée d’exécution

## Pourquoi cette approche est solide côté architecture

Parce qu’elle respecte les responsabilités :

- ****LLM**** : compréhension de la question, orchestration des tools, formulation finale.
- ****Backend métier**** : règles, requêtes, validation, normalisation.
- ****Base**** : source de vérité.

C’est aussi compatible avec :

- [De la validation en entrée](/back/java/spring-boot/validation-spring-boot-du-standard-au-sur-mesure/) pour valider les entrées API,
- [De la gestion de profil](/back/java/spring-boot/les-profils-dans-spring-boot/) pour séparer config locale et environnements,
- [Du monitoring pour surveiller les instances](/back/java/spring-boot/superviser-votre-application-spring-boot-grace-a-prometheus-et-grafana/).

## Limites à assumer

Le tool-calling ne résout pas tout :

- il dépend des capacités du modèle choisi dans Ollama,
- il ne remplace pas le RAG documentaire,
- il impose une vraie qualité de conception des tools,
- il nécessite des garde-fous sur les paramètres.

Pour aller plus loin :

- intégrer un store vectoriel pour les questions “connaissance non structurée”,
- ajouter une politique de fallback stricte,
- renforcer la gouvernance des prompts système.
## Conclusion

Un LLM branché sans tools, c’est souvent une belle interface sur un moteur probabiliste.

Un LLM branché avec des tools métier bien conçus, c’est une ****orchestration fiable**** entre langage naturel et logique applicative.

Et c’est exactement ce qu’on cherche ici :

- garder l’ergonomie conversationnelle,
- sans sacrifier la vérité métier.

En une phrase :

> le LLM interprète la demande,  
> ton backend décide des faits.

C’est là que l’IA commence à devenir sérieuse dans une application Spring Boot.
