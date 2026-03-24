---
layout: "default"
title: "Internationalisation (i18n) et localisation (l10n) avec Spring Boot : comment rendre vos applications multilingues"
permalink: "/back/java/spring-boot/internationalisation-i18n-et-localisation-l10n-avec-spring-boot-comment-rendre-vos-applications-multilingues/"
tags: [back, java, spring-boot]
date: "2026-02-04"
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/internationalisation-i18n-et-localisation-l10n-avec-spring-boot-comment-rendre-vos-applications-multilingues/"
banner: "https://www.sfeir.dev/content/images/size/w1304/2025/08/20250821_1341_Pixelated-Global-Adventure_simple_compose_01k366snw0f8rvaaeznkg98bzq.png"
published_at: "2026-02-04"
sfeir_slug: "internationalisation-i18n-et-localisation-l10n-avec-spring-boot-comment-rendre-vos-applications-multilingues"
sfeir_tags: [Back, Java, Spring Boot, i18n, internationalisation, l10n]
---
La gestion du multilingue (ou __internationalisation__) est un aspect essentiel des applications modernes. Qu’il s’agisse d’une application web, d’un service backend ou d’un produit distribué à l’international, il est important que les messages affichés ou renvoyés soient adaptés à la langue de l’utilisateur.  
Avec [[Il était une fois... Spring Boot|**Spring Boot**]], l’i18n se configure facilement grâce aux fichiers de propriétés et à la classe `MessageSource`.  
Mais l’intérêt ne se limite pas à l’interface utilisateur : on peut également propager ces messages localisés dans la ****couche service****, notamment lors du lancement d’exceptions métiers.

## Internationalisation (i18n) et localisation (l10n)

Avant de plonger dans la technique, clarifions les termes :

- ****Internationalisation (i18n)**** : c’est la capacité d’une application à supporter plusieurs langues et formats sans modification du code.
- ****Localisation (l10n)**** : c’est l’adaptation concrète de l’application à une langue ou une culture donnée (messages traduits, formats de date, devise, etc.).

Spring Boot nous aide à préparer notre application pour l’i18n, et il suffit ensuite de fournir les traductions nécessaires.

## Mise en place de l’i18n dans Spring Boot

La gestion des messages repose sur des fichiers `.properties`. Chaque fichier correspond à une langue donnée.

### Exemple de fichiers de messages

📄 `messages.properties` (par défaut, anglais)

```properties
greeting=Hello
greeting.user=Hello {0}, welcome back!
error.notfound=The requested resource was not found.
```

📄 `messages_fr.properties`

```properties
greeting=Bonjour
greeting.user=Bonjour {0}, ravi de vous revoir !
error.notfound=La ressource demandée est introuvable.
```

> 🔑 Astuce : toujours utiliser l’encodage UTF-8 pour gérer correctement les accents.

Ces fichiers seront placés sous `src/main/resources`.

## Configuration Spring Boot

Par défaut, Spring Boot reconnaît les fichiers `messages.properties`, mais pour une gestion fine, on définit un `MessageSource` .

```java
@Configuration
public class I18nConfig {

    @Bean
    public ResourceBundleMessageSource messageSource() {
        ResourceBundleMessageSource source = new ResourceBundleMessageSource();
        source.setBasename("messages");
        source.setDefaultEncoding("UTF-8");
        source.setUseCodeAsDefaultMessage(true);
        return source;
    }
}
```

## Définir une exception personnalisée

Pour relier les messages d’erreur aux fichiers de traduction, il est judicieux de créer une exception applicative contenant une ****clé de message**** et éventuellement des arguments :

```java
public abstract class ResourceNotFoundException extends RuntimeException {

    private final String messageKey;
    private final Object[] args;

    public ResourceNotFoundException(String messageKey, Object... args) {
        super(messageKey);
        this.messageKey = messageKey;
        this.args = args;
    }

    public String getMessageKey() {
        return messageKey;
    }

    public Object[] getArgs() {
        return args;
    }
}

public class UserNotFoundException extends ResourceNotFoundException{
    public UserNotFoundException(String messageKey, Object... args) {
        super(messageKey, args);
    }
}
```

Ainsi, au lieu de coder en dur un texte dans l’exception, on transmet une clé (`user.not.found`) qui sera résolue plus tard en fonction de la langue de l’utilisateur.

## Gérer les exceptions globalement

Spring met à disposition `@ControllerAdvice` pour [[Comment bien gérer ses exceptions dans Spring Boot|centraliser la gestion des erreurs]].  
Voici un exemple concret de handler utilisant le ****MessageSource**** pour traduire les messages :

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger LOG = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private final MessageSource messageSource;

    public GlobalExceptionHandler(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> resourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        Locale locale = request.getLocale();
        String message = messageSource.getMessage(ex.getMessageKey(), ex.getArgs(), locale);
        return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> globalExceptionHandler(Exception ex, WebRequest request) {
        return new ResponseEntity<>("An error occurred: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

Ici, deux points sont importants :

1. `request.getLocale()` permet de récupérer la locale de l’utilisateur. Celle-ci est fournie par défaut par Spring, en fonction des en-têtes HTTP (`Accept-Language`).
2. `messageSource.getMessage(...)` transforme la clé de l’exception en un texte compréhensible, traduit dans la langue correspondante.

## Exemple d’utilisation dans la couche service

Supposons que l’on cherche un utilisateur par son identifiant dans un service :

```java
public User getUserById(Long id) {
    return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("user.not.found", id));
}
```

Si l’utilisateur n’existe pas, une exception `UserNotFoundException` sera levée avec la clé de traduction `user.not.found`.  
Le handler global se chargera ensuite de convertir cette clé en message adapté.

## Résultat attendu

En fonction de la locale envoyée par le client, la réponse renvoyée ne sera pas la même :

- Requête avec en-tête `Accept-Language: fr`

```text
Utilisateur non trouvé avec l'id : 999
```

- Requête avec en-tête `Accept-Language: en`

```text
User not found with id: 999
```

Ainsi, sans modifier le code métier, l’application répond dans la langue de l’utilisateur.

## Mise en place du l10n

Maintenant allons un peu plus loin, on peut également supposer qu'en fonction de la ou se trouve notre utilisateur, certaines données n'ont pas forcément le même format, comme par exemple la date :

- format `dd/MM/yyyy` en France
- format `MM/dd/yyyy` en Angleterre

Mais alors, comment renvoyer le bon format ? Tout simplement en se servant également de nos fichiers `messages_xx.properties`.

Prenons un objet `User` stocké en base qui aurait une champs `lastLoginDate` de type `LocalDateTime`.  
Pour éviter les quiproquo à la lecture de cette dernière, je devrais la transmettre au format attendu par mon utilisateur, pour ce faire nous allons ajouter une nouvelle ligne dans nos fichier :

```properties
# dans messages_en.properties
date.format=MM/dd/yyyy HH:mm:ss
# dans messages_fr.properties
date.format=dd/MM/yyyy HH:mm:ss
```

Nous allons aussi modifier notre service précédent, pour qu'il ne retourne plus directement l'objet présent en base, mais un objet de transfert (DTO), qui lui aura la date au bon format.

```java
public class UserDto {

    private Long id;
    private String username;
    private String status;
    private String lastLoginDate;

    //Getter et Setter
  }
```

Et pour transformer notre `User` en `UserDto` [[MapStruct - Dites adieu au code répétitif et boostez vos mappages Java !|nous utiliserons un mapper]] :

```java
@Component
public class UserMapper {

    private final MessageSource messageSource;

    public UserMapper(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    public UserDto toDto(User user, Locale locale) {
        if (user == null) {
            return null;
        }

        String pattern = messageSource.getMessage("date.format", null, "dd/MM/yyyy HH:mm:ss", locale);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
        String formattedDate = user.getLastLoginDate() != null ? user.getLastLoginDate().format(formatter) : "";

        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getStatus(),
                formattedDate
        );
    }
}
```

Nous retrouvons ici le même fonctionnement que pour notre controller advice, qui nous permet de récupérer le format de date directement depuis le bon fichier.

Donc en fonction de la valeur de mon header, mon format sera différent

- Requête avec en-tête `Accept-Language: fr`

```json
{
    "id": 5,
    "username": "eve",
    "status": "active",
    "lastLoginDate": "25/02/2024 20:15:00"
}
```

- Requête avec en-tête `Accept-Language: en`

```json
{
    "id": 5,
    "username": "eve",
    "status": "active",
    "lastLoginDate": "02/25/2024 20:15:00"
}
```

## Conclusion

La mise en place de l’internationalisation et de la localisation dans une application Spring Boot permet de répondre aux besoins d’utilisateurs répartis dans différentes régions et parlant différentes langues.  
Grâce à l’utilisation des fichiers de messages, du `MessageSource` et d’exceptions ou DTO adaptés, il est possible de centraliser et de standardiser la gestion des textes et des formats de données.

Cette approche offre une grande flexibilité : le code métier reste indépendant de la langue ou du format, et les évolutions (ajout de nouvelles langues, adaptation des formats) peuvent se faire sans modification du cœur de l’application.

En résumé, l’i18n et le l10n ne se limitent pas à l’interface utilisateur : ils constituent un socle solide pour construire des applications robustes et réellement globales.
