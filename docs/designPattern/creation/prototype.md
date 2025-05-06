---
layout: default
title: Prototype
tags: [java, tutoriel, design pattern, prototype]
---


# Le design pattern Prototype

## définition

En programmation orientée objet, le design pattern **Prototype** est utilisé lorsque la création d'une instance est complexe ou consommatrice en temps. Plutôt que créer plusieurs instances de la classe, on copie la première instance et on modifie la copie de façon appropriée.

Pour implémenter ce patron il faut déclarer une classe abstraite spécifiant une méthode virtuelle pure appelée clone(). Toute classe nécessitant un constructeur polymorphique dérivera de cette classe abstraite et implémentera la méthode _**clone()**_.

Le client de cette classe, au lieu d'écrire du code invoquant directement une nouvelle instance de la classe, appellera la méthode _**clone()**_ sur le **prototype** ou utilisera une autre méthode fourni par un autre design pattern.

## Cas d'utilisation

1. Création d'objets coûteuse : Lorsqu'il est coûteux de créer un nouvel objet en utilisant le processus d'instanciation habituel, le Prototype permet de cloner un objet existant pour obtenir une copie modifiable, évitant ainsi les coûts de création répétée.
    
2. Configuration initiale : Lorsqu'un objet nécessite une configuration complexe, mais que certaines parties de la configuration sont identiques pour plusieurs instances, le Prototype permet de cloner un objet préconfiguré au lieu de tout reconfigurer à chaque fois.
    
3. Génération de données de test : Lorsqu'il est nécessaire de générer de grandes quantités de données de test, le Prototype peut être utilisé pour cloner des objets représentant des données de base et les modifier légèrement pour créer de nouvelles instances de test.
    
4. Gestion des caches : Lorsque les objets fréquemment utilisés doivent être stockés dans un cache, le Prototype peut être utilisé pour créer des copies de ces objets et les stocker dans le cache. Cela évite de devoir accéder à une source de données externe ou de les recréer à chaque fois.
    
5. Manipulation d'objets immuables : Lorsque les objets sont immuables et ne peuvent pas être modifiés directement, le Prototype permet de cloner un objet existant, d'apporter des modifications à la copie et d'obtenir ainsi un nouvel objet modifié.
    

## exemple d'implementation

[![](https://www.sfeir.dev/content/images/2023/09/image-13.png)](https://www.sfeir.dev/content/images/2023/09/image-13.png)

Pour commencer, il nous faut créer l'interface _**Humain**_ qui définira la méthode _clone()_ qui sera implémenter les classe qui hériterons de l'interface, ici _**ConcreteHuman**_

```java
public interface Human {

    public Human getClone();
}
```

La méthode _clone()_ de _**ConcreteHuman**_ renverra une nouvelle instance de _**ConcreteHuman**_ avec les même nom, prenom et age que l'objet d'origine.

```java
public class ConcreteHuman implements Prototype {

    private String name;
    private String lastName;
    private Integer age;

    public ConcreteHuman(String name, String lastName, Integer age) {
        this.name = name;
        this.lastName = lastName;
        this.age = age;
    }

    @Override
    public Prototype getClone() {
        return new ConcreteHuman(name, lastName, age);
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Human human = (Human) o;
        return age == human.age && name.equals(human.name) && lastName.equals(human.lastName);
    }
}
```

Il ne reste plus qu'à implementez le code permettant de vérifier que la méthode _**clone()**_ me retourne bien un objet identique à celui d'origine

```java
Prototype erwan = new Human("Erwan", "Le Tutour", 32);
Prototype erwanClone = erwan.getClone();
Assertions.assertEquals(erwan, erwanClone);
```