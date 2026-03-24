---
layout: "default"
title: "Et si on intégrait LangChain dans Spring Boot ? Partie 2"
permalink: "/back/java/spring-boot/ia/et-si-on-integrait-langchain-dans-spring-boot-partie-2/"
tags: [back, java, spring-boot, ia]
status: "Draft"
---
Dans la [première partie](/back/java/spring-boot/ia/et-si-on-integrait-langchain-dans-spring-boot-partie-1/), nous avons découvert comment **LangChain4j** permet d’interagir avec les modèles de langage à travers une intégration manuelle et structurée dans une application [Spring Boot](/back/java/spring-boot/il-etait-une-fois-spring-boot/).  
Aujourd’hui, nous allons franchir une nouvelle étape : **simplifier drastiquement l’intégration** grâce aux [**Spring Boot Starters**](https://www.sfeir.dev/back/how-to-trouver-ses-starters-springboot/) officiels de LangChain4j et de Mistral.

Et comme nous sommes attachés à notre patrimoine technologique, nous continuerons à faire honneur à [**Mistral**, l’IA française](https://www.sfeir.dev/ia/arthur-mensch-le-visionnaire-de-la-tech-qui-place-la-france-sur-la-carte-mondiale-de-lia/) qui n’a rien à envier à ses équivalentes étrangères.

Cette deuxième partie mettra en avant :

- la simplicité du **starter Spring Boot LangChain4j**,
- la création d’**assistants IA spécialisés**,
- et l’utilisation d’**outils (tools)** pour enrichir les capacités du modèle.

## Dépendances Maven

Le cœur de cette simplification réside dans les starters officiels.  
Grâce à eux, plus besoin de gérer manuellement l’injection des modèles ou la configuration des API.

```xml
<dependencies>
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-mistral-ai-spring-boot-starter</artifactId>
        <version>1.7.1-beta14</version>
    </dependency>

    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-spring-boot-starter</artifactId>
        <version>1.7.1-beta14</version>
    </dependency>
</dependencies>
```

- **`langchain4j-spring-boot-starter`** : gère automatiquement la configuration de base et l’injection des composants LangChain4j dans le contexte Spring.
- **`langchain4j-mistral-ai-spring-boot-starter`** : ajoute la configuration spécifique au fournisseur Mistral, notamment la gestion des clés API et des modèles disponibles.

## Configuration de l’application

Tout se fait désormais via le fichier `application.properties`.  
Les propriétés ci-dessous suffisent pour configurer le modèle Mistral à utiliser :

```properties
langchain4j.mistral-ai.chat-model.api-key=<API_KEY>
langchain4j.mistral-ai.chat-model.model-name=mistral-small-latest
langchain4j.mistral-ai.chat-model.log-requests=true
langchain4j.mistral-ai.chat-model.log-responses=true
```

- **api-key** : votre clé personnelle fournie par Mistral AI ([Surtout ne la commité pas](https://www.sfeir.dev/securite/de-la-bonne-gestion-des-donnees-sensibles-dans-les-depots-git/)).
- **model-name** : le modèle utilisé (ici `mistral-small-latest` pour son excellent rapport coût/performance).
- **log-requests / log-responses** : activent la journalisation complète des échanges pour le débogage.

Grâce à ces lignes, le **`ChatModel`** est automatiquement instancié et disponible pour injection dans vos services Spring.

## Un contrôleur pour tester nos assistants

Notre contrôleur expose trois points d’accès :

- un accès direct au modèle de chat,
- un assistant “poli”,
- et un assistant “cuisinier”.

```java
@RestController
public class IAController {

    private final ChatModel chatModel;
    private final PoliteAssistant politeAssistant;
    private final CookingAssistant cookingAssistant;

    public IAController(ChatModel chatModel, PoliteAssistant politeAssistant, CookingAssistant cookingAssistant) {
        this.chatModel = chatModel;
        this.politeAssistant = politeAssistant;
        this.cookingAssistant = cookingAssistant;
    }

    @GetMapping("/chat")
    public String model(@RequestParam(value = "message", defaultValue = "Hello") String message) {
        return chatModel.chat(message);
    }

    @GetMapping("/polite")
    public String politeAssistant() {
        return politeAssistant.chat("Hello");
    }

    @GetMapping("/cook")
    public String chat(@RequestParam(defaultValue = "Donne-moi une recette de crêpes") String message) {
        return cookingAssistant.chat(message);
    }

}
```

- `/chat` → interagit directement avec le modèle Mistral.
- `/polite` → utilise un assistant personnalisé pour produire des réponses polies.
- `/cook` → fait appel à un assistant cuisinier, capable de chercher des recettes ou d’en proposer de nouvelles.

## Les assistants : donner une personnalité à l’IA

LangChain4j permet d’annoter des interfaces Java avec `@AiService`.  
Chaque méthode annotée devient une interaction avec le modèle, et [l’annotation](/back/java/spring-boot/comprendre-les-annotations-dans-spring-boot-guide-et-exemples/) `@SystemMessage` définit le **rôle** et le **comportement global** de l’assistant.

### un assistant poli

```java
@AiService
public interface PoliteAssistant {

    @SystemMessage("Tu es un assistant poli et serviable, tu termine toutes tes phrase par monseigneur")
    String chat(String userMessage);
}
```

non j'ai pas la grosse tête

cet assistant illustre la simplicité avec laquelle on peut orienter la personnalité de l’IA.  
Chaque appel à `chat()` retournera une réponse conforme à cette règle de politesse.

**Exemple de réponse à un simple bonjour :**

```text
Bonjour monseigneur, comment puis-je vous aider aujourd'hui ?
```

j'ai aussi essayé de le rendre énervé et ironique, mais il faut croire que les modèles de Mistral ne veulent que rester courtois, par contre, il accepte de se prendre pour un pirate 🏴‍☠️.

```text
Bonjour à toi, matelot ! Que puis-je faire pour toi aujourd'hui ? Cherches-tu un trésor culinaire ou as-tu besoin d'aide pour quelque chose d'autre ?
```

### un assistant cuisinier

```java
@AiService
public interface CookingAssistant {

    @SystemMessage("""
        Tu es un chef cuisinier français. 
        Si l'utilisateur demande une recette, tu dois utiliser les outils disponibles
        pour trouver ou proposer une recette adaptée.
        """)
    String chat(String userMessage);
}
```

cet assistant agit comme un chef français.  
Mais surtout, il **peut utiliser des outils LangChain** pour accéder à des informations dynamiques, ce que nous allons voir à présent.

## Les Tools : relier l’IA à votre logique métier

Les **tools** (outils) permettent à l’IA d’interagir avec votre code Java.  
Chaque méthode annotée avec `@Tool` peut être appelée par le modèle **lorsqu’il en a besoin** pour répondre à une question.

```java
@Component
public class CookingTools {

    private final Logger logger = LoggerFactory.getLogger(CookingTools.class);

    private final RecipeService recipeService;

    public CookingTools(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @Tool
    public Recipe getRecipeByName(String name) {
        logger.info("get recipe by name");
        return recipeService.findRecipeByName(name);
    }

    @Tool
    public String suggestRecipe(String ingredient) {
        logger.info("get recipe for ingredient");
        return recipeService.suggestRecipeForIngredient(ingredient);
    }
}
```

- Chaque méthode exposée avec `@Tool` devient une **capacité additionnelle** de l’assistant.
- L’IA décide elle-même d’appeler ces outils pour enrichir ses réponses.

Et notre service metier

```java
@Service
public class RecipeService {

    public Recipe findRecipeByName(String name) {
        // Dans un vrai cas, on interrogerait une base de données ou un fichier
        if (name.equalsIgnoreCase("chocolat chaud")) {
            return new Recipe(
                    "Chocolat chaud",
                    List.of("250 ml de lait", "40 g de chocolat noir", "1 c. à café de sucre"),
                    List.of("Faire chauffer le lait", "Ajouter le chocolat et le sucre", "Fouetter jusqu'à consistance lisse")
            );
        }
        if (name.equalsIgnoreCase("crêpes")) {
            return new Recipe(
                    "Crêpes",
                    List.of("250 g de farine", "3 œufs", "50 cl de lait", "1 pincée de sel", "1 c. à soupe d'huile"),
                    List.of("Mélanger les ingrédients", "Laisser reposer la pâte 30 min", "Cuire dans une poêle chaude")
            );
        }
        return new Recipe(name, List.of(), List.of("Désolé, je ne connais pas encore cette recette."));
    }

    public String suggestRecipeForIngredient(String ingredient) {
        return switch (ingredient.toLowerCase()) {
            case "œuf" -> "Omelette à la ciboulette";
            case "pomme" -> "Tarte aux pommes rustique";
            case "chocolat" -> "Mousse au chocolat maison";
            default -> "Je n’ai pas de recette précise pour cet ingrédient, mais tu peux l’ajouter à un gratin ou une salade.";
        };
    }
}
```

Cette approche fait du modèle un véritable **agent intelligent**, capable de mêler langage naturel et exécution de logique applicative.

## Classification des messages : une IA qui comprend le ton

Si LangChain4j permet de converser, de raisonner et même d’utiliser des outils, il sait également **analyser le ton et l’intention** d’un message.  
Cette fonctionnalité ouvre la porte à des usages concrets comme la **modération automatique**, l’analyse de **sentiment client**, ou la priorisation des messages selon leur tonalité.

Pour illustrer ce cas d’usage, nous allons mettre en place un **classifieur de sentiments**, capable d’identifier si un texte exprime une émotion **positive**, **neutre** ou **négative** — toujours en utilisant notre modèle français **Mistral**.

### Définir les catégories de sentiment

```java
public enum Sentiment {
    POSITIVE,
    NEUTRAL,
    NEGATIVE
}
```

Cette énumération représente les trois classes principales de tonalité que notre assistant devra reconnaître.

### Créer le service d’analyse de sentiment

{% raw %}
```java
@AiService
public interface SentimentAnalyzer {

    @UserMessage("Analyse le sentiment de ce texte et répond uniquement par POSITIVE, NEUTRAL ou NEGATIVE : {{it}}")
    Sentiment analyzeSentimentOf(String text);

    @UserMessage("Ce texte est-il positif ? Réponds uniquement par true ou false : {{it}}")
    boolean isPositive(String text);
}
```
{% endraw %}

**`@UserMessage`** : définit la manière dont le texte est transmis à l’IA, ici avec des instructions claires et limitées pour garantir une réponse structurée.

### Exposer le service via un contrôleur Spring Boot

```java
@RestController
public class SentimentController {

    private final SentimentAnalyzer sentimentAnalyzer;

    public SentimentController(SentimentAnalyzer sentimentAnalyzer) {
        this.sentimentAnalyzer = sentimentAnalyzer;
    }

    @GetMapping("/sentiment")
    public Sentiment analyze(@RequestParam String message) {
        return sentimentAnalyzer.analyzeSentimentOf(message);
    }

    @GetMapping("/sentiment/positive")
    public boolean isPositive(@RequestParam String message) {
        return sentimentAnalyzer.isPositive(message);
    }
}
```

Avec seulement quelques lignes, on obtient un service capable de **classifier les messages** et de **répondre instantanément** à une requête HTTP :

- `GET /sentiment?message=J'adore ce projet !` → `POSITIVE`
- `GET /sentiment/positive?message=Ce code est horrible` → `false`

## Conclusion

Avec cette seconde étape, nous avons franchi un cap important dans l’intégration de [l’intelligence artificielle](https://www.sfeir.dev/ia/le-cercle-de-lintelligence-artificielle-les-13-experts-qui-eclairent-la-france/) au sein d’une application Spring Boot.  
Loin de se limiter à un simple échange de messages avec un modèle de langage, LangChain4j permet de structurer l’interaction autour de véritables **assistants spécialisés**, chacun doté d’un rôle clair et d’un ton défini, reproduisant ainsi une approche très naturelle du dialogue entre l’utilisateur et la machine.

L’ajout des **outils** ouvre, quant à lui, des perspectives encore plus intéressantes. Grâce à eux, les assistants peuvent désormais exécuter des actions concrètes, interroger des systèmes existants ou enrichir leurs réponses par des données réelles. On passe donc d’une intelligence purement textuelle à une intelligence **opérationnelle**, capable de manipuler l’information au sein même de l’écosystème applicatif.
