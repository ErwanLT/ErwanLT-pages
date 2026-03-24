---
layout: "default"
title: "Architecture hexagonale en Java - relier DDD, Design Patterns et code concret"
permalink: "/back/java/architecture-hexagonale-en-java-relier-ddd-design-patterns-et-code-concret/"
tags: [back, java]
date: "2026-01-14"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/architecture-hexagonale-en-java-relier-ddd-design-patterns-et-code-concret/"
banner: "https://www.sfeir.dev/content/images/size/w1200/2026/03/20260304_1312_Image-Generation_simple_compose_01kjwc6vz0en5rnpvez4f89daq.png"
published_at: "2026-01-14"
sfeir_slug: "architecture-hexagonale-en-java-relier-ddd-design-patterns-et-code-concret"
sfeir_tags: [Back, Java, Design pattern, Architecture]
---
## Pourquoi cet article ?

Quand on parle de conception logicielle, on croise souvent deux mondes qui se regardent de loin :

- le monde de la modélisation métier, avec [[DDD - Définition|DDD]] ;
- le monde des solutions de code, avec [[Les Design Patterns|les design patterns]].

En pratique, ces deux approches ne s’opposent pas. Elles se complètent.

L’objectif de cet article est simple : montrer comment une architecture hexagonale en **Java pur** permet de relier la pensée DDD à du code concret, lisible, et testable.

## De quel DDD parle-t-on ici ?

Le sigle DDD est parfois utilisé pour deux expressions :

- **Domain-Driven Design**
- **Design-Driven Development**

Dans cet article, nous parlons explicitement de **Domain-Driven Design** : un mode de conception centré sur le domaine métier, le langage partagé, et la modélisation des règles métier.

Autrement dit, l’objectif n’est pas de “faire joli” côté design technique, mais de faire en sorte que le code exprime clairement le métier.

## DDD et architecture hexagonale : même combat

Le DDD nous rappelle une idée centrale : le code doit refléter le métier.

Le problème, c’est que dans beaucoup de projets, la logique métier finit noyée dans :

- les détails techniques,
- les frameworks,
- les appels externes,
- les couches de plomberie.

L’architecture hexagonale (Ports & Adapters) répond exactement à ce problème.

Elle sépare :

1. **Le cœur métier** (domain + use cases),
2. **Les ports** (interfaces),
3. **Les adapters** (implémentations techniques).

Résultat : le métier reste stable, l’infrastructure peut évoluer sans tout casser.

## Modèle cible (Java pur)

Pour illustrer, prenons un cas simple : gestion de commande.

```text
src/main/java
└── fr/eletutour/order
    ├── domain
    │   ├── model
    │   └── service
    ├── application
    │   ├── port
    │   └── usecase
    └── infrastructure
        ├── persistence
        └── notification
```

- `domain` : règles métier, invariants.
- `application` : orchestration des cas d’usage.
- `infrastructure` : base de données, email, API externe, etc.

## À quoi ressemble le flux complet ?

Prenons le scénario “création de commande” de bout en bout :

1. Une entrée arrive (CLI, HTTP, batch, message...).
2. On transforme cette entrée en commande applicative (`CreateOrderCommand`).
3. Le use case orchestre la création de l’agrégat via une factory.
4. Les règles métier s’appliquent (calcul, validation, invariants).
5. Le port de persistence enregistre la commande.
6. L’adapter technique fait le travail concret (JPA, JDBC, mémoire, etc.).

Ce flux permet de garder le métier au centre et la technique en périphérie.

## Où interviennent les Design Patterns ?

C’est ici que les patterns deviennent utiles, sans sur-ingénierie.

### 1) `Factory` pour créer des agrégats valides

Au lieu d’instancier les objets métier n’importe comment, on centralise la création avec [[Factory]].

```java
public final class OrderFactory {

    private OrderFactory() {}

    public static Order create(String customerId, List<OrderLine> lines) {
        if (lines == null || lines.isEmpty()) {
            throw new IllegalArgumentException("An order must contain at least one line");
        }
        return new Order(UUID.randomUUID(), customerId, lines, OrderStatus.CREATED);
    }
}
```

La factory protège les invariants dès l’entrée.

### 2) `Strategy` pour les règles variables

Quand un comportement peut changer (tarification, remise, taxation), [[Stratégie]] évite les `if/else` infinis.

```java
public interface PricingStrategy {
    BigDecimal computeTotal(List<OrderLine> lines);
}

public class StandardPricingStrategy implements PricingStrategy {
    @Override
    public BigDecimal computeTotal(List<OrderLine> lines) {
        return lines.stream()
                .map(line -> line.unitPrice().multiply(BigDecimal.valueOf(line.quantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
```

Tu gardes un domaine extensible sans le complexifier.

### 3) `Adapter` pour l’infrastructure

Le port d’application définit un contrat ; l’infrastructure l’implémente avec [[Adaptateur]].

```java
public interface OrderRepository {
    Order save(Order order);
    Optional<Order> findById(UUID id);
}

public class InMemoryOrderRepositoryAdapter implements OrderRepository {
    private final Map<UUID, Order> storage = new HashMap<>();

    @Override
    public Order save(Order order) {
        storage.put(order.id(), order);
        return order;
    }

    @Override
    public Optional<Order> findById(UUID id) {
        return Optional.ofNullable(storage.get(id));
    }
}
```

Le cas d’usage ne dépend ni de JPA, ni d’un framework.

### 4) `Facade` pour exposer un point d’entrée clair

Une [[Façade]] peut simplifier l’accès aux use cases côté client (CLI, REST, batch).

```java
public class OrderFacade {

    private final CreateOrderUseCase createOrderUseCase;

    public OrderFacade(CreateOrderUseCase createOrderUseCase) {
        this.createOrderUseCase = createOrderUseCase;
    }

    public UUID create(CreateOrderCommand command) {
        return createOrderUseCase.handle(command);
    }
}
```

Côté appelant, tu n’as qu’une API métier simple.

## Et les tests dans tout ça ?

Le vrai bénéfice de cette structure apparaît dans les tests :

- tu testes les règles métier sans framework,
- tu testes les use cases avec des doubles de ports,
- tu gardes les tests d’intégration pour les adapters.

Exemple de test unitaire du use case (sans démarrer Spring) :

```java
class CreateOrderUseCaseTest {

    @Test
    void shouldCreateOrderAndPersistIt() {
        OrderRepository repository = new InMemoryOrderRepositoryAdapter();
        PricingStrategy pricing = new StandardPricingStrategy();
        CreateOrderUseCase useCase = new CreateOrderUseCase(repository, pricing);

        CreateOrderCommand command = new CreateOrderCommand(
                "customer-1",
                List.of(new OrderLine("book-1", 2, new BigDecimal("19.90")))
        );

        UUID orderId = useCase.handle(command);

        assertThat(repository.findById(orderId)).isPresent();
    }
}
```

Ce niveau de testabilité va dans le même sens que [[Maîtrisez votre architecture Spring Boot avec ArchUnit]] : rendre les limites de l’architecture explicites et vérifiables.

## Cas d’usage complet

```java
public class CreateOrderUseCase {

    private final OrderRepository orderRepository;
    private final PricingStrategy pricingStrategy;

    public CreateOrderUseCase(OrderRepository orderRepository,
                              PricingStrategy pricingStrategy) {
        this.orderRepository = orderRepository;
        this.pricingStrategy = pricingStrategy;
    }

    public UUID handle(CreateOrderCommand command) {
        Order order = OrderFactory.create(command.customerId(), command.lines());
        BigDecimal total = pricingStrategy.computeTotal(order.lines());
        order.defineTotal(total);
        return orderRepository.save(order).id();
    }
}
```

Ici, on voit bien la chaîne DDD + patterns :

- modèle métier explicite,
- orchestration applicative,
- dépendances inversées via ports,
- techniques encapsulées en adapters.

## Pourquoi ça réduit la dette technique

- Tu isoles les changements techniques (DB, transport, framework).
- Tu testes le métier sans démarrer toute la stack.
- Tu rends l’architecture explicite et lisible pour l’équipe.

Ce n’est pas “du pattern pour du pattern”. C’est de la conception au service du métier.

## Erreurs fréquentes

1. Transformer l’hexagone en mille couches inutiles.
2. Mettre des annotations framework dans le domaine.
3. Confondre “séparation” et “duplication systématique”.
4. Introduire des patterns sans problème concret à résoudre.

Si tu hésites, reviens à la question de base :

> Est-ce que cette décision rend le métier plus clair et le code plus change-friendly ?

## Comment l’adopter progressivement dans un projet existant

Pas besoin de tout réécrire.

Une approche réaliste :

1. Commencer par un seul use case critique.
2. Isoler un premier port (ex: repository métier).
3. Créer un adapter simple (même in-memory au départ).
4. Déplacer progressivement les règles métier hors des contrôleurs/services techniques.
5. Ajouter des tests de non-régression autour des invariants métier.

L’idée est d’introduire la structure au service du produit, pas de lancer un chantier “architecture pour l’architecture”.

## Java pur aujourd’hui, Spring demain ?

Bonne nouvelle : ce modèle fonctionne aussi si tu branches ensuite Spring Boot.

- les use cases restent identiques,
- les ports restent identiques,
- seuls les adapters changent (JPA, REST, messaging...).

Tu peux donc conserver la clarté métier tout en profitant de l’écosystème Spring sur les aspects techniques.

## Conclusion

DDD donne la direction.
Les design patterns donnent des outils.
L’architecture hexagonale fournit la structure.

En Java pur, ce trio permet de construire un code qui tient dans le temps.

Si tu veux approfondir la logique derrière chaque pattern, commence par [[Pourquoi utiliser les Design Patterns ?]], puis traverse les patterns de création, structurels et comportementaux pour voir lesquels répondent à tes vrais besoins.

## Maillage interne

- [[DDD - Définition]]
- [[Les Design Patterns]]
- [[Pourquoi utiliser les Design Patterns ?]]
- [[Factory]]
- [[Stratégie]]
- [[Adaptateur]]
- [[Façade]]
