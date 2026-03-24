---
layout: "default"
title: "Spring Boot et le défi du multi datasource"
permalink: "/springboot/spring-boot-et-le-defi-du-multi-datasource/"
tags: [back, java, spring-boot, spring data, tutoriel]
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/spring-boot-multi-datasource/"
banner: "https://www.sfeir.dev/content/images/size/w1200/2025/11/20251106_1619_Retro-Database-Adventure_simple_compose_01k9cvwxgsefrrssjqh0725rr2.png"
published_at: "2026-01-04"
sfeir_slug: "spring-boot-multi-datasource"
date: "2026-01-04"
---
Ah, [****Spring Boot**** et son autoconfiguration si pratique !](/springboot/il-etait-une-fois-spring-boot/)  
Quelques lignes dans un `application.properties`, une dépendance `spring-boot-starter-data-jpa`, et vous voilà connecté à une base de données, prêt à manipuler vos entités en toute transparence.

Mais que se passe-t-il lorsque votre application doit interagir avec ****plusieurs bases de données**** ?  
Ce cas, moins courant mais fréquent dans les systèmes modulaires (gestion séparée des utilisateurs, des commandes, des historiques…), nécessite une configuration manuelle plus fine.

Voyons ensemble ****comment**** [****Spring Boot****](https://www.sfeir.dev/back/back-spring-boot/) ****permet de gérer plusieurs sources de données**** tout en conservant la souplesse et la clarté de son modèle.

## Comprendre le multi-datasource

Le terme ****multi-datasource**** désigne une application qui se connecte à ****plusieurs bases de données distinctes**** au sein du même contexte Spring.  
Chaque base possède sa propre configuration (URL, utilisateur, dialecte, schéma…) et souvent son propre modèle de données.

### Pourquoi plusieurs bases de données ?

Plusieurs raisons peuvent motiver ce choix :

- ****Séparation fonctionnelle**** : par exemple, isoler les données des utilisateurs d’un côté, et celles des commandes de l’autre.
- ****Contraintes techniques**** : certains modules doivent se connecter à des bases déjà existantes, voire à des SGBD différents.
- [****Sécurité****](/springboot/security/securisez-vos-api-avec-spring-security-basic-auth/) ****ou conformité**** : séparer certaines données sensibles sur un serveur ou un environnement dédié.
- ****Performance et scalabilité**** : permettre à chaque base d’évoluer indépendamment selon les besoins métiers.

En somme, le multi-datasource est une réponse à une architecture plus modulaire, parfois un avant-goût d’une approche microservices.

### Comment cela fonctionne dans Spring Boot

Par défaut, Spring Boot détecte ****une seule source de données**** et configure automatiquement tout le nécessaire :  
le `DataSource`, l’`EntityManagerFactory` et le `TransactionManager`.

Mais dès qu’une deuxième datasource entre en jeu, cette autoconfiguration n’est plus suffisante.  
Il faut alors :

1. ****Définir manuellement**** chaque `DataSource` avec ses propriétés.
2. ****Créer un**** **`**EntityManagerFactory**`** ****dédié**** à chaque ensemble d’entités.
3. ****Associer un**** **`**TransactionManager**`** ****distinct**** pour gérer les transactions de manière isolée.
4. ****Spécifier clairement**** à quel repository et quelle transaction chaque opération doit s’appliquer.

En pratique, cela signifie créer une ****classe de configuration par base de données****, et bien séparer les packages d’entités et de repositories.

## ⚖️ Avantages et inconvénients

### ➕ Avantages

- ****Isolation logique et technique**** : Chaque base peut être dédiée à un domaine fonctionnel distinct (utilisateurs, commandes, facturation…).  
    Cela favorise une meilleure séparation des responsabilités, et prépare le terrain pour une future architecture microservices.
- ****Sécurité et performance**** : Certaines données sensibles peuvent résider sur une base dédiée, éventuellement sur un serveur différent.  
    Cela limite les risques et permet d’optimiser les accès selon les besoins.
- ****Interopérabilité**** : Vous pouvez connecter votre application à des bases de natures différentes (H2, PostgreSQL, Oracle…) sans les mélanger.

### ➖ Inconvénients

- ****Complexité accrue**** : Spring Boot ne peut plus tout deviner : il faut configurer manuellement chaque source de données, chaque `EntityManager` et chaque `TransactionManager`.
- ****Gestion des transactions**** : Une transaction unique sur plusieurs bases nécessite un mécanisme de coordination (comme un `ChainedTransactionManager` ou un gestionnaire XA).  
    Sans cela, les opérations restent indépendantes.
- ****Maintenance**** : Plus de fichiers de configuration, plus de beans à suivre, et donc plus de risques d’erreurs de mapping ou de transaction.

## Exemple d’implémentation

Prenons une application simple gérant ****des utilisateurs**** et ****des commandes**** sur ****deux bases H2 distinctes****.

### Configuration du fichier `application.properties`

```properties
# ===============================
# PRIMARY DATASOURCE (USERS - H2)
# ===============================
app.datasource.users.url=jdbc:h2:mem:users_db;DB_CLOSE_DELAY=-1
app.datasource.users.username=sa
app.datasource.users.password=password
app.datasource.users.driver-class-name=org.h2.Driver
# Hibernate properties for the primary datasource
app.datasource.users.jpa.hibernate.ddl-auto=update
app.datasource.users.jpa.show-sql=true
app.datasource.users.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect

# ===============================
# SECONDARY DATASOURCE (ORDERS - H2)
# ===============================
app.datasource.orders.url=jdbc:h2:mem:orders_db;DB_CLOSE_DELAY=-1
app.datasource.orders.username=sa
app.datasource.orders.password=password
app.datasource.orders.driver-class-name=org.h2.Driver
# Hibernate properties for the secondary datasource
app.datasource.orders.jpa.hibernate.ddl-auto=update
app.datasource.orders.jpa.show-sql=true
app.datasource.orders.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect
```

- Chaque datasource a ****ses propres paramètres**** : URL, utilisateur, mot de passe et driver.
- `DB_CLOSE_DELAY=-1` : la base H2 reste en mémoire même après la fermeture de la connexion.
- `hibernate.hbm2ddl.auto=update` : Hibernate crée ou met à jour les tables automatiquement.
- `hibernate.dialect` : indique à Hibernate comment générer le SQL spécifique au type de base.

### Configuration de la base principale (utilisateurs)

```java
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        entityManagerFactoryRef = "userEntityManagerFactory",
        transactionManagerRef = "userTransactionManager",
        basePackages = {"fr.eletutour.multi.database.users.repository"}
)
public class UserDbConfig {

    @Primary
    @Bean(name = "userProperties")
    @ConfigurationProperties("app.datasource.users")
    public DataSourceProperties userDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Primary
    @Bean(name = "userDataSource")
    public DataSource userDataSource(@Qualifier("userProperties") DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
    }

    @Primary
    @Bean(name = "userEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean userEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("userDataSource") DataSource dataSource) {

        Map<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", "update");
        properties.put("hibernate.dialect", "org.hibernate.dialect.H2Dialect");

        return builder
                .dataSource(dataSource)
                .packages("fr.eletutour.multi.database.users.domain")
                .persistenceUnit("User")
                .properties(properties)
                .build();
    }

    @Primary
    @Bean(name = "userTransactionManager")
    public PlatformTransactionManager userTransactionManager(
            @Qualifier("userEntityManagerFactory") LocalContainerEntityManagerFactoryBean entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory.getObject());
    }
}
```

- `@EnableJpaRepositories` : [cette annotation](/springboot/comprendre-les-annotations-dans-spring-boot-guide-et-exemples/) indique à Spring où chercher les repositories associés à cette datasource.
- `@Primary` : permet à Spring de savoir quelle datasource utiliser par défaut si plusieurs existent.
- `userDataSourceProperties()` : lit les propriétés dans `application.properties`.
- `userDataSource()` : crée le bean `DataSource` réel utilisé pour se connecter à la base.
- `userEntityManagerFactory()` : configure l’`EntityManagerFactory` pour gérer les entités utilisateurs.
- `userTransactionManager()` : gère les transactions sur cette base.

### Configuration de la base secondaire (commandes)

```java
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        entityManagerFactoryRef = "orderEntityManagerFactory",
        transactionManagerRef = "orderTransactionManager",
        basePackages = {"fr.eletutour.multi.database.orders.repository"}
)
public class OrderDbConfig {

    @Bean(name = "orderProperties")
    @ConfigurationProperties("app.datasource.orders")
    public DataSourceProperties orderDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean(name = "orderDataSource")
    public DataSource orderDataSource(@Qualifier("orderProperties") DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
    }

    @Bean(name = "orderEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean orderEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("orderDataSource") DataSource dataSource) {

        Map<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", "update");
        properties.put("hibernate.dialect", "org.hibernate.dialect.H2Dialect");

        return builder
                .dataSource(dataSource)
                .packages("fr.eletutour.multi.database.orders.domain")
                .persistenceUnit("Order")
                .properties(properties)
                .build();
    }

    @Bean(name = "orderTransactionManager")
    public PlatformTransactionManager orderTransactionManager(
            @Qualifier("orderEntityManagerFactory") LocalContainerEntityManagerFactoryBean entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory.getObject());
    }
}
```

- Même principe que pour la base utilisateurs, mais appliqué aux entités commandes et produits.
- Chaque bean est distinct et indépendant, ce qui permet de gérer les transactions séparément.

### Configuration du `ChainedTransactionManager`

```java
@Configuration
public class ChainedTransactionConfig {

    @Bean(name = "chainedTransactionManager")
    public PlatformTransactionManager chainedTransactionManager(
            @Qualifier("userTransactionManager") PlatformTransactionManager userTxManager,
            @Qualifier("orderTransactionManager") PlatformTransactionManager orderTxManager) {
        return new ChainedTransactionManager(userTxManager, orderTxManager);
    }
}
```

- `ChainedTransactionManager` permet de ****gérer plusieurs transactions comme une seule****.
- Spring coordonne les commits et rollbacks sur les deux bases.
- L’ordre des managers dans le constructeur est important : `userTxManager` est exécuté en premier, `orderTxManager` ensuite.
- Si une exception survient, Spring annule les transactions ****dans l’ordre inverse****.

### Service métier avec transaction globale

```java
@Service
public class AppService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public AppService(UserRepository userRepository,
                      OrderRepository orderRepository,
                      ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    /**
     * Cette méthode exécute une transaction globale sur les deux bases H2.
     * Si une étape échoue, toutes les opérations sont annulées.
     */
    @Transactional("chainedTransactionManager")
    public String createUserAndOrder(CreateUserAndOrderRequest request) {
        // Création de l'utilisateur (users_db)
        User user = new User(
                request.getUsername(),
                request.getFirstName(),
                request.getLastName(),
                request.getEmail()
        );
        User savedUser = userRepository.save(user);

        // Création du produit (orders_db)
        Product product = new Product(
                request.getProductName(),
                request.getProductPrice()
        );
        Product savedProduct = productRepository.save(product);

        // Création de la commande (orders_db)
        Order order = new Order(savedProduct, savedUser.getId());
        Order savedOrder = orderRepository.save(order);

        return String.format("""
                ✅ Utilisateur '%s' (ID: %d) créé dans users_db.
                ✅ Produit '%s' (ID: %d) créé dans orders_db.
                ✅ Commande (ID: %d) créée dans orders_db, liée à l’utilisateur.""",
                savedUser.getUsername(),
                savedUser.getId(),
                savedProduct.getName(),
                savedProduct.getId(),
                savedOrder.getId());
    }
}
```

- `@Transactional("chainedTransactionManager")`
    - Utilise le ****ChainedTransactionManager**** que nous avons défini pour coordonner les transactions sur ****les deux bases****.
    - Si une opération échoue (ex : produit non créé), Spring ****rollback**** toutes les modifications dans les deux bases.
- `User user = new User(...)` → `userRepository.save(user)`
    - Insère l’utilisateur dans la base ****users_db****.
    - La transaction est gérée par le `UserTransactionManager`, mais coordonnée via le `chainedTransactionManager`.
- `Product product = new Product(...)` → `productRepository.save(product)`
    - Insère le produit dans ****orders_db****.
    - Transaction également coordonnée pour garantir l’atomicité.
- `Order order = new Order(...)` → `orderRepository.save(order)`
    - Crée la commande en liant le produit et l’utilisateur.
    - Si cette opération échoue, ****tout est annulé****, y compris l’utilisateur créé précédemment.

## Conclusion

Spring Boot simplifie énormément la gestion d’une ****unique**** source de données, mais il reste suffisamment flexible pour en gérer plusieurs sans artifice.  
En définissant clairement vos `DataSource`, `EntityManagerFactory` et `TransactionManager`, vous gardez le contrôle complet sur la persistance.

Le multi-datasource n’est pas nécessairement la voie la plus simple, mais il est souvent la plus saine lorsqu’on cherche à isoler les responsabilités, préparer une migration vers des microservices ou simplement séparer les mondes métier.

Et c’est là toute la beauté de Spring : la complexité est maîtrisée, et chaque couche garde son indépendance.
