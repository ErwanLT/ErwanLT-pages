---
layout: default
title: Pont
tags: [java, tutoriel, design pattern, structure, pont]
---

# Le design pattern Pont

## Définition

Le design pattern **Pont** permet de découpler une abstraction d'une implémentation afin qu'elles puissent évoluer indépendamment.  
Il permet de séparer la logique d'une classe de sa représentation physique, facilitant ainsi la gestion et l'extension du code.  
Le pattern **Pont** utilise la composition plutôt que l'héritage, permettant de combiner des implémentations et des abstractions de manière plus flexible.

## ⚖️ Avantages et inconvénients

|   |   |
|---|---|
|- Séparation des préoccupations<br>- Flexibilité<br>- Réduction de la complexité<br>- Composition|- Complexité accrue<br>- Maintenance|

### ➕Avantages

1. **Séparation des préoccupations** : En séparant l'abstraction de son implémentation, il devient plus facile de gérer et de maintenir le code. Cela améliore la clarté et la lisibilité du code.
2. **Flexibilité** : Les abstractions et les implémentations peuvent évoluer indépendamment. On peut changer une implémentation sans affecter l'abstraction et vice versa.
3. **Réduction de la complexité** : Le pattern réduit le nombre de sous-classes nécessaires. Au lieu de créer plusieurs classes pour chaque combinaison d'abstraction et d'implémentation, on crée des classes indépendantes qui peuvent être combinées dynamiquement.
4. **Composition** : Plutôt que d'utiliser un héritage rigide, le pattern favorise la composition, permettant une plus grande modularité et réutilisabilité du code.

### ➖Inconvénients

1. **Complexité accrue** : L'introduction de couches supplémentaires peut rendre le code plus complexe à comprendre pour les développeurs qui ne sont pas familiers avec le pattern.
2. **Maintenance** : La séparation stricte entre l'abstraction et l'implémentation peut parfois mener à une surcharge de maintenance, surtout si le modèle est mal appliqué ou dans des cas où il n'est pas nécessaire.

## Exemple d'implémentation

Dans mes articles précédents sur les design patterns [Décorateur](https://www.sfeir.dev/back/les-design-patterns-structurels-decorateur/) et [Façade](https://www.sfeir.dev/back/les-design-patterns-structurels-facade/), j'ai utilisé l'exemple de [types de cafés différents](https://www.sfeir.dev/back/les-design-patterns-structurels-decorateur/) ainsi que d'une boutique spécialisée dans la vente de ce dernier. Généralement dans ce genre d'établissement nous avons aussi la possibilité de choisir la taille de notre boisson. C'est ce que nous verrons dans notre exemple d'implémentation.

[![diagramme de classe](https://www.sfeir.dev/content/images/2024/06/bridge.drawio.png)](https://www.sfeir.dev/content/images/2024/06/bridge.drawio.png)

implémentation

#### Classe abstraite

La classe abstraite `Coffee` définit l'interface pour les types de cafés et contient une référence à une implémentation de `CoffeeSize`.

```java
public abstract class Coffee {
    protected CoffeeSize size;

    protected Coffee(CoffeeSize size) {
        this.size = size;
    }

    abstract public void prepare();
}
```

#### Implémentation : CoffeeSize

L'interface `CoffeeSize` définit l'interface pour les tailles de café.

```java
public interface CoffeeSize {
    void applySize();
}
```

#### Implémentation concrète des tailles de café

Les classes `SmallSize`, `MediumSize`, et `LargeSize` implémentent l'interface `CoffeeSize` et fournissent des implémentations spécifiques pour chaque taille de café.

```java
public class SmallSize implements CoffeeSize {
    public void applySize() {
        System.out.println("Preparing a small coffee.");
    }
}

public class MediumSize implements CoffeeSize {
    public void applySize() {
        System.out.println("Preparing a medium coffee.");
    }
}

public class LargeSize implements CoffeeSize {
    public void applySize() {
        System.out.println("Preparing a large coffee.");
    }
}
```

#### Abstraction concrète : Types de cafés

Les classes `Espresso` et `Latte` étendent la classe abstraite `Coffee` et fournissent des implémentations spécifiques pour chaque type de café.

```java
class Espresso extends Coffee {

    public Espresso(CoffeeSize size) {
        super(size);
    }

    @Override
    public void prepare() {
        System.out.print("Espresso: ");
        size.applySize();
    }
}

class Latte extends Coffee {

    public Latte(CoffeeSize size) {
        super(size);
    }

    @Override
    public void prepare() {
        System.out.print("Latte: ");
        size.applySize();
    }
}
```

## Exemple d'utilisation

```java
public static void main(String[] args) {
    Coffee smallEspresso = new Espresso(new SmallSize());
    Coffee mediumLatte = new Latte(new MediumSize());
    Coffee largeEspresso = new Espresso(new LargeSize());

    smallEspresso.prepare();
    mediumLatte.prepare();
    largeEspresso.prepare();
}
```

Voyons un peu plus en profondeur ce que nous faisons ici :

1. **Création d'un Espresso de petite taille :**

```java
Coffee smallEspresso = new Espresso(new SmallSize());
```

Cette ligne crée un objet `Espresso` avec une taille `SmallSize`. Le constructeur de `Espresso` appelle le constructeur de `Coffee`, passant la référence à l'objet `SmallSize`

2. **Création d'un Latte de taille moyenne** :

```java
Coffee mediumLatte = new Latte(new MediumSize());
```

Cette ligne crée un objet `Latte` avec une taille `MediumSize`. De même, le constructeur de `Latte` appelle le constructeur de `Coffee`, passant la référence à l'objet `MediumSize`.

3. **Création d'un Espresso de grande taille** :

```java
Coffee largeEspresso = new Espresso(new LargeSize());
```

Cette ligne crée un objet `Espresso` avec une taille `LargeSize`. Le constructeur de `Espresso` appelle le constructeur de `Coffee`, passant la référence à l'objet `LargeSize`.

4. **Préparation des cafés** :

```java
smallEspresso.prepare();
mediumLatte.prepare();
largeEspresso.prepare();
```

Chaque appel à la méthode `prepare` affiche le type de café et applique la taille correspondante. La méthode `prepare` dans les classes `Espresso` et `Latte` appelle `applySize` de l'objet `CoffeeSize` associé, ce qui imprime le message spécifique pour la taille du café.

L'exécution du code suivant donnera la sortie suivante en console :

```text
Espresso: Preparing a small coffee.
Latte: Preparing a medium coffee.
Espresso: Preparing a large coffee.
```

## En conclusion

Le design pattern Pont est particulièrement utile pour découpler les différentes parties d'un système, comme dans l'exemple du café.  
Il permet de créer des systèmes flexibles et facilement extensibles, où les abstractions et leurs implémentations peuvent évoluer indépendamment.

⚠️ L'utilisation de ce pattern peut introduire une complexité supplémentaire.