---
layout: default
title: Gestion des exceptions
permalink: /springboot/exceptions/
tags: [spring-boot, java, tutoriel, exceptions]
---
# Comment bien gérer ses exceptions dans Spring Boot

Commençons simplement par une question : qui a déjà rencontré ce genre de cas de figure ?

[![](https://www.sfeir.dev/content/images/2024/07/image.png)](https://www.sfeir.dev/content/images/2024/07/image.png)

Une abomination

Pour ma part, j'ai rencontré à plusieurs reprises des cas similaires, et à chaque fois, ma réaction a été la même :

[![](https://media.tenor.com/-c34XISCYBEAAAAC/fear.gif)](https://media.tenor.com/-c34XISCYBEAAAAC/fear.gif)

Réaction normale à ce genre de réponse HTTP

Il y'a dans cette réponse à une requête HTTP quelque chose de terrible : **un code retour 200 avec un message d'erreur**.

Pour ceux qui ne comprennent pas pourquoi ce message est terrifiant, je vous invite à aller lire la [section 6 de la RFC-7231](https://datatracker.ietf.org/doc/html/rfc7231?ref=sfeir.dev#section-6).  
Mais pour résumer, voici ce que nous pouvons déduire des codes retour HTTP :

|code|Type|Description|Excemple|
|---|---|---|---|
|1XX|Information|La demande a été reçue, le processus se poursuit.|**100 Continue** indique que, jusqu'à présent, tout est normal et que le client doit poursuivre avec la requête ou l'ignorer si celle-ci est déjà finie.|
|2XX|Succès|La demande a été acceptée avec succès,|**200 OK** indique la réussite d'une requête|
|3XX|Redirection|Redirection permanente ou temporaire|**304 Not Modified** indique qu'il n'y a pas besoin de retransmettre les ressources demandées.|
|4XX|Erreur client|La requête contient des erreurs ou ne peut pas être accomplie|**418 I'm a teapot** qui signifie « Je suis une théière » informe que le serveur refuse de préparer du café, car il s'agit d'une théière.|
|5XX|Erreur server|Le serveur n’a pas réussi à traiter une requête valide|**500 Internal Server Error** indique que le serveur a rencontré un problème inattendu qui l'empêche de répondre à la requête.|

Vous comprenez donc que pour une réponse avec un code de retour 200, je ne m'attend pas à recevoir un message d'erreur contrairement à ce que nous avons eu plus haut.

Maintenant que les bases sont posées, entrons dans le vif du sujet.

## Pourquoi bien gérer ses erreurs ?

### Améliorer l'expérience utilisateur

Nous ne savons pas toujours comment nos utilisateurs utiliseront nos applications ni quelles requêtes ils pourront envoyer, qui ne respecteront pas forcément les formats attendus. Une bonne gestion des exceptions permet de fournir des messages d'erreur clairs et compréhensibles aux utilisateurs, ce qui améliore leur expérience. Plutôt que de rencontrer des erreurs génériques ou des pages de plantage, les utilisateurs reçoivent des informations utiles sur ce qui s'est passé et, si possible, sur la manière de résoudre le problème.

[![](https://media.tenor.com/laHWlSpynX4AAAAC/thirsty-drink.gif)](https://media.tenor.com/laHWlSpynX4AAAAC/thirsty-drink.gif)

Quand on confit l'application aux utilisateurs.

### Maintenir la stabilité et la fiabilité

Même en tant qu'experts, les développeurs peuvent faire des erreurs. Bien que nous nous efforcions de [produire un code de haute qualité](https://www.sfeir.dev/product/pourquoi-tester-son-code/) et de [tester rigoureusement tous les cas possibles](https://www.sfeir.dev/back/un-test-pour-les-gouverner-tous/), il est irréaliste de penser que notre code sera toujours exempt de défauts. C'est pourquoi une gestion efficace des exceptions est cruciale. Elle permet à l'application de continuer à fonctionner de manière contrôlée même lorsqu'une erreur survient, améliorant ainsi sa stabilité et sa fiabilité.

### Respecter les bonnes pratiques de développement

La gestion des exceptions est une part essentielle des bonnes pratiques de développement. Elle contribue à écrire un code propre, lisible et maintenable, et à suivre les principes de la programmation défensive.

## Créons un projet Spring Boot

Je vous épargne [la définition de Spring Boot](https://www.sfeir.dev/back/back-spring-boot/) et [pourquoi il est si utilisé](https://www.sfeir.dev/back/back-pourquoi-utiliser-spring-boot/) en java. Un de mes collègues a déjà écrit de supers articles sur le sujet que je vous recommande vivement de lire.  
D'ailleurs je vous recommande également de lire l'article suivant :

[

Comment créer son projet Spring Boot de zéro !

Débutant ou expert, lancer un projet Spring Boot de zéro n’a jamais été aussi simple !

[![](https://www.sfeir.dev/content/images/2023/10/Capture-d-e-cran-2023-10-27-a--09.54.06-1.png)](https://www.sfeir.dev/back/creer-son-projet-spring-boot-de-zero/)

Comment créer son projet Spring Boot de zéro ! par Yves Dautremay

Il servira de base pour le reste de l'article.

### Changement arborescence projet

J'ai apporté quelques changements au projet créer précédemment, j'ai ajouté une couche service en plus entre le controller et le repository, et mes noms de répertoire ne sont pas nécessairement les mêmes, mais je vous fais confiance pour vous en accommoder.

Notre nouvelle arborescence ressemble maintenant à celle-ci :

[![](https://www.sfeir.dev/content/images/2024/07/image-1.png)](https://www.sfeir.dev/content/images/2024/07/image-1.png)

arborescence du projet

### Une exception déjà présente

Les plus observateurs d'entre vous auront noté dans le code la présence de la ligne suivante :

```java
Hello hello = helloRepository.findById(id).orElseThrow();
```

Et oui, nous avons bien une exception qui est levée par notre application si jamais nous ne trouvons pas l'entité Hello en base de données.  
Cette exception _throw_ par notre méthode est une exception `NoSuchElementException` et en console sera la suivante :

```text
java.util.NoSuchElementException: No value present
```

Mais cette dernière étant une exception, que j'appellerai une exception par défaut, nous renverra la réponse suivante :

[![](https://www.sfeir.dev/content/images/2024/07/image-2.png)](https://www.sfeir.dev/content/images/2024/07/image-2.png)

une réponse en erreur

Nous pouvons constater deux choses par rapport à l'exemple catastrophique du début :

- Nous avons un code **500** qui nous indique qu'une erreur est survenue coté serveur.
- Nous avons quelques informations dans notre réponse

### Quel code retour choisir ?

Mais ici une question se pose : qu'aurions-nous vraiment du avoir comme code retour ?

- [**200 Ok**](https://datatracker.ietf.org/doc/html/rfc7231?ref=sfeir.dev#section-6.3.1) : Le code de statut **200 OK** est utilisé pour indiquer que la requête a été reçue, comprise et traitée avec succès par le serveur. Dans le contexte de notre application, cela signifierait que la requête `GET` a été exécutée correctement et que la ressource demandée, bien que traitée, n'a produit aucun contenu à renvoyer. Toutefois, renvoyer un **200 OK** avec un message d'erreur n'est pas une bonne pratique, car cela crée une confusion : le client reçoit un signal de succès mais avec une indication qu'une erreur est survenue.
- [**204 NO CONTENT**](https://datatracker.ietf.org/doc/html/rfc7231?ref=sfeir.dev#section-6.3.5) : Bien que le code de statut **200 OK** soit valide, retourner un **204 No Content** peut être pertinent lorsqu'il n'y a absolument rien à renvoyer. En effet, ce statut est souvent utilisé en réponse à un `PUT` (remplacement) ou à un `PATCH` (mise à jour partielle), ainsi qu'à un `DELETE`, puisqu'il n'y a généralement rien à retourner après une suppression. Cependant, il peut également être utilisé pour un GET. Si la requête est valide, traitée avec succès et qu'il n'y a pas de contenu à renvoyer, le code **204 No Content** est parfaitement compréhensible et approprié.
- [**404 NOT FOUND**](https://datatracker.ietf.org/doc/html/rfc7231?ref=sfeir.dev#section-6.5.4) **:** Le code de statut **404** est approprié lorsque la ressource demandée n'a pas été trouvée sur le serveur. Dans le contexte de notre application, cela signifie que la requête `GET` était bien formée et compréhensible, mais que l'entité "Hello" avec l'ID spécifié n'existe pas dans la base de données. En renvoyant un code **404**, nous informons clairement le client que la ressource qu'il cherche n'existe pas, ce qui est plus précis et utile que de renvoyer une erreur générique ou de laisser le client deviner la cause de l'absence de réponse.

[![](https://www.sfeir.dev/content/images/2024/07/8wkbe1.jpg)](https://www.sfeir.dev/content/images/2024/07/8wkbe1.jpg)

On ne choisi pas la réponse D !

> En renvoyant un code **404**, nous informons clairement le client que la ressource qu'il cherche n'existe pas, ce qui est plus précis et utile que de renvoyer une erreur générique ou de laisser le client deviner la cause de l'absence de réponse

Voici l'indice qui nous permet de choisir ~~la réponse D~~ la réponse C.

### Créons notre exception

Dans un premier temps, nous allons compléter le `orElseThrow()` en lui ajoutant une exception de notre cru :

```java
public class HelloException extends Exception {

    public enum HelloError {
        HELLO_NOT_FOUND("Hello not found", 404);

        private final String message;
        private final int code;

        HelloError(String message, int code) {
            this.message = message;
            this.code = code;
        }

        public String getMessage() {
            return message;
        }

        public int getCode() {
            return code;
        }
    }

    private HelloError error;
    private String message;

    public HelloException(HelloError error, String message) {
        this.error = error;
        this.message = message;
    }

    public HelloError getError() {
        return error;
    }

    public void setError(HelloError error) {
        this.error = error;
    }

    @Override
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
```


Cette classe définit une exception personnalisée pour notre service, permettant de gérer les erreurs spécifiques de manière plus claire et précise.  
Dans cette classe, j'ai une énumération `HelloError` qui permet de définir un message et un code retour. Pour le moment je n'ai qu'un seul message, mais cela me permettra dans le futur de rajouter d'autres erreurs liées à notre service.  
Cette classe étant dédiée uniquement aux erreurs pouvant survenir dans notre `HelloService` , nous respectons également [le principe de responsabilité unique](https://www.sfeir.dev/back/en-quete-du-principe-de-responsabilite-unique/) :

- **Responsabilité claire** : La classe d'exception a pour seule responsabilité de gérer les erreurs liées à ce service particulier.
- **Maintenabilité** : Les modifications aux exceptions spécifiques de ce service n'affecteront pas d'autres parties du système.
- **Lisibilité** : Le code devient plus compréhensible et organisé, car les exceptions spécifiques sont encapsulées dans une classe dédiée.

Maintenant que notre exception est créée, il nous faut l'utiliser :

```java
Hello hello = helloRepository.findById(id)
                .orElseThrow(() -> new HelloException(HELLO_NOT_FOUND, String.format("Hello %d non trouvé", id)));
```

Comme j'ai utilisé une exception qui étend directement `Exception` et non une `RunTimeException` la signature de ma méthode d'origine s'en trouve également changée car nous pouvons voir apparaitre le mot `throws` suivit de mon exception à la fin de ma signature

```java
public HelloDto findHello(Long id) throws HelloException
```

et également au niveau de mon controller

```java
public ResponseEntity<HelloDto> get(@PathVariable Long id) throws HelloException
```

Mais pourquoi ces changements au niveau de nos signatures de méthode ?  
Et bien tout simplement car notre exception rentre dans la catégorie des exceptions vérifiées ([checked exceptions](https://www.baeldung.com/java-checked-unchecked-exceptions?ref=sfeir.dev)).

Voici les points importants à considérer quand on utilise des checked exceptions :

1. Les développeurs sont obligés de les gérer avec des blocs `try-catch` ou de les déclarer dans les signatures des méthodes. ✅
2. Elles sont utilisées pour des conditions exceptionnelles que l’on peut raisonnablement attendre et traiter, comme les erreurs d’E/S, les erreurs de connexion réseau, les erreurs de fichier non trouvé. ✅
3. Encourage les développeurs à penser à la gestion des erreurs et à écrire du code plus robuste en obligeant la gestion des exceptions (ce que nous sommes en train de voir).

Mais du coup, si je teste mon code maintenant, y'aura t'il une différence dans ma réponse ?  
Et bien voyons cela :

[![](https://www.sfeir.dev/content/images/2024/07/image-3.png)](https://www.sfeir.dev/content/images/2024/07/image-3.png)

pas de changement pour l'instant

Pas de changement pour l'instant dans la réponse, mais dans les logs

```text
com.example.demo.model.exception.HelloException: Hello 1 non trouvé
	at com.example.demo.service.HelloService.lambda$findHello$0(HelloService.java:37) ~[classes/:na]
```

nous voyons bien l'exception que nous venons de créer.

Mais alors pourquoi avoir créé une exception customisée si je n'ai pas de changement ?  
Tout simplement car pour l'instant, nos exceptions sont throw mais pas interceptées.

### Interceptons nos exceptions

Pour intercepter nos exceptions nous allons avoir recours à un ControllerAdvice.  
`@ControllerAdvice` est une [annotation du framework Spring](https://www.sfeir.dev/back/comprendre-les-annotations-dans-spring-boot/) qui permet de définir une classe globale pour la gestion des exceptions et le traitement des réponses associées.

##### Avantages de @ControllerAdvice

- **Réduction du code redondant** : Centralise la gestion des exceptions, éliminant la nécessité de répéter le code de gestion d'erreur dans chaque contrôleur.
- **Maintenance améliorée** : Facilite la maintenance du code en permettant des modifications de la logique de gestion des exceptions en un seul endroit.
- **Uniformité** : Assure une réponse uniforme et cohérente pour les erreurs, améliorant l'expérience utilisateur et facilitant le débug.
- [**Respect du principe de responsabilité unique**](https://www.sfeir.dev/back/en-quete-du-principe-de-responsabilite-unique/) : Le `ControllerAdvice` a pour seule responsabilité de gérer les exceptions.

##### Mise en place du ControllerAdvice

```java
@ControllerAdvice
public class MyAppExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(HelloException.class)
    public ResponseEntity<Object> handleHelloException(HelloException he){
        return ResponseEntity.status(he.getError().getCode())
                .body(new ErrorResponse(HttpStatus.resolve(he.getError().getCode()), he.getError().getMessage(), List.of(he.getMessage())));
    }
}
```

Ici, mon controllerAdvice étend la classe `ResponseEntityExceptionHandler` ce qui permet de bénéficier de la gestion par défaut des exceptions fournies par Spring, tout en permettant de personnaliser cette gestion selon les besoins spécifiques de votre application.

Voyons plus en détail comment fonctionne cette classe :

- **`@ControllerAdvice`** : indique que c'est dans cette classe qu'aura lieu la gestion des exceptions
- `**@ExceptionHandler(HelloException.class)**` : Cette annotation indique que la méthode `handleHelloException` gère spécifiquement les exceptions de type `HelloException`.
- `**ResponseEntity.status(he.getError().getCode())**` : Cette méthode crée un `ResponseEntity` avec le code de statut HTTP provenant de l'objet `HelloError` contenu dans l'exception `HelloException`.
- `**body(new ErrorResponse(...))**` : La méthode `body` définit le corps de la réponse HTTP. Dans ce cas, elle crée un nouvel objet `ErrorResponse`.

Maintenant que j'intercepte mon `HelloException` et que je renvoie une réponse adaptée à l'erreur de cette dernière, voyons à quoi peut bien ressembler le retour de mon service.

[![](https://www.sfeir.dev/content/images/2024/07/image-4.png)](https://www.sfeir.dev/content/images/2024/07/image-4.png)

c'est de toute beauté

Enfin nous avons un code retour et un message explicite sur ce qui s'est produit comme erreur.

## Conclusion

Une gestion appropriée des erreurs est essentielle pour améliorer l'expérience utilisateur, maintenir la stabilité et la fiabilité de l'application, et suivre les bonnes pratiques de développement.  
En fournissant des messages d'erreur clairs et des réponses HTTP adaptées, on évite la confusion et aide les utilisateurs à résoudre les problèmes plus facilement.