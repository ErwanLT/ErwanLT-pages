---
layout: default
title: Interpréteur
tags: [java, tutoriel, design pattern, comportementaux, interpréteur]
---

# Le design pattern Interpréteur

## Définition

Le design pattern **Interpréteur** est un modèle comportemental qui permet d'interpréter ou d'évaluer un langage ou une grammaire. Il définit une représentation grammaticale d'une langue donnée, ainsi qu'un interpréteur qui utilise cette représentation pour interpréter les phrases de cette langue.  
Chaque élément de la grammaire est représenté par une classe, et les combinaisons d'éléments sont interprétées par des méthodes spécifiques de ces classes. Lorsqu'une expression est passée à l'interpréteur, il utilise la représentation grammaticale pour interpréter et évaluer l'expression selon les règles définies par la grammaire.

## Avantages et inconvénients

|   |   |
|---|---|
|- Structure modulaire<br>- Facilité d'ajout de nouvelles fonctionnalités<br>- Fléxibilité|- Complexité de la conception<br>- Performance<br>- Difficulté de compréhension|

### Avantages

1. **Structure modulaire :** Il permet de décomposer une grammaire complexe en une structure modulaire d'expressions simples, ce qui facilite la maintenance et l'évolution du système.
2. **Facilité d'ajout de nouvelles fonctionnalités :** En ajoutant de nouvelles classes d'expressions ou en modifiant les règles de grammaire, on peut étendre facilement les fonctionnalités de l'interpréteur sans modifier son noyau.
3. **Flexibilité :** L'interpréteur permet d'ajuster dynamiquement les règles de grammaire et les comportements d'interprétation, ce qui le rend flexible pour traiter différents types d'expressions et de langages.

### Inconvénients

1. **Complexité de la conception :** La mise en œuvre de l'interpréteur peut devenir complexe, surtout pour les langages ou les grammaires très complexes. La gestion des interactions entre les différentes classes d'expressions peut être délicate.
2. **Performance :** Dans certains cas, l'interpréteur peut avoir des performances moins efficaces par rapport à d'autres méthodes de traitement des langages, comme la compilation. L'évaluation répétée des expressions peut entraîner des surcoûts de performance, notamment pour les expressions complexes.
3. **Difficulté de compréhension :** Pour les développeurs non familiers avec le design pattern Interpréteur, sa logique peut être difficile à comprendre et à maintenir. La structure en arbre des expressions et les interactions entre les différentes classes peuvent rendre le code moins intuitif.

## Exemple d'implémentation

Pour la suite de cet article, nous utiliserons **2 exemples** :

- une calculatrice
- un système de traduction

[![](https://www.sfeir.dev/content/images/2024/04/Diagramme-sans-nom.drawio--2-.png)](https://www.sfeir.dev/content/images/2024/04/Diagramme-sans-nom.drawio--2-.png)

Pour commencer nous allons déclarer une interface `Expression` en utilisant un [type générique](https://docs.oracle.com/javase/tutorial/java/generics/types.html?ref=sfeir.dev), cette interface sera commune à nos 2 exemples :

```java
public interface Expression<T> {
    T interpret();
}
```

Interface générique

### La calculatrice

La calculatrice que nous allons implémenter sera simple, elle disposera des 4 opérations de base :

- addition
- soustraction
- multiplication
- division

Dans cet exemple, les expressions arithmétiques sont représentées comme des arbres d'expressions où chaque nœud est une opération (comme l'addition ou la soustraction) et chaque feuille est un nombre.

Pour commencer nous allons créer la première implémentation de notre interface `NumberExpression` qui représentera comme son nom l'indique... un nombre.

```java
public class NumberExpression implements Expression<Integer> {
    private int number;

    public NumberExpression(int number) {
        this.number = number;
    }

    @Override
    public Integer interpret() {
        return number;
    }
}
```

Mais créer une calculatrice pour avoir le résultat d'un seul nombre n'a pas vraiment d'intérêt, nous allons donc créer une nouvelle expression `ComputeExpression` :

```java
public abstract class ComputeExpression<T> implements Expression<T> {
    protected Expression<T> left;
    protected Expression<T> right;

    public ComputeExpression(Expression<T> left, Expression<T> right) {
        this.left = left;
        this.right = right;
    }
}
```

Son rôle principal est de fournir une structure de base réutilisable pour les expressions arithmétiques, en déléguant l'interprétation des opérations aux sous-expressions gauche et droite.

Il ne nous reste plus qu'à déclarer nos opérations :

```java
public class AddExpression extends ComputeExpression<Integer> {
    public AddExpression(Expression<Integer> left, Expression<Integer> right) {
        super(left, right);
    }
    
    @Override
    public Integer interpret() {
        return left.interpret() + right.interpret();
    }
}

public class SubtractExpression extends ComputeExpression<Integer> {
    public SubtractExpression(Expression<Integer> left, Expression<Integer> right) {
        super(left, right);
    }

    @Override
    public Integer interpret() {
        return left.interpret() - right.interpret();
    }
}

public class MultiplyExpression extends ComputeExpression<Integer>{
    public MultiplyExpression(Expression<Integer> left, Expression<Integer> right) {
        super(left, right);
    }

    @Override
    public Integer interpret() {
        return left.interpret() * right.interpret();
    }
}

public class DivideExpression extends ComputeExpression<Integer>{
    public DivideExpression(Expression<Integer> left, Expression<Integer> right) {
        super(left, right);
    }

    @Override
    public Integer interpret() {
        return left.interpret() / right.interpret();
    }
}
```

Nous verrons par la suite comment utiliser ces expressions.

### Le système de traduction

Nous allons également développer un système de traduction de phrases simple en utilisant le design pattern **Interpréteur**. Chaque mot dans une phrase est interprété et traduit en utilisant un contexte de traduction spécifique à une langue.

Pour ce faire, nous allons devoir déclarer une nouvelle implémentation à notre interface Expression, `WordExpression` :

```java
public class WordExpression implements Expression<String> {
    private String word;
    private TranslationContext translationContext;

    public WordExpression(String word, TranslationContext translationContext) {
        this.word = word;
        this.translationContext = translationContext;
    }

    @Override
    public String interpret() {
        return translationContext.translateWord(word);
    }
}
```

Comme vous pouvez le constater, cette implémentation utilisera un contexte `TranslationContext`

```java
public interface TranslationContext {
    String translateWord(String word);
}
```

Cette interface représente une opération permettant de traduire un mot d'une langue source vers une langue cible. Cette interface peut être implémentée par différentes classes qui fournissent des contextes de traduction spécifiques à des langues particulières. Dans notre exemple nous aurons un contexte de traduction en anglais et un autre en français :

```java
public class EnglishTranslationContext implements TranslationContext {
    private Map<String, String> translations;

    public EnglishTranslationContext() {
        translations = new HashMap<>();
        translations.put("hello", "hello");
        translations.put("world", "world");
        translations.put("java", "Java");
    }

    @Override
    public String translateWord(String word) {
        return translations.getOrDefault(word, word);
    }
}

public class FrenchTranslationContext implements TranslationContext{
    private Map<String, String> translations;

    public FrenchTranslationContext() {
        translations = new HashMap<>();
        translations.put("hello", "bonjour");
        translations.put("world", "monde");
        translations.put("java", "Java");
    }

    @Override
    public String translateWord(String word) {
        return translations.getOrDefault(word, word);
    }
}
```

Maintenant que nous avons toutes nos classes, il est temps de voir comment les utiliser entre elles.

## Exemple d'utilisation

Comme j'ai 2 cas d'utilisation, ma méthode main aura 2 fonctions distincte pour ne pas nous emmêler les pinceaux :

```java
public static void main(String[] args) {
    computeExpression();
    translateExpression();
}
```

méthode main

Voyons dans un premier temps la méthode `computeExpression` qui correspond à nos expressions arithmétiques :

```java
private static void computeExpression() {
    Expression<Integer> expr1 = new NumberExpression(10);
    Expression<Integer> expr2 = new NumberExpression(5);
    Expression<Integer> expr3 = new NumberExpression(3);

    Expression<Integer> multiplication = new MultiplyExpression(
            new AddExpression(expr2, expr3),
            expr1
    );
    int result = multiplication.interpret();
    System.out.println("Result: " + result);
}
```

méthode compute

Je commence par déclarer 3 expressions qui représenteront mes nombres : 10, 5 et 3. Ensuite, j'utilise différentes expressions de calcul, ici `MultiplyExpression` et `AddExpression` afin de créer le calcul suivant **`(5 + 3) * 10`.**

L'utilisation de plusieurs expressions nous permet de découper notre opération en plusieurs blocs qui permettront de respecter [les règles de priorité des opérations](https://fr.wikipedia.org/wiki/Ordre_des_op%C3%A9rations?ref=sfeir.dev) : le contenu de la parenthèse avant la multiplication.

Le code suivant aura comme sortie en console :

```log
80
```

sortie console opération

Maintenant, passons à la méthode `translateExpression`

```java
private static void translateExpression() {
    Expression<String> expr4 = new WordExpression("hello", new FrenchTranslationContext());
    Expression<String> expr5 = new WordExpression("world", new FrenchTranslationContext());
    Expression<String> expr6 = new WordExpression("java", new FrenchTranslationContext());

    System.out.println("French Translation:");
    System.out.println(expr4.interpret() + " " + expr5.interpret() + " " + expr6.interpret());
}
```

méthode translate

Je commence par lui déclarer des expressions qui représenteront des mots, avec un contexte de traduction en français.

Ce code se traduira en console par la sortie suivante :

```log
French Translation:
bonjour monde Java
```

sortie console traduction

## En conclusion

Le design pattern **Interpréteur** est un outil puissant pour implémenter des systèmes de traitement de langages ou d'expressions. Il permet de décomposer des problèmes complexes en structures modulaires et facilite l'extension et la maintenance des systèmes.  
En utilisant ce design pattern, vous pouvez créer des systèmes de requêtes, des systèmes de traduction, des analyseurs syntaxiques et bien plus encore, en offrant une flexibilité et une extensibilité accrue.