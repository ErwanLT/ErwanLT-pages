---
layout: default
title: Composite
tags: [java, tutoriel, design pattern, structure, composite]
---

# Le design pattern Composite

## Définition

Le design pattern Composite permet de composer des objets en structures arborescentes pour représenter des hiérarchies.  
Imaginez un arbre : l'arbre complet représente l'ensemble de la structure, les branches représentent les compositions d'objets (les composites), et les feuilles représentent les objets individuels (les feuilles). De la même manière qu'un arbre peut être constitué de branches et de feuilles, une structure composite permet de combiner des objets simples et des compositions d'objets pour former une hiérarchie complexe.

## ⚖️ Avantages et inconvénients

|   |   |
|---|---|
|- Manipulation des hiérarchies complexes<br>- Ajout de nouveaux composant<br>- Flexibilité et extensibilité|- Gestion de la complexité<br>- Difficulté de mise en œuvre|

### ➕Avantages

1. **Manipulation des hiérarchies complexes** : Le pattern Composite permet de traiter les objets simples (les feuilles) et les compositions d'objets (les branches) de manière uniforme. Cela simplifie le code client qui n'a pas besoin de connaître la différence entre un objet simple et une composition d'objets.
2. **Ajout de nouvelles composantes** : Le pattern permet d'ajouter facilement de nouvelles composantes (feuilles ou composites) sans modifier le code existant.
3. **Flexibilité et extensibilité** : La structure arborescente permet de représenter facilement des hiérarchies complexes et de les étendre au besoin.

### ➖Inconvénients

1. **Gestion de la complexité** : Bien que le pattern Composite simplifie la manipulation des hiérarchies complexes, il peut introduire une certaine complexité dans la gestion des objets, notamment en ce qui concerne les opérations spécifiques à certaines classes.
2. **Difficulté de mise en œuvre** : Il peut être difficile de restreindre les types d'objets qui peuvent être ajoutés à une composition, ce qui peut entraîner des erreurs si des objets inappropriés sont ajoutés.

## Exemple d'implémentation

Pour illustrer le design pattern Composite, nous allons implémenter un arbre généalogique en Java. Cet exemple comprend des individus et des familles, chaque famille pouvant contenir des conjoints et des enfants.

[![](https://www.sfeir.dev/content/images/2024/05/composite.drawio.png)](https://www.sfeir.dev/content/images/2024/05/composite.drawio.png)

diagramme de classe

Pour se faire, nous allons créer une interface `Personne`

```java
public interface Personne {
    void afficher(int niveau);
    void ajouterEnfant(Personne enfant);
    void ajouterConjoint(Personne conjoint);
    List<Personne> getEnfants();
    Personne getConjoint();
    String getNom();
    int getAge();
    String getSexe();
}
```

interface Personne

L'interface `Personne` définit les méthodes nécessaires pour manipuler les individus et les familles dans l'arbre généalogique. Les méthodes incluent `afficher`, `ajouterEnfant`, `ajouterConjoint`, ainsi que des méthodes pour obtenir les informations de base sur la personne ou la famille.

Nous allons ensuite créer une première implémentation de cette interface, la classe `Individu`

```java
public class Individu implements Personne {
    private String nom;
    private int age;
    private String sexe;

    public Individu(String nom, int age, String sexe) {
        this.nom = nom;
        this.age = age;
        this.sexe = sexe;
    }

    @Override
    public void afficher(int niveau) {
        String indentation = " ".repeat(niveau * 4);
        System.out.println(indentation + nom + ", " + age + " ans, " + sexe);
    }

    @Override
    public void ajouterEnfant(Personne enfant) {
        // Un individu simple ne peut pas avoir d'enfants directement.
        throw new UnsupportedOperationException("Un individu simple ne peut pas avoir d'enfants.");
    }

    @Override
    public void ajouterConjoint(Personne conjoint) {
        // Un individu simple ne peut pas avoir de conjoint directement.
        throw new UnsupportedOperationException("Un individu simple ne peut pas avoir de conjoint.");
    }

    @Override
    public List<Personne> getEnfants() {
        return new ArrayList<>(); // Un individu simple n'a pas d'enfants.
    }

    @Override
    public Personne getConjoint() {
        return null; // Un individu simple n'a pas de conjoint.
    }

    @Override
    public String getNom() {
        return nom;
    }

    @Override
    public int getAge() {
        return age;
    }

    @Override
    public String getSexe() {
        return sexe;
    }
}
```

classe Individu

La classe `Individu` implémente l'interface `Personne`. Chaque individu est une feuille de l'arbre. La méthode `afficher` affiche les détails de l'individu avec une indentation appropriée. Les méthodes `ajouterEnfant` et `ajouterConjoint` lèvent des exceptions car un individu ne peut pas avoir d'enfants ou de conjoint directement.

Passons maintenant à notre deuxième implémentation, la classe `Famille`.

```java
public class Famille implements Personne {
    private Personne conjoint1;
    private Personne conjoint2;
    private List<Personne> enfants;

    public Famille(Personne conjoint1, Personne conjoint2) {
        this.conjoint1 = conjoint1;
        this.conjoint2 = conjoint2;
        this.enfants = new ArrayList<>();
    }

    @Override
    public void afficher(int niveau) {
        String indentation = " ".repeat(niveau * 4);
        System.out.println(indentation + "Famille:");
        System.out.println(indentation + "  Conjoints:");
        conjoint1.afficher(niveau + 2);
        conjoint2.afficher(niveau + 2);
        System.out.println(indentation + "  Enfants:");
        for (Personne enfant : enfants) {
            enfant.afficher(niveau + 2);
        }
    }

    @Override
    public void ajouterEnfant(Personne enfant) {
        enfants.add(enfant);
    }

    @Override
    public void ajouterConjoint(Personne conjoint) {
        throw new UnsupportedOperationException("Une famille ne peut pas ajouter de conjoint.");
    }

    @Override
    public List<Personne> getEnfants() {
        return enfants;
    }

    @Override
    public Personne getConjoint() {
        throw new UnsupportedOperationException("Une famille ne peut pas avoir un conjoint unique.");
    }

    @Override
    public String getNom() {
        return conjoint1.getNom() + " & " + conjoint2.getNom();
    }

    @Override
    public int getAge() {
        throw new UnsupportedOperationException("Une famille n'a pas un âge unique.");
    }

    @Override
    public String getSexe() {
        throw new UnsupportedOperationException("Une famille n'a pas un sexe unique.");
    }
}
```

classe Famille

La classe `Famille` implémente l'interface `Personne` et représente un composite. Une famille peut avoir deux conjoints et des enfants. La méthode `afficher` affiche les conjoints et les enfants avec une indentation appropriée. La méthode `ajouterEnfant` permet d'ajouter des enfants à la famille.

## Exemple d'utilisation

```java
public static void main(String[] args) {
    Personne philippe = new Individu("Philippe", 62, "Homme");
    Personne isabelle = new Individu("Isabelle", 57, "Femme");
    Famille grandsParents = new Famille(philippe, isabelle);

    Personne erwan = new Individu("Erwan", 33, "Homme");
    Personne amelie = new Individu("Amélie", 34, "Femme");
    Famille familleParent1 = new Famille(erwan, amelie);

    Personne alan = new Individu("Alan", 30, "Homme");
    Personne katell = new Individu("Katell", 27, "Femme");
    Personne mathys = new Individu("Mathys", 5, "Homme");


    familleParent1.ajouterEnfant(mathys);
    grandsParents.ajouterEnfant(familleParent1);
    grandsParents.ajouterEnfant(alan);
    grandsParents.ajouterEnfant(katell);

    System.out.println("Arbre généalogique des grands-parents:");
    grandsParents.afficher(0);

}
```

méthode main

Ici ma méthode main se compose principalement de trois sections :

- la création des individus et des familles
- la structuration de l'arbre généalogique
- l'affichage de l'arbre

#### Création des grands-parents :

```java
Personne philippe = new Individu("Philippe", 62, "Homme");
Personne isabelle = new Individu("Isabelle", 57, "Femme");
Famille grandsParents = new Famille(philippe, isabelle);
```

Ici, nous créons deux individus représentant les grands-parents et les regroupons dans une instance de la classe `Famille`.

#### Création des parents

```java
Personne erwan = new Individu("Erwan", 33, "Homme");
Personne amelie = new Individu("Amélie", 34, "Femme");
Famille familleParent1 = new Famille(erwan, amelie);
```

Nous répétons l'opération pour les parents.

#### Création des enfant et ajout dans les familles

```java
Personne alan = new Individu("Alan", 30, "Homme");
Personne katell = new Individu("Katell", 27, "Femme");
Personne mathys = new Individu("Mathys", 5, "Homme");

familleParent1.ajouterEnfant(mathys);
grandsParents.ajouterEnfant(familleParent1);
grandsParents.ajouterEnfant(alan);
grandsParents.ajouterEnfant(katell);
```

Les enfants sont créés et ajoutés aux familles appropriées à l'aide de la méthode `ajouterEnfant`.

#### Affichage de l'arbre

```java
System.out.println("Arbre généalogique des grands-parents:");
grandsParents.afficher(0);
```

Enfin, nous affichons l'arbre généalogique en appelant la méthode `afficher` sur la famille des grands-parents, avec un niveau d'indentation initial de 0.  
Ce qui donnera le rendu suivant en sortie console :

```log
Arbre généalogique des grands-parents:
Famille:
  Conjoints:
        Philippe, 62 ans, Homme
        Isabelle, 57 ans, Femme
  Enfants:
        Famille:
          Conjoints:
                Erwan, 33 ans, Homme
                Amélie, 34 ans, Femme
          Enfants:
                Mathys, 5 ans, Homme
        Alan, 30 ans, Homme
        Katell, 27 ans, Femme
```

sortie en console

## En conclusion

Le design pattern Composite est une solution élégante pour traiter des structures hiérarchiques complexes de manière uniforme.  
Il permet de simplifier le code client en masquant la différence entre les objets simples et les compositions d'objets.