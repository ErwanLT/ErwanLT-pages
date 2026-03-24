---
layout: "default"
title: "Singleton"
permalink: "/designPattern/creation/singleton/"
tags: [back, java, design pattern, tutoriel, creation]
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/design-pattern-singleton/"
banner: "https://images.unsplash.com/photo-1658457459792-f4dfe37407ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDExfHxwbGFuZXRzJTIwc3VufGVufDB8fHx8MTY4NjIyOTUwNnww&ixlib=rb-4.0.3&q=80&w=2000"
published_at: "2023-06-09"
sfeir_slug: "design-pattern-singleton"
date: "2023-06-09"
---
# Les designs patterns de création c'est quoi ?

[Les Design Patterns](/definition/les-design-patterns/) de Création sont un ensemble de design patterns qui permettent de créer des objets d'une manière qui soit flexible, modulaire et qui facilite leur réutilisation. Ils sont utilisés pour résoudre des problèmes de conception liés à la création d'objets.  
Les designs pattern de création les plus utilisés sont les suivants :

- [Factory](/designPattern/creation/factory/)
- [Builder](/designPattern/creation/builder/)
- [Prototype](/designPattern/creation/prototype/)
- **Singleton**

Ici nous nous attaquerons au **design pattern singleton**.
## Le design pattern Singleton

### Définition

En programmation orientée objet, le design pattern Singleton est utilisé pour s'assurer qu'une classe ne possède qu'une seule instance et pour fournir un point d'accès à cette unique instance.

### Exemple d'implémentation

![singleton](https://www.sfeir.dev/content/images/2023/06/singleton.png)

Ici notre **singleton** sera la classe Sun

```java
public class Sun {

    private static Sun instance;
    private String name;

    private Sun(String name) {
        this.name = name;
    }

    public static Sun getInstance() {
        return instance==null?instance = new Sun("Sun"):instance;
    }

    public String getName() {
        return name;
    }
}
```

Dans cette implémentation, la classe Sun possède une variable statique instance qui est initialisée à null. Le constructeur de la classe est privé, ce qui signifie qu'il ne peut être invoqué que de l'intérieur de la classe elle-même.

La méthode **getInstance()** est utilisée pour obtenir l'instance unique de la classe Sun. Elle vérifie si l'instance est déjà créée. Si ce n'est pas le cas, elle l'initialise.

Une fois l'instance créée, la méthode **getInstance()** retourne cette instance unique. Les appels ultérieurs à **getInstance()** renverront simplement cette même instance sans créer de nouvelles instances supplémentaires.

Nous allons créer également deux instances de planètes (Terre et Mars), puis les faire orbiter autour du solei avec leur méthode **orbit()**.

```java
public class Planet {
    private String name;

    public Planet(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void orbit(Sun sun) {
        System.out.println(name + " is orbiting around " + sun.getName());
    }
}
```

Dans la classe **SolarSystem** qui contient notre méthode main, nous appelons _Sun.getInstance()_ pour obtenir l'instance unique du soleil. Ensuite, nous créons les instances de **Planet** (Terre et Mars) et les faisons orbiter autour du soleil en utilisant la méthode orbit().

L'utilisation du **Singleton** ici garantit qu'il n'y a qu'une seule instance du soleil dans tout le système solaire.
