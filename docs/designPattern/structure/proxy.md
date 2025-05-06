---
layout: default
title: Proxy
tags: [java, tutoriel, design pattern, structure, proxy]
---

# Le design pattern Proxy

## Définition

Le design pattern Proxy est un modèle de conception structurel qui fournit un substitut ou un intermédiaire à un autre objet pour contrôler l'accès à cet objet.  
En Java, un proxy peut être utilisé pour ajouter une couche d'indirection et d'interception, permettant de modifier ou de contrôler l'accès aux fonctionnalités d'un objet sans en altérer le code source.

## ⚖️ Avantages et inconvénients

|   |   |
|---|---|
|- Contrôle d'accès<br>- Réduction des coûts<br>- Gestion des ressources<br>- Ajout de fonctionnalités|- Complexité accrue<br>- Dégradation des performances<br>- Débug plus difficile|

### ➕Avantages

1. **Contrôle d'accès** : Le proxy peut contrôler l'accès à l'objet réel, ce qui est utile pour des raisons de sécurité.
2. **Réduction des coûts** : Un proxy peut différer la création d'un objet coûteux jusqu'à ce qu'il soit réellement nécessaire.
3. **Gestion des ressources** : En utilisant un proxy, les ressources peuvent être gérées plus efficacement, par exemple en instanciant des objets à la demande.
4. **Ajout de fonctionnalités** : Il permet d'ajouter des fonctionnalités supplémentaires telles que la journalisation, la gestion des transactions, ou la mise en cache sans modifier l'objet d'origine.

### ➖Inconvénients

1. **Complexité accrue** : L'ajout de proxies peut augmenter la complexité du système, rendant le code plus difficile à comprendre et à maintenir.
2. **Dégradation des performances** : L'interception des appels de méthode via un proxy peut introduire une surcharge et potentiellement dégrader les performances.
3. **Débug plus difficile** : La présence de proxies peut rendre le débogage plus compliqué car il ajoute un niveau d'indirection entre le client et l'objet réel.

## Exemple d'implémentation

Dans mes précédents articles nous avons les exemples suivant :

- [Personnaliser son café](https://www.sfeir.dev/back/les-design-patterns-structurels-decorateur/)
- [Le fonctionnement d'un coffee shop](https://www.sfeir.dev/back/les-design-patterns-structurels-facade/)
- [Comment choisir la taille de son café](https://www.sfeir.dev/back/les-design-patterns-structurels-pont/)

Il nous reste à voir comment payer ce dernier afin de pouvoir en profiter.  
Dans cet exemple, nous allons implémenter un système de paiement avec différents types de cartes de crédit. Nous aurons une interface `Payment`, une classe `RealPayment` qui représente l'objet réel, et une classe `PaymentProxy` qui agit comme un proxy pour `RealPayment`, en ajoutant des fonctionnalités telles que l'authentification et la journalisation.

[![](https://www.sfeir.dev/content/images/2024/07/Diagramme-sans-nom.drawio--1-.png)](https://www.sfeir.dev/content/images/2024/07/Diagramme-sans-nom.drawio--1-.png)

Diagramme de classe

#### Payment et ses implémentations

L'interface `Payment` définit la méthode `pay`, qui sera implémentée par les classes concrètes pour effectuer un paiement.

```java
public interface Payment {
    void pay(double amount);
}
```

La classe `RealPayment` implémente l'interface `Payment`. Elle représente l'objet réel qui effectue le paiement. La méthode `pay` affiche un message confirmant le traitement du paiement.

```java
public class RealPayment implements Payment {
    private String cardNumber;

    public RealPayment(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    @Override
    public void pay(double amount) {
        System.out.println("Payment of $" + amount + " using card " + cardNumber + " processed.");
    }
}
```

La classe `PaymentProxy` implémente l'interface `Payment` et agit comme un intermédiaire. Elle contrôle l'accès à `RealPayment` en vérifiant l'authentification de l'utilisateur avant d'autoriser le paiement. Si l'utilisateur est authentifié, elle crée une instance de `RealPayment` (si ce n'est pas déjà fait) et appelle sa méthode `pay`. Ensuite, elle journalise la transaction en utilisant la classe `Logger`.

```java
public class PaymentProxy implements Payment {
    private RealPayment realPayment;
    private String cardNumber;
    private boolean isAuthenticated;

    public PaymentProxy(String cardNumber, boolean isAuthenticated) {
        this.cardNumber = cardNumber;
        this.isAuthenticated = isAuthenticated;
    }

    @Override
    public void pay(double amount) {
        if (Authenticator.authenticate(cardNumber, isAuthenticated)) {
            if (realPayment == null) {
                realPayment = new RealPayment(cardNumber);
            }
            realPayment.pay(amount);
            Logger.logTransaction(cardNumber, amount);
        } else {
            System.out.println("Authentication required to process payment.");
        }
    }
}
```

#### Journalisation

La classe `Logger` est une classe utilitaire qui fournit une méthode statique pour journaliser les transactions. Elle affiche un message indiquant le montant du paiement et le numéro de la carte utilisée.

```java
public class Logger {
    public static void logTransaction(String cardNumber, double amount) {
        System.out.println("Logging: Payment of $" + amount + " made with card " + cardNumber);
    }
}
```

Ici nous faisons un simple print en console, mais nous pourrions très bien utiliser d'autres méthodes de journalisation :

- enregistrement en base de donnée
- fichier de log dédié
- ect

#### Authentification

La classe `Authenticator` est une classe utilitaire qui fournit une méthode statique pour vérifier l'authentification des utilisateurs. Elle utilise une logique simplifiée pour authentifier les utilisateurs en fonction d'un booléen `isAuthenticated`.

```java
public class Authenticator {
    public static boolean authenticate(String cardNumber, boolean isAuthenticated) {
        if (isAuthenticated) {
            System.out.println("Authentication successful for card " + cardNumber);
            return true;
        } else {
            System.out.println("Authentication failed for card " + cardNumber);
            return false;
        }
    }
}
```

## Exemple d'utilisation

```java
public static void main(String[] args) {
    Payment payment1 = new PaymentProxy("1111-1111-1111-1111", true);
    payment1.pay(100.00);

    Payment payment2 = new PaymentProxy("2222-2222-2222-2222", false);
    payment2.pay(200.00);
}
```

- **Etape 1** : Création d'un proxy avec authentification réussie

```java
Payment payment1 = new PaymentProxy("1111-1111-1111-1111", true);
payment1.pay(100.00);
```

- Le proxy vérifie l'authentification.
- Le paiement est traité et journalisé.

- **Etape 2** : Création d'un proxy avec échec d'authentification

```java
Payment payment2 = new PaymentProxy("2222-2222-2222-2222", false);
payment2.pay(200.00);
```

- Le proxy vérifie l'authentification.
- Le paiement est refusé en raison d'un échec d'authentification.

Le code suivant donnera le résultat suivant en sortie console :

```text
Authentication successful for card 1111-1111-1111-1111
Payment of $100.0 using card 1111-1111-1111-1111 processed.
Logging: Payment of $100.0 made with card 1111-1111-1111-1111
Authentication failed for card 2222-2222-2222-2222
Authentication required to process payment.
```

## En conclusion

Le design pattern Proxy est efficace pour contrôler l'accès et ajouter des fonctionnalités supplémentaires à des objets.  
Bien qu'il puisse augmenter la complexité et potentiellement dégrader les performances, ses avantages en matière de gestion des ressources, de sécurité et de modularité sont très utiles.