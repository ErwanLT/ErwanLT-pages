---
layout: "default"
title: "Intégration d'Easy Rules dans une application Spring Boot"
permalink: "/back/java/spring-boot/brms/integration-d-easy-rules-dans-une-application-spring-boot/"
tags: [back, java, spring-boot, brms]
date: "2025-08-06"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/integration-deasy-rules-dans-une-application-spring-boot/"
banner: "https://www.sfeir.dev/content/images/2025/09/20250923_1034_Pixelated-Rule-Magic_simple_compose_01k5tv78fpfsztjf3xb811a4m2.png"
published_at: "2025-08-06"
sfeir_slug: "integration-deasy-rules-dans-une-application-spring-boot"
sfeir_tags: [Back, Java, Spring Boot, BRMS]
---
Dans le développement d'applications modernes, la gestion des règles métier est une tâche cruciale, surtout dans des domaines comme la finance où des conditions complexes doivent être validées dynamiquement.  
Les moteurs de règles permettent de découpler la logique métier du code principal, rendant les applications plus flexibles et maintenables. Cet article explore l'intégration d'**Easy Rules**, un moteur de règles léger, dans une application [Spring Boot](/back/java/spring-boot/il-etait-une-fois-spring-boot/).

## Présentation d'Easy Rules

**Easy Rules** est une bibliothèque Java [open-source](https://www.sfeir.dev/tag/opensource/) conçue pour simplifier la définition et l'exécution de règles métier.  
Contrairement à des moteurs de règles plus complexes, Easy Rules adopte une approche minimaliste, avec une [API](https://www.sfeir.dev/kesaco-api/) intuitive basée sur des [annotations](/back/java/spring-boot/comprendre-les-annotations-dans-spring-boot-guide-et-exemples/) comme `@Rule`, `@Condition`, et `@Action`.  
**Une règle dans Easy Rules** est une classe [Java](/back/java/il-etait-une-fois-java/)qui encapsule une **condition** (évaluée sur des faits) et une **action** (exécutée si la condition est remplie).

### ⚖️ Avantages et inconvénients

#### ➕ Avantages

- **Simplicité** : L'API d'Easy Rules est intuitive, réduisant la courbe d'apprentissage pour les développeurs Java.
- **Légèreté** : Avec une empreinte mémoire réduite, Easy Rules convient aux applications où la performance est critique.
- **Intégration facile avec Spring** : Les règles et le moteur peuvent être configurés comme des beans Spring, et [l'AOP](/back/java/spring-boot/spring-aop-comprendre-la-programmation-orientee-aspect-dans-spring/) permet d'appliquer les règles de manière déclarative.
- **Flexibilité** : Les règles sont des classes Java, ce qui permet d'utiliser toute la puissance du langage (héritage, composition, etc.).
- **Extensibilité** : Il est facile d'ajouter de nouvelles règles ou de personnaliser le comportement via des listeners.

#### ➖ Inconvénients

- **Fonctionnalités limitées** : Easy Rules manque de fonctionnalités avancées comme la gestion des priorités complexes, les règles dynamiques (basées sur des fichiers externes), ou l'inférence (chaînage de règles).
- **Peu adapté aux grandes bases de règles** : Pour des systèmes avec des centaines de règles, Easy Rules peut devenir difficile à gérer en raison de son approche orientée code.
- **Dépendance au code Java** : Contrairement à certains moteurs qui permettent de définir des règles dans des fichiers (ex. XML, DSL), Easy Rules exige de coder chaque règle, ce qui peut compliquer les modifications fréquentes par des non-développeurs.

## Cas pratique

Pour illustrer l'intégration d'Easy Rules, examinons une application bancaire gérant des comptes et des transactions (dépôts et retraits). L'objectif est de valider les transactions, notamment en s'assurant qu'un retrait ne dépasse pas le solde du compte. Nous détaillerons les spécificités du code liées à Easy Rules.

### Installation

Pour intégrer Easy Rules à votre application, il faut ajouter la dépendance suivante dans votre fichier `pom.xml`

```xml
<dependency>
    <groupId>org.jeasy</groupId>
    <artifactId>easy-rules-core</artifactId>
    <version>4.1.0</version>
</dependency>
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

Une [annotation](/back/java/spring-boot/comprendre-les-annotations-dans-spring-boot-guide-et-exemples/) `@TransactionRule` marque les méthodes où les règles RuleBook doivent s'appliquer pour valider les transcation.

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface TransactionRule {
}
```

**Explication** :

- Cette annotation est utilisée avec **Spring AOP** pour intercepter les méthodes et exécuter les règles **RuleBook** de manière transparente.

### Définition de la règle Easy Rules

```java
@Rule(name = "insufficient balance rule", description = "Check if account has sufficient balance")
public class InsufficientBalanceRule {
    
    @Condition
    public boolean when(@Fact("account") Account account, @Fact("transaction") Transaction transaction) {
        return transaction.getType() == TransactionType.WITHDRAWAL
                && (transaction.getAmount() == null
                || transaction.getAmount().compareTo(BigDecimal.ZERO) <= 0
                || account.getBalance() == null
                || account.getBalance().compareTo(transaction.getAmount()) < 0);
    }
    
    @Action
    public void then() throws Exception {
        throw new TransactionException("Insufficient balance");
    }
}
```

**Explications :**

- L'annotation `@Rule` marque la classe comme une règle, avec un nom et une description pour la traçabilité.
- L'annotation `@Condition` définit la méthode _when_ qui évalue si la règle s'applique, en utilisant des faits (`@Fact`) injectés depuis un conteneur Facts.
- L'annotation `@Action` définit la méthode then exécutée si la condition est vraie. Ici, elle lève une _TransactionException_ pour signaler un solde insuffisant.
- Les faits (`account` et `transaction`) sont des objets passés au moteur pour l'évaluation, une caractéristique clé d'**Easy Rules** permettant de travailler avec des données dynamiques.

### Configuration du moteur Easy Rules

La classe `Engine` configure le moteur et gère l'exécution des règles :

```java
@Component
public class Engine {
    private final Rules rules;
    private final DefaultRulesEngine rulesEngine;
    private final TransactionRulesListener rulesListener;
    
    public Engine() {
        rules = new Rules();
        rules.register(new InsufficientBalanceRule());
        rulesEngine = new DefaultRulesEngine();
        rulesListener = new TransactionRulesListener();
        rulesEngine.registerRuleListener(rulesListener);
    }
    
    public void executeRules(Account account, Transaction transaction) {
        Facts facts = new Facts();
        facts.put("account", account);
        facts.put("transaction", transaction);
        rulesEngine.fire(rules, facts);
        rulesListener.throwIfFailed();
    }
}
```

**Explications** :

- **Rules** : L'objet Rules est un conteneur pour enregistrer les règles (ici, `InsufficientBalanceRule`). Easy Rules permet d’ajouter plusieurs règles dynamiquement.
- **DefaultRulesEngine** : Le moteur par défaut d'Easy Rules évalue les règles en séquence et exécute les actions des règles dont la condition est vraie.
- **Facts** : Le conteneur Facts stocke les données (`account` et `transaction`) passées aux règles pour évaluation. Cette approche est centrale dans Easy Rules, car elle sépare les données des règles.
- **RuleListener** : L'écouteur personnalisé `TransactionRulesListener` est enregistré pour capturer les événements du cycle de vie des règles, une fonctionnalité d'Easy Rules permettant de gérer les erreurs ou de logger les résultats.

### Listener personnalisé pour gérer les erreurs

La classe `TransactionRulesListener` implémente l'interface `RuleListener` d'Easy Rules :

```java
public class TransactionRulesListener implements RuleListener {

    private static final Logger logger = LoggerFactory.getLogger(TransactionRulesListener.class);

    private TransactionException transactionException;

    @Override
    public boolean beforeEvaluate(Rule rule, Facts facts) {
        this.transactionException = null;
        return true; // Permet l'évaluation de la règle
    }

    @Override
    public void afterEvaluate(Rule rule, Facts facts, boolean evaluationResult) {
        // Rien à faire après l'évaluation
    }

    @Override
    public void beforeExecute(Rule rule, Facts facts) {
        // Rien à faire avant l'exécution
    }

    @Override
    public void onSuccess(Rule rule, Facts facts) {
    }

    @Override
    public void onFailure(Rule rule, Facts facts, Exception exception) {
        // Capturer TransactionException si elle est la cause
        Throwable cause = exception;
        while (cause != null) {
            logger.error("Error executing rule: {}", rule.getName());
            if (cause instanceof TransactionException) {
                this.transactionException = (TransactionException) cause;
                return;
            }
            cause = cause.getCause();
        }
        // Stocker une exception générique si ce n'est pas une TransactionException
        this.transactionException = new TransactionException("Error executing rule: " + rule.getName());
        logger.error("Error executing rule: {}", rule.getName(), exception);
    }

    /**
     * Lance l'exception capturée, s'il y en a une.
     */
    public void throwIfFailed() throws TransactionException {
        if (transactionException != null) {
            throw transactionException;
        }
    }
}
```

**Explications :**

- L'interface `RuleListener `permet de personnaliser la gestion des événements (avant/après évaluation, succès/échec).
- La méthode _onFailure_ capture les exceptions levées par les règles (comme `TransactionException` dans InsufficientBalanceRule), une fonctionnalité clé pour gérer les erreurs de manière centralisée.
- La méthode _throwIfFailed_ propage l’exception après l’exécution, garantissant que les erreurs des règles sont transmises à la logique appelante.

### Intégration avec Spring AOP

Un aspect Spring applique les règles avant le traitement des transactions :

```java
@Aspect
@Component
public class RulesAspect {
    
    private final Engine rulesEngine;
    private final AccountRepository accountRepository;
    
    public RulesAspect(Engine rulesEngine, AccountRepository accountRepository) {
        this.rulesEngine = rulesEngine;
        this.accountRepository = accountRepository;
    }

    @Before("@annotation(fr.eletutour.annotations.TransactionRule) && args(transaction)")
    public void applyRules(Transaction transaction) {
        Account account = accountRepository.findById(transaction.getAccountNumber())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        rulesEngine.executeRules(account, transaction);
    }
}
```

**Explications** :

- Bien que l’aspect soit une fonctionnalité Spring AOP, il s’appuie sur le moteur Easy Rules (`Engine`) pour exécuter les règles.
- L’appel à _`rulesEngine.executeRules`_ déclenche l’évaluation des règles enregistrées, montrant comment **Easy Rules** s’intègre dans une architecture Spring modulaire.

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

Le controller expose nos endpoints à notre [API REST](/definition/rest-definition/)

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

L'intégration d'**Easy Rules** dans une application Spring Boot offre une solution pour gérer des règles métier de manière flexible et maintenable.  
Sa simplicité et son intégration transparente avec Spring, notamment via AOP, en font un choix idéal pour des projets nécessitant un moteur de règles léger.

Bien qu'il ne soit pas adapté aux systèmes complexes nécessitant des fonctionnalités avancées comme l'inférence ou la gestion externe des règles, Easy Rules excelle dans des cas d'utilisation comme la validation de transactions bancaires.

Comparé à **Drools** et **RuleBook**, il se distingue par sa facilité d'utilisation et sa légèreté, ce qui en fait un excellent compromis pour de nombreuses applications.
