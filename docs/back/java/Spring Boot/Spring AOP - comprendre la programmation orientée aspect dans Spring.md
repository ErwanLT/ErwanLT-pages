---
layout: "default"
title: "Spring AOP - comprendre la programmation orientée aspect dans Spring"
permalink: "/back/java/spring-boot/spring-aop-comprendre-la-programmation-orientee-aspect-dans-spring/"
tags: [back, java, spring-boot]
date: "2025-09-17"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/spring-aop-comprendre-la-programmation-orientee-aspect-dans-spring/"
banner: "https://www.sfeir.dev/content/images/2025/08/20250821_1727_Pixelated-Spring-Boot-Magic_simple_compose_01k36kqadqf1xav38vw32my06a.png"
published_at: "2025-09-17"
sfeir_slug: "spring-aop-comprendre-la-programmation-orientee-aspect-dans-spring"
sfeir_tags: [Back, Spring Boot, AOP, Java]
---
**Spring AOP** (_Aspect-Oriented Programming_) est un module du framework [Spring](https://www.sfeir.dev/tag/spring-boot/) qui permet de modulariser des préoccupations transversales, telles que la gestion des transactions, la journalisation ou la [sécurité](https://www.sfeir.dev/back/limiter-les-appels-a-son-api-rest-avec-bucket4j/), sans alourdir le code métier principal. En s'appuyant sur le paradigme de programmation orientée aspect, **Spring AOP** offre une approche pour séparer les fonctionnalités communes des logiques spécifiques, améliorant ainsi la lisibilité, la maintenabilité et la réutilisabilité du code.  
Grâce à des concepts clés comme les aspects, les **pointcuts** et les **advices**, Spring AOP permet d'intercepter et de modifier dynamiquement le comportement des applications Java.

Cette introduction explore les principes fondamentaux de Spring AOP, ses cas d'utilisation et son intégration dans les projets Spring modernes.

## Origine et apparition de Spring AOP

Spring AOP, ou programmation orientée aspect dans le framework Spring, trouve ses racines dans l'émergence du paradigme de programmation orientée aspect (**AOP**) à la fin des années 1990. L'AOP a été conceptualisée par [**Gregor Kiczales**](https://ca.linkedin.com/in/gregork?ref=sfeir.dev), avec l'objectif de résoudre les limitations de la programmation orientée objet (**POO**) en matière de gestion des préoccupations transversales comme la journalisation, la gestion des transactions ou la sécurité.  
Ces préoccupations, souvent dispersées à travers le code, rendaient les applications difficiles à maintenir et à modulariser.

L'AOP propose une solution en introduisant des "**aspects**", qui permettent d'isoler ces préoccupations dans des modules réutilisables. Le concept a été formalisé avec des outils comme **AspectJ**, un pionnier dans ce domaine, qui a influencé de nombreux frameworks, y compris Spring.

## Principes fondamentaux

**Spring AOP** repose sur plusieurs concepts fondamentaux :

- **Aspect** : une classe qui regroupe une préoccupation transversale.
- **Advice** : l’action exécutée à un point donné de l’exécution du programme.
- **Join point** : un point d’exécution dans l’application (par ex. l’appel d’une méthode).
- **Pointcut** : une expression qui sélectionne les join points visés.
- **Weaving** : le processus d’association d’un aspect à un pointcut.

### Types d'`Advice` dans Spring AOP

Spring AOP fournit plusieurs types d’advices pour intervenir à différents moments de l’exécution :

- `@Before` : exécuté **avant** l’appel d’une méthode ciblée.
- `@After` : exécuté **après** l’appel, que celui-ci réussisse ou échoue.
- `@AfterReturning` : exécuté **après un retour normal** de la méthode.
- `@AfterThrowing` : exécuté **en cas d’exception**.
- `@Around` : englobe l’exécution de la méthode, permettant un contrôle total (avant, après, exception, etc.).

## Ajouter Spring-AOP à votre projet

La solution la plus simple si vous êtes dans un contexte [d'application Spring Boot](/back/java/spring-boot/il-etait-une-fois-spring-boot/) est de rajouter la [dépendance au starter AOP](https://www.sfeir.dev/back/how-to-trouver-ses-starters-springboot/).

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
    <version>votre version</version>
</dependency>
```

Dépendance au starter AOP

mais encore, celle-ci n'est pas obligatoire car l'AOP étant au coeur du framework Spring Boot, la dépendance est déjà présente dans plusieurs starter.  
Par exemple, si je lance un `mvn dependency:tree` on peut voir que **spring-aop** est embarqué.

```log
[INFO] +- org.springframework.boot:spring-boot-starter-web:jar:3.5.3:compile
[INFO] |  +- org.springframework.boot:spring-boot-starter-json:jar:3.5.3:compile
[INFO] |  |  +- com.fasterxml.jackson.core:jackson-databind:jar:2.19.1:compile
[INFO] |  |  |  +- com.fasterxml.jackson.core:jackson-annotations:jar:2.19.1:compile
[INFO] |  |  |  \- com.fasterxml.jackson.core:jackson-core:jar:2.19.1:compile
[INFO] |  |  +- com.fasterxml.jackson.datatype:jackson-datatype-jdk8:jar:2.19.1:compile
[INFO] |  |  +- com.fasterxml.jackson.datatype:jackson-datatype-jsr310:jar:2.19.1:compile
[INFO] |  |  \- com.fasterxml.jackson.module:jackson-module-parameter-names:jar:2.19.1:compile
[INFO] |  +- org.springframework.boot:spring-boot-starter-tomcat:jar:3.5.3:compile
[INFO] |  |  +- org.apache.tomcat.embed:tomcat-embed-core:jar:10.1.42:compile
[INFO] |  |  +- org.apache.tomcat.embed:tomcat-embed-el:jar:10.1.42:compile
[INFO] |  |  \- org.apache.tomcat.embed:tomcat-embed-websocket:jar:10.1.42:compile
[INFO] |  +- org.springframework:spring-web:jar:6.2.8:compile
[INFO] |  |  \- org.springframework:spring-beans:jar:6.2.8:compile
[INFO] |  \- org.springframework:spring-webmvc:jar:6.2.8:compile
[INFO] |     +- org.springframework:spring-aop:jar:6.2.8:compile
[INFO] |     \- org.springframework:spring-expression:jar:6.2.8:compile
```

### Exemple concret d’utilisation

Prenons un service simple qui ne fait que retourner la chaine "Hello name"

```java
@Service
public class TutorialService {

    public String sayHello(String name) {
        return "Hello " + name;
    }
}
```

Maintenant, créons un aspect qui va logger tout ce qui passe dans mon service :

```java
@Aspect
@Component
public class LoggingAspect {

    private final Logger LOGGER = LoggerFactory.getLogger(LoggingAspect.class);

    @Before("execution(* fr.eletutour.tutorial.aop.service.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        LOGGER.info("Méthode exécutée : {}", joinPoint.getSignature());
    }

    @After("execution(* fr.eletutour.tutorial.aop.service.*.*(..))")
    public void logAfter(JoinPoint joinPoint) {
        LOGGER.info("Méthode terminée : {}", joinPoint.getSignature());
    }

    @Around("execution(* fr.eletutour.tutorial.aop.service.*.*(..))")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        LOGGER.info("Avant la méthode : {}", joinPoint.getSignature());
        LOGGER.info("Args de la méthode {}", joinPoint.getArgs());

        // Appel de la méthode cible
        Object result = joinPoint.proceed();

        LOGGER.info("Après la méthode : {}", joinPoint.getSignature());
        return result;
    }

    @AfterReturning(
            pointcut = "execution(* fr.eletutour.tutorial.aop.service.*.*(..))",
            returning = "result"
    )
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        LOGGER.info("Méthode réussie : {}", joinPoint.getSignature());
        LOGGER.info("Résultat : {}", result);
    }
}
```

Exemple concret d'aspect

Maintenant voyons ce qu'il se passe à l'exécution de la méthode `sayHello` de mon service :

```log
2025-08-08T08:30:11.548+02:00  INFO 39280 --- [           main] f.e.tutorial.aop.aspect.LoggingAspect    : Avant la méthode : String fr.eletutour.tutorial.aop.service.TutorialService.sayHello(String)
2025-08-08T08:30:11.548+02:00  INFO 39280 --- [           main] f.e.tutorial.aop.aspect.LoggingAspect    : Args de la méthode Erwan
2025-08-08T08:30:11.548+02:00  INFO 39280 --- [           main] f.e.tutorial.aop.aspect.LoggingAspect    : Méthode exécutée : String fr.eletutour.tutorial.aop.service.TutorialService.sayHello(String)
2025-08-08T08:30:11.548+02:00  INFO 39280 --- [           main] f.e.tutorial.aop.aspect.LoggingAspect    : Méthode réussie : String fr.eletutour.tutorial.aop.service.TutorialService.sayHello(String)
2025-08-08T08:30:11.548+02:00  INFO 39280 --- [           main] f.e.tutorial.aop.aspect.LoggingAspect    : Résultat : Hello Erwan
2025-08-08T08:30:11.548+02:00  INFO 39280 --- [           main] f.e.tutorial.aop.aspect.LoggingAspect    : Méthode terminée : String fr.eletutour.tutorial.aop.service.TutorialService.sayHello(String)
2025-08-08T08:30:11.548+02:00  INFO 39280 --- [           main] f.e.tutorial.aop.aspect.LoggingAspect    : Après la méthode : String fr.eletutour.tutorial.aop.service.TutorialService.sayHello(String)
```

On peut constater que les différents advice sont exécutés dans l'ordre suivant :

- `@Around` :
    - Avant la méthode : String
    - Args de la méthode Erwan
- `@Before` :
    - Méthode exécutée : String fr.eletutour.tutorial.aop.service.TutorialService.sayHello(String)
- `@AfterReturning`
    - Méthode réussie : String fr.eletutour.tutorial.aop.service.TutorialService.sayHello(String)
    - Résultat : Hello Erwan
- `@After`
    - Méthode terminée : String fr.eletutour.tutorial.aop.service.TutorialService.sayHello(String)
- `@Around` :
    - Après la méthode : String fr.eletutour.tutorial.aop.service.TutorialService.sayHello(String)

### Autres expressions de `Pointcut`

Ici, je n'ai utilisé que l'expression **execution** dans mes **pointcuts**, mais il en existe d'autres :

- `within(com.example.service..*)` : cible toutes les méthodes d’un package.
- `this(com.example.service.MyInterface)` : cible les beans implémentant une interface donnée.
- `target(com.example.service.MyService)` : cible les beans de type spécifique.
- `args(java.lang.String, ..)` : cible les méthodes avec un ou plusieurs paramètres.
- `@annotation(MyCustomAnnotation)` : cible les méthodes annotées. (pour un exemple de cette dernière, [allez lire la série sur les BRMS](/back/java/spring-boot/brms/maitrisez-vos-regles-metier-integrez-drools-dans-spring-boot/)

Il est aussi possible de combiner plusieurs conditions avec `&&`, `||`, `!`.

## Conclusion

Spring AOP est une solution fidèle aux principes de séparation des préoccupations, en isolant clairement la logique métier des traitements transversaux comme la sécurité, la journalisation ou la gestion des transactions.  
Grâce à son intégration native au sein de l’écosystème Spring, il s’adapte naturellement aux architectures existantes et favorise un code plus clair, plus maintenable et plus modulaire.
