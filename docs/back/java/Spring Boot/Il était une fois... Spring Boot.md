---
layout: "default"
title: "Il était une fois... Spring Boot"
permalink: "/back/java/spring-boot/il-etait-une-fois-spring-boot/"
tags: [back, java, spring-boot]
date: "2025-09-05"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/il-etait-une-fois-spring-boot/"
banner: "https://www.sfeir.dev/content/images/size/w1200/2025/08/Capture-d---e--cran-2025-08-13-a---12.54.18.png"
published_at: "2025-09-05"
sfeir_slug: "il-etait-une-fois-spring-boot"
sfeir_tags: [Back, Spring Boot, Il etait une fois]
---
## Avant Spring Boot, il y avait… Spring ! 🌱

Avant l’arrivée de Spring Boot, il y avait [**Spring**](https://spring.io/projects/spring-framework?ref=sfeir.dev), le framework incontournable qui a révolutionné le développement d’applications [[Il était une fois... Java|Java]]. Créé au début des années 2000, Spring avait une mission claire : rendre le code Java plus léger, mieux structuré et surtout plus facile à [[Test paramétrés - un test pour les gouverner tous|tester]].

À cette époque, développer une application Java complète signifiait gérer soi-même une pléthore de configurations et de dépendances.  
Spring a introduit deux concepts majeurs qui ont tout changé :

- **L’inversion de contrôle (IoC)** : le framework prend en charge la création et la gestion des objets au lieu du développeur.
- **L’injection de dépendances (DI)** : plus besoin de créer manuellement des instances d’objets partout dans le code.

Grâce à cela, Spring a permis de créer des applications Java modulaires, testables et flexibles. Mais… tout n’était pas parfait.

## Une idée simple, une révolution

Avant l’arrivée de [Spring Boot](https://www.sfeir.dev/back/back-spring-boot/), les développeurs Java devaient jongler avec une multitude de fichiers XML et gérer manuellement des dépendances complexes, un processus souvent laborieux.  
Tout changea en **2014**, lorsque l’équipe derrière Spring eut une idée révolutionnaire : créer un framework permettant de [lancer un projet Java rapidement, sans être submergé par la configuration](https://www.sfeir.dev/back/creer-son-projet-spring-boot-de-zero/).  
C’est ainsi que naquit Spring Boot, un véritable super-héros pour les développeurs, fondé sur le principe « **convention over configuration** », offrant une simplicité et une productivité accrues.

## Pourquoi moi, Spring Boot, je suis devenu incontournable ?

- **Démarrage rapide** : Pas besoin de configurer un fichier XML long comme un roman : ajoute les bonnes dépendances, et c’est parti !
- **Spring Boot Starter** : [Chaque fonctionnalité a son starter](https://www.sfeir.dev/back/how-to-trouver-ses-starters-springboot/) : [[REST - définition|REST]], JPA, sécurité, [[Pourquoi tester son code ?|tests]]… Un simple ajout dans le `pom.xml` et tout est prêt.
- **Serveur embarqué** : Tomcat, Jetty, ou Undertow, directement dans ton application. Pas besoin de te soucier d’un serveur externe.
- **Production-ready** : Actuator pour la gestion des [[Superviser votre application Spring Boot grâce à Prometheus et Grafana|métriques, monitoring et santé de l’application]].

## Les grandes étapes de ma carrière 🚀

### 🌟 2014 : La naissance de Spring Boot 1.0

C’est le début d’une nouvelle ère pour les développeurs Java. Avec l’introduction des starters, de l’auto-configuration et des serveurs embarqués, Spring Boot rend la création d’applications web plus rapide et intuitive que jamais.  
Les développeurs adoptent massivement ce nouvel outil, qui devient rapidement la pierre angulaire de l’écosystème Spring.

### ⚙️ 2018 : Spring Boot 2.0 et l’ère réactive

Avec Spring Boot 2.0, le framework devient encore plus puissant :

- **Support des applications réactives** avec **Spring WebFlux**, conçu pour gérer des milliers de requêtes simultanément de manière non bloquante.
- Meilleure gestion des **dépendances** et des **starters**, facilitant encore plus l’intégration des modules tiers.
- Introduction de nouvelles options de monitoring et d’observabilité grâce à **Spring Boot Actuator**, amélioré pour s’adapter aux environnements de production modernes.

Cette version marque également l’adoption massive de Spring Boot pour le développement de **microservices**, notamment grâce à l’intégration transparente avec **Spring Cloud**.

### 🚀 2023 : Spring Boot 3.0 – Transition vers Jakarta EE et Java 17

En 2023, Spring Boot franchit un cap important avec la sortie de sa version 3.0 :

- **Migration vers Jakarta EE** : cette transition est essentielle pour rester compatible avec l’évolution des standards Java EE, désormais sous l’égide de Jakarta.
- **Support minimum de** [**Java 17**](https://www.sfeir.dev/back/comment-jai-survecu-a-la-certification-oracle-certified-professional-java-se-17-developer/) : en exploitant les nouvelles fonctionnalités du langage, comme les **records** et le **pattern matching**, Spring Boot 3.0 permet d’écrire un code plus concis et performant.
- **Support natif de GraalVM** : la possibilité de compiler les applications en **images natives** permet de réduire considérablement le temps de démarrage et la consommation de mémoire, ce qui est idéal pour les applications cloud-native.

Cette version s’impose comme la solution de choix pour les entreprises développant des **microservices** ou des applications cloud évolutives.

### 🔮 2025 : L’avenir avec Java 21

Avec l’arrivée de [**Java 21**](https://www.sfeir.dev/back/quoi-de-neuf-dans-lapi-java-21/) et les nouvelles avancées du langage, Spring Boot continue de s’améliorer. Les futures versions intègrent :

- Les dernières évolutions de Java, comme les **héritages étendus des records** et le **pattern matching pour les switch** finalisé.
- Des optimisations continues pour un meilleur support des environnements modernes (containers, Kubernetes…).

Aujourd’hui, je suis plus qu’un simple framework : je suis une **plateforme complète** pour le développement d’applications Java modernes, couvrant un large éventail de besoins, du développement web classique au cloud-native et aux microservices.

## 🛠️ Mes secrets sous le capot : Auto-configuration et starters

### Auto configuration

Spring Boot détecte automatiquement les dépendances présentes dans ton projet et configure les beans nécessaires. Par exemple, ajoute Spring Data JPA, et il détectera la base de données et configurera l’entité `EntityManager` pour toi.

### Starters

Les starters sont des packages tout-en-un. En voici quelques-uns incontournables :

- `spring-boot-starter-web` : pour créer des applications web et des APIs REST.
- `spring-boot-starter-data-jpa` : pour gérer la persistance avec JPA.
- `spring-boot-starter-security` : pour sécuriser ton application.

### Un exemple concret : ma première API REST

```java
@RestController
@RequestMapping("/api/books")
public class BookController {

    @GetMapping
    public List<Book> getAllBooks() {
        return List.of(new Book("Il était une fois Java", "Anonyme"));
    }
}
```

une API tout ce qu'il y'a de plus simple

Avec Spring Boot, créer une API REST est simple comme bonjour. Un contrôleur, une méthode annotée `@GetMapping`, et c’est prêt !

## 📖 Et l’histoire continue…

Depuis sa naissance en 2014, **Spring Boot** a grandi, mûri, et s’est adapté à toutes les époques du royaume Java.  
Aujourd’hui, il est devenu bien plus qu’un simple framework : c’est un compagnon de route pour les développeurs, un allié qui simplifie, accélère et sécurise la création d’applications.

Comme tout bon héros, Spring Boot ne cesse d’évoluer, embrassant les nouvelles versions de Java, s’adaptant aux environnements cloud et anticipant les besoins de demain.  
Et si l’histoire de Spring Boot nous apprend quelque chose, c’est bien qu’il ne s’agit pas seulement d’un outil technique… mais d’un véritable partenaire dans nos aventures de code.
