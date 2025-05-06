---
layout: default
title: Décorateur
tags: [java, tutoriel, design pattern, structure, décorateur]
---

# Le design pattern Décorateur

## Définition

Le design pattern [**Décorateur**](https://www.sfeir.dev/back/du-bruit-avec-kotlin-2/#d%C3%A9corateurs), aussi connu sous le nom de **Wrapper**, permet d’ajouter dynamiquement des comportements ou des responsabilités à un objet sans modifier son code.  
Il favorise l'utilisation de la composition plutôt que de l'héritage pour l'extension des fonctionnalités.  
Le décorateur enveloppe l'objet d'origine et ajoute de nouvelles fonctionnalités tout en déléguant les appels à l'objet encapsulé.

## ⚖️ Avantages et inconvénients

|   |   |
|---|---|
|- Flexibilité accrue<br>- Combinaison de comportements<br>- Responsabilité unique<br>- Réutilisabilité|- Complexité accrue<br>- Difficile à debug<br>- Performance|

### ➕Avantages

1. **Flexibilité accrue** : Contrairement à l'héritage, le décorateur permet d'ajouter des fonctionnalités de manière dynamique et flexible à un objet.
2. **Combinaison de comportements** : Les décorateurs peuvent être empilés les uns sur les autres, permettant ainsi de combiner différentes fonctionnalités de manière modulaire.
3. [**Responsabilité unique**](https://www.sfeir.dev/kesaco-les-principes-solid/#:~:text=S%20Comme%20Single%2DResponsibility) : Chaque décorateur a une seule responsabilité, ce qui rend le code plus facile à maintenir et plus lisible.
4. [**Réutilisabilité**](https://www.sfeir.dev/kesaco-les-principes-solid/#:~:text=L%20comme%20Liskov%20Substitution) : Les composants peuvent être réutilisés indépendamment dans différents contextes sans avoir besoin de dupliquer le code.

### ➖Inconvénients

1. **Complexité accrue** : L'utilisation de plusieurs décorateurs peut rendre la compréhension du code plus difficile, surtout si les décorateurs sont imbriqués.
2. **Difficile à débug** : La multiplication des couches de décoration peut rendre le débogage et le suivi des appels plus complexes.
3. **Performance** : Chaque appel de méthode passe par plusieurs objets, ce qui peut légèrement dégrader les performances.

## Exemple d'implémentation

Comme sans doute la plupart des développeurs je consomme régulièrement une boisson noire et amère : le café.  
Il y'a quelques années de nombreux établissements spécialisés dans cette boisson ont ouvert un peu partout proposant bien sur du café, et d'autre dérivés de ce dernier, nous allons donc utilisé cet exemple dans la suite de cet article.

[![](https://www.sfeir.dev/content/images/2024/05/decorator.drawio.png)](https://www.sfeir.dev/content/images/2024/05/decorator.drawio.png)

diagramme de classe

Dans notre exemple, nous allons aussi voir le principe de substitution de Liskov :

> _Si S est un sous-type de T alors tout objet de type T peut être remplacé par un objet de type S sans altérer les propriétés désirables du programme concerné_

#### Coffee et ses implémentations :

Nous allons commencer par déclarer une interface `Coffee`

```java
public interface Coffee {
    double getCost();
    String getDescription();
}
```

Coffee interface

`Coffee` est l'interface de base pour tous les types de café. Elle déclare les méthodes `getCost` et `getDescription` que toutes les classes de café doivent implémenter.

Nous allons ensuite créer notre première implémentation de cette interface, `SimpleCoffee`.

```java
public class SimpleCoffee implements Coffee{
    @Override
    public double getCost() {
        return 1;
    }

    @Override
    public String getDescription() {
        return "Un café classique";
    }
}
```

`SimpleCoffee` représente un café de base sans décoration. Il implémente les méthodes `getCost` et `getDescription` de l'interface `Coffee`.

Nous allons ensuite créer une classe abstraite `CoffeeDecorator` qui implémente l'interface `Coffee` et contient une référence à un objet `Coffee`.

```java
public abstract class CoffeeDecorator implements Coffee {
    protected Coffee decoratedCoffee;

    public CoffeeDecorator(Coffee coffee) {
        this.decoratedCoffee = coffee;
    }

    @Override
    public double getCost() {
        return decoratedCoffee.getCost();
    }

    @Override
    public String getDescription() {
        return decoratedCoffee.getDescription();
    }
}
```

`CoffeeDecorator` sert de classe de base pour tous les décorateurs de café. Elle implémente les méthodes de l'interface `Coffee` en déléguant les appels à l'objet `Coffee` encapsulé.

#### Création des décorateurs :

Dans notre exemple, nous aurons 2 extensions à notre décorateur de base :

- `MilkDecorator`
- `SugarDecorator`

```java
public class MilkDecorator extends CoffeeDecorator{

    public MilkDecorator(Coffee coffee) {
        super(coffee);
    }

    public double getCost() {
        return super.getCost() + 1.5;
    }

    @Override
    public String getDescription() {
        return super.getDescription() + ", avec du lait";
    }
}

public class SugarDecorator extends CoffeeDecorator{
    public SugarDecorator(Coffee coffee) {
        super(coffee);
    }

    public double getCost() {
        return super.getCost() + 0.5;
    }

    @Override
    public String getDescription() {
        return super.getDescription() + ", avec du sucre";
    }
}
```

Ces décorateurs modifient le cout du café en ajoutant le cout de l'ingrédient ajouté, et modifient également la description pour y ajouter le dit ingrédient.

## Exemple d'utilisation

```java
public static void main(String[] args) {
    Coffee coffee = new SimpleCoffee();
    System.out.println(coffee.getDescription() + " €" + coffee.getCost());

    coffee = new MilkDecorator(coffee);
    System.out.println(coffee.getDescription() + " €" + coffee.getCost());

    coffee = new SugarDecorator(coffee);
    System.out.println(coffee.getDescription() + " €" + coffee.getCost());
}
```

voyons un peu plus en profondeur ce que nous faisons ici :

**Création d'un café simple** : Nous commençons par créer un objet `SimpleCoffee`.

```java
Coffee coffee = new SimpleCoffee();
System.out.println(coffee.getDescription() + " €" + coffee.getCost());
```

**Ajout de lait** : Nous enveloppons l'objet `coffee` avec `MilkDecorator`. Bien que l'objet original soit de type `SimpleCoffee`, il est maintenant traité comme un objet de type `Coffee` avec du lait ajouté.

```java
coffee = new MilkDecorator(coffee);
System.out.println(coffee.getDescription() + " €" + coffee.getCost());
```

**Ajout de sucre** : De même, nous enveloppons le café (qui a déjà du lait) avec `SugarDecorator`, en continuant à traiter l'objet comme un `Coffee`.

```java
coffee = new SugarDecorator(coffee);
System.out.println(coffee.getDescription() + " €" + coffee.getCost());
```

Plus haut je vous avait parlé de la substitution de Liskov, c'est ici qu'elle entre en jeu. En effet, nous pouvons substituer des instances de `Coffee` par des instances de `SimpleCoffee`, `MilkDecorator`, et `SugarDecorator` sans modifier le code client.

Le code suivant donnera le résultat suivant en sortie console :

```text
Un café classique €1.0
Un café classique, avec du lait €2.5
Un café classique, avec du lait, avec du sucre €3.0
```

## En conclusion

Le design pattern Décorateur permet d'ajouter des fonctionnalités à des objets de manière dynamique. Bien qu'il puisse introduire une certaine complexité dans le code, ses avantages en termes de modularité et de réutilisabilité en font un choix précieux dans de nombreux scénarios.