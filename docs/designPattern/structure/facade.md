---
layout: default
title: Façade
tags: [java, tutoriel, design pattern, structure, facade]
---

# Le design pattern Façade

## Définition

Le design pattern **Façade** fournit une interface simplifiée à un ensemble de classes ou à un sous-système complexe.  
Il agit comme une "façade" qui cache la complexité des interactions internes, offrant aux clients une interface plus simple et plus facile à utiliser.  
Ce pattern est particulièrement utile lorsque vous avez un système complexe avec de nombreuses classes interconnectées, et que vous souhaitez fournir une interface plus intuitive pour les utilisateurs de ce système.

## ⚖️ Avantages et inconvénients

|   |   |
|---|---|
|- Simplification de l'interface<br>- Réduction de la dépendance<br>- Encapsulation<br>- Facilité de maintenance|- Couche supplémentaire<br>- Masquage excessif|

### ➕Avantages

1. **Simplification de l'interface** : La façade offre une interface simplifiée et unifiée pour un ensemble de classes ou un sous-système, rendant le code plus facile à comprendre et à utiliser.
2. **Réduction de la dépendance** : En utilisant une façade, les clients n'ont pas besoin de connaître les détails des classes internes du système. Cela réduit les dépendances entre les composants du système.
3. **Encapsulation** : La façade masque la complexité du système et protège les composants internes des modifications, favorisant ainsi une meilleure encapsulation.
4. **Facilité de maintenance** : Avec une interface simplifiée, il devient plus facile de modifier ou de mettre à jour le sous-système sans impacter les clients qui utilisent la façade.

### ➖Inconvénients

1. **Couche supplémentaire** : L'utilisation d'une façade introduit une couche supplémentaire d'abstraction, ce qui peut parfois ajouter une légère surcharge en matière de performance et de complexité.
2. **Masquage excessif** : Dans certains cas, la façade peut masquer trop de détails du sous-système, limitant ainsi la flexibilité et les possibilités d'optimisation pour les utilisateurs avancés.

## Exemple d'implémentation

Dans mon précédent [article sur le design pattern Décorateur](https://www.sfeir.dev/back/les-design-patterns-structurels-decorateur/), nous avons utilisé l'exemple du café. Ici nous utiliserons l'exemple d'une boutique d'une grande enseigne en vente de boisson caféinée.

[![](https://www.sfeir.dev/content/images/2024/06/facade.drawio.png)](https://www.sfeir.dev/content/images/2024/06/facade.drawio.png)

Dans cette boutique, nous aurons plusieurs rôles d'employés, y compris le barista cuisinier, le serveur et le caissier. Nous allons créer une façade pour simplifier l'interface de ce système.

#### Sous système

La classe `Barista` est responsable de la préparation des cafés, elle contient une méthode `prepareCoffee` qui prend le nom d'un café en paramètre et simule la préparation de ce dernier.

```java
public class Barista {
    public void prepareCoffee(String coffee) {
        System.out.println("Préparation du café: " + coffee);
    }
}
```

La classe `Waiter` est responsable de la prise de commande et du service des cafés. Elle contient deux méthodes : `takeOrder` pour prendre une commande et `serveCoffee` pour servir le plat au client.

```java
public class Waiter {
    public void takeOrder(String order) {
        System.out.println("Prise de commande: " + order);
    }

    public void serveCoffee(String coffee) {
        System.out.println("Service du café: " + coffee);
    }
}
```

La classe `Cashier` est responsable du traitement des paiements. Elle contient une méthode `processPayment` qui prend une commande en paramètre et simule le traitement du paiement.

```java
public class Cashier {
    public void processPayment(String order) {
        System.out.println("Traitement du paiement pour la commande: " + order);
    }
}
```

#### Façade

La classe CoffeeShopFacade simplifie l'interaction avec les différents rôles des employés. Elle encapsule les instances de `Barista`, `Waiter` et `Cashier`, et fournit une méthode `completeOrder` qui orchestre les opérations nécessaires pour compléter une commande.

```java
public class CoffeeShopFacade {
    private Waiter waiter;
    private Barista barista;
    private Cashier cashier;

    public CoffeeShopFacade() {
        this.waiter = new Waiter();
        this.barista = new Barista();
        this.cashier = new Cashier();
    }

    public void completeOrder(String order) {
        waiter.takeOrder(order);
        barista.prepareCoffee(order);
        waiter.serveCoffee(order);
        cashier.processPayment(order);
    }
}
```

## Exemple d'utilisation

Dans notre classe `Main`, nous créons une instance de `CoffeeShopFacade` et utilisons la méthode `completeOrder` pour passer une commande. Le client n'a pas besoin de connaître les détails des interactions entre les différents rôles.

```java
public static void main(String[] args) {
    CoffeeShopFacade coffeeShop = new CoffeeShopFacade();
    coffeeShop.completeOrder("Cappucino");
}
```

L'exécution du code ci-dessus donnera le résultat suivant en console :

```text
Prise de commande: Cappucino
Préparation du café: Cappucino
Service du café: Cappucino
Traitement du paiement pour la commande: Cappucino
```

## En conclusion

Le design pattern Facade simplifie les interactions avec des systèmes complexes en offrant une interface simple. Bien qu'il ajoute une couche d'abstraction supplémentaire, les avantages en matière de simplification, réduction des dépendances et facilité de maintenance l'emportent souvent sur les inconvénients.