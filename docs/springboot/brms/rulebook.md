---
layout: default
title: Rulebook
tags: [spring-boot, java, tutoriel, BRMS]
---

# Rulebook

Dans le développement d'applications modernes, la gestion des règles métier est une problématique clé pour garantir la robustesse et la flexibilité des systèmes.  
Les règles métier, telles que la validation des transactions bancaires ou les restrictions sur la création de comptes, doivent être bien structurées, maintenables et évolutives.  
**RuleBook** est une bibliothèque [Java](https://www.sfeir.dev/back/il-etait-une-fois-java/) légère et flexible qui permet de définir et d'exécuter des règles métier de manière déclarative. Lorsqu'elle est intégrée à [Spring Boot](https://www.sfeir.dev/back/back-spring-boot/), RuleBook offre une solution puissante pour externaliser la logique de validation tout en s'appuyant sur l'écosystème Spring, notamment Spring AOP pour une application modulaire des règles.

## Qu'est ce que RuleBook ?

**RuleBook** est une [bibliothèque open-source](https://www.sfeir.dev/tag/opensource/) Java conçue pour implémenter des règles métier de manière simple et intuitive.  
Contrairement à des moteurs de règles complexes comme [Drools](https://www.sfeir.dev/back/maitrisez-vos-regles-metier-integrez-drools-dans-spring-boot/), RuleBook adopte une approche légère basée sur [des annotations](https://www.sfeir.dev/back/comprendre-les-annotations-dans-spring-boot/) et une API fluide. Les règles sont définies dans des classes Java annotées avec des métadonnées telles que `@Rule`, `@Given`, `@When`, `@Then`, et `@Result`, ce qui les rend lisibles et faciles à maintenir.

Dans une application Spring Boot, **RuleBook** peut être intégré via le module `rulebook-spring`, qui fournit des beans comme **SpringAwareRuleBookRunner** pour charger automatiquement les règles d'un package donné. Les règles peuvent être appliquées à des méthodes spécifiques grâce à Spring AOP, ce qui permet de séparer la logique de validation de la logique métier principale.

### ⚖️ Quels sont les avantages et inconvénients de RuleBook ?

#### ➕ Avantages

- **Simplicité** : RuleBook est léger et facile à prendre en main, avec une syntaxe claire basée sur des annotations. Cela réduit la courbe d'apprentissage par rapport à des moteurs plus complexes.
- **Intégration avec Spring** : Grâce au module `rulebook-spring`, RuleBook s'intègre parfaitement à Spring Boot, notamment avec Spring AOP pour appliquer les règles de manière non intrusive.
- **Modularité** : Les règles sont définies dans des classes indépendantes, ce qui facilite leur maintenance et leur réutilisation.
- **Flexibilité** : RuleBook permet de combiner plusieurs règles avec un ordre d'exécution défini, et les résultats peuvent être personnalisés (par exemple, retourner une liste d'erreurs).
- **Testabilité** : Les règles étant des classes Java, elles [peuvent être testées](https://www.sfeir.dev/back/un-test-pour-les-gouverner-tous/) avec des outils comme **JUnit** ou **Mockito**.

#### ➖ Inconvénients

- **Fonctionnalités limitées** : RuleBook est moins puissant que des moteurs comme **Drools**, qui offrent des fonctionnalités avancées comme l'inférence ou le traitement des événements complexes.
- **Gestion des erreurs** : Par défaut, RuleBook retourne le résultat de la dernière règle exécutée, ce qui peut poser problème si plusieurs règles échouent. Une personnalisation est nécessaire pour collecter toutes les erreurs.
- **Performance** : Pour des applications avec un grand nombre de règles ou des exécutions fréquentes, RuleBook peut être moins optimisé que des moteurs compilés comme Drools.
- **Communauté réduite** : RuleBook a une [communauté](https://www.sfeir.dev/tag/communaute/) plus petite que Drools, ce qui peut limiter les ressources et le support disponibles.

#### Comparaison entre RuleBook et Drools

**Drools** est un moteur de règles open-source plus mature et puissant, largement utilisé dans les systèmes de gestion de règles métier (**BRMS**). Voici une comparaison entre **RuleBook** et **Drools** :

|Critère|RuleBook|Drools|
|---|---|---|
|**Complexité**|Simple, basé sur des annotations Java|Plus complexe, avec un langage dédié (DRL) et des outils comme Workbench|
|**Performance**|Convient aux applications légères, moins optimisé pour les règles complexes|Optimisé pour les règles complexes et les grandes bases de connaissances|
|**Intégration Spring**|Intégration native via **rulebook-spring** et Spring AOP|Intégration possible, mais nécessite plus de configuration|
|**Fonctionnalités**|Validation simple, règles statiques|Supporte l'inférence, les événements, et les règles dynamiques|
|**Courbe d'apprentissage**|Facile à apprendre pour les développeurs Java|Courbe d'apprentissage plus longue, surtout pour le langage DRL|
|**Communauté**|Petite communauté, moins de ressources|Grande communauté, nombreux tutoriels et support commercial (Red Hat)|

**Quand choisir RuleBook ?**

- Pour des projets nécessitant des validations simples et bien définies.
- Lorsque l'équipe préfère une approche Java pure sans apprendre un nouveau langage.
- Dans des applications Spring Boot où l'intégration avec AOP est un atout.

**Quand choisir Drools ?**

- Pour des systèmes complexes avec des règles dynamiques ou des besoins d'inférence.
- Dans des environnements nécessitant une interface utilisateur pour gérer les règles (Drools Workbench).
- Pour des applications à haute performance avec un grand volume de règles.

## Cas pratique

Pour illustrer l'intégration de RuleBook, considérons une application Spring Boot de gestion de compte bancaire. L'application permet de créer des comptes et d'effectuer des transactions (dépôts et retraits), avec des règles de validation définies via RuleBook et appliquées via Spring AOP.

### Installation

Pour intégrer RuleBook à votre application, il faut ajouter les dépendances suivantes dans votre fichier `pom.xml`

```xml
<dependencies>
    <dependency>
        <groupId>com.deliveredtechnologies</groupId>
        <artifactId>rulebook-core</artifactId>
        <version>${rulebook.version}</version>
    </dependency>
    <dependency>
        <groupId>com.deliveredtechnologies</groupId>
        <artifactId>rulebook-spring</artifactId>
        <version>${rulebook.version}</version>
    </dependency>
</dependencies>
```

### Modèles métier

Les classes `Account` et `Transaction` représentent nos objets métier

```java
@Entity
public class Account {
    @Id
    private String accountNumber;
    private String ownerName;
    private BigDecimal balance;

    //constructeur + getter et setter
}

@Entity
public class Transaction {
    @Id
    @GeneratedValue
    private Long id;
    private String accountNumber;
    @Enumerated(EnumType.STRING)
    private TransactionType type;
    private BigDecimal amount;
    private LocalDateTime timestamp = LocalDateTime.now();

    //constructeur + getter et setter
}
```

L'énumération `TransactionType` définit les types de transactions :

```java
public enum TransactionType {
    DEPOSIT, WITHDRAWAL
}
```

### Annotation personnalisée

Une [annotation](https://www.sfeir.dev/back/comprendre-les-annotations-dans-spring-boot/) `@TransactionRule` marque les méthodes où les règles RuleBook doivent s'appliquer pour valider les transactions.

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface TransactionRule {
}
```

**Explication** :

- Cette annotation est utilisée avec **Spring AOP** pour intercepter les méthodes et exécuter les règles **RuleBook** de manière transparente.

### Configuration RuleBook

La configuration de RuleBook dans Spring Boot repose sur la classe `RuleBookConfiguration`, qui définit des beans `SpringAwareRuleBookRunner` pour charger les règles à partir de packages spécifiques. Chaque **RuleBookRunner** est configuré pour cibler un sous-package contenant les règles pertinentes, garantissant une séparation claire des contextes (création de compte vs. transactions).

```java
@Configuration
public class RuleBookConfiguration {

    @Bean
    public SpringAwareRuleBookRunner accountCreationRuleBook() {
        return new SpringAwareRuleBookRunner("fr.eletutour.rules.account.creation");
    }

    @Bean
    public SpringAwareRuleBookRunner transactionRuleBook() {
        return new SpringAwareRuleBookRunner("fr.eletutour.rules.account.operation");
    }
}
```

**Explications** :

- Le bean **accountCreationRuleBook** charge les règles du package `fr.eletutour.rules.account.creation`, qui contient `AccountCreationRule`. Ce bean est utilisé pour valider la création de comptes.
- Le bean **transactionRuleBook** charge les règles du package `fr.eletutour.rules.account.operation`, qui contient `DepositRule` et `WithdrawalRule`. Ce bean est utilisé pour valider les transactions.
- La séparation des packages évite l'exécution de règles inutiles (par exemple, les règles de transaction ne sont pas appliquées lors de la création de compte).
- **SpringAwareRuleBookRunner** est une implémentation fournie par `rulebook-spring` qui intègre RuleBook avec le contexte Spring, permettant l'injection de dépendances dans les règles si nécessaire.

Cette configuration garantit que chaque opération utilise uniquement les règles pertinentes, [améliorant la performance et la clarté](https://www.sfeir.dev/tag/clean-code/). Les développeurs peuvent facilement ajouter de nouvelles règles en les plaçant dans le bon sous-package, sans modifier la configuration.

### Définir les règles RuleBook

Les règles **RuleBook** sont définies dans des classes Java annotées avec `@RuleBean` et `@Rule`. Chaque règle utilise les annotations `@Given` pour recevoir des faits (données d'entrée), `@When` pour définir une condition de validation, et `@Then` pour spécifier l'action à exécuter si la condition est remplie.

#### Règle de création de compte

```java
@RuleBean
@Rule(order = 1)
public class AccountCreationRule {

    private final Logger logger = org.slf4j.LoggerFactory.getLogger(AccountCreationRule.class);

    @Given("account")
    private Account account;

    @Result
    private String result;

    @When
    public boolean when() {
        logger.info("Validating account creation for account: {}", account);
        return account.getAccountNumber() == null || account.getAccountNumber().isEmpty()
                || account.getBalance() == null || account.getBalance().compareTo(BigDecimal.ZERO) < 0;
    }

    @Then
    public void then() {
        logger.error("Account creation failed: Invalid account number or negative initial balance");
        result = "Account creation failed: Invalid account number or negative initial balance";
    }
}
```

**Explications** :

- **Annotations** :
    - `@RuleBean` indique que la classe est une règle RuleBook compatible avec Spring.
    - `@Rule(order = 1)` définit l'ordre d'exécution (utile si plusieurs règles sont dans le même package).
    - `@Given("account")` injecte l'objet Account comme fait.
    - `@Result` indique que le retour sera une chaîne de caractères.
    - `@When` définit la condition de validation : le numéro de compte ne doit pas être vide ou nul, et le solde initial ne doit pas être négatif.
    - `@Then` ajoute un message d'erreur si la condition est vraie.
- **Comportement** : Cette règle s'assure que les données d'un compte sont valides avant sa création. Si la validation échoue, elle enrichit la liste des erreurs sans interrompre l'exécution d'autres règles potentielles.

#### Règles de validation de transaction

```java
@RuleBean
@Rule(order = 1)
public class DepositRule {

    private final Logger logger = org.slf4j.LoggerFactory.getLogger(DepositRule.class);

    @Given("transaction")
    private Transaction transaction;

    @Given("errors")
    private List<String> errors;

    @When
    public boolean when() {
        logger.info("Validating deposit transaction: {}", transaction);
        return transaction.getType() == TransactionType.DEPOSIT
                && (transaction.getAmount() == null || transaction.getAmount().compareTo(BigDecimal.ZERO) <= 0);
    }

    @Then
    public void then() {
        logger.error("Deposit failed: Amount must be positive");
        errors.add("Deposit failed: Amount must be positive");
    }
}

@RuleBean
@Rule(order = 2)
public class WithdrawalRule {

    private final Logger logger = org.slf4j.LoggerFactory.getLogger(WithdrawalRule.class);

    @Given("transaction")
    private Transaction transaction;

    @Given("balance")
    private BigDecimal balance;

    @Given("errors")
    private List<String> errors;

    @When
    public boolean when() {
        logger.info("Validating withdrawal transaction: {}", transaction);
        return transaction.getType() == TransactionType.WITHDRAWAL
                && (transaction.getAmount() == null
                || transaction.getAmount().compareTo(BigDecimal.ZERO) <= 0
                || balance == null
                || balance.compareTo(transaction.getAmount()) < 0);
    }

    @Then
    public void then() {
        logger.error("Withdrawal failed: Insufficient balance or invalid amount");
        errors.add("Withdrawal failed: Insufficient balance or invalid amount");
    }
}
```

**Explications** :

- **Règle de validation de dépôt** :
    - La règle s'applique uniquement aux transactions de type **DEPOSIT** (vérifié dans `@When`).
    - Elle valide que le montant de la transaction est non nul et positif.
    - Si la condition est remplie (montant invalide), un message d'erreur est ajouté à la liste errors.
    - L'utilisation de **TransactionType.DEPOSIT** garantit que la règle ne s'exécute pas pour les retraits, optimisant l'exécution.
- **Règle de validation de retrait** :
    - La règle s'applique aux transactions de type **WITHDRAWAL**.
    - Elle vérifie que le montant est positif et que le solde du compte est suffisant pour couvrir le retrait.
    - **Le fait** balance est injecté par l'aspect, permettant à la règle d'accéder au solde actuel du compte.
    - Les erreurs sont collectées dans la liste errors, permettant de signaler des problèmes multiples si d'autres règles étaient ajoutées.
- **Gestion des erreurs** :
    - Contrairement à l'approche par défaut de RuleBook (voir la règle de création de compte), où un seul résultat est retourné, nous utilisons une liste errors comme fait partagé. Chaque règle peut y ajouter des messages, permettant de collecter toutes les erreurs de validation.
    - Cette approche est particulièrement utile pour fournir un retour détaillé aux utilisateurs, par exemple, en signalant à la fois un montant négatif et un solde insuffisant.

### Les aspects

Les aspects Spring AOP interceptent les appels aux méthodes pour appliquer les règles **RuleBook**.

#### Aspect de création de compte

```java
@Aspect
@Component
public class AccountCreationAspect {

    @Autowired
    private RuleBookRunner accountCreationRuleBook;

    @Before("execution(* fr.eletutour.service.AccountService.createAccount(..)) && args(account)")
    public void validateAccountCreation(Account account) {
        NameValueReferableMap<Object> facts = new FactMap<>();
        facts.setValue("account", account);

        accountCreationRuleBook.run(facts);

        if (accountCreationRuleBook.getResult().isPresent()) {
            throw new IllegalArgumentException(accountCreationRuleBook.getResult().get().toString());
        }
    }
}
```

#### Aspect de gestion de transaction

```java
@Aspect
@Component
public class TransactionAspect {

    @Autowired
    private RuleBookRunner transactionRuleBook;

    @Autowired
    private AccountRepository accountRepository;

    @Before("@annotation(fr.eletutour.annotations.TransactionRule) && args(transaction)")
    public void validateTransaction(Transaction transaction) {
        Account account = accountRepository.findById(transaction.getAccountNumber())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        List<String> errors = new ArrayList<>();
        NameValueReferableMap<Object> facts = new FactMap<>();
        facts.setValue("transaction", transaction);
        facts.setValue("balance", account.getBalance());
        facts.setValue("errors", errors);

        transactionRuleBook.run(facts);

        if (!errors.isEmpty()) {
            throw new TransactionException(errors);
        }
    }
}
```

### Service et controller

Notre logique de service reste simple car nous avons "décentralisé" la gestion des règles métier dans nos aspects et notre règle RuleBook.

```java
@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public AccountService(AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    public Account createAccount(Account account) {
        return accountRepository.save(account);
    }

    @TransactionRule
    public Transaction processTransaction(Transaction transaction) {
        Account account = accountRepository.findById(transaction.getAccountNumber())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        if (transaction.getType() == TransactionType.DEPOSIT) {
            account.setBalance(account.getBalance().add(transaction.getAmount()));
        } else if (transaction.getType() == TransactionType.WITHDRAWAL) {
            account.setBalance(account.getBalance().subtract(transaction.getAmount()));
        }

        accountRepository.save(account);
        return transactionRepository.save(transaction);
    }
}
```

Le controller expose nos endpoints à notre [API REST](https://www.sfeir.dev/back/votre-api-rest-est-elle-vraiment-restful/)

```java
@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping
    public Account createAccount(@RequestBody Account account) {
        return accountService.createAccount(account);
    }

    @PostMapping("/transaction")
    public Transaction processTransaction(@RequestBody Transaction transaction) {
        return accountService.processTransaction(transaction);
    }
}
```

## Conclusion

L'intégration de **RuleBook** dans Spring Boot, comme illustré dans cet exemple, offre une approche simple pour gérer les règles métier. La configuration via `SpringAwareRuleBookRunner` permet de charger les règles de manière modulaire, tandis que les annotations **RuleBook** rendent les règles lisibles et maintenables. L'utilisation de Spring AOP et d'une exception personnalisée comme TransactionException garantit une séparation claire entre la validation et la logique métier, avec une gestion robuste des erreurs via une réponse JSON structurée.

**RuleBook** est idéal pour des projets nécessitant des validations simples et une intégration fluide avec Spring Boot. Pour des besoins plus complexes, comme l'inférence ou les règles dynamiques, Drools reste une alternative. En fonction de vos besoins, RuleBook peut transformer la gestion des règles métier en une tâche claire et efficace.