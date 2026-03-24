---
layout: "default"
title: "Maîtrisez les Tests de Charge avec Gatling pour Spring Boot"
permalink: "/springboot/testing/maitrisez-les-tests-de-charge-avec-gatling-pour-spring-boot/"
tags: [back, java, spring-boot, test, performance, gatling, tutoriel, testing]
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/maitrisez-les-tests-de-charge-avec-gatling-pour-spring-boot/"
banner: "https://www.sfeir.dev/content/images/2025/08/20250827_1252_Pixelated-Performance-Race_simple_compose_01k3nje393ekyscaxm2dyvxcdp.png"
published_at: "2025-06-18"
sfeir_slug: "maitrisez-les-tests-de-charge-avec-gatling-pour-spring-boot"
date: "2025-06-18"
---
Dans le développement d’applications web, la performance est un facteur clé pour garantir une expérience utilisateur optimale. Les applications développées avec [Spring Boot](/springboot/il-etait-une-fois-spring-boot/), framework populaire pour sa simplicité et sa robustesse, doivent souvent supporter un volume important de requêtes simultanées. Les tests de performance permettent de simuler ces conditions pour évaluer la capacité de l’application à répondre efficacement en termes de temps de réponse et de fiabilité.

Pour cela, Gatling se positionne comme [un outil open-source](https://www.sfeir.dev/tag/open-source/) puissant et adapté aux tests de charge et de performance. Dans cet article, nous allons explorer comment utiliser Gatling pour [tester une API Spring Boot](/product/pourquoi-tester-son-code/), en nous appuyant sur un exemple concret de simulation de création d’auteurs via une requête `POST`. Cet exemple servira de base pour illustrer chaque étape du processus.

## Présentation de Gatling

Gatling est un outil de test de performance conçu pour simuler des charges importantes sur des applications web. Écrit en Scala, il est néanmoins parfaitement utilisable dans des projets [Java](/back/java/il-etait-une-fois-java/), ce qui le rend idéal pour les développeurs travaillant avec [Spring Boot](https://www.sfeir.dev/back/back-pourquoi-utiliser-spring-boot/).  
Gatling excelle dans la création de scénarios de charge réalistes, en envoyant des requêtes simultanées à une application et en analysant ses performances via des rapports détaillés.

Ses principales caractéristiques incluent :

- Une DSL (**Domain-Specific Language**) intuitive pour définir les scénarios de test.
- La génération automatique de rapports visuels riches en métriques.
- Une intégration fluide avec Maven, facilitant son adoption dans les projets Java.
- Le support de protocoles variés comme **HTTP**, **WebSocket** ou **JMS**.

Gatling est largement reconnu dans la communauté pour sa capacité à simuler des montées en charge progressives et à fournir des données précises sur les performances, ce qui en fait un choix privilégié pour tester les applications Spring Boot.

![](https://www.sfeir.dev/content/images/thumbnail/gatling)

](https://github.com/gatling/gatling?ref=sfeir.dev)

## ⚖️ Avantages et inconvénients de Gatling

### ➕ Avantages

- **Facilité de création des scénarios** : La DSL de Gatling est conçue pour être claire et accessible, même pour les novices.
- **Rapports détaillés** : Les rapports HTML générés automatiquement offrent des graphiques sur les temps de réponse, les requêtes par seconde et les erreurs.
- **Intégration Maven** : Le plugin dédié simplifie l’exécution des tests dans un pipeline CI/CD.
- **Flexibilité multi-protocoles** : Principalement utilisé pour HTTP, Gatling peut également tester d’autres protocoles.

### ➖ Inconvénients

- **Courbe d’apprentissage** : Les débutants peuvent trouver la DSL ou le paradigme Scala intimidants au départ.
- **Focus sur la performance** : Gatling n’est pas conçu pour les tests fonctionnels, contrairement à des outils comme Selenium ou RestAssured.
- **Configuration avancée requise** : Pour des simulations à très grande échelle, une gestion fine des ressources système est nécessaire.

## Mise en place

Pour intégrer Gatling dans un projet Spring Boot, il faut configurer le fichier pom.xml avec les dépendances et plugins nécessaires.

```xml
<dependency>
    <groupId>io.gatling</groupId>
    <artifactId>gatling-app</artifactId>
    <version>3.13.5</version>
</dependency>
<dependency>
    <groupId>io.gatling.highcharts</groupId>
    <artifactId>gatling-charts-highcharts</artifactId>
    <version>3.13.5</version>
</dependency>
<dependency>
    <groupId>io.gatling</groupId>
    <artifactId>gatling-maven-plugin</artifactId>
    <version>4.16.3</version>
</dependency>
```

Les dépendances Gatling

Dépendances Gatling :

- **gatling-app** : Fournit les outils pour exécuter les simulations.
- **gatling-charts-highcharts** : Permet la génération de rapports graphiques.
- **gatling-maven-plugin** : Active l’exécution des tests via la commande `mvn gatling:test` et orchestre l’exécution des simulations.

### Petit plus

[![](https://www.sfeir.dev/content/images/2025/04/image-18-1.png)](https://www.sfeir.dev/content/images/2025/04/image-18-1.png)

Légionnaire romain Petiplus (image générée par IA)

Vous pouvez également ajouter les dépendances suivantes :

```xml
<dependency>
    <groupId>com.github.javafaker</groupId>
    <artifactId>javafaker</artifactId>
    <version>1.0.2</version>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <scope>provided</scope>
</dependency>
```

Les dépendances utiles

- **javafaker** : Génère des données fictives pour les tests.
- **lombok** : Simplifie le code avec [des annotations](/springboot/comprendre-les-annotations-dans-spring-boot-guide-et-exemples/) comme `@Getter` ou `@Slf4j`.

Avec cette configuration, le projet est prêt à exécuter des tests de performance avec Gatling.

## Exemple de simulation

Nous allons définir une classe _AuthorSimulation_ qui va illustrer une simulation Gatling testant la création d’auteurs via une requête POST sur l’endpoint `/authors` d’une API Spring Boot.  
Examinons chaque méthode en détail.

### Configuration du protocole HTTP

La méthode `setupProtocolForSimulation` définit les paramètres globaux des requêtes HTTP :

```java
private static HttpProtocolBuilder setupProtocolForSimulation() {
    return http.baseUrl("http://localhost:8080")
            .acceptHeader("application/json")
            .maxConnectionsPerHost(10)
            .userAgentHeader("Gatling/Performance Test");
}
```

- **baseUrl** : Spécifie l’URL de base de l’API (http://localhost:8080).
- **acceptHeader** : Indique que les réponses attendues sont au format JSON.
- **maxConnectionsPerHost** : Limite à 10 les connexions simultanées par hôte.
- **userAgentHeader** : Identifie le client comme étant Gatling.

### Génération des données de test

La méthode `setupTestFeedData` utilise **JavaFaker** pour produire des données dynamiques :

```java
private static Iterator<Map<String, Object>> setupTestFeedData() {
    Faker faker = new Faker();
    Iterator<Map<String, Object>> iterator;
    iterator = Stream.generate(() -> {
                Map<String, Object> stringObjectMap = new HashMap<>();
                stringObjectMap.put("name", faker.name()
                        .fullName());
                stringObjectMap.put("bio", faker.lorem().sentence(15));
                return stringObjectMap;
            })
            .iterator();
    return iterator;
}
```

- Un Iterator génère des paires **name** (nom complet) et **bio** (phrase de 15 mots) à la demande.
- Ces données alimenteront les requêtes pendant la simulation.

### Définition du scénario

La méthode `buildPostScenario` décrit le scénario de test :

```java
private static ScenarioBuilder buildPostScenario() {
    return CoreDsl.scenario("Load Test Creating Author")
            .feed(FEED_DATA)
            .exec(session -> {
                String name = session.getString("name");
                String bio = session.getString("bio");
                String jsonBody = """
                                    {
                                        "name": "%s",
                                        "bio": "%s"
                                    }
                                    """.formatted(name, bio);
                return session.set("jsonBody", jsonBody);
            })
            .exec(http("create-author-request").post("/authors")
                    .header("Content-Type", "application/json")
                    .body(StringBody(session -> session.getString("jsonBody")))
                    .check(status().is(200)));
}
```

- **scenario** : Nomme le scénario ("Load Test Creating Author").
- **feed(FEED_DATA)** : Injecte les données générées dans la session de chaque utilisateur virtuel.
- **exec(session -> ...)** : Construit le corps JSON avec les valeurs name et bio.
- **http("create-author-request")** : Envoie une requête POST à `/authors`, avec un corps JSON et une vérification que le statut de réponse est `200`.

### Injection d’utilisateurs

La méthode `postEndpointInjectionProfile` configure la montée en charge :

```java
private RampRateOpenInjectionStep postEndpointInjectionProfile() {
    int totalDesiredUserCount = 50;
    double userRampUpPerInterval = 10;
    double rampUpIntervalSeconds = 20;
    int totalRampUptimeSeconds = 20;
    int steadyStateDurationSeconds = 60;
    return rampUsersPerSec(userRampUpPerInterval / (rampUpIntervalSeconds / 60)).to(totalDesiredUserCount)
            .during(Duration.ofSeconds(totalRampUptimeSeconds + steadyStateDurationSeconds));
}
```

- **Montée progressive** : Ajoute des utilisateurs à un rythme de 10 toutes les 20 secondes, jusqu’à atteindre 50 utilisateurs.
- **Phase stable** : Maintient 50 utilisateurs pendant 60 secondes.
- Cela simule une charge croissante suivie d’une période constante.

### Assertions

Les assertions, définies dans le constructeur, valident les performances :

```java
public AuthorSimulation() {
    setUp(POST_SCENARIO_BUILDER.injectOpen(postEndpointInjectionProfile())
            .protocols(HTTP_PROTOCOL_BUILDER)).assertions(global().responseTime()
            .max()
            .lte(10000), global().successfulRequests()
            .percent()
            .gt(90d));
}
```

- **responseTime().max().lte(10000)** : Le temps de réponse maximal doit être ≤ 10 secondes.
- **successfulRequests().percent().gt(90d)** : Plus de 90 % des requêtes doivent réussir.

### Le rapport de test généré

Une fois la simulation terminée, Gatling produit un rapport HTML contenant :

- Des graphiques sur les temps de réponse (moyenne, maximum, percentiles).
- Le nombre de requêtes par seconde.
- La répartition des codes de statut (succès, échecs).
- Des statistiques détaillées par scénario et globalement.

Ce rapport permet d’identifier les goulets d’étranglement, de valider les assertions et d’évaluer si l’application répond aux exigences de performance. Il est généré automatiquement dans le dossier `target/gatling` après l’exécution via `mvn gatling:test`.

[![](https://www.sfeir.dev/content/images/2025/04/image-19.png)](https://www.sfeir.dev/content/images/2025/04/image-19.png)

## Conclusion

**Gatling** est un outil incontournable pour tester les performances des applications Spring Boot. Avec sa DSL intuitive, son intégration Maven et ses rapports détaillés, il permet de simuler des charges réalistes et d’analyser les résultats efficacement.

En intégrant les tests de performance dans leur workflow, les développeurs peuvent s’assurer que leurs applications restent robustes et rapides, même sous forte charge.
