---
layout: "default"
title: "Et si vos prochaines migrations étaient simples ?"
permalink: "/back/java/spring-boot/et-si-vos-prochaines-migrations-etaient-simples/"
tags: [back, java, spring-boot]
date: "2026-03-04"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/et-si-vos-prochaines-migrations-etaient-simples/"
banner: "https://www.sfeir.dev/content/images/size/w1304/2026/01/task_01kebnst2kedyt4sf0z1kw9n1j_1767771046_img_1.webp"
published_at: "2026-03-04"
sfeir_slug: "et-si-vos-prochaines-migrations-etaient-simples"
sfeir_tags: ""
---
La migration technique, c’est l’art de quitter le confort douillet de Java 11 pour partir à la chasse aux [Virtual Threads de Java 21](https://www.sfeir.dev/back/quoi-de-neuf-dans-lapi-java-21/), en trébuchant sur chaque `record` de Java 17, tout en sachant pertinemment que [[Java 25 - quelles sont les nouveautés ?|Java 25 sera sorti]] avant que tu aies terminé.

C’est une épopée où [[Il était une fois... Spring Boot|Spring Boot]] t’explique soudainement que tes imports `javax` sont devenus indésirables, presque honteux. [[JUnit 6 - le successeur de JUnit 5 est là !|Mais la palme du sadisme revient à JUnit]] : passer de la v4 à la v5 ne sert qu’à te rappeler ta condition. Tu perds tes `@Rules`, tu renommes `@Before` en `@BeforeEach`, et tu finis par activer le moteur Vintage en pleurant, admettant ainsi que ton code — comme toi — refuse fondamentalement de grandir.

Et si tout cela appartenait au passé ?  
Et si les futures migrations techniques étaient simples, répétables et surtout… prévisibles ?

## Et si on arrêtait d’improviser les migrations ?

Depuis des années, les migrations techniques sont traitées comme des événements exceptionnels. On les prépare tard, on les exécute vite, et on espère ne pas avoir à y revenir avant longtemps. Chaque montée de version devient alors une expédition risquée, dépendante de la mémoire collective de l’équipe et de quelques développeurs qui “savent encore comment ça marchait avant”.

Le problème n’est pas la migration elle-même.  
Le problème, c’est qu’elle n’est ni outillée ni capitalisée.

À chaque fois, on recommence :

- Les mêmes recherches,
- Les mêmes remplacements,
- Les mêmes ajustements subtils que seul le compilateur finit par révéler.

Et surtout, une fois la migration terminée, tout ce savoir disparaît avec la branche [[Les commandes git essentielles démystifiées|Git]].

## OpenRewrite : transformer la migration en savoir-faire

OpenRewrite propose une approche radicalement différente : considérer la migration non plus comme un projet ponctuel, mais comme un **ensemble de transformations formalisées**, versionnées et rejouables.

C’est un point important : **OpenRewrite est un outil open source**, distribué sous licence **Apache 2.0**.  
Le moteur, les recettes existantes et les API d’extension sont accessibles publiquement. Cela signifie que les règles de migration ne sont pas une boîte noire : elles peuvent être lues, comprises, adaptées et enrichies pour répondre aux besoins réels d’un projet.

[

OpenRewrite

Semantic code search and transformation. OpenRewrite has 73 repositories available. Follow their code on GitHub.

![](https://www.sfeir.dev/content/images/icon/pinned-octocat-093da3e6fa40-147.svg)GitHub

![](https://www.sfeir.dev/content/images/thumbnail/61478321)

](https://github.com/openrewrite?ref=sfeir.dev)

le repository OpenRewrite

Ici, on ne parle pas de simples scripts ou de `search & replace`. OpenRewrite travaille au niveau **sémantique** :

- Il comprend le code Java,
- Il applique des règles conscientes du langage, des frameworks et de leurs évolutions.

Une migration devient alors :

- **Prévisible**, car les transformations sont explicites ;
- **Répétable**, puisqu’une recette peut être rejouée à l’identique ;
- **Capitalisable**, le code de migration devenant lui-même un artefact du projet, conservé au même titre que le reste du code source.

## Préparer aujourd’hui les migrations de demain

Dans la suite de cet article, nous allons voir comment cette approche s’applique concrètement à des évolutions majeures :

- Passage de **Spring Boot 3 à 4**,
- Montée de **Java 21 à Java 25**,
- Évolution de **JUnit 5 vers JUnit 6**.

L’objectif n’est pas seulement de faire passer un build au vert, mais de montrer comment ces migrations peuvent être **préparées, automatisées et transmises**, afin que les prochaines évolutions ne soient plus une rupture, mais la continuité naturelle d’un projet vivant.

Mais avant toute chose...

## Comment fonctionne OpenRewrite ?

OpenRewrite n’est pas un générateur de code ni un outil de migration “magique”. C’est un **moteur de transformation du code source**, conçu pour appliquer des changements **structurés, sûrs et reproductibles**.

Son fonctionnement repose sur un principe simple :

> On ne modifie pas du texte, on transforme une structure.

### Analyse du code

Lorsqu’OpenRewrite est lancé, il commence par :

- Parser le code source,
- Construire un **AST (Abstract Syntax Tree)**,
- Enrichir cet arbre avec des informations de types, d’imports, de dépendances.

À ce stade, le code n’est pas encore modifié. OpenRewrite cherche d’abord à **comprendre** ce que fait réellement l’application.

### Les recipes : le cœur du système

Une **recipe** (recette) est une description formelle d’un changement à appliquer au code.

Elle répond toujours à la même question :

> Si je rencontre telle structure dans le code, que dois-je en faire ?

Une recipe peut :

- Remplacer un import,
- Renommer une classe ou une méthode,
- Modifier une annotation,
- Réécrire un test,
- Ou orchestrer plusieurs transformations plus petites.

Il existe deux grandes catégories :

#### Recipes atomiques

Des transformations simples et ciblées :

- Remplacer `@Before` par `@BeforeEach`,
- Migrer un package `javax` vers `jakarta`,
- Adapter une signature de méthode.

#### Recipes composites

Des recettes plus haut niveau, qui enchaînent plusieurs transformations :

- Migration complète de Spring Boot 3 vers 4,
- Montée de version Java,
- Évolution majeure d’un framework de test.

Ces recipes composites sont souvent celles que l’on utilise directement dans un projet.

### Une recipe est du code, pas de la configuration magique

C’est un point fondamental : une recipe est **elle-même du code**.

Elle peut être :

- Fournie par OpenRewrite,
- Écrite par la communauté,
- Ou développée en interne pour un projet spécifique.

Cela permet :

- De versionner les migrations avec le reste du projet,
- De les tester,
- De les rejouer autant de fois que nécessaire,
- Et surtout de les faire évoluer dans le temps.

La migration cesse d’être un événement ponctuel ; elle devient un **actif technique**.

### L’exécution : appliquer sans casser

Lors de l’exécution :

- OpenRewrite parcourt l’AST,
- Applique les recipes configurées,
- Régénère le code source modifié.

Le formatage est conservé autant que possible, et les transformations restent **localisées et explicites**.  
Rien n’est appliqué “en aveugle”.

Et maintenant en piste pour l'exemple.

## Exemple

Pour les besoins de cet exemple, j'ai créé un petit projet trouvable ici :

[

GitHub - ErwanLT/openrewrite-demo

Contribute to ErwanLT/openrewrite-demo development by creating an account on GitHub.

![](https://www.sfeir.dev/content/images/icon/pinned-octocat-093da3e6fa40-148.svg)GitHubErwanLT

![](https://www.sfeir.dev/content/images/thumbnail/openrewrite-demo)

](https://github.com/ErwanLT/openrewrite-demo?ref=sfeir.dev)

Dans ce projet, j'ai une application avec les critères suivants :

- Springboot 3.5.9
- Java 21
- Des tests en JUnit 5 et même certains encore en JUnit 4
- Des méthodes et [[Comprendre les annotations dans Spring Boot - guide et exemples|annotations]] marquées comme deprecated

Bref, un terrain de jeu idéal pour démontrer l'utilité de l'outil.

### Installation d’OpenRewrite

L’intégration d’OpenRewrite dans un projet Spring Boot se fait de manière classique, via le **plugin Maven officiel**. Aucun outil externe, aucun script exotique : OpenRewrite s’insère là où les équipes Java ont l’habitude de travailler, au cœur du build.

L’installation consiste à déclarer le plugin `rewrite-maven-plugin`, puis à lui indiquer explicitement quelles **recipes** doivent être appliquées. Cette configuration rend les migrations visibles, assumées et versionnées avec le reste du projet.

```xml
<plugin>
    <groupId>org.openrewrite.maven</groupId>
    <artifactId>rewrite-maven-plugin</artifactId>
    <version>6.26.0</version>
    <configuration>
        <exportDatatables>true</exportDatatables>
        <activeRecipes>
            <recipe>org.openrewrite.java.spring.boot4.UpgradeSpringBoot_4_0</recipe>
            <recipe>org.openrewrite.java.migrate.UpgradeToJava25</recipe>
            <recipe>org.openrewrite.java.testing.junit6.JUnit5to6Migration</recipe>
        </activeRecipes>
    </configuration>
    <dependencies>
        <dependency>
            <groupId>org.openrewrite.recipe</groupId>
            <artifactId>rewrite-spring</artifactId>
            <version>6.21.0</version>
        </dependency>
        <dependency>
            <groupId>org.openrewrite.recipe</groupId>
            <artifactId>rewrite-migrate-java</artifactId>
            <version>3.24.0</version>
        </dependency>
        <dependency>
            <groupId>org.openrewrite.recipe</groupId>
            <artifactId>rewrite-testing-frameworks</artifactId>
            <version>3.24.0</version>
        </dependency>
    </dependencies>
</plugin>
```

exemple d'utilisation du plugin

D’abord, les **recipes actives** sont déclarées explicitement. Ici, la migration n’est pas limitée à un seul axe, mais couvre l’ensemble du socle technique :

- Spring Boot 3 vers 4,
- Java 21 vers Java 25,
- JUnit 5 vers JUnit 6.

Ensuite, les recipes ne sont pas intégrées par défaut : elles sont apportées via des **dépendances dédiées**, chacune correspondant à un domaine précis (Spring, Java, frameworks de test). Cette séparation rend l’intention claire et évite les migrations implicites ou accidentelles.

Enfin, cette configuration est **pérenne**. Elle peut être rejouée sur une autre branche, sur un autre projet, ou dans un pipeline d’intégration continue. La migration n’est plus un événement exceptionnel : elle devient une capacité intégrée du projet.

Une fois ce socle en place, il ne reste plus qu’à exécuter OpenRewrite pour observer, concrètement, comment ces recipes transforment le code. C’est ce que nous allons voir dans la suite avec un exemple réel de migration.

### Découvrir les recipes disponibles : `discover`

Avant même d’appliquer la moindre transformation, OpenRewrite permet d’explorer ce qui est à sa disposition. La commande `discover` a précisément ce rôle : **lister les recipes applicables au projet courant**.

Elle analyse le code, les dépendances et la configuration du build afin de proposer les recipes pertinentes, qu’elles soient liées à la version de Java, à Spring Boot ou aux frameworks de test présents.

Un point essentiel à comprendre est que ces recipes sont souvent **composites**. Une migration de haut niveau peut embarquer de nombreuses sous-recettes. Si certaines d’entre elles se retrouvent déclarées plusieurs fois — directement ou indirectement — **OpenRewrite ne les appliquera qu’une seule fois**. Le moteur se charge de dédupliquer les transformations afin d’éviter toute redondance ou tout effet de bord.

Cette étape est souvent sous-estimée, mais elle joue un rôle essentiel :

- Elle permet de comprendre l’étendue réelle des migrations possibles,
- Elle évite d’activer des recipes inadaptées ou inutiles,
- Elle donne une vision claire et structurée des évolutions supportées par l’écosystème OpenRewrite.

On ne part pas à l’aveugle : on observe le terrain avant d’avancer.

```log
[INFO] --- rewrite:6.26.0:discover (default-cli) @ openrewrite-demo ---
[INFO] Available Recipes:
[INFO]     com.google.guava.InlineGuavaMethods
[INFO]     org.apache.logging.log4j.InlineLog4jApiMethods
[INFO]     org.openrewrite.AddToGitignore
[INFO]     org.openrewrite.analysis.controlflow.ControlFlowVisualization
[INFO]     org.openrewrite.analysis.search.FindFlowBetweenMethods
...
[INFO] Available Styles:
[INFO]     com.netflix.eureka.Style
[INFO]     com.netflix.genie.Style
[INFO]     org.openrewrite.java.GoogleJavaFormat
[INFO]     org.openrewrite.java.IntelliJ
[INFO]     org.openrewrite.java.SpringFormat
[INFO]     org.openrewrite.kotlin.IntelliJ
[INFO] 
[INFO] Active Styles:
[INFO] 
[INFO] Active Recipes:
[INFO]     org.openrewrite.java.migrate.UpgradeToJava25
[INFO]     org.openrewrite.java.spring.boot4.UpgradeSpringBoot_4_0
[INFO]     org.openrewrite.java.testing.junit6.JUnit5to6Migration
[INFO] 
[INFO] Found 2860 available recipes and 6 available styles.
[INFO] Configured with 3 active recipes and 0 active styles.
```

exemple de sortie console pour discover

### Simuler sans modifier : `dryRun`

Une fois les recipes choisies, la tentation est grande de les exécuter immédiatement. Pourtant, OpenRewrite propose une étape intermédiaire précieuse : le `dryRun`.

Cette commande applique les recipes **sans modifier le code source**. Elle permet de visualiser précisément :

- Quels fichiers seraient impactés,
- Quelles transformations seraient appliquées,
- Et dans quelle mesure le code évoluerait.

Concrètement, OpenRewrite génère des **fichiers de diff** dans le répertoire `target`. Ces fichiers contiennent, pour chaque ressource concernée, une représentation claire des changements à venir. On peut ainsi parcourir les modifications comme on le ferait lors d’une revue de code, sans avoir encore touché au projet.

C’est un garde-fou fondamental. Il permet de :

- Valider l’intention des recipes,
- Rassurer l’équipe sur l’ampleur réelle de la migration,
- Discuter et ajuster les choix avant toute modification effective.

Le `dryRun` transforme ainsi la migration en **sujet de réflexion et de revue**, plutôt qu’en opération irréversible exécutée à l’aveugle.

```log
[INFO] Using active recipe(s) [org.openrewrite.java.spring.boot4.UpgradeSpringBoot_4_0, org.openrewrite.java.migrate.UpgradeToJava25, org.openrewrite.java.testing.junit6.JUnit5to6Migration]
[INFO] Using active styles(s) []
[INFO] Validating active recipes...
[INFO] Project [openrewrite-demo] Resolving Poms...
[INFO] Project [openrewrite-demo] Parsing source files
[INFO] Running recipe(s)...
[INFO] Printing available datatables to: target/rewrite/datatables/2026-01-08_08-39-02-848
[WARNING] These recipes would make changes to pom.xml:
[WARNING]     org.openrewrite.java.spring.boot4.UpgradeSpringBoot_4_0
[WARNING]         org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_5
[WARNING]             org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_4
[WARNING]                 org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_3
[WARNING]                     org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_2
[WARNING]                         org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_1
[WARNING]                             org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_0
[WARNING]                                 org.openrewrite.java.spring.boot2.UpgradeSpringBoot_2_7
[WARNING]                                     org.openrewrite.java.spring.boot2.UpgradeSpringBoot_2_6
[WARNING]                                         org.openrewrite.java.spring.boot2.UpgradeSpringBoot_2_5
[WARNING]                                             org.openrewrite.java.spring.boot2.UpgradeSpringBoot_2_4
[WARNING]                                                 org.openrewrite.java.spring.boot2.SpringBoot2JUnit4to5Migration
[WARNING]                                                     org.openrewrite.java.testing.junit5.JUnit4to5Migration
[WARNING]                                                         org.openrewrite.java.dependencies.RemoveDependency: {groupId=junit, artifactId=junit}
[WARNING]                                                         org.openrewrite.java.testing.junit5.ExcludeJUnit4UnlessUsingTestcontainers
[WARNING]                                                             org.openrewrite.maven.ExcludeDependency
[WARNING]                                                         org.openrewrite.java.dependencies.RemoveDependency: {groupId=org.junit.vintage, artifactId=junit-vintage-engine}
[WARNING]                 org.openrewrite.java.dependencies.UpgradeDependencyVersion: {groupId=org.springdoc, artifactId=*, newVersion=2.8.x}
[WARNING]         org.openrewrite.java.spring.boot4.MigrateToModularStarters
[WARNING]             org.openrewrite.java.dependencies.AddDependency: {groupId=org.springframework.boot, artifactId=spring-boot-starter-webmvc-test, version=4.0.x, onlyIfUsing=org.springframework.boot.test.autoconfigure.web.servlet.*}
[WARNING]         org.openrewrite.maven.UpgradeParentVersion: {groupId=org.springframework.boot, artifactId=spring-boot-starter-parent, newVersion=4.0.x}
[WARNING]         org.openrewrite.java.dependencies.ChangeDependency: {oldGroupId=org.springframework.boot, oldArtifactId=spring-boot-starter-web, newArtifactId=spring-boot-starter-webmvc}
[WARNING]         org.openrewrite.java.migrate.UpgradeToJava25
[WARNING]             org.openrewrite.java.migrate.UpgradeJavaVersion: {version=25}
[WARNING]                 org.openrewrite.maven.UpdateMavenProjectPropertyJavaVersion: {version=25}
[WARNING] These recipes would make changes to src/main/java/fr/eletutour/openrewritedemo/exception/ResourceNotFoundException.java:
[WARNING]     org.openrewrite.java.spring.boot4.UpgradeSpringBoot_4_0
[WARNING]         org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_5
[WARNING]             org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_4
[WARNING]                 org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_3
[WARNING]                     org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_2
[WARNING]                         org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_1
[WARNING]                             org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_0
[WARNING]                                 org.openrewrite.java.migrate.UpgradeToJava17
[WARNING]                                     org.openrewrite.java.migrate.lang.StringFormatted: {addParentheses=false}
[WARNING]         org.openrewrite.java.migrate.UpgradeToJava25
[WARNING]             org.openrewrite.java.migrate.UpgradeJavaVersion: {version=25}
[WARNING] These recipes would make changes to src/test/java/fr/eletutour/openrewritedemo/controller/LegacyControllerTest.java:
[WARNING]     org.openrewrite.java.spring.boot4.UpgradeSpringBoot_4_0
[WARNING]         org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_5
[WARNING]             org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_4
[WARNING]                 org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_3
[WARNING]                     org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_2
[WARNING]                         org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_1
[WARNING]                             org.openrewrite.java.spring.boot3.UpgradeSpringBoot_3_0
[WARNING]                                 org.openrewrite.java.spring.boot2.UpgradeSpringBoot_2_7
[WARNING]                                     org.openrewrite.java.spring.boot2.UpgradeSpringBoot_2_6
[WARNING]                                         org.openrewrite.java.spring.boot2.UpgradeSpringBoot_2_5
[WARNING]                                             org.openrewrite.java.spring.boot2.UpgradeSpringBoot_2_4
[WARNING]                                                 org.openrewrite.java.spring.boot2.SpringBoot2JUnit4to5Migration
[WARNING]                                                     org.openrewrite.java.testing.junit5.JUnit4to5Migration
[WARNING]                                                         org.openrewrite.java.testing.junit5.UpdateTestAnnotation
[WARNING]                                                     org.openrewrite.java.spring.boot2.UnnecessarySpringRunWith
[WARNING]                                                         org.openrewrite.java.testing.junit5.RunnerToExtension: {runners=[org.springframework.test.context.junit4.SpringRunner, org.springframework.test.context.junit4.SpringJUnit4ClassRunner], extension=org.springframework.test.context.junit.jupiter.SpringExtension}
[WARNING]                                                     org.openrewrite.java.spring.boot2.UnnecessarySpringExtension
[WARNING]         org.openrewrite.java.spring.boot4.ReplaceMockBeanAndSpyBean
[WARNING]             org.openrewrite.java.ChangeType: {oldFullyQualifiedTypeName=org.springframework.boot.test.mock.mockito.MockBean, newFullyQualifiedTypeName=org.springframework.test.context.bean.override.mockito.MockitoBean}
[WARNING]         org.openrewrite.java.spring.boot4.MigrateToModularStarters
[WARNING]             org.openrewrite.java.spring.boot4.MigrateAutoconfigurePackages
[WARNING]                 org.openrewrite.java.ChangePackage: {oldPackageName=org.springframework.boot.test.autoconfigure.web.servlet, newPackageName=org.springframework.boot.webmvc.test.autoconfigure, recursive=true}
[WARNING]         org.openrewrite.java.migrate.UpgradeToJava25
[WARNING]             org.openrewrite.java.migrate.UpgradeJavaVersion: {version=25}
[WARNING] These recipes would make changes to src/test/java/fr/eletutour/openrewritedemo/controller/ArticleControllerTest.java:
[WARNING]     org.openrewrite.java.spring.boot4.UpgradeSpringBoot_4_0
[WARNING]         org.openrewrite.java.spring.framework.UpgradeSpringFramework_7_0
[WARNING]             org.openrewrite.java.jackson.UpgradeJackson_2_3
[WARNING]                 org.openrewrite.java.jackson.UpgradeJackson_2_3_PackageChanges
[WARNING]                     org.openrewrite.java.ChangePackage: {oldPackageName=com.fasterxml.jackson.databind, newPackageName=tools.jackson.databind, recursive=true}
[WARNING]         org.openrewrite.java.spring.boot4.ReplaceMockBeanAndSpyBean
[WARNING]             org.openrewrite.java.ChangeType: {oldFullyQualifiedTypeName=org.springframework.boot.test.mock.mockito.MockBean, newFullyQualifiedTypeName=org.springframework.test.context.bean.override.mockito.MockitoBean}
[WARNING]         org.openrewrite.java.spring.boot4.MigrateToModularStarters
[WARNING]             org.openrewrite.java.spring.boot4.MigrateAutoconfigurePackages
[WARNING]                 org.openrewrite.java.ChangePackage: {oldPackageName=org.springframework.boot.test.autoconfigure.web.servlet, newPackageName=org.springframework.boot.webmvc.test.autoconfigure, recursive=true}
[WARNING]         org.openrewrite.java.migrate.UpgradeToJava25
[WARNING]             org.openrewrite.java.migrate.UpgradeJavaVersion: {version=25}
[WARNING] These recipes would make changes to src/test/java/fr/eletutour/openrewritedemo/controller/AuthorControllerTest.java:
[WARNING]     org.openrewrite.java.spring.boot4.UpgradeSpringBoot_4_0
[WARNING]         org.openrewrite.java.spring.framework.UpgradeSpringFramework_7_0
[WARNING]             org.openrewrite.java.jackson.UpgradeJackson_2_3
[WARNING]                 org.openrewrite.java.jackson.UpgradeJackson_2_3_PackageChanges
[WARNING]                     org.openrewrite.java.ChangePackage: {oldPackageName=com.fasterxml.jackson.databind, newPackageName=tools.jackson.databind, recursive=true}
[WARNING]         org.openrewrite.java.spring.boot4.ReplaceMockBeanAndSpyBean
[WARNING]             org.openrewrite.java.ChangeType: {oldFullyQualifiedTypeName=org.springframework.boot.test.mock.mockito.MockBean, newFullyQualifiedTypeName=org.springframework.test.context.bean.override.mockito.MockitoBean}
[WARNING]         org.openrewrite.java.spring.boot4.MigrateToModularStarters
[WARNING]             org.openrewrite.java.spring.boot4.MigrateAutoconfigurePackages
[WARNING]                 org.openrewrite.java.ChangePackage: {oldPackageName=org.springframework.boot.test.autoconfigure.web.servlet, newPackageName=org.springframework.boot.webmvc.test.autoconfigure, recursive=true}
[WARNING]         org.openrewrite.java.migrate.UpgradeToJava25
[WARNING]             org.openrewrite.java.migrate.UpgradeJavaVersion: {version=25}
[WARNING] Patch file available:
[WARNING]     /Users/erwanletutour/IdeaProjects/openrewrite-demo/target/rewrite/rewrite.patch
[WARNING] Estimate time saved: 21m
```

sortie console de la méthode dryRun

### Appliquer les transformations : `run`

La commande `run` est l’aboutissement du processus. Elle applique réellement les recipes configurées et modifie le code source.

À ce stade, rien n’est improvisé :

- Les recipes ont été identifiées,
- Leur impact a été évalué,
- Leur exécution est volontaire et assumée.

OpenRewrite parcourt alors l’AST, applique les transformations prévues et régénère le code de manière cohérente. Les modifications sont locales, explicites, et immédiatement visibles dans le contrôle de version.

Une migration exécutée avec `run` n’est pas une boîte noire : chaque changement peut être relu, compris et validé. Le commit qui en résulte raconte une histoire claire — celle d’une évolution maîtrisée.

[![](https://www.sfeir.dev/content/images/2026/01/image.png)](https://www.sfeir.dev/content/images/2026/01/image.png)

Résultat de la commande run dans la fenêtre de commit

## Conclusion

Les migrations techniques ont longtemps été vécues comme des passages obligés, coûteux et anxiogènes. On les repoussait autant que possible, en espérant que le temps finirait par arranger les choses. En réalité, il ne faisait que rendre la marche plus haute.

OpenRewrite ne supprime pas la nécessité de faire évoluer un projet, mais il change profondément la manière de l’aborder. En transformant les migrations en recipes explicites, versionnées et rejouables, il remet de la méthode là où il n’y avait souvent que de l’urgence.

L’intérêt n’est pas seulement de réussir une montée de version, qu’il s’agisse de Spring Boot, de Java ou de JUnit, mais de **préparer les suivantes**. Le code de migration devient un héritage technique, transmis avec le projet, au même titre que les choix d’architecture ou les conventions de nommage.
