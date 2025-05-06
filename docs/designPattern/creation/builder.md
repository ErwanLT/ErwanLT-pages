---
layout: default
title: Builder
tags: [java, tutoriel, design pattern, builder]
---

# Le design pattern Builder

## Définition

Le design pattern **Builder** est un modèle de conception qui permet de créer des objets complexes en séparant leur construction de leur représentation. En programmation orientée objet, ce design pattern est couramment utilisé pour créer des objets avec de nombreuses propriétés, en évitant de définir chacune de ces propriétés à chaque fois qu'un nouvel objet est créé.

## Cas d'utilisation

Le design pattern Builder fonctionne en séparant la construction d'un objet de sa représentation. Il se compose de deux parties principales : une classe **Builder** qui est responsable de la construction de l'objet, et une classe représentant l'objet lui-même.

La classe **Builder** contient des méthodes pour définir les différentes propriétés de l'objet, tandis que la classe représentant l'objet expose un constructeur pour créer l'objet en utilisant les méthodes définies dans la classe Builder. Une fois que toutes les propriétés ont été définies, la méthode **build()** est appelée pour construire l'objet.

Le pattern **Builder** peut être utilisé pour créer des objets avec un grand nombre de propriétés en évitant la complexité d'un constructeur avec de nombreux arguments. Au lieu de cela, le constructeur de la classe représentant l'objet peut avoir une seule propriété qui est un objet Builder. La classe Builder peut alors définir les propriétés une par une, en utilisant des méthodes spécifiques pour chaque propriété.

## Exemple d'implementation

![Builder](https://www.sfeir.dev/content/images/2023/04/Builder.png)

Pour commencer, il nous faut la classe **Human** qui contiendra différente propriétées qui permettent de définir un humain : nom, prenom, age ...

```java
@Getter
public class Human {

    private final String name;
    private final String lastName;
    private final int age;
    private final String height;
    private final String weight;
    private final String eyesColor;
    private final String hairColor;
    private final String birthPlace;
    private final Date birthDate;
    private final int numberOfSibling;
    private final boolean married;

    private Human(HumanBuilder builder) {
        this.name = builder.name;
        this.lastName = builder.lastName;
        this.age = builder.age;
        this.height = builder.height;
        this.weight = builder.weight;
        this.eyesColor = builder.eyesColor;
        this.hairColor = builder.hairColor;
        this.birthPlace = builder.birthPlace;
        this.birthDate = builder.birthDate;
        this.numberOfSibling = builder.numberOfSibling;
        this.married = builder.married;
    }
}
```

dans cet exemple et ceux qui vont suivre, les accesseurs pour acceder aux différentes propriétées de mon objets seront généré par l'annotation **@Getter** de lombok pour éviter de complexifier le code.

Il me faut ensuite définier une classe **HumanBuilder** qui me permettra de créer une instance de ma classe **Human** pas à pas.

```java
public static class HumanBuilder {

    private String name;
    private String lastName;
    private int age;
    private String height;
    private String weight;
    private String eyesColor;
    private String hairColor;
    private String birthPlace;
    private Date birthDate;
    private int numberOfSibling;
    private boolean married;

    public HumanBuilder withName(String name) {
        this.name = name;
        return this;
    }

    public HumanBuilder withLastName(String lastName) {
        this.lastName = lastName;
        return this;
    }

    public HumanBuilder withAge(int age) {
        this.age = age;
        return this;
    }

    public HumanBuilder withHeight(String height) {
        this.height = height;
        return this;
    }

    public HumanBuilder withWeight(String weight) {
        this.weight = weight;
        return this;
    }

    public HumanBuilder withEyesColor(String eyesColor) {
        this.eyesColor = eyesColor;
        return this;
    }

    public HumanBuilder withHairColor(String hairColor) {
        this.hairColor = hairColor;
        return this;
    }

    public HumanBuilder withBirthPlace(String birthPlace) {
        this.birthPlace = birthPlace;
        return this;
    }

    public HumanBuilder withBirthDate(Date birthDate) {
        this.birthDate = birthDate;
        return this;
    }

    public HumanBuilder withNumberOfSibling(int numberOfSibling) {
        this.numberOfSibling = numberOfSibling;
        return this;
    }

    public HumanBuilder isMarried(boolean married) {
        this.married = married;
        return this;
    }

    public Human build() {
        Human human = new Human(this);
        return human;
    }
}

```

Notre classe **HumanBuilder** contient des méthodes withXXX() pour définir les propriétés de la humain, et une méthode build() pour créer une instance de la classe **Human** en utilisant les propriétés définies. Ces méthodes renvoient une instance de **HumanBuilder** pour permettre une construction en chaîne, ce qui facilite l'utilisation du builder.

A présent, il me suffit juste d'appelé mon builder pour pouvoir créer mon humain :

```java
Human erwan = new Human.HumanBuilder()
    .withName("Erwan")
    .withAge(32)
    .withEyesColor("blue")
    .isMarried(true)
    .build();
```

En utilisant le design pattern **Builder**, nous pouvons créer des objets complexes étape par étape, en évitant la confusion des constructeurs avec de nombreux paramètres. Cela rend notre code plus facile à lire et à maintenir, et nous permet de créer des objets avec des propriétés optionnelles sans avoir à créer plusieurs constructeurs.