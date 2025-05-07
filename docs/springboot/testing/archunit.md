---
layout: default
title: ArchUnit
tags: [spring-boot, java, tutoriel, testing]
---

# Maîtrisez votre architecture Spring Boot avec ArchUnit

Dans le développement d'applications modernes, maintenir une architecture logicielle claire et cohérente est un défi constant.  
[Les applications Spring Boot](https://www.sfeir.dev/back/back-spring-boot/), avec leur flexibilité et leur richesse fonctionnelle, peuvent rapidement devenir complexes si les règles architecturales ne sont pas respectées.

C'est là qu'intervient **ArchUnit**, une bibliothèque [Java](https://www.sfeir.dev/back/il-etait-une-fois-java/) qui permet de tester et de valider l'architecture de votre code de manière automatisée.

## Présentation d'ArchUnit

**ArchUnit** est [une bibliothèque open-source](https://www.sfeir.dev/tag/open-source/) conçue pour vérifier l'architecture d'une application Java à travers des tests unitaires. Contrairement aux outils traditionnels qui se concentrent sur la logique métier, **ArchUnit** analyse le bytecode pour s'assurer que la structure du code respecte des règles prédéfinies.

Par exemple, il peut vérifier que les contrôleurs ne dépendent que des services ou que les couches de persistance n'accèdent pas aux couches supérieures. **ArchUnit** est particulièrement adapté aux [projets Spring Boot](https://www.sfeir.dev/back/back-pourquoi-utiliser-spring-boot/), car il permet de valider des conventions architecturales courantes, comme [la séparation des responsabilités](https://www.sfeir.dev/single-responsibility-principle-les-niveaux-dabstraction/) entre contrôleurs, services et repositories.

Avec une API fluide et intuitive, il s'intègre facilement dans [des environnements de test comme JUnit](https://www.sfeir.dev/back/un-test-pour-les-gouverner-tous/).

## L'intérêt de tester son architecture

Pourquoi investir du temps dans des tests d'architecture ? Voici quelques raisons clés :

- **Maintenir la cohérence** : Dans un projet d'équipe, il est facile de dévier des conventions architecturales. ArchUnit agit comme un garde-fou.
- **Prévenir** [**les dettes techniques**](https://www.sfeir.dev/tag/dette-technique/) : Les dépendances inappropriées (par exemple, un repository accédant à un contrôleur) peuvent compliquer la maintenance. ArchUnit détecte ces problèmes tôt.
- **Faciliter** [**les revues de code**](https://www.sfeir.dev/front/conventional-comments/) : Les règles définies dans ArchUnit automatisent la vérification des conventions, réduisant le besoin de revues manuelles.
- **Évolutivité** : Une architecture bien définie est plus facile à faire évoluer, surtout dans des applications Spring Boot complexes.

En résumé, tester son architecture avec ArchUnit garantit que votre codebase reste propre, maintenable et conforme à vos principes de conception.

## ⚖️ Avantages et inconvénients

### ➕ Avantages

- **Automatisation** : Les règles architecturales sont vérifiées automatiquement dans vos tests, intégrables dans un pipeline CI/CD.
- **Flexibilité** : L'API d'ArchUnit permet de définir des règles spécifiques adaptées à votre projet (par exemple, vérifier les annotations ou les dépendances).
- **Intégration simple** : ArchUnit s'intègre facilement dans des projets Spring Boot via Maven ou Gradle.
- [**Détection précoce des erreurs**](https://www.sfeir.dev/product/pourquoi-tester-son-code/) : Les violations architecturales sont identifiées dès les tests unitaires, avant même le déploiement.

### ➖ Inconvénients

- **Courbe d'apprentissage** : L'API d'ArchUnit, bien que fluide, peut sembler complexe pour les débutants.
- **Performance** : L'analyse du bytecode peut ralentir les tests dans de très grands projets, surtout si toutes les classes sont importées.
- **Maintenance des règles** : Les règles doivent être mises à jour si l'architecture évolue, ce qui peut nécessiter un effort supplémentaire.

## Cas pratique : Utilisation d'ArchUnit dans une application Spring Boot

### Mise en place

Ajouter la dépendance suivante dans votre fichier `pom.xml`

```xml
<dependency>
    <groupId>com.tngtech.archunit</groupId>
    <artifactId>archunit-junit5</artifactId>
    <version>1.4.0</version>
    <scope>test</scope>
</dependency>
```

Et le tour est joué.

### Exemple

Prenons une application Spring Boot avec son architecture classique :

[![](https://www.sfeir.dev/content/images/2025/04/image-17.png)](https://www.sfeir.dev/content/images/2025/04/image-17.png)

Nous allons utiliser ArchUnit pour valider son architecture à l'aide de la classe de test suivante :

```java
public class ArchitectureTest {

    private static JavaClasses importedClasses;

    @BeforeAll
    public static void setup() {
        // Importer toutes les classes du package de l'application
        importedClasses = new ClassFileImporter()
                .importPackages("fr.eletutour.archunit");
    }

    @Test
    public void controllersShouldOnlyDependOnServices() {
        ArchRule rule = classes()
            .that().areAnnotatedWith(RestController.class)
            .or().resideInAPackage("..controller..")
            .should().onlyDependOnClassesThat()
            .resideInAnyPackage("..service..", "..model..", "..exception..", "java..", "org.springframework..");

        rule.check(importedClasses);
    }

    @Test
    public void servicesShouldOnlyDependOnRepositories() {
        ArchRule rule = classes()
            .that().areAnnotatedWith(Service.class)
            .or().resideInAPackage("..service..")
            .should().onlyDependOnClassesThat()
            .resideInAnyPackage("..repository..", "..model..", "..exception..", "java..", "org.springframework..");

        rule.check(importedClasses);
    }

    @Test
    public void repositoriesShouldNotDependOnServicesOrControllers() {
        ArchRule rule = classes()
            .that().areAnnotatedWith(Repository.class)
            .or().resideInAPackage("..repository..")
            .should().onlyDependOnClassesThat()
            .resideInAnyPackage("java..",  "..model..", "org.springframework..");

        rule.check(importedClasses);
    }

    @Test
    public void noClassesShouldAccessControllers() {
        ArchRule rule = noClasses()
                .that()
                .resideInAnyPackage("..service..", "..repository..")
                .should()
                .dependOnClassesThat().resideInAPackage("..controller..");

        rule.check(importedClasses);
    }
}
```

**Configurer les tests**

- La classe `ArchitectureTest` utilise `ClassFileImporter` pour importer toutes les classes du package `fr.eletutour.archunit`. Les tests sont exécutés avec **JUnit**, et chaque règle est définie à l'aide de l'API fluide d'ArchUnit.

**Explications des règles**

- **controllersShouldOnlyDependOnServices** : Vérifie que les classes annotées `@RestController` ou dans le package `controller` ne dépendent que des classes des packages `service`, `model`, `exception`, ou des bibliothèques Java/Spring. Cela garantit que les contrôleurs respectent leur rôle de point d'entrée HTTP.
- **servicesShouldOnlyDependOnRepositories** : S'assure que les classes annotées `@Service` ou dans le package `service` ne dépendent que des classes des packages `repository`, `model`, `exception`, ou des bibliothèques Java/Spring, renforçant la logique métier.
- **repositoriesShouldNotDependOnServicesOrControllers** : Garantit que les classes annotées `@Repository` ou dans le package `repository` n'ont pas de dépendances vers les services ou les contrôleurs, limitant leurs interactions aux entités et aux bibliothèques Spring/Java.
- **noClassesShouldAccessControllers** : Empêche les classes des packages service ou repository de dépendre des contrôleurs, évitant ainsi des dépendances inversées.

Si une règle est violée, ArchUnit fournira un message d'erreur détaillé indiquant la classe et la dépendance incriminée.

### Exemple de violation

Supposons que je modifie mon controller et lui ajoute une dépendance directement vers le repository :

```java
@RestController
@RequestMapping("/authors")
public class AuthorController {

    private final AuthorService authorService;
    private final AuthorRepository authorRepository;

    public AuthorController(AuthorService authorService, AuthorRepository authorRepository) {
        this.authorService = authorService;
        this.authorRepository = authorRepository;
    }

    @GetMapping
    public List<Author> getAuthors() throws AuthorNotFoundException {
        return authorService.getAuthors();
    }

    @GetMapping("/{id}")
    public Author getAuthorById(@PathVariable Long id) throws AuthorNotFoundException {
        return authorService.getAuthorById(id);
    }
}
```

Le test **controllersShouldOnlyDependOnServices** échouera et me fournira le message d'erreur suivant :

```log
java.lang.AssertionError: Architecture Violation [Priority: MEDIUM] - Rule 'classes that are annotated with @RestController or reside in a package '..controller..' should only depend on classes that reside in any package ['..service..', '..model..', '..exception..', 'java..', 'org.springframework..']' was violated (2 times):
Constructor <fr.eletutour.archunit.controller.AuthorController.<init>(fr.eletutour.archunit.service.AuthorService, fr.eletutour.archunit.repository.AuthorRepository)> has parameter of type <fr.eletutour.archunit.repository.AuthorRepository> in (AuthorController.java:0)
Field <fr.eletutour.archunit.controller.AuthorController.authorRepository> has type <fr.eletutour.archunit.repository.AuthorRepository> in (AuthorController.java:0)
```

## Conclusion

Intégrer **ArchUnit** dans une application Spring Boot est une stratégie efficace pour maintenir une architecture propre et cohérente.  
En automatisant la vérification des règles architecturales, **ArchUnit** réduit les dettes techniques et facilite la collaboration dans les équipes.  
Bien qu'il nécessite un investissement initial pour apprendre son API et définir des règles pertinentes, les bénéfices à long terme sont indéniables.

Le cas pratique présenté montre comment appliquer **ArchUnit** à une application simple, mais ses principes peuvent être étendus à des projets plus complexes.

Alors, pourquoi ne pas essayer ArchUnit dans votre prochain projet Spring Boot ? Votre architecture vous remerciera !
