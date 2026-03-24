---
layout: "default"
title: "Papa, je veux un Pokédex - partie 2"
permalink: "/springboot/papa-je-veux-un-pokedex-partie-2/"
tags: [back, java, vaadin, pokedex, spring-boot, tutoriel]
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/papa-je-veux-un-pokedex-partie-2/"
banner: "https://www.sfeir.dev/content/images/2024/08/pexels-caleboquendo-7772561.jpg"
published_at: "2024-11-15"
sfeir_slug: "papa-je-veux-un-pokedex-partie-2"
date: "2024-11-15"
---
[Après avoir tester différentes approches](/springboot/papa-je-veux-un-pokedex-partie-1/), qui se sont toutes retrouvées infructueuses, on continue de chercher comment réaliser le Pokédex parfait avec un autre solution.

## Quatrième solution : [Vaadin](/definition/vaadin-definition/)

### Qu'est ce que c'est ?

[Vaadin est un framework Java pour créer des applications web](/definition/vaadin-definition/). Il est particulièrement apprécié pour sa capacité à simplifier le développement d'interfaces utilisateur, tout en utilisant [Java](/back/java/il-etait-une-fois-java/) pour tout le code, y compris celui de l'interface.

### L'intérêt ?

Vaadin possède plusieurs atouts qui le rendent particulièrement attrayant pour les développeurs. Voici les trois points forts principaux de ce framework :

#### Développement full-stack Java

- **Unification** : Vaadin permet de développer toute l'application (front-end et back-end) en Java. Cela simplifie énormément le processus de développement pour les équipes qui maîtrisent bien Java, en réduisant la nécessité de basculer entre différents langages (comme JavaScript, HTML, CSS).
- **Productivité** : En utilisant un seul langage pour tout, les développeurs peuvent se concentrer sur la logique métier sans se soucier des détails de l'implémentation côté client. Cela accélère le développement et réduit les erreurs.

#### [Composants riches et performants](https://vaadin.com/docs/latest/components?ref=sfeir.dev)

- **Bibliothèque de composants** : Vaadin offre une large gamme de composants UI modernes, réactifs et bien conçus (boutons, tableaux, graphiques, formulaires, etc.), ce qui permet de créer rapidement des interfaces utilisateur complexes et interactives.
- **Personnalisation et extensibilité** : Les composants peuvent être facilement personnalisés et étendus pour répondre aux besoins spécifiques de l'application. De plus, Vaadin s'intègre bien avec d'autres bibliothèques et outils Java, permettant une grande flexibilité dans la conception des interfaces.

#### Gestion simplifiée de la sécurité et de la synchronisation

- **Sécurité** : Étant donné que la logique de l'application est principalement exécutée côté serveur, les données sensibles et la logique métier sont mieux protégées contre les attaques côté client.
- **Synchronisation** : Vaadin gère automatiquement la synchronisation entre le client et le serveur. Les développeurs n'ont pas besoin de gérer manuellement les appels AJAX ou WebSocket, car Vaadin s'occupe de maintenir l'état de l'interface utilisateur en phase avec les données du serveur, assurant une expérience utilisateur fluide et réactive.

Ok, tout ça c'est bien beau, mais comment je mets ça en place ?  
C'est ce que nous allons voir tout de suite.

### Mise en place

L'un des avantages de Vaadin, c'est sa capacité à s'intégrer de manière transparente avec les frameworks Spring.  
Voici les étapes pour démarrer une application Vaadin avec [Spring Boot](/springboot/il-etait-une-fois-spring-boot/) :

1. Allez sur [Spring Initializr](https://start.spring.io/?ref=sfeir.dev)
2. Choisissez votre type de projet (Maven / Gradle)
3. Choisissez votre Langage (Java / Kotlin)
4. Choisissez votre version de Spring Boot
5. Remplissez les informations relatives à votre projet
6. Dans les dépendances ajouter Vaadin ainsi que celles qui pourraient vous être utiles :
    1. Accès à une base de données
    2. Lombok
    3. Test

[![](https://www.sfeir.dev/content/images/2024/08/image-2.png)](https://www.sfeir.dev/content/images/2024/08/image-2.png)

interface spring initialzer

Une fois cela fait, je vous laisse le soin d'importer le projet ainsi généré dans votre IDE favori.  
Une fois cela fait, vous pouvez démarrer l'application comme n'importe quelle application spring boot classique.

```java
@SpringBootApplication
public class PokedexViewsApplication {

	public static void main(String[] args) {
		SpringApplication.run(PokedexViewsApplication.class, args);
	}

}
```

application spring boot

et en vous rendant à l'url suivante : [http://localhost:8080/](http://localhost:8080/?ref=sfeir.dev)

vous aurez un résultat similaire à ceci

[![](https://www.sfeir.dev/content/images/2024/08/image-3.png)](https://www.sfeir.dev/content/images/2024/08/image-3.png)

vue par défaut

### Créons notre première vue

Cette étape peut faire peur dit comme cela, mais il n'en est rien, bien au contraire.

```java
@Route("home")
@PageTitle("home")
public class HomeView extends VerticalLayout {

    public HomeView() {

        add(new H1("Welcome to your new application"));
        add(new Paragraph("This is the home view"));
        add(new Paragraph("You can edit this view in src/main/java/fr/eletutour/pokedex_views/views/HomeView.java"));

    }
}
```

classe HomeView

#### L'annotation @Route

[L'annotation](/springboot/comprendre-les-annotations-dans-spring-boot-guide-et-exemples/) `@Route` dans Vaadin est utilisée pour définir les vues qui sont navigables dans l'application. Cette annotation indique que la classe annotée représente une page ou une vue de l'application, et elle spécifie le chemin d'accès (URL) où cette vue sera accessible.

⚠️ La classe annotée avec `@Route` doit hériter d'une classe de composant Vaadin, généralement `VerticalLayout`, `HorizontalLayout`.  
Le chemin d'accès (URL) de la vue est défini dans la valeur de l'annotation `@Route`. Si aucune valeur n'est fournie, la vue sera accessible à la racine de l'application (`/`).

Ici ma vue sera accessible à l'adresse suivante : [http://localhost:8080/home](http://localhost:8080/home?ref=sfeir.dev)

#### L'annotation @PageTitle

L'annotation `@PageTitle` dans Vaadin est utilisée pour définir le titre de la page (l'élément `<title>` dans le `<head>` du document HTML) pour une vue spécifique. Cela permet de spécifier ce qui apparaît dans l'onglet du navigateur lorsqu'un utilisateur navigue vers cette vue.

⚠️ La classe annotée avec `@PageTitle` doit être une vue navigable (annotée avec `@Route`)

#### La méthode add

La méthode `add` dans Vaadin est utilisée pour ajouter des composants enfants à un composant conteneur. Cette méthode est très courante et essentielle pour construire l'interface utilisateur en organisant les composants de manière hiérarchique.

- La méthode `add` est disponible sur tous les composants conteneurs, comme `VerticalLayout`, `HorizontalLayout`, `Div`, etc.
- Vous pouvez ajouter un ou plusieurs composants en tant qu'arguments de la méthode `add`.

Voyons à quoi ressemble cette première vue :

[![](https://www.sfeir.dev/content/images/2024/08/image-4.png)](https://www.sfeir.dev/content/images/2024/08/image-4.png)

vue Home

Il est temps de pimenter un peu les choses ! RDV sur le 3ème et dernier article de la série !
