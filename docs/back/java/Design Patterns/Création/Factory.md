---
layout: "default"
title: "Factory"
permalink: "/back/java/design-patterns/creation/factory/"
tags: [back, java, design-patterns, creation]
date: "2023-05-03"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/design-pattern-factory/"
banner: "https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDF8fGZhY3Rvcnl8ZW58MHx8fHwxNjgyMTg5Nzg4&ixlib=rb-4.0.3&q=80&w=2000"
published_at: "2023-05-03"
sfeir_slug: "design-pattern-factory"
sfeir_tags: [Back, Java, Design pattern]
---
# Les designs patterns de création c'est quoi ?

[Les Design Patterns](/definition/les-design-patterns/) de Création sont un ensemble de design patterns qui permettent de créer des objets d'une manière qui soit flexible, modulaire et qui facilite leur réutilisation. Ils sont utilisés pour résoudre des problèmes de conception liés à la création d'objets.  
Les designs pattern de création les plus utilisés sont les suivants :

- **Factory**
- [Builder](/back/java/design-patterns/creation/builder/)
- [Prototype](/back/java/design-patterns/creation/prototype/)
- [Singleton](/back/java/design-patterns/creation/singleton/)

Ici nous nous attaquerons au **design pattern factory**.

## Le design pattern FACTORY

### Définition

En programmation orientée objet, le design pattern **factory** est un pattern de création qui utilise des méthodes de fabrication pour résoudre le problème de création d'objets sans avoir à spécifier la classe exacte de l'objet à créer. On utilise une interface ou une classe abstraite pour définir une méthode de création qui est implémentée par les sous-classes pour créer des objets de différentes classes. Ainsi, le Factory Method permet de créer des objets sans connaitre leur implémentation.

### Exemple d'implementation

![Factory](https://www.sfeir.dev/content/images/2023/04/Factory.png)

Tout d'abord nous avons une interface **Celestial** qui contient la méthode **canHaveNaturalSatellite()**

```java
public interface Celestial {
    String canHaveNaturalSatellite();
}
```

Nous avons ensuite 3 classes qui implementent cette interface : **Planet**, **Star** et **ManMadeSatellite**.  
Chacune de ces implementation aura sa propre version de la méthode **canHaveNaturalSatellite()**

```java
public class Planet implements Celestial {
    @Override
    public String canHaveNaturalSatellite() {
        return "Une planete peut avoir des satellites naturels";
    }
}

public class Star implements Celestial {
    @Override
    public String canHaveNaturalSatellite() {
        return "Une étoile peut avoir des satellites naturels";
    }
}

public class ManMadeSatellite implements Celestial {
    @Override
    public String canHaveNaturalSatellite() {
        return "Un satellite construit par l'homme a très peu de chance d'avoir des satellites naturels";
    }
}
```

Pour finir nous avons notre classe **CelestialFactory** qui s'occupera de créer une instance des trois classes précedente en fonction d'une chaine de caractère passé en paramètre.

```java
public static Celestial getCelestial(String type){
    if(Objects.isNull(type)){
        return null;
    }
    if("PLANET".equals(type)){
        return new Planet();
    } else if ("STAR".equals(type)) {
        return new Star();
    } else {
        return new ManMadeSatellite();
    }
}
```

Ainsi, si nous voulons créer une instance d'un objet celeste, nous pouvons simplement appeler la méthode **getCelestial()** de la classe **CelestialFactory** en passant le nom de l'objet en paramètre. Par exemple :

```java
Celestial planet = CelestialFactory.getCelestial("PLANET");
System.out.println(planet.canHaveNaturalSatellite());

Celestial star = CelestialFactory.getCelestial("STAR");
System.out.println(star.canHaveNaturalSatellite());

Celestial manMadeSatellite = CelestialFactory.getCelestial("STARLINK");
System.out.println(manMadeSatellite.canHaveNaturalSatellite());
```

Le bout de code précédent donnerais un output comme celui ci :

```
Une planete peut avoir des satellites naturels
Une étoile peut avoir des satellites naturels
Un satellite construit par l'homme a très peu de chance d'avoir des satellites naturels
```

En utilisant le design pattern Factory, nous pouvons créer des objets de manière dynamique en fonction de la situation, sans avoir besoin de connaître la classe exacte dont nous avons besoin à l'avance. Cela rend notre code plus flexible et plus facile à maintenir.
