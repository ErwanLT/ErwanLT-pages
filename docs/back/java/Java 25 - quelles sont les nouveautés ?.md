---
layout: "default"
title: "Java 25 : quelles sont les nouveautés ?"
permalink: "/back/java/java-25-quelles-sont-les-nouveautes/"
tags: [back, java]
date: "2025-09-26"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/java-25-quelles-sont-les-nouveautes/"
banner: "https://www.sfeir.dev/content/images/2025/09/Capture-d---e--cran-2025-09-26-a---11.09.27-1.png"
published_at: "2025-09-26"
sfeir_slug: "java-25-quelles-sont-les-nouveautes"
sfeir_tags: [Back, Java, Java25]
---
[Java](https://www.sfeir.dev/tag/java/) 25, récemment publié le 16 septembre 2025, marque une étape significative dans l’évolution du langage Java.  
En tant que version **LTS** (Long-Term Support), elle offre une stabilité et une pérennité accrues pour les entreprises et les développeurs.  
Cette version introduit **18 propositions d’amélioration (JEPs)**, dont certaines finalisées et d'autres en aperçu, enrichissant ainsi l'écosystème Java tout en restant fidèle à ses principes fondateurs.

## Une continuité fidèle à l'esprit de Java

Depuis sa création, [Java](https://www.sfeir.dev/back/le-langage-java-definition/) s'est toujours efforcé de concilier simplicité, portabilité et robustesse. Java 25 poursuit cette tradition en introduisant des fonctionnalités qui simplifient le développement tout en renforçant la performance et la sécurité.

[[Il était une fois... Java]]

## Nouvelles fonctionnalités de Java 25

### Concurrence Structurée ([JEP 505](https://openjdk.org/jeps/505?ref=sfeir.dev))

Java 25 simplifie la gestion [des threads et tâches parallèles](https://www.sfeir.dev/back/revolutionnez-votre-programmation-asynchrone-avec-java-21-et-loom/)

```java
static void main() throws InterruptedException {
     try (var scope = StructuredTaskScope.open()) {

         StructuredTaskScope.Subtask<String> t1 = scope.fork(() -> task1());
         StructuredTaskScope.Subtask<String> t2 = scope.fork(() -> task2());

         scope.join();   // Join subtasks, propagating exceptions

         // Both subtasks have succeeded, so compose their results
         IO.println(t1.get() + " " + t2.get());

     }
}

private static String task1() throws InterruptedException {
    Thread.sleep(Duration.ofSeconds(1));
    return "Result from task 1";
}

private static String task2() throws InterruptedException {
    Thread.sleep(Duration.ofSeconds(2));
    return "Result from task 2";
}
```

Chaque tâche est automatiquement jointe, et la portée de leur exécution est claire et sûre, héritant de la philosophie de Java en matière de concurrence.

### Valeurs à portée limitée ([JEP 506](https://openjdk.org/jeps/506?ref=sfeir.dev))

Cette nouveauté permet de gérer des valeurs sensibles dont la portée est strictement limitée, par exemple un mot de passe temporaire. Le mot de passe n’existe que dans la portée définie par `ScopedValue.where(...).run(...)` :

```java
public class SecureExample {

    // Déclaration d'une ScopedValue pour stocker un mot de passe temporaire
    private static final ScopedValue<String> TEMP_PASSWORD = ScopedValue.newInstance();

    public static void main(String[] args) {
        // Définition de la valeur pour une portée d'exécution spécifique
        ScopedValue.where(TEMP_PASSWORD, "Secr3tP@ss")
                   .run(() -> {
                       // Le mot de passe est maintenant disponible uniquement dans cette portée
                       authenticateUser("alice");
                       System.out.println("Mot de passe temporaire utilisé pour la connexion.");
                   });

        // En dehors de la portée de .run(), la valeur n'est plus accessible
        tryReadingPasswordOutsideScope();
    }

    static void authenticateUser(String username) {
        // Récupération de la valeur depuis la ScopedValue
        // Cela ne fonctionne que si la méthode est appelée dans la portée de .run()
        String password = TEMP_PASSWORD.get();

        // Logique d'authentification fictive
        if ("Secr3tP@ss".equals(password)) {
            System.out.println(username + " connecté avec succès !");
        } else {
            System.out.println("Échec de l'authentification.");
        }
    }

    /**
     * Tente de lire la ScopedValue en dehors de sa portée pour démontrer
     * qu'elle n'est pas accessible.
     */
    static void tryReadingPasswordOutsideScope() {
        System.out.println("Tentative de lecture du mot de passe en dehors de la portée :");
        try {
            // Cette ligne doit échouer car nous sommes en dehors du .run()
            String password = TEMP_PASSWORD.get();
            System.out.println("ERREUR : Le mot de passe a été lu (ne devrait pas arriver) : " + password);
        } catch (NoSuchElementException e) {
            System.out.println("SUCCÈS : Impossible de lire le mot de passe, comme attendu.");
        }
    }
}
```

- La valeur n’est disponible que dans la portée du bloc `run`.
- Hors de cette portée, l’accès échoue, réduisant le risque d’exposition accidentelle.
- Idéal pour les mots de passe temporaires, clés cryptographiques ou tokens sensibles.

### Pattern matching pour les types primitifs ([JEP 507](https://openjdk.org/jeps/507?ref=sfeir.dev), 3e aperçu)

Le pattern matching s’étend aux types primitifs, rendant le code plus concis :

```java
static void main() {
  int value = 42;

  String description = switch(value) {
      case int n when n > 0 -> "Positif";
      case int n when n < 0 -> "Négatif";
      default -> "Zéro";
  };
  IO.println(description);
}
```

Une continuité logique du pattern matching introduit dans Java 16, améliorant la lisibilité.

### Déclarations d’import de module ([JEP 511](https://openjdk.org/jeps/511?ref=sfeir.dev))

Avec Java 9, l’introduction du système de modules a marqué une étape importante, mais il fallait passer par un fichier `module-info.java` pour exprimer les dépendances.  
Java 25 simplifie cette approche grâce à la **JEP 511 : Module Import Declarations**.

Il est désormais possible d’importer un module directement dans son code source, de la même manière qu’un package ou une classe. Cette nouveauté rend le code plus lisible et particulièrement pratique pour les petits projets, les démonstrations ou les scripts.

Il faut cependant faire attention aux ambiguïtés pour certaines classe ayant le même nom (ex: Date)

```java
import module java.base;
import module java.sql;

public class ModulImport {

    static void main() {
        Date utilDate = new Date();
        IO.println(utilDate);
    }
}
```

provoquera l'erreur suivante :

```log
java: reference to Date is ambiguous
  both class java.sql.Date in java.sql and class java.util.Date in java.util match
```

Il faudra alors ajouter l'import spécifique

```java
import module java.base;
import module java.sql;

import java.util.Date;

public class ModulImport {

    static void main() {
        Date utilDate = new Date();
        IO.println(utilDate);
    }
}
```

### Fichiers source compacts et méthodes `main` d'instance ([JEP 512](https://openjdk.org/jeps/512?ref=sfeir.dev))

Java 25 permet de simplifier la déclaration d’une application minimale, idéale pour l’apprentissage ou les prototypes.  
Par exemple on passe de :

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

à :

```java
class Main {
    static void main() {
        IO.println("Hello world");
    }
}
```

Il n’est plus nécessaire de déclarer explicitement une classe publique ni de gérer les paramètres `String[] args`.

### Constructeurs plus flexibles ([JEP 513](https://openjdk.org/jeps/513?ref=sfeir.dev))

Jusqu’à présent, les constructeurs Java imposaient que l’appel à `super(...)` ou `this(...)` soit **la première ligne** du constructeur.  
Avec Java 25, il est désormais possible d’ajouter du code avant cet appel, tant que `this` n’est pas utilisé prématurément. Cela ouvre la porte à des validations et calculs préparatoires plus naturels.

Exemple classique avec `Point` et `Point3D` :

```java
public class Point { 
  protected final int x, y; 
  
  public Point(int x, int y) { 
    this.x = x; 
    this.y = y; 
  } 
} 

public class Point3D extends Point { 
  private final int z; 
  
  public Point3D(int x, int y, int z) { 
    // Avant JEP 513, interdit : on ne pouvait rien mettre avant super(...)
    if (z < 0) { 
      throw new IllegalArgumentException("z ne peut pas être négatif"); 
    }
    super(x, y); // Initialisation de la partie Point 
    this.z = z; 
  } 
}
```

Cet assouplissement aligne la lisibilité du code sur les besoins concrets des développeurs, sans sacrifier la sécurité d’initialisation.

## Conclusion : Java 25, un héritage vivant

Java 25 poursuit la tradition des versions LTS (8, 11, 17) : modernisation des fonctionnalités, performances optimisées, et sécurité renforcée, tout en respectant la compatibilité et l’esprit du langage.

La liste complte des JEPs inclus dans Java 25 est disponible ici [https://jdk.java.net/25/](https://jdk.java.net/25/?ref=sfeir.dev)
