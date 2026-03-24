---
layout: "default"
title: "Et si on intégrait LangChain dans Spring Boot ? Partie 1"
permalink: "/back/java/spring-boot/ia/et-si-on-integrait-langchain-dans-spring-boot-partie-1/"
tags: [back, java, spring-boot, ia]
status: "Draft"
source: "sfeir.dev"
---
Depuis l’apparition des [**modèles de langage de grande taille (LLM)**](https://www.sfeir.dev/data/comment-demarer-un-projet-llm/), le monde du développement logiciel vit une transformation profonde. Ces modèles — capables de comprendre et de générer du texte de manière cohérente, contextualisée, et souvent bluffante — ont ouvert la voie à une nouvelle génération d’applications dites “intelligentes”.  
Dans l’écosystème [**Java**](/back/java/il-etait-une-fois-java/), réputé pour sa robustesse et sa pérennité, cette révolution se traduit par l’apparition de bibliothèques dédiées à l’orchestration et à la manipulation des LLM, dont **LangChain4j** est aujourd’hui la référence incontournable.

Certes, [**Spring Boot**](/back/java/spring-boot/il-etait-une-fois-spring-boot/) propose déjà un **starter officiel, Spring AI**, qui facilite l’intégration de modèles tels qu’[OpenAI, Azure OpenAI, ou encore Anthropic Claude](https://www.sfeir.dev/ia/quel-modele-dia-choisir-gpt-claude-gemini-mistral-llama-falcon-le-comparatif-indispensable/). Mais soyons honnêtes : la majorité de ces solutions reposent sur des modèles étrangers, souvent hébergés et régulés outre-Atlantique.  
Or, pour qui tient à la souveraineté technologique et à l’excellence française, il est naturel de se tourner vers une alternative **nationale**. C’est ici qu’entre en scène [**Mistral AI**](https://www.sfeir.dev/ia/il-etait-une-fois-le-chat-de-mistral-ai/), jeune entreprise française devenue en quelques mois un symbole de l’innovation européenne dans le domaine de l’intelligence artificielle.

Le choix que nous faisons ici est donc volontairement **chauvin** : utiliser un **modèle français**, performant et ouvert, au sein d’un environnement [**Spring Boot** — pilier du développement d’applications Java modernes](https://www.sfeir.dev/back/back-pourquoi-utiliser-spring-boot/). Et pour cela, **LangChain4j** nous sert de passerelle, souple et parfaitement intégrée à l’écosystème Java.

[![](https://www.sfeir.dev/content/images/2025/10/image-4.png)](https://www.sfeir.dev/content/images/2025/10/image-4.png)

le coq gaulois

## Présentation de LangChain

Pour comprendre LangChain4j, il faut d’abord remonter à son ancêtre : **LangChain**, une bibliothèque née dans l’univers Python en 2022, sous l’impulsion de **Harrison Chase**.  
Son objectif initial était simple, mais ambitieux : **permettre aux développeurs de structurer les interactions avec un LLM** de manière modulaire et réutilisable.

[

Késaco : LangChain

LangChain, LangChain... vous entendez ce mot dans toutes les conversations sans réellement comprendre de quoi il s’agit? Pas de panique, notre Késaco est là pour vous aider !

![](https://www.sfeir.dev/content/images/icon/plume-point-292.png)sfeir.dev - Le média incontournable pour les passionnés de tech et d'intelligence artificielleCharlotte Ryssen (Coumont)

![](https://www.sfeir.dev/content/images/thumbnail/Capture-d-e-cran-2024-02-22-a--11.02.53.png)

](https://www.sfeir.dev/ia/kesaco-langchain/)

Pour en savoir plus sur langchain c'est par ici

En effet, interagir directement avec un modèle (comme GPT, Claude ou Mistral) via une API brute est souvent limité. On envoie un texte, on obtient une réponse. Mais dès qu’on souhaite :

- enchaîner plusieurs requêtes logiquement (chaîne de prompts),
- stocker le contexte d’une conversation (mémoire),
- enrichir les réponses à partir de documents internes ([RAG : _Retrieval-Augmented Generation_](https://www.sfeir.dev/ia/kesaco-larchitecture-rag/)),
- ou même connecter le modèle à des outils externes ([agents](https://www.sfeir.dev/front/les-tendances-tech-2025-de-lindustrialisation-a-linnovation-en-data-et-ia/)),

… l’approche basique ne suffit plus.

LangChain a introduit une série de **concepts fondateurs** :

- **PromptTemplate** : des modèles de texte avec des variables dynamiques.
- **Chain** : une séquence d’étapes connectées qui utilisent un LLM pour traiter ou enrichir des données.
- **Memory** : une structure permettant à un modèle de conserver le contexte d’une conversation.
- **Tool / Agent** : un mécanisme permettant au modèle d’appeler des fonctions ou des API extérieures.
- **Retrieval** : l’utilisation d’un moteur d’embeddings pour rechercher dans une base documentaire les passages pertinents avant de répondre.

Ces abstractions ont fait de LangChain une véritable boîte à outils pour concevoir des applications intelligentes et adaptables.  
Rapidement, LangChain s’est imposé comme un **standard de fait** dans le monde Python pour bâtir des applications LLM complexes — assistants personnels, moteurs de recherche sémantiques, agents conversationnels, etc.

[

Pourquoi utiliser LangChain ?

Pourquoi LangChain est le framework incontournable pour débuter votre projet de chatbot intelligent ?

![](https://www.sfeir.dev/content/images/icon/plume-point-293.png)sfeir.dev - Le média incontournable pour les passionnés de tech et d'intelligence artificielleCharlotte Ryssen (Coumont)

![](https://www.sfeir.dev/content/images/thumbnail/Capture-d-e-cran-2024-02-21-a--16.00.28-1-1.png)

](https://www.sfeir.dev/ia/langchain-pourquoi/)

## Présentation de LangChain4j

Le succès de LangChain a naturellement inspiré un portage vers d’autres langages. C’est ainsi qu’est né **LangChain4j**, projet [open-source](https://www.sfeir.dev/tag/open-source/) qui apporte la même philosophie au monde **Java**.  
LangChain4j transpose les grands concepts de LangChain dans un cadre familier aux développeurs Java : typage fort, [configuration par annotations](/back/java/spring-boot/comprendre-les-annotations-dans-spring-boot-guide-et-exemples/), injection de dépendances, compatibilité Spring Boot, etc.

Concrètement, **LangChain4j** fournit une série d’interfaces et de classes qui encapsulent les principales briques nécessaires pour construire des applications intelligentes :

- **ChatModel** : pour interagir avec un modèle de langage conversationnel (comme Mistral, OpenAI ou Ollama).
- **EmbeddingModel** : pour convertir du texte en vecteurs numériques et permettre la recherche sémantique.
- **PromptTemplate** : pour générer dynamiquement des prompts avec des variables.
- **DocumentSplitter** et **EmbeddingStore** : pour découper, indexer et rechercher dans des documents.
- **ChatMemory** : pour conserver le contexte des conversations et offrir des échanges cohérents dans la durée.

Mais LangChain4j ne se limite pas à la théorie.  
L’un de ses grands atouts est de proposer des **implémentations concrètes** pour plusieurs fournisseurs de modèles : OpenAI, Anthropic, Hugging Face, Ollama, et — ce qui nous intéresse ici — **Mistral AI**.  
Ce dernier est pris en charge grâce au module `langchain4j-mistral-ai`, qui permet d’accéder aux modèles de la famille **Mistral Small**, **Mistral Medium** et **Mistral Embed**, via leur API officielle.

[

GitHub - langchain4j/langchain4j: LangChain4j is an open-source Java library that simplifies the integration of LLMs into Java applications through a unified API, providing access to popular LLMs and vector databases. It makes implementing RAG, tool calling (including support for MCP), and agents easy. LangChain4j integrates seamlessly with various enterprise Java frameworks.

LangChain4j is an open-source Java library that simplifies the integration of LLMs into Java applications through a unified API, providing access to popular LLMs and vector databases. It makes impl…

![](https://www.sfeir.dev/content/images/icon/pinned-octocat-093da3e6fa40-106.svg)GitHublangchain4j

![](https://www.sfeir.dev/content/images/thumbnail/langchain4j)

](https://github.com/langchain4j/langchain4j)

## ⚖️ Avantages et inconvénients de LangChain4j

### ➕ Avantages

- **API Java idiomatique** : cohérente avec les conventions de Spring et facile à intégrer.
- **Écosystème modulaire** : prise en charge de nombreux fournisseurs de modèles et de stores d’embeddings.
- **Abstractions puissantes** : support natif des prompts, de la mémoire, du RAG et du streaming.
- **Compatibilité Spring Boot / Quarkus** : déploiement aisé dans des environnements cloud ou on-premise.
- **Support Mistral** : intégration directe avec les modèles Mistral, performants et souverains.

### ➖ Inconvénients

- **Jeunesse du projet** : LangChain4j évolue vite, certaines API changent d’une version à l’autre.
- **Stores en mémoire** : pratiques pour le prototypage, mais à remplacer par des solutions persistantes (pgvector, Elasticsearch) en production.
- **Concurrence et état** : attention à la gestion de la mémoire partagée entre sessions ou threads.

## Exemple d’implémentation

### Dépendances Maven

Pour utiliser **LangChain4j** avec le modèle **Mistral**, il faut importer deux modules principaux dans votre projet Maven :

```xml
<dependencies>
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j</artifactId>
        <version>1.7.1</version>
    </dependency>

    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-mistral-ai</artifactId>
        <version>1.7.1</version>
    </dependency>
</dependencies>
```

les dépendances pour langchain4j et pour utiliser les modèles mistral

#### langchain4j

C’est le **cœur de la bibliothèque**.  
Elle contient toutes les **abstractions de base** et les **interfaces communes** qui définissent la structure logique d’une application LangChain en Java.

**En d’autres termes :** c’est le moteur sans le carburant.

Elle fournit :

- Les **interfaces principales** :
    - `ChatLanguageModel` – pour interagir avec les modèles conversationnels.
    - `EmbeddingModel` – pour générer des vecteurs numériques à partir de texte.
    - `PromptTemplate` – pour formater dynamiquement les prompts.
    - `ChatMemory` – pour stocker le contexte d’une conversation.
    - `Retriever` et `EmbeddingStore` – pour la recherche sémantique et la gestion du RAG.
- Les **classes de base** utilisées pour la composition de chaînes de traitement :
    - `Chain`, `Prompt`, `Message`, `ToolExecutionRequest`, etc.
- Les **utilitaires communs** :
    - Convertisseurs, builders, adaptateurs, classes de support pour la sérialisation JSON, etc.

#### langchain4j-mistral-ai

C’est le **connecteur** entre LangChain4j et les modèles **Mistral AI**.  
Il fournit les classes concrètes qui permettent d’interagir avec les API Mistral à travers les interfaces standard de LangChain4j.

**En d’autres termes :** c’est le carburant — le module qui rend le moteur LangChain4j capable de parler avec Mistral.

Elle fournit :

- Une **implémentation du modèle de chat** :  
    `MistralAiChatModel`, qui implémente `ChatLanguageModel`.
- Une **intégration directe de l’API Mistral** :  
    gestion des clés d’API, du format de requêtes et des réponses.
- La **prise en charge du streaming** :  
    vous pouvez recevoir les réponses token par token (utile pour des UI interactives).
- La **compatibilité avec plusieurs modèles** :
    - `mistral-small`
    - `mistral-medium`
    - `mistral-large`
    - `open-mistral-7b` (modèle open source téléchargeable)
- Des **options de configuration avancées** :
    - température, top-p, nombre maximal de tokens, etc.

### Le service

Nous allons maintenant voir comment mettre en place :

- un exemple de chat classique
- un exemple avec de la mémoire
- un exemple de RAG
- un exemple de streaming
- avoir un output structuré

```java
public ChatService(@Value("${mistral.api.key}") String KEY){
    model = MistralAiChatModel.builder()
            .apiKey(KEY)
            .modelName(MISTRAL_SMALL_LATEST)
            .logRequests(true)
            .logResponses(true)
            .build();

    embeddingModel = MistralAiEmbeddingModel.builder()
            .apiKey(KEY)
            .modelName(MISTRAL_EMBED)
            .logRequests(true)
            .logResponses(true)
            .build();

    streamingChatModel = MistralAiStreamingChatModel.builder()
            .apiKey(KEY)
            .modelName(MISTRAL_SMALL_LATEST)
            .logRequests(true)
            .logResponses(true)
            .build();
}
```

Dans le constructeur de mon service, je créer les différentes instance de modèle que j'utiliserais dans cet article, la clé d'API sera stocké dans un fichier properties et injecté dans le service ([Surtout, ne la commité pas](https://www.sfeir.dev/securite/de-la-bonne-gestion-des-donnees-sensibles-dans-les-depots-git/)).

Voyons plus en détails les différents modèls utilisé ici :

#### MistralAiChatModel

- **Rôle :** modèle principal de génération de texte (conversation, rédaction, résumé).
- **Interface implémentée :** `ChatLanguageModel`.
- **Utilisation typique :** réponses textuelles à un prompt (`model.chat(...)`).
- **Paramètres clés :**`apiKey(KEY)` → clé d’accès à l’API Mistral.`modelName(MISTRAL_SMALL_LATEST)` → choix du modèle.`logRequests(true)` / `logResponses(true)` → activation des logs pour le debug.
- **Modèles disponibles :**
    - `MISTRAL_SMALL_LATEST` → rapide, économique, idéal pour des tests et tâches simples.
    - `MISTRAL_MEDIUM_LATEST` → équilibre entre coût et performance.
    - `MISTRAL_LARGE_LATEST` → plus précis, adapté à des tâches complexes.
    - `OPEN_MISTRAL_7B` → version open source, exécutable localement.

#### MistralAiEmbeddingModel

- **Rôle :** création d’**embeddings** (vecteurs représentant le sens d’un texte).
- **Interface implémentée :** `EmbeddingModel`.
- **Utilisation typique :** recherche sémantique et RAG (_Retrieval-Augmented Generation_).
- **Modèles disponible :**
    
    - `MISTRAL_EMBED` → modèle optimisé pour la génération d’embeddings rapides et cohérents.
    

#### MistralAiStreamingChatModel

- **Rôle :** génération **en flux continu** de texte (réponses token par token).
- **Interface implémentée :** `StreamingChatLanguageModel`.
- **Utilisation typique :** affichage progressif dans une interface utilisateur (chat en direct, console).
- **Avantages :**
    - Meilleure expérience utilisateur (réponses en temps réel).
    - Réduction de la latence perçue.

Passons maintenant aux exemple.

---

### Méthode `chat()` — génération de texte simple

Cette méthode illustre l’utilisation la plus basique du modèle de chat Mistral dans un contexte applicatif.  
Elle génère une réponse textuelle à partir d’un **prompt dynamique**, construit avec des variables.

{% raw %}
```java
public String chat(String subjet, String adjective) {
    PromptTemplate promptTemplate = PromptTemplate
            .from("Raconte moi une blague {{adjective}} sur {{content}}..");
    Map<String, Object> variables = new HashMap<>();
    variables.put("adjective", adjective);
    variables.put("content", subjet);
    Prompt prompt = promptTemplate.apply(variables);

    return model.chat(prompt.text());
}
```
{% endraw %}

#### Fonctionnement étape par étape

1. **Création du template de prompt :**`PromptTemplate.from(...)` définit une phrase modèle contenant des variables dynamiques (`{{adjective}}`, `{{content}}`).
2. **Injection des variables :** Les valeurs réelles (ex. _drôle_, _les développeurs Java_) sont insérées dans le template via une `Map`.
3. **Application du template :**`promptTemplate.apply(variables)` génère un texte complet prêt à être envoyé au modèle.
4. **Appel au modèle de chat :**`model.chat(prompt.text())` envoie le texte final à **Mistral**, qui renvoie une réponse humoristique.
5. **Retour du résultat :** La réponse textuelle est renvoyée sous forme de `String` à la couche supérieure (ex. un contrôleur REST).

#### Exemple de réponse

Pour tester cette méthode je l'ai rattaché à un controller qui lui envoie les paramètre via une requête HTTP [`http://localhost:8080/joke?subject=ordinateur&adjective=drole`](http://localhost:8080/joke?subject=ordinateur&adjective=drole)  
Ce qui me donne la réponse suivante :

```md
Bien sûr ! Voici une blague informatique qui devrait te faire sourire :

**Un ordinateur entre dans un bar...**
Le barman lui dit : *"Désolé, on ne sert pas les ordinateurs ici."*
L'ordinateur répond : *"Mais je suis un *notebook* !"*

*(Blague bonus pour les geeks :)*
**Pourquoi les ordinateurs ont-ils peur du vide ?**
*Parce qu’ils pourraient *crash* !*

Tu en veux une autre ? 😄
```

la blague générée

l'humour étant tout relatif, je ne m'offusquerait pas si vous ne la trouvez pas drôle.

---

### Méthode `memory()` — gestion de la mémoire conversationnelle

Cette méthode illustre l’utilisation d’une **mémoire de conversation** afin de permettre au modèle de conserver le contexte entre plusieurs échanges.

```java
public String memory() {
    var chatMemory = MessageWindowChatMemory.withMaxMessages(5);

    chatMemory.add(userMessage("Bonjour je m'appelle Erwan"));
    AiMessage answer = model.chat(chatMemory.messages()).aiMessage();
    System.out.println(answer.text());
    chatMemory.add(answer);

    chatMemory.add(userMessage("Quel est mon nom ?"));
    AiMessage answerWithName = model.chat(chatMemory.messages()).aiMessage();
    chatMemory.add(answerWithName);
    return answerWithName.text();
}
```

#### Fonctionnement étape par étape

1. **Initialisation de la mémoire :** `MessageWindowChatMemory.withMaxMessages(5)` crée une fenêtre de mémoire contenant les 5 derniers messages échangés.
2. **Ajout du premier message utilisateur :** Le modèle reçoit une première instruction : _Hello, my name is Erwan_.
3. **Réponse du modèle :** `model.chat(...)` renvoie une réponse, ajoutée à la mémoire pour conserver le contexte.
4. **Nouvelle question :** L’utilisateur demande ensuite : _What is my name?_  
    Comme le message précédent est encore dans la mémoire, le modèle peut répondre correctement (_Your name is Erwan_).
5. **Retour de la réponse :**  
    Le texte final est renvoyé, illustrant la persistance du contexte conversationnel.

#### Exemple de réponse

Comme précédemment j'ai branché mon service à un controller pour tester la réponse :

```md
Ton nom est **Erwan** ! 😊

Si tu veux, je peux aussi t'aider à trouver des informations sur l'origine de ton prénom, des idées de surnoms ou d'autres détails. 😉

Tu cherches quelque chose en particulier ?
```

---

### Méthode `ragExample()` — utilisation du RAG (Retrieval-Augmented Generation)

Cette méthode démontre comment utiliser les **embeddings** pour effectuer une recherche sémantique sur un document, avant de générer une réponse contextuelle.

{% raw %}
```java
public String ragExample() throws Exception {
  Document document = loadDocument(
          toPath(),
          new TextDocumentParser()
  );

  DocumentSplitter splitter = DocumentSplitters.recursive(200, 0);
  List<TextSegment> segments = splitter.split(document);

  List<Embedding> embeddings = embeddingModel.embedAll(segments).content();

  EmbeddingStore<TextSegment> embeddingStore = new InMemoryEmbeddingStore<>();
  embeddingStore.addAll(embeddings, segments);

  String question = "Quel est le nom scientifique des axolotl ?";

  Embedding questionEmbedding = embeddingModel.embed(question).content();

  EmbeddingSearchRequest embeddingSearchRequest = EmbeddingSearchRequest.builder()
          .queryEmbedding(questionEmbedding)
          .maxResults(3)
          .minScore(0.7)
          .build();
  List<EmbeddingMatch<TextSegment>> relevantEmbeddings =
          embeddingStore.search(embeddingSearchRequest).matches();

  String information = relevantEmbeddings.stream()
          .map(match -> match.embedded().text())
          .collect(Collectors.joining("\n\n"));

  PromptTemplate promptTemplate = PromptTemplate.from("""
          Voici des informations de contexte :
          ------------------
          {{information}}
          ------------------

          En te basant uniquement sur ces informations et sans connaissances externes,
          réponds à la question suivante :
          {{question}}

          Réponse :
          """);

  Map<String, Object> promptInputs = new HashMap<>();
  promptInputs.put("question", question);
  promptInputs.put("information", information);

  Prompt prompt = promptTemplate.apply(promptInputs);

  // 🔟 Envoi de la requête au modèle de chat
  AiMessage aiMessage = model.chat(prompt.toUserMessage()).aiMessage();
  return aiMessage.text();
}

static Path toPath() {
  try {
      URL fileUrl = ChatService.class.getResource("/" + "example-files/about-axolotl.txt");
      return Paths.get(fileUrl.toURI());
  } catch (URISyntaxException e) {
      throw new RuntimeException(e);
  }
}
```
{% endraw %}

#### Fonctionnement étape par étape

1. **Chargement du document :** Lecture d’un fichier texte (`about-axolotl.txt`) depuis les ressources.
2. **Découpage en segments :** Le document est découpé en blocs de 200 caractères pour faciliter le traitement.
3. **Génération des embeddings :** Chaque segment est transformé en vecteur numérique via `embeddingModel`.
4. **Stockage en mémoire :** Les embeddings sont stockés dans un `InMemoryEmbeddingStore`.
5. **Recherche sémantique :** La question est elle aussi vectorisée, puis comparée à chaque segment via une recherche de proximité.
6. **Génération du prompt contextuel :** Les segments les plus pertinents sont injectés dans un template, servant de base au raisonnement.
7. **Réponse du modèle :** Mistral génère une réponse en se basant **uniquement sur le contenu du document**, sans connaissances externes.

ici le contenu de mon document est le premier paragraphe de wikipedia sur les axolotl.

Si vous ne connaissez pas ces petites bestioles, c'est par ici que ça se passe :

[

À la découverte de l’axolotl : cette créature étonnante capable d’auto-régénérer ses organes

L’axolotl, mascotte de SFEIR, incarne un amphibien mythique venu du Mexique. Capable de régénérer ses membres et de rester éternellement jeune, il fascine autant qu’il inquiète par son statut d’espèce menacée. À la Ferme Tropicale, Karim Daoues me révèle les secrets de cette créature extraordinaire.

![](https://www.sfeir.dev/content/images/icon/plume-point-294.png)sfeir.dev - Le média incontournable pour les passionnés de tech et d'intelligence artificielleCharlotte Ryssen (Coumont)

![](https://www.sfeir.dev/content/images/thumbnail/Capture-d-e-cran-2024-12-18-a--14.37.57.png)

](https://www.sfeir.dev/tendances/a-la-decouverte-de-laxolotl-cette-creature-etonnante-capable-dauto-regenerer-ses-organes/)

#### Exemple de réponse

Voici la réponse fournit par mon modèle après avoir appelé ma méthode :

```md
Le nom scientifique des axolotl est **Ambystoma mexicanum**.
```

---

### Méthode `streaming()` — génération de texte en flux continu

Cette méthode illustre la capacité de Mistral à **streamer** les réponses en temps réel, pour un rendu fluide côté utilisateur.

```java
public String streaming() {
    String userMessage = "Écrit un poème à propos de java et des axolotl faisant 100 mots";

    CompletableFuture<ChatResponse> futureResponse = new CompletableFuture<>();

    streamingChatModel.chat(userMessage, new StreamingChatResponseHandler() {

        @Override
        public void onPartialResponse(String partialResponse) {
            System.out.print(partialResponse);
        }

        @Override
        public void onCompleteResponse(ChatResponse completeResponse) {
            futureResponse.complete(completeResponse);
        }

        @Override
        public void onError(Throwable error) {
            futureResponse.completeExceptionally(error);
        }
    });

    AiMessage response = futureResponse.join().aiMessage();
    return response.text();
}
```

#### Fonctionnement étape par étape

1. **Envoi du message utilisateur :** Le texte à générer est défini sous forme de `String`.
2. **Démarrage du flux :** `streamingChatModel.chat(...)` envoie la requête et ouvre un flux de réponse.
3. **Gestion du flux :**

- `onPartialResponse()` : reçoit les fragments de texte à mesure de leur génération.
- `onCompleteResponse()` : indique la fin de la réponse.
- `onError()` : capture toute erreur éventuelle pendant le streaming.

4. **Récupération de la réponse complète :** Une fois le flux terminé, le texte complet est récupéré via `futureResponse.join()`.

#### Exemple de réponse

```md
**Java et les Axolotls**

Dans l’océan des bits, Java danse,
Un langage robuste, sans entrave.
Les axolotls, doux et sans âge,
Nagent en silence, sages et sages.

Le code s’écoule, fluide et pur,
Comme l’eau qui berce leur murmure.
Java compile, les axolotls rêvent,
Dans un monde où tout est possible.

Les exceptions volent, légères,
Mais les axolotls, patients, guettent.
Leur peau lisse, leur regard profond,
Reflètent l’éternité du code.

Java et les axolotls, unis,
Dans un ballet de logique et de vie.
L’un construit, l’autre renaît,
Dans l’infini des serveurs et des flots.

*(100 mots exactement)*
```

là comme ça on voit pas bien le mode streaming, mais je vous assure que dans la console de mon IDE, c'était bien le cas.

---

### Méthode `structuredOutput()` - produire des sorties structurées

LangChain4j ne se limite pas à la génération de texte libre. Il est également capable de produire des **sorties structurées** conformes à un schéma JSON défini, permettant ainsi de **convertir directement la réponse du modèle en objet Java**.  
C’est une fonctionnalité particulièrement utile pour intégrer des résultats dans une logique métier sans phase d’analyse manuelle.

```java
public record Book(String title, String author, int year, boolean available){
}

public Book structuredOutput() throws JsonProcessingException {
    ResponseFormat responseFormat = ResponseFormat.builder()
            .type(JSON)
            .jsonSchema(JsonSchema.builder()
                    .name("Book")
                    .rootElement(JsonObjectSchema.builder()
                            .addStringProperty("title")
                            .addStringProperty("author")
                            .addIntegerProperty("year")
                            .addBooleanProperty("available")
                            .required("title", "author", "year", "available")
                            .build())
                    .build())
            .build();

    UserMessage userMessage = UserMessage.from("""
    "Les Misérables" est un roman écrit par Victor Hugo en 1862.
    Cet ouvrage monumental est aujourd’hui encore disponible en librairie.
    """);

    ChatRequest chatRequest = ChatRequest.builder()
            .responseFormat(responseFormat)
            .messages(userMessage)
            .build();

    ChatResponse chatResponse = model.chat(chatRequest);

    String output = chatResponse.aiMessage().text();

    return new ObjectMapper().readValue(output, Book.class);

}
```

#### Fonctionnement étape par étape

1. **Définir le format attendu** :

- Le format de sortie est défini comme **JSON**.
- Le schéma JSON décrit les propriétés attendues pour un objet `Book`.
- Le modèle saura ainsi structurer sa réponse selon ce schéma.

2. **Le message d'entrée** :

- Le message fourni contient une description textuelle libre.
- LangChain4j analysera ce texte pour en extraire les éléments correspondant au schéma défini.

3. **Exploitation du résultat** :

- Le modèle renvoie une réponse au format JSON respectant le schéma.
- Cette réponse est ensuite convertie directement en instance Java (`Book`) via Jackson.
- On obtient ainsi un objet parfaitement typé, prêt à être utilisé dans la logique applicative Spring.

#### Exemple de réponse

```json
{
    "title": "Les Misérables",
    "author": "Victor Hugo",
    "year": 1862,
    "available": true
}
```

## Conclusion

L’intégration de **LangChain4j** dans une application **Spring Boot** ouvre la voie à une nouvelle génération d’applications Java, capables d’interagir intelligemment avec des modèles de langage puissants comme **Mistral**, le fleuron de l’IA française 🇫🇷.

L’exemple présenté démontre à quel point la mise en œuvre est fluide : une configuration simple, quelques annotations, et l’on dispose déjà d’une IA conversationnelle, capable de mémoire, de raisonnement contextuel et même de traitement de texte structuré via le RAG.

LangChain4j offre un **pont entre le monde Java traditionnel et l’intelligence artificielle moderne**, sans renier les principes de robustesse, de modularité et de clarté qui font la force de l’écosystème Spring.

Bien que l’outil soit encore jeune, son potentiel est considérable : en s’appuyant sur des modèles ouverts et souverains comme Mistral, il ouvre la voie à une **intégration éthique et maîtrisée de l’IA dans les architectures logicielles d’entreprise**.
