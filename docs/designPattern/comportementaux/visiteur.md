---
layout: default
title: Visiteur
tags: [java, tutoriel, design pattern, comportementaux, visiteur]
---

# Le design pattern Visiteur

## Définition

Le design patterns **Visiteur** est un design pattern comportemental qui permet de séparer l'algorithme des éléments sur lesquels il opère. Il est souvent utilisé lorsque vous avez une structure d'objets complexe et que vous voulez ajouter de nouvelles opérations sans modifier les classes des objets eux-mêmes.

### Avantages et inconvénients

|   |   |
|---|---|
|- Séparation des préoccupations<br>- Extensibilité<br>- Maintenabilité<br>- Polymorphisme<br>- Encapsulation|- Complexité accrue<br>- Violation du principe d'encapsulation<br>- Ajout de nouveaux types d'objets<br>- Les structures de données complexes|

### Avantages

1. **Séparation des préoccupations** : Le pattern Visiteur permet de séparer le comportement des objets de leur structure. Cela facilite la gestion des changements dans le comportement sans modifier les classes des objets.
2. **Extensibilité** : Il est facile d'ajouter de nouvelles opérations sur les objets sans modifier leur structure. Vous pouvez simplement créer de nouveaux visiteurs pour implémenter de nouvelles fonctionnalités
3. **Maintenabilité** : En raison de sa modularité, le pattern Visiteur rend le code plus facile à comprendre et à maintenir. Chaque visiteur peut être développé et testé indépendamment.
4. **Polymorphisme** : Le pattern Visiteur exploite le polymorphisme offert par les langages de programmation orientés objet. Cela permet de traiter différents types d'objets de manière uniforme.
5. **Encapsulation** : Le pattern Visiteur encapsule le comportement spécifique à chaque visiteur dans des classes distinctes, ce qui permet de réduire le couplage entre les objets et les opérations.

### Inconvénients

1. **Complexité accrue** : L'utilisation du pattern Visiteur peut rendre le code plus complexe, surtout si vous avez un grand nombre de classes à visiter ou de visiteurs à implémenter.
2. **Violation du principe d'encapsulation** : Dans certains cas, le pattern Visiteur peut violer le principe d'encapsulation, car il nécessite que les classes à visiter exposent une méthode `accept` pour accepter le visiteur.
3. **Ajout de nouveaux types d'objets** : Si vous devez ajouter de nouveaux types d'objets à visiter, vous devrez modifier l'interface `Visitor` pour inclure une méthode pour chaque nouveau type, ce qui peut rendre le code plus fragile.
4. **Les structures de données complexes** : Le pattern Visiteur peut être moins adapté pour les structures de données complexes, car il peut nécessiter la création de plusieurs visiteurs pour traiter toutes les opérations souhaitées.

## Exemple d'implémentation

Au cœur du pattern **Visitor** se trouve la notion de séparation des préoccupations. Plutôt que de mélanger le code des opérations à effectuer sur une structure d'objets avec le code de cette structure, le Visitor déplace ces opérations dans des classes distinctes appelées visiteurs. Ces visiteurs agissent comme des extensions externes à la hiérarchie d'objets, ce qui rend le code plus modulaire et plus facile à maintenir.

## Le Double Dispatch

Le concept clé derrière le pattern **Visitor** est le double dispatch. Dans le contexte de l'orienté objet, le dispatch simple se produit lorsqu'une méthode est appelée sur un objet et l'implémentation de cette méthode est déterminée par le type de l'objet. Cependant, le double dispatch va un peu plus loin. Il s'agit d'une forme de polymorphisme où la méthode à appeler est déterminée à la fois par le type de l'objet et par le type des arguments passés à cette méthode.

Dans le pattern Visitor, le double dispatch est utilisé pour choisir dynamiquement la méthode de visite appropriée en fonction du type, à la fois de l'objet à visiter et du visiteur utilisé. Cela permet une grande flexibilité dans la manière dont les opérations sont exécutées sur les objets, car elles peuvent varier en fonction de ces deux types.

[![](https://www.sfeir.dev/content/images/2024/03/Diagramme-sans-nom.drawio--1-.png)](https://www.sfeir.dev/content/images/2024/03/Diagramme-sans-nom.drawio--1-.png)

diagramme de classe

Dans cet exemple d'utilisation du pattern Visitor et du double dispatch. Supposons que nous ayons un système solaire composé d'étoiles, de planètes et de lunes. Nous voulons exporter ces objets dans différents formats, tels que XML et JSON.

Nous pourrions utiliser le pattern Visitor pour implémenter des visiteurs spécifiques à chaque format d'exportation. Ces visiteurs peuvent parcourir la structure des objets spatiaux et générer la représentation correspondante dans le format souhaité. Grâce au double dispatch, chaque objet spatial peut choisir dynamiquement la méthode de visite appropriée en fonction du visiteur utilisé, ce qui permet une séparation claire des préoccupations et une extension facile pour de nouveaux formats d'exportation.

Nous commençons par déclarer une interface `SpaceElement` qui définie une seule méthode `accept(Visitor visitor)`.

```java
public interface SpaceElement {
    String accept(Visitor visitor);
}
```

Cette interface sera implémentée par 3 classes distinctes `Star`, `Planet`, et `Moon` :

```java
public class Star implements SpaceElement {
    private String name;

    private List<SpaceElement> orbitalPlanets;

    public Star(String name) {
        this.name = name;
        this.orbitalPlanets = new ArrayList<>();
    }

    @Override
    public String accept(Visitor visitor) {
        return visitor.visitStar(this);
    }

    public void addPlanet(SpaceElement planet){
        orbitalPlanets.add(planet);
    }

    public List<SpaceElement> getOrbitalPlanets() {
        return orbitalPlanets;
    }

    public String getName() {
        return name;
    }
}

public class Planet implements SpaceElement {
    private String name;
    private List<SpaceElement> moons;

    public Planet(String name) {
        this.name = name;
        this.moons = new ArrayList<>();
    }

    public void addMoon(SpaceElement moon) {
        moons.add(moon);
    }

    @Override
    public String accept(Visitor visitor) {
        return visitor.visitPlanet(this);
    }

    public List<SpaceElement> getMoons() {
        return moons;
    }

    public String getName() {
        return name;
    }
}

public class Moon implements SpaceElement {
    private String name;

    public Moon(String name) {
        this.name = name;
    }

    @Override
    public String accept(Visitor visitor) {
        return visitor.visitMoon(this);
    }

    public String getName() {
        return name;
    }
}
```

Dans cet exemple, les classes `Star`, `Planet` et `Moon` sont des éléments spatiaux et peuvent accepter un visiteur (**Visitor**). Cependant, l'action exacte effectuée par le visiteur dépendra de son implémentation que nous allons voir tout de suite.

```java
public interface Visitor {
    String visitPlanet(Planet planet);
    String visitStar(Star star);
    String visitMoon(Moon moon);
    String getRepresentation(SpaceElement element);
}
```

Cette interface :

- Définit les méthodes `visitPlanet`, `visitStar`, et `visitMoon` pour visiter respectivement les planètes, les étoiles et les lunes.
- Définit également une méthode `getRepresentation` qui est censée retourner la représentation complète du système solaire dans le format choisi.

Et voici les 2 implémentations de mon visiteur

```java
public class XmlExporter implements Visitor {

    private int level = 1;

    @Override
    public String visitPlanet(Planet planet) {
        StringBuilder sb = new StringBuilder();
        sb.append(indent()).append("    <planet>\n");
        sb.append(indent()).append("        <name>").append(planet.getName()).append("</name>\n");
        sb.append(indent()).append("        <moons number=").append(planet.getMoons().size()).append(">\n");
        level++;
        planet.getMoons().forEach( e-> {
            var rep = e.accept(this);
            sb.append(rep);
        });
        level--;
        sb.append(indent()).append("        </moons>\n");
        sb.append(indent()).append("    </planet>\n");
        return sb.toString();
    }

    @Override
    public String visitStar(Star star) {
        StringBuilder sb = new StringBuilder();
        sb.append(indent()).append("<star>\n");
        sb.append(indent()).append("    <name>").append(star.getName()).append("</name>\n");
        sb.append(indent()).append("    <planets number=").append(star.getOrbitalPlanets().size()).append(">\n");
        level++;
        star.getOrbitalPlanets().forEach(e -> {
            var rep = e.accept(this);
            sb.append(rep);
        });
        level--;
        sb.append(indent()).append("    </planets>\n");
        sb.append(indent()).append("</star>\n");
        return sb.toString();
    }

    @Override
    public String visitMoon(Moon moon) {
        return indent() + "        <moon>\n" +
                indent() + "            <name>" + moon.getName() + "</name>\n" +
                indent() + "        </moon>\n";
    }

    public String getRepresentation(SpaceElement element) {
        return "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
                "<solar_system>\n" +
                element.accept(this) +
                "</solar_system>";
    }

    private String indent() {
        return "    ".repeat(Math.max(0, level));
    }
}

public class JsonExporter implements Visitor {

    private int level = 1;

    @Override
    public String visitStar(Star star) {
        StringBuilder sb = new StringBuilder();
        level++;
        sb.append(indent()).append("\"star\":{\n")
                .append(indent()).append("    \"name\":\"").append(star.getName()).append("\",\n")
                .append(indent()).append("    \"planets\":[\n");
        star.getOrbitalPlanets().forEach(e -> {
            var rep = e.accept(this);
            sb.append(rep);
        });
        sb.append(indent()).append("    ]\n")
            .append(indent()).append("}\n");
        level--;
        return sb.toString();
    }

    @Override
    public String visitPlanet(Planet planet) {
        level++;
        StringBuilder sb = new StringBuilder()
                .append(indent()).append("    {\n")
                .append(indent()).append("        \"name\":\"").append(planet.getName()).append("\",\n")
                .append(indent()).append("        \"moons\":[\n");
        planet.getMoons().forEach(e -> {
            var rep = e.accept(this);
            sb.append(rep);
        });
        sb.append(indent()).append("        ]\n")
                .append(indent()).append("    },\n");

        level--;
        return sb.toString();
    }

    @Override
    public String visitMoon(Moon moon) {
        level++;
        StringBuilder sb = new StringBuilder()
                .append(indent()).append("        {\n")
                .append(indent()).append("            \"name\":\"").append(moon.getName()).append("\"\n")
                .append(indent()).append("        },\n");
        level--;
        return sb.toString();
    }

    public String getRepresentation(SpaceElement element) {
        return "{\n"+
                indent()+"\"solar_system\":{\n"+
                element.accept(this) +
                indent()+"}\n"+
                "}";
    }

    private String indent() {
        return "    ".repeat(Math.max(0, level));
    }
}
```

1. **Implémentation XMLExporter** :
    - La classe `XmlExporter` implémente l'interface **Visitor** pour exporter les objets spatiaux au format XML.
    - Pour chaque type d'objet spatial, nous avons une méthode de visite qui génère la représentation XML correspondante.
    - La méthode `getRepresentation` retourne la représentation XML complète du système solaire.
2. **Implémentation JSONExporter** :
    - La classe `JsonExporter` implémente l'interface **Visitor** pour exporter les objets spatiaux au format JSON.
    - De manière similaire à `XmlExporter`, pour chaque type d'objet spatial, nous avons une méthode de visite qui génère la représentation JSON correspondante.
    - La méthode `getRepresentation` retourne la représentation JSON complète du système solaire.

Et le double dispatch dans tout ça ? Le double dispatch est bien utilisé dans notre code. Lorsque nous appelons la méthode `accept` sur un objet spatial, la méthode appropriée de visite est appelée en fonction du type de l'objet spatial et du visiteur utilisé. Ensuite, le visiteur peut accéder aux méthodes de l'objet spatial pour générer la représentation correspondante.

## Exemple d'utilisation

```java
public class VisitorMain {
    public static void main(String[] args) {
        Star sun = new Star("Sun");
        Planet earth = new Planet("Earth");
        Moon moon = new Moon("Moon");
        earth.addMoon(moon);
        Planet mars = new Planet("Mars");
        Moon phobos = new Moon("Phobos");
        Moon deimos = new Moon("Deimos");
        mars.addMoon(phobos);
        mars.addMoon(deimos);
        sun.addPlanet(earth);
        sun.addPlanet(mars);

        Visitor xmlVisitor = new XmlVisitor();
        sun.accept(xmlVisitor);
        earth.accept(xmlVisitor);
        mars.accept(xmlVisitor);
        export(xmlVisitor, sun);

        Visitor jsonVisitor = new JsonVisitor();
        sun.accept(jsonVisitor);
        earth.accept(jsonVisitor);
        mars.accept(jsonVisitor);
        export(jsonVisitor, sun);
    }

    private static void export(Visitor visitor, SpaceElement element){
        System.out.println(visitor.getRepresentation(element)+"\n");
    }
}}
```

méthode main

Dans cet exemple, je crée mes différents corps célestes, le Soleil, la Terre et la Lune, Mars avec ses deux satellites Phobos et Deimos, et j'organise la hiérarchie de mon système solaire : Etoile (`Star`) > Planète (`Planet`) > Lunes (`Moon`).

Je crée ensuite un premier **visiteur** (xmlVisitor) que je donne en paramètres des méthodes `accept()` de mes objets, le rendu de l'export de ce dernier est le suivant dans la console :

```xml
<?xml version="1.0" encoding="utf-8"?>
<solar_system>
    <star>
        <name>Sun</name>
        <planets number=2>
            <planet>
                <name>Earth</name>
                <moons number=1>
                    <moon>
                        <name>Moon</name>
                    </moon>
                </moons>
            </planet>
            <planet>
                <name>Mars</name>
                <moons number=2>
                    <moon>
                        <name>Phobos</name>
                    </moon>
                    <moon>
                        <name>Deimos</name>
                    </moon>
                </moons>
            </planet>
        </planets>
    </star>
</solar_system>
```

representation XML en console

Je crée ensuite un premier **visiteur** (jsonVisitor) que je donne en paramètres des méthodes `accept()` de mes objets, le rendu de l'export de ce dernier est le suivant dans la console :

```json
{
    "solar_system":{
        "star":{
            "name":"Sun",
            "planets":[
                {
                    "name":"Earth",
                    "moons":[
                        {
                            "name":"Moon"
                        },
                    ]
                },
                {
                    "name":"Mars",
                    "moons":[
                        {
                            "name":"Phobos"
                        },
                        {
                            "name":"Deimos"
                        },
                    ]
                },
            ]
        }
    }
}
```

## En conclusion

Le [design pattern](https://www.sfeir.dev/back/kesaco-designs-pattern/) Visitor offre une solution pour séparer les algorithmes des objets sur lesquels ils opèrent, offrant ainsi modularité, extensibilité et maintenabilité au sein des applications logicielles.  
En exploitant le double dispatch, le pattern Visitor permet une sélection dynamique des méthodes de visite en fonction des types d'objets et des visiteurs utilisés, facilitant ainsi la gestion des opérations sur des structures d'objets complexes.

⚠️ Cependant, bien que le pattern Visitor présente des avantages significatifs, notamment la séparation des préoccupations et la promotion du polymorphisme, il n'est pas exempt d'inconvénients, tels que l'augmentation de la complexité et la violation potentielle du principe d'encapsulation dans certaines situations.