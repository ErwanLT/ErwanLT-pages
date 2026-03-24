---
layout: "default"
title: "JUnit 6 - le successeur de JUnit 5 est là !"
permalink: "/back/java/junit-6-le-successeur-de-junit-5-est-la/"
tags: [back, java]
date: "2025-11-21"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/junit-6-le-successeur-de-junit-5-est-la/"
banner: "https://www.sfeir.dev/content/images/2025/10/junit6-temporary-logo.png"
published_at: "2025-11-21"
sfeir_slug: "junit-6-le-successeur-de-junit-5-est-la"
sfeir_tags: [Back, Java, Test]
---
Après **plus de sept ans de bons et loyaux services**, **JUnit 5** cède sa place à son successeur : **JUnit 6**, sorti officiellement le **30 septembre 2025**.  
Une nouvelle ère s’ouvre pour le framework de test le plus utilisé dans l’écosystème [[Il était une fois... Java|Java]], mais cette fois-ci, l’histoire ne se répète pas tout à fait.

## Une transition apaisée

Souvenons-nous : lors du passage de **JUnit 4 à JUnit 5**, nombreux furent les projets à devoir revoir [[Pourquoi tester son code ?|leurs tests]] de fond en comble — une véritable mue, parfois laborieuse, entre _runners_, [[Comprendre les annotations dans Spring Boot - guide et exemples|annotations]] et dépendances éclatées.  
Mais cette fois, la transition s’annonce bien plus paisible : **pas de révolution syntaxique**, **pas de rupture conceptuelle**, simplement une **évolution naturelle**, tournée vers la modernité, la performance et la cohérence.

JUnit 6 reste fondé sur **le modèle Jupiter** introduit avec JUnit 5, mais consolide l’ensemble de la plateforme avec un **numéro de version unifié** pour _Platform_, _Jupiter_ et _Vintage_.  
Cette unification symbolise une maturité : le framework a trouvé sa forme, et JUnit 6 en consolide les bases.

## Les grands axes de cette nouvelle version

### Une base modernisée

JUnit 6 pose de nouvelles exigences minimales :

- **Java 17** devient la base technique ;
- [**Kotlin**](https://www.sfeir.dev/back/kotlin-pourquoi-les-developpeurs-java-devraient-franchir-le-pas-des-aujourdhui/) **2.1+** est désormais pleinement supporté, avec des tests capables d’utiliser des **fonctions suspendues**.

Un choix qui peut surprendre à première vue, alors que [**Java 21**](https://www.sfeir.dev/back/quoi-de-neuf-dans-lapi-java-21/) est déjà devenu la norme dans de nombreux projets.  
Mais il s’agit là d’un **choix réfléchi plutôt que conservateur**. En s’appuyant sur Java 17, JUnit 6 garantit une **compatibilité maximale** avec les infrastructures d’entreprise, souvent encore figées sur ce LTS — qu’il s’agisse de serveurs CI/CD, de versions Maven/Gradle ou de plateformes d’intégration.

Ce socle assure donc :

- la **disparition définitive** des anciennes API Java 8 à 16,
- une **stabilité industrielle éprouvée**,
- et une compatibilité naturelle avec **Java 21**, pour ceux qui ont déjà franchi le pas.

En d’autres termes, JUnit 6 préfère la **stabilité maîtrisée** à la course vers la nouveauté : il prépare le terrain sereinement, avant qu’un futur **JUnit 7** n’entérine définitivement Java 21 comme nouvelle base (ou qui sait, peut être [[Java 25 - quelles sont les nouveautés ?|Java 25]] – oui on peut rêver).

### Une plateforme unifiée et simplifiée

Historiquement, JUnit 5 était scindé en plusieurs artefacts : _Platform_, _Jupiter_ et _Vintage_, chacun avec sa propre version.  
Désormais, **tout le monde partage le même numéro** : une simplification bienvenue.

Les modules **`junit-platform-runner`** (hérité de JUnit 4) et **`junit-platform-jfr`** (pour l’intégration avec Java Flight Recorder) ont été **supprimés**.  
Leur contenu est intégré directement dans **`junit-platform-launcher`**, ce qui allège la configuration Maven ou Gradle :

```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>6.0.0</version>
    <scope>test</scope>
</dependency>
```

dépendance maven de JUnit 6

Plus besoin de jongler avec les versions : un seul numéro, une seule cohérence.

### Des tests mieux ordonnés et plus prédictibles

Dans JUnit 5, lorsque l’on utilisait `@Nested`, l’ordre d’exécution des tests internes n’héritait **pas** de celui défini dans la classe externe.  
Cela pouvait mener à des ordres inattendus, surtout avec `@Order`.

JUnit 6 corrige cela : l’ordre défini au niveau de la classe principale s’applique désormais à **toutes les classes imbriquées**, sauf si elles redéfinissent leur propre ordre localement.

#### Exemple avant (JUnit 5)

```java
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class CalculatorTests {

    @Order(1)
    @Test
    void shouldAddTwoNumbers() {
        System.out.println("1️⃣ Test addition");
    }

    @Order(2)
    @Test
    void shouldSubtractTwoNumbers() {
        System.out.println("2️⃣ Test soustraction");
    }

    @Nested
    class AdvancedOperationsTests {

        @Test
        void shouldMultiplyTwoNumbers() {
            System.out.println("🔹 Test multiplication (nested)");
        }

        @Test
        void shouldDivideTwoNumbers() {
            System.out.println("🔹 Test division (nested)");
        }
    }
}
```

Ce qui pouvait donner en sortie console :

```text
1️⃣ Test addition
2️⃣ Test soustraction
🔹 Test division (nested)
🔹 Test multiplication (nested)
```

L’ordre global n’est pas respecté, car `@Nested` n’hérite pas du `@TestMethodOrder`.

#### Exemple maintenant (JUnit 6)

```java
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class CalculatorTests {

    @Order(1)
    @Test
    void shouldAddTwoNumbers() {
        System.out.println("1️⃣ Test addition");
    }

    @Order(2)
    @Test
    void shouldSubtractTwoNumbers() {
        System.out.println("2️⃣ Test soustraction");
    }

    @Nested
    class AdvancedOperationsTests {

        @Order(3)
        @Test
        void shouldMultiplyTwoNumbers() {
            System.out.println("3️⃣ Test multiplication (nested)");
        }

        @Order(4)
        @Test
        void shouldDivideTwoNumbers() {
            System.out.println("4️⃣ Test division (nested)");
        }
    }
}
```

Ce qui revient en console à :

```text
1️⃣ Test addition
2️⃣ Test soustraction
3️⃣ Test multiplication (nested)
4️⃣ Test division (nested)
```

Cette fois, **l’ordre est cohérent et prévisible**, y compris pour les tests imbriqués.

### Une nullabilité explicite et des messages plus propres

Depuis toujours, JUnit se veut un allié du développeur soucieux de la qualité de son code. Avec **JUnit 6**, cette vocation s’affirme davantage grâce à deux évolutions notables : la **nullabilité explicite** et un **affichage plus lisible** dans les rapports de test.

Ces ajouts ne bouleversent pas les habitudes, mais ils consolident la robustesse et la clarté des tests, tout en préparant le terrain pour une intégration plus fine avec les outils d’analyse statique modernes.

#### Nullabilité explicite avec JSPECIFY

Dans le monde Java, la nullabilité a longtemps reposé sur la simple discipline du développeur : une méthode pouvait retourner `null` sans que rien ne l’indique.  
JUnit 6 s’appuie désormais sur la spécification **JSPECIFY** (`org.jspecify.annotations.Nullable` / `@NonNull`) pour formaliser ces contrats et permettre aux outils (IDE, analyseurs de code, CI) de détecter les incohérences avant l’exécution.

```java
class UserServiceTest {

    private UserService service;

    @BeforeEach
    void init() {
        service = new UserService();
    }

    @Test
    void givenUnknownUserId_whenFindNicknameOrNull_thenReturnsNull() {
        String nickname = service.findNicknameOrNull("unknownUser");
        assertNull(nickname);
    }

    @Test
    void givenNullableMethodResult_whenWrappedInOptional_thenHandledSafely() {
        String nickname = service.findNicknameOrNull("unknownUser");
        Optional<String> safeNickname = Optional.ofNullable(nickname);

        assertTrue(safeNickname.isEmpty());
    }
}

class UserService {
    @Nullable
    public String findNicknameOrNull(String userId) {
        if ("user123".equals(userId)) {
            return "CoolUser";
        } else {
            return null;
        }
    }
}
```

- L’annotation `**@Nullable**` indique clairement que la méthode peut retourner `null`.
- Le test **vérifie ce comportement attendu**, en s’assurant que `findNicknameOrNull("unknownUser")` renvoie bien `null`.
- Le second test illustre une **gestion sécurisée** de ce résultat grâce à `Optional.ofNullable(...)`, sans risque de NullPointerException.

Cette approche explicite supprime toute ambiguïté : la méthode annonce ses intentions, et le test s’y conforme.  
En pratique, cela améliore non seulement la qualité des tests, mais aussi celle du code applicatif : les outils comme **ErrorProne**, **SpotBugs** ou **SonarQube** peuvent signaler toute incohérence d’utilisation avant même le lancement des tests.

#### Un affichage plus clair des tests

JUnit 6 poursuit le travail entamé avec la cinquième génération en cherchant à rendre la sortie des tests plus claire, plus fiable et plus homogène sur l’ensemble des environnements d’exécution.  
L’un des changements les plus notables concerne la **gestion des caractères de contrôle dans les noms de tests**.

Les caractères invisibles comme les retours à la ligne (`\n`), les tabulations (`\t`) ou les retours chariot (`\r`) sont désormais **systématiquement convertis** en équivalents lisibles tels que `<LF>`, `<CR>`, ou `<TAB>`.  
Cette conversion vise à garantir que les rapports d’exécution — qu’ils soient produits dans un terminal, un IDE ou une pipeline CI — restent lisibles et cohérents.

Toutefois, le moteur de rendu de JUnit 6 a été durci.  
Désormais, certains caractères comme la tabulation (`\t`) ne sont plus toujours remplacés par `<TAB>`, mais parfois par le symbole générique `<?>`, selon le contexte d’exécution et les capacités du terminal.  
Ce comportement est voulu : il évite les décalages de colonnes ou les rendus imprévisibles dans les journaux de build.

```java
@Test
@DisplayName("Test avec saut de ligne\net tabulation\t")
void givenUnknownUserId_whenFindNicknameOrNull_thenReturnsNull() {
    String nickname = service.findNicknameOrNull("unknownUser");
    assertNull(nickname);
}
```

**rendu en console**

```text
Test avec saut de ligne<LF>et tabulation<?>en fin de phrase
```

Le caractère de saut de ligne (`\n`) est bien traduit en `<LF>`, mais la tabulation (`\t`) est rendue ici sous la forme `<?>`.  
Selon l’environnement d’exécution, elle pourrait aussi apparaître comme `<TAB>` ou être neutralisée.

### Tests paramétrés et nouveau formatage CSV

JUnit 5 avait popularisé [[Test paramétrés - un test pour les gouverner tous|les tests paramétrés]] grâce à l’annotation `@ParameterizedTest`, permettant de rejouer un même scénario avec plusieurs jeux de données.  
JUnit 6 perfectionne cette approche, en rendant `@CsvSource` **plus souple, plus expressif**, et surtout **plus cohérent avec les standards du langage Java moderne**.

La syntaxe de base reste simple : chaque ligne du `@CsvSource` correspond à une exécution du test, avec des arguments séparés par des virgules.

```java
@ParameterizedTest(name = "Fruit: {0}, quantité: {1}")
@CsvSource({
    "apple,         1",
    "banana,        2",
    "'lemon, lime', 0xF1",
    "strawberry,    700_000"
})
void testWithCsvSource(String fruit, int rank) {
    assertNotNull(fruit);
    assertNotEquals(0, rank);
}
```

Ici, le test sera exécuté quatre fois.  
Les valeurs sont automatiquement **trimées** (les espaces avant/après les virgules sont ignorés), et les valeurs entre guillemets simples peuvent contenir des virgules internes, comme `'lemon, lime'`.

#### Délimiteurs et formatage personnalisés

Le séparateur par défaut est la virgule `,`, mais on peut le modifier grâce à l’attribut `delimiter` :

```java
@CsvSource(value = {
    "apple;1",
    "banana;2"
}, delimiter = ';')
```

Depuis JUnit 6, il est aussi possible d’utiliser **une chaîne de caractères** comme séparateur via `delimiterString` — par exemple, `delimiterString = "::"` — ce qui facilite les formats non conventionnels.  
⚠️ Les deux attributs (`delimiter` et `delimiterString`) ne peuvent pas être utilisés simultanément.

#### Prise en charge des Text Blocks

JUnit 6 profite pleinement des **text blocks** introduits avec Java 15+.  
Cela rend les jeux de données CSV **bien plus lisibles**, notamment lorsqu’ils contiennent plusieurs colonnes ou des commentaires :

```java
@ParameterizedTest
@CsvSource(useHeadersInDisplayName = true, textBlock = """
FRUIT,         RANK
apple,         1
banana,        2
'lemon, lime', 0xF1
strawberry,    700_000
""")
void testWithCsvSource(String fruit, int rank) {
    assertNotNull(fruit);
    assertTrue(rank > 0);
}
```

Le nom du test affichera automatiquement les en-têtes CSV :

```text
[1] FRUIT = "apple", RANK = "1"
[2] FRUIT = "banana", RANK = "2"
```

Autre avantage : les text blocks peuvent contenir des **commentaires** grâce au symbole `#` au début d’une ligne, pratique pour documenter un jeu de données sans l’exécuter.

```java
@ParameterizedTest
@CsvSource(delimiter = '|', quoteCharacter = '"', textBlock = """
#-----------------------------
#    FRUIT     |     RANK
#-----------------------------
     apple     |      1
     banana    |      2
  "lemon lime" |     0xF1
   strawberry  |    700_000
#-----------------------------
""")
void testWithCsvSourceWithComment(String fruit, int rank) {
    assertNotNull(fruit);
    assertTrue(rank > 0);
}
```

### De nouvelles options pour le contrôle de l’exécution

JUnit 6 ne se limite pas à des raffinements syntaxiques : la plateforme gagne en **maturité opérationnelle**, avec deux apports majeurs qui répondent aux besoins concrets des équipes modernes.

#### Le mode --fail-fast

Dans une grande campagne de tests, il est parfois inutile de poursuivre l’exécution après un premier échec : mieux vaut s’arrêter immédiatement, corriger, puis relancer.  
JUnit 6 introduit donc un **mode `--fail-fast`** directement intégré au _ConsoleLauncher_.

Autrefois, il fallait passer par des solutions externes ou des scripts pour simuler ce comportement ; désormais, une simple option suffit :

```bash
java -jar junit-platform-console-standalone-6.0.0.jar \
  execute --fail-fast \
  --scan-classpath
```

Dès qu’un test échoue, l’exécution est annulée proprement.  
Ce mode est particulièrement utile dans :

- les **pipelines CI/CD**, où un build doit échouer immédiatement en cas de régression ;
- les **tests d’intégration coûteux** (ex : base de données ou conteneur Docker) ;
- ou les **exécutions locales rapides**, pour éviter de perdre du temps sur des suites longues.

### Le crépuscule de Vintage

Le moteur **JUnit Vintage**, qui permettait d’exécuter d’anciens tests JUnit 4, entre dans une **phase de dépréciation**.  
Son rôle est désormais clarifié : il n’est plus destiné à durer, mais à **faciliter les migrations temporaires**.  
Un symbole fort : après vingt ans d’existence, la page se tourne doucement sur les tests JUnit 4, remplacés par des approches plus modernes et unifiées.

### Une continuité maîtrisée

Contrairement à la migration douloureuse de JUnit 4 vers JUnit 5, cette nouvelle version se distingue par sa **douceur d’intégration**.  
Le projet **ne bouscule pas les habitudes** : les annotations, les extensions et la philosophie globale demeurent inchangées.  
Les modifications concernent surtout **la consolidation interne**, **la simplification du code** et **l’ouverture vers l’avenir** (Java 17+, Kotlin, null-safety).

## En conclusion

**JUnit 6** n’est pas une révolution, mais une **maturation**.  
Il marque la fin d’une longue période de transition et ouvre une décennie de stabilité.  
Plus moderne, plus strict, mieux intégré, il conserve l’âme du framework tout en préparant son avenir.

Et pour une fois, les développeurs Java pourront aborder la mise à jour non pas avec crainte, mais avec une certaine sérénité.  
Une belle manière de rendre hommage à **l’héritage de JUnit 4 et JUnit 5**, tout en écrivant le prochain chapitre du test automatisé en Java.
