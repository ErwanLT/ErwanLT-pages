---
layout: default
title: Stratégie
tags: [java, tutoriel, design pattern, comportementaux, stratégie]
---

# Le design pattern Stratégie

## Définition

En programmation orientée objet, le design pattern Stratégie définit une famille d'algorithmes, encapsulant chacun d'eux, et les rendant interchangeables. Il permet à un client de choisir un algorithme parmi plusieurs sans modifier la structure du code. Cela favorise la flexibilité et l'extensibilité du code.

## Exemple d'implémentation

[![](https://www.sfeir.dev/content/images/2024/01/strategy.drawio--1-.png)](https://www.sfeir.dev/content/images/2024/01/strategy.drawio--1-.png)

Ici, nous avons l'interface _IOperationStrategy_ que toutes les stratégies que nous allons utiliser implémenteront.

```java
public interface IOperationStrategy {
    int compute();
}
```

Nous avons ensuite les stratégies qui seront utilisés et qui implémenteront notre interface :

```java
public final class PlusOperationStrategy extends AbstractOperationStrategy {

    public PlusOperationStrategy(int a, int b){
        super(a, b);
    }

    @Override
    public int compute() {
        return getA() + getB();
    }
}

public final class MinusOperationStrategy extends AbstractOperationStrategy{

    public MinusOperationStrategy(int a, int b){
        super(a, b);
    }

    @Override
    public int compute() {
        return getA() - getB();
    }
}
```

...

Puisque mes stratégies partagent le même supertype, je pourrais plus tard les substituer les unes aux autres en fonction du comportement voulu.

Maintenant que j'ai mes stratégies, il me reste à créer un contexte dans lequel elle seront utilisées :

```java
public class CalculatorContext {

    private IOperationStrategy strategy;

    public void setOperationStrategy(IOperationStrategy operationStrategy) {
        this.strategy = operationStrategy;
    }

    public int executeOperation(){
        return this.strategy.compute();
    }
}
```

En fonction de la stratégie qui sera passé en paramètre de mon contexte, ça sera la méthode compute de cette dernière qui sera utilisée.

```java
public static void main(String[] args) {
    CalculatorContext ctx = new CalculatorContext();
    ctx.setOperationStrategy(new PlusOperationStrategy(2, 3));
    System.out.println(ctx.executeOperation());

    ctx.setOperationStrategy(new MinusOperationStrategy(2, 3));
    System.out.println(ctx.executeOperation());
}
```

Le résultat du code ci-dessus en console sera le suivant

```log
5
-1
```

## En conclusion

Le design pattern Stratégie offre de la flexibilité aux développeurs. En encapsulant des familles d'algorithmes interchangeables, ce pattern permet aux clients de choisir dynamiquement le comportement désiré sans altérer la structure du code existant.  
En utilisant le design pattern Stratégie, nous pouvons facilement ajouter de nouvelles stratégies sans perturber le fonctionnement global de l'application.