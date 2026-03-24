---
layout: "default"
title: "Java 26 - quoi de neuf ?"
permalink: "/back/java/java-26-quoi-de-neuf/"
tags: [back, java]
date: "2026-02-12"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/java-26-quoi-de-neuf/"
banner: "https://www.sfeir.dev/content/images/2026/02/20260202_1308_Sans-TM_remix_01kgf40kq5e0gtm1x6apzf6aq0.png"
published_at: "2026-02-12"
sfeir_slug: "java-26-quoi-de-neuf"
sfeir_tags: [Back, Java]
---
Java 26, dont la **publication est attendue en mars 2026**, continue la progression réfléchie et conservatrice du langage vers davantage de **sécurité, de robustesse et de simplicité pour les développeurs**.

[[Java 25 - quelles sont les nouveautés ?|Contrairement à Java 25, cette version n'est pas une LTS]].

Dans cette version, parmi les nouveautés, deux JEP ont un rôle **symbolique et fondamental** : **la JEP 500**, qui renforce la signification de `final` dans le langage, et **la JEP 504**, qui supprime un héritage historique aujourd’hui obsolète.

## [JEP 500](https://openjdk.org/jeps/500?ref=sfeir.dev) – Prepare to Make Final Mean Final

L’une des pierres angulaires de Java est la confiance que l’on peut placer dans l’immuabilité lorsqu’on déclare un champ `final`. Pourtant, depuis longtemps, il était possible de trahir cette immuabilité en utilisant de la réflexion (`java.lang.reflect.Field`) pour modifier ces champs, ce qui va à l’encontre de l’esprit même du mot-clé `final`.

### Pourquoi cette JEP ?

- **Assurer que `final` signifie vraiment immuable** : dans l’esprit originel de Java, un champ `final` garantit une valeur fixe après initialisation, ce qui aide au raisonnement sur le code et permet des optimisations du JVM.
- **Contraindre progressivement les bibliothèques à s’aligner** sur les intentions architecturales du langage : aujourd’hui, certaines bibliothèques peuvent manipuler des champs `final` par réflexion, ce qui fragilise cette promesse.

### Ce qui change concrètement

- **Avertissement à l’exécution** : dès Java 26, si du code tente de modifier un champ `final` via réflexion profonde, la JVM émettra un **avertissement**.
- **Vers une immuabilité stricte** : cette étape prépare l’avenir : dans une future version, ce type de mutation pourrait être **complètement interdit par défaut**.
- **Compatibilité pragmatique** : il restera possible de permettre ces mutations, par exemple pour des bibliothèques de sérialisation qui en ont légitimement besoin, mais cela devra être **explicitement activé** au démarrage.

Ce JEP est un hommage à l’esprit originel de Java : renforcer la fiabilité et la transparence du code tout en ménageant les contraintes réalistes des écosystèmes existants.

**Exemple** :

```java
class C {
    final int x;
    C() { x = 100; }
}

public class FinalMain {
    static void main() throws NoSuchFieldException, IllegalAccessException {
        java.lang.reflect.Field f = C.class.getDeclaredField("x");
        f.setAccessible(true);

        C obj = new C();
        IO.println(obj.x);

        // 3. Mutate the final field in the object
        f.set(obj, 200);
        IO.println(obj.x);
        f.set(obj, 300);
        IO.println(obj.x);
    }
}
```

Jusqu'en Java 25, ce code compile et tourne sans générer le moindre warning, mais dès que l'on passe en Java 26

```log
100
200
300
WARNING: Final field x in class fr.eletutour.jep.finalMeaning.C has been mutated reflectively by class fr.eletutour.jep.finalMeaning.FinalMain in unnamed module @7adf9f5f
WARNING: Use --enable-final-field-mutation=ALL-UNNAMED to avoid a warning
WARNING: Mutating final fields will be blocked in a future release unless final field mutation is enabled
```

## [JEP 504](https://openjdk.org/jeps/504?ref=sfeir.dev) – Remove the Applet API

L’API Applet est un reliquat d’une époque où Java s’intégrait dans les pages Web pour exécuter du code dynamique dans le navigateur. Aujourd’hui, **les navigateurs modernes n’offrent plus aucun support pour les applets**, ce qui rend cette API obsolète.

[![](https://media.tenor.com/D9wqPfZcuK0AAAAC/it-belongs-in-a-museum-indiana-jones.gif)](https://media.tenor.com/D9wqPfZcuK0AAAAC/it-belongs-in-a-museum-indiana-jones.gif)

Remove the Applet API

### Un retrait naturel

- **La technologie est morte** : depuis plusieurs années, la capacité d’exécuter des applets dans les navigateurs a disparu, et même l’outil `appletviewer` n’existe plus dans les versions récentes de Java.
- **Support déprécié depuis longtemps** : l’API avait été désapprouvée (deprecated) puis dépréciée pour suppression dès JDK 17.

### Ce qui est retiré

Java 26 supprime complètement :

- Le package `**java.applet**` et toutes ses classes (par exemple `Applet`, `AudioClip`, etc.).
- Les classes **associées** qui ne font plus sens, comme `javax.swing.JApplet`.
- Les références résiduelles dans d’autres parties de l’API.

Ce retrait est une démarche respectueuse de l’histoire : Java n’oublie pas ce qu’il a été, mais refuse de porter des éléments sans utilité dans son cœur. Cela allège la plateforme, réduit la charge de maintenance et clarifie l’API pour les développeurs.

## Conclusion : une version qui avance avec sagesse

Java 26 ne révolutionne pas le langage, mais **affirme des valeurs fondamentales** : sécurité, clarté et fidélité à ses promesses historiques.

- **Avec la JEP 500**, Java renforce la sémantique de l’immuabilité, un principe fondamental pour raisonner sur un code fiable.
- **Avec la JEP 504**, il fait le tri dans son héritage pour ne garder que ce qui sert encore les besoins actuels des développeurs.

Ces évolutions témoignent d’un langage qui avance avec soin, respectant son passé tout en préparant son avenir.
