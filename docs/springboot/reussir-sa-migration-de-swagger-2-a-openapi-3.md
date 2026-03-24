---
layout: "default"
title: "Réussir sa migration de Swagger 2 à OpenApi 3"
permalink: "/springboot/reussir-sa-migration-de-swagger-2-a-openapi-3/"
tags: [back, java, spring-boot, tutoriel]
source: "sfeir.dev"
source_url: "https://www.sfeir.dev/back/migrer-de-swagger-2-a-openapi-3/"
banner: "https://www.sfeir.dev/content/images/2025/09/20250919_1539_Pixelated-OpenAPI-Migration_simple_compose_01k5h32dc5fxcbsek16mh6r0gb.png"
published_at: "2023-12-11"
sfeir_slug: "migrer-de-swagger-2-a-openapi-3"
date: "2023-12-11"
---
Un grand nombre d’API sont documentées en utilisant [Swagger](https://swagger.io/?ref=sfeir.dev) et c’est une bonne chose qu'elles le soient, pour nous autres développeurs, afin de comprendre comment elles fonctionnent et comment les appeler.  
Mais beaucoup de ces API sont encore documentées en utilisant Swagger 2, maintenant que [OpenApi](https://swagger.io/specification/?ref=sfeir.dev) est sorti (depuis 2017, la version actuelle est la [**3.1**](https://spec.openapis.org/oas/latest.html?ref=sfeir.dev#version-3-1-0) et est disponible depuis le 15/02/2021) certains projets n’ont pas mis à jour leurs outils de documentation. Dans cet article, je vais essayer de vous aider à réaliser cette mise à jour.

## Un peu de contexte

### Swagger vs OpenAPI

Pour faciliter la compréhension, il n'y a pas vraiment de 'versus' entre ces deux technologies, car OpenAPI est une spécification, tandis que Swagger est une suite d'outils qui implémentent et utilisent cette spécification.

La spécification OpenAPI est développée par l'initiative OpenAPI, regroupant plusieurs organisations de divers secteurs technologiques, telles que Microsoft, Google, IBM, et CapitalOne. Smartbear Software, créateur des outils Swagger, fait également partie de cette initiative, contribuant au développement de la spécification.

Swagger est associé à certains des outils les plus connus et utilisés pour implémenter la spécification OpenAPI, parmi lesquels :

[**Swagger Editor**](https://swagger.io/swagger-editor/?ref=sfeir.dev) **:** C'est un éditeur en ligne qui permet aux développeurs de concevoir des fichiers de spécification Swagger au format YAML ou JSON. Ces fichiers décrivent la structure de l'API, y compris les points de terminaison, les opérations disponibles, les modèles de données, etc.

1. [**Swagger UI**](https://swagger.io/swagger-ui/?ref=sfeir.dev) **:** Une fois que vous avez créé une spécification Swagger, vous pouvez utiliser Swagger UI pour générer une documentation interactive basée sur cette spécification. Cela donne aux développeurs et aux utilisateurs une interface web conviviale pour explorer et tester l'API.
2. [**Swagger Codegen**](https://swagger.io/swagger-codegen/?ref=sfeir.dev) **:** Cet outil permet de générer automatiquement du code client dans plusieurs langages de programmation à partir de la spécification Swagger. Cela facilite l'intégration de l'API dans différentes applications.
3. [**Swagger Hub**](https://swaggerhub.com/?_ga=2.131692303.1671015228.1700828351-1388437802.1700828349&ref=sfeir.dev) **:** C'est une plateforme en ligne qui permet de créer, héberger et partager des spécifications Swagger. Elle offre des fonctionnalités collaboratives pour travailler en équipe sur le développement d'API.

Étant donné que l'équipe à l'origine de la spécification Swagger originale a développé les outils Swagger, ils sont souvent considérés comme étant synonymes de cette spécification. Cependant, il est important de noter que d'autres outils sont également disponibles pour mettre en œuvre la spécification OpenAPI. Une diversité de solutions, couvrant la conception, la documentation, les tests, la gestion et la surveillance d'API, prend en charge la version 2.0 de la spécification et travaille activement à intégrer le support de la version 3.0.

---

## Avant de commencer

Pour suivre ce tutoriel, vous aurez besoin d’une API REST documenté à l'aide de Swagger 2, si vous n'en avez pas sous la main vous pouvez :

- Suivre ce [premier tutoriel](https://www.sfeir.dev/back/creer-son-projet-spring-boot-de-zero/) afin d'en créer une rapidement
- La documenter en utilisant swagger 2

---

## Étape 1 : Se débarrasser des dépendances de SpringFox

En toute logique quand vous avez documenté votre API avec Swagger 2, vous avez utilisé les dépendances springfox afin de :

- Générer la spécification à l'url suivante [http://localhost:8080/v2/api-docs](http://localhost:8080/v2/api-docs?ref=sfeir.dev)
- Créer l'interface à l'url suivante [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html?ref=sfeir.dev)
- Valider les données en entrée de votre API

```xml
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>X.X.X</version>
</dependency>
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger-ui</artifactId>
    <version>X.X.X</version>
</dependency>
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-bean-validators</artifactId>
    <version>X.X.X</version>
</dependency>
```

Une fois ces dépendances retirées de votre fichier pom.xml, vous pouvez les remplacer par celle-ci :

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.2.0</version>
</dependency>
```

Cette unique dépendance remplace les trois que nous avons supprimées, permettant de :

- Générer la spécification à l'url suivante [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs?ref=sfeir.dev)
- Créer l'interface à l'URL [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html?ref=sfeir.dev)
- Valider les données en entrée de votre API

[![OpenAPI JSON file](https://www.sfeir.dev/content/images/2023/11/image-8.png)](https://www.sfeir.dev/content/images/2023/11/image-8.png)

OpenAPI JSON file

- L'interface à l'url suivante [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html?ref=sfeir.dev)

[![Swagger IHM](https://www.sfeir.dev/content/images/2023/11/image-9.png)](https://www.sfeir.dev/content/images/2023/11/image-9.png)

Swagger IHM

- Valider les données en entrée de votre API

Si vous partez d'un projet existant, vous trouverez probablement des anciennes [annotations](/springboot/comprendre-les-annotations-dans-spring-boot-guide-et-exemples/) Swagger 2 et une configuration Swagger désormais obsolètes, ce qui peut causer des problèmes de compilation. Ne vous inquiétez pas, nous allons corriger cela.

## Etape 2 : Corriger la classe de configuration

Avec Swagger 2, vous aviez peut-être une classe de configuration similaire à celle-ci :

```java
@Configuration
@EnableSwagger2
public class SwaggerConfig {

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.any())
                .paths(path())
                .build()
                .apiInfo(apiInfo())
                .useDefaultResponseMessages(false);
    }

    private Predicate<String> path() {
        return Predicates.not(PathSelectors.regex("/error"));
    }

    private ApiInfo apiInfo() {
        return new ApiInfo(
                "API Test",
                "Test API for this article",
                "1.0.O",
                "",
                new Contact("Erwan Le Tutour", "https://github.com/ErwanLT", "letutour.e@sfeir.com"),
                "MIT License",
                "https://opensource.org/licenses/mit-license.php",
                Collections.emptyList());
    }
}
```

Maintenant, elle ressemblera davantage à ceci :

```java
@Configuration
public class OpenApiConfiguration {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI().info(apiInfo());
    }

    private Info apiInfo() {
        return new Info()
                .title("API Test")
                .description("Test API for this article")
                .version("2.0")
                .contact(apiContact())
                .license(apiLicence());
    }

    private License apiLicence() {
        return new License()
                .name("MIT Licence")
                .url("https://opensource.org/licenses/mit-license.php");
    }

    private Contact apiContact() {
        return new Contact()
                .name("Erwan LE TUTOUR")
                .email("letutour.e@sfeir.com")
                .url("https://github.com/ErwanLT");
    }
}
```

Le changement majeur réside dans la syntaxe, passant d'un constructeur à plusieurs paramètres compliqués à une syntaxe plus proche du [design pattern builder](https://www.sfeir.dev/back/les-designs-patterns-de-creation-builder/).

La configuration effectué dans cette étape se traduira par ce résultat dans l'ihm swagger

[![API informations](https://www.sfeir.dev/content/images/2023/11/image-10.png)](https://www.sfeir.dev/content/images/2023/11/image-10.png)

API informations

## Etape 3 : Corriger les annotations des controllers

Prenons un exemple d'API très simpliste, un Hello World en GET

## Correction controller

### L'API

#### Avec Swagger 2

```java
@RestController
@Api(value = "Hello API", description = "Service to say hello")
public class HelloController {
    ...
}
```

L'annotation **@Api** est utilisée pour définir les informations de base sur une classe controller qui expose des services via une API REST. Elle permet de documenter des informations générales concernant l'API.

#### Avec OpenApi

```java
@RestController
@Tag(name = "Hello Service", description = "Service to say hello")
public class HelloController {
    ...
}
```

La modification que l'on peut observer en passant de Swagger 2 à OpenApi est la suivante :

- `@Api(value = "Hello API", description = "Service to say hello")` → `@Tag(name = "Hello Service", description = "Service to say hello")`

Ce qui se traduira dans IHM par la situation suivante :  
![Capture d’écran 2023-11-28 à 18.23.49.png](https://www.sfeir.dev/content/images/2023/11/Capture-d-e-cran-2023-11-28-a--18.23.49.png)

### Les endpoints

#### Avec Swagger 2

```java
@ApiOperation(value = "Say Hello to User",
            produces = "application/json")
@ApiResponses(value = {
    @ApiResponse(code = 200, message = "Hello", response = String.class),
    @ApiResponse(code = 500, message = "An error occured")
})
@GetMapping("/{name})
public ResponseEntity<String> hello(@ApiParam(name = "the name", example = "Erwan",required = true) @PathVariable("name") String name) {
    return ResponseEntity.ok("Hello " + name);
}
```

On retrouve ici 3 annotations :

- **@ApiOperation** : Décrit une opération ou typiquement une méthode HTTP contre un chemin spécifique.
- **@ApiResponses** : Un wrapper qui contient une liste de plusieurs objets **@ApiResponse**. Ici, j’ai 2 **@ApiResponse** pour décrire mon code de retour d’état HTTP 200 et 500.
- **@ApiParam** : Permet de spécifier le nom, le type, la description (valeur) et la valeur d’exemple du paramètre.

#### Avec OpenApi

```java
@Operation(summary = "Say hello to User", description = "Hello")
@ApiResponses({
        @ApiResponse(responseCode = "200", description = "Hello"),
        @ApiResponse(responseCode = "500", description = "error")
})
@GetMapping("/{name}")
public ResponseEntity<String> hello(@Parameter(name = "name", description = "user name", example = "Erwan", required = true) @PathVariable("name") String name) {
    return ResponseEntity.ok("Hello " + name);
}
```

Les modifications que l'on peut observer en passant de Swagger 2 à OpenApi sont les suivantes :

- `@ApiOperation(value = "Say Hello to User", notes = "hello")` → `@Operation(summary = "Say Hello to User", description = "hello")`
    
- `@ApiParam` → `@Parameter`
    
- `@ApiResponse(code = 200, message = "Hello")` → `@ApiResponse(responseCode = "200", description = "Hello")`
    

Ce qui se traduira dans IHM par la situation suivante :

[![](https://www.sfeir.dev/content/images/2023/11/image-11.png)](https://www.sfeir.dev/content/images/2023/11/image-11.png)

OpenApi UI

Voyons un peu ce que cela engendre avec une méthode retournant un objet un peu plus complexe qu'une chaine de caractère

```java
@GetMapping("/{id}")
public ResponseEntity<Sfeirien> getSfeirienById(@PathVariable("id") @Parameter Long id) {
    return ResponseEntity.ok(sfeirService.getSfeirienById(id));
}
```

Pour l'instant au niveau de ma méthode pas plus de documentation que ça, ce qui donne le résultat suivant au niveau de l'IHM :

[![](https://www.sfeir.dev/content/images/2023/11/Capture-d-e-cran-2023-11-29-a--18.30.29.png)](https://www.sfeir.dev/content/images/2023/11/Capture-d-e-cran-2023-11-29-a--18.30.29.png)

Rien de bien folichon, mais on peut déjà voir que la structure de l'objet **_Sfeirien_** retourné en cas de succès est bien récupéré depuis le code.

Maintenant, documentons un peu mes différents cas de retour possible 200 / 404 /500 et voyons ce qui va se passer

```java
@Operation(summary = "Recherche Sfeirien", description = "Recherche d'un sfeirien par son id")
@ApiResponses({
        @ApiResponse(responseCode = "200", description = "Sfeirien trouvé avec succès"),
        @ApiResponse(responseCode = "404", description = "Aucun sfeirien avec cet id"),
        @ApiResponse(responseCode = "500", description = "Erreur lors du traitement")
})
@GetMapping("/{id}")
public ResponseEntity<Sfeirien> getSfeirienById(@PathVariable("id") @Parameter Long id) {
    return ResponseEntity.ok(sfeirService.getSfeirienById(id));
}
```

[![](https://www.sfeir.dev/content/images/2023/11/image-13.png)](https://www.sfeir.dev/content/images/2023/11/image-13.png)

Aie, comme on peut le constater, par défaut quelque soit le code retour, il pense que la réponse contiendra un objet **_Sfeirien_** et que le type de retour sera **_* / *_**, du coup comment lui indiquer le bon retour ?  
Et bien on va rajouter d'autres information au niveau des annotations du endpoint

```java
@Operation(summary = "Recherche Sfeirien", description = "Recherche d'un sfeirien par son id")
@ApiResponses({
        @ApiResponse(responseCode = "200", description = "Sfeirien trouvé avec succès",
                content = {@Content(mediaType = "application/json", schema = @Schema(implementation = Sfeirien.class))}),
        @ApiResponse(responseCode = "404", description = "Aucun sfeirien avec cet id",
                content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))}),
        @ApiResponse(responseCode = "500", description = "Erreur lors du traitement",
                content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))})
})
@GetMapping("/{id}")
public ResponseEntity<Sfeirien> getSfeirienById(@PathVariable("id") @Parameter Long id) {
    return ResponseEntity.ok(sfeirService.getSfeirienById(id));
}
```

Alors, je le concède, c'est verbeux voir très verbeux, mais ça permet de préciser quel sera l'objet retourné par chaque code retour, et quel sera la type de la réponse

[![](https://www.sfeir.dev/content/images/2023/11/image-14.png)](https://www.sfeir.dev/content/images/2023/11/image-14.png)

## Etape 4 : Corriger les annotations dans les objets

### Avec Swagger 2

Prenons comme exemple le code ma classe _Sfeirien_

```java
@ApiModel
@Getter
@Setter
public class Sfeirien {

    @ApiModelProperty(value = "the id",
            name = "ID",
            dataType = "Long",
            required = true,
            position = 0)
    private Long id;

    @NotNull
    @ApiModelProperty( value = "The name",
            name = "name",
            dataType = "String",
            required = true,
            position = 1
    )
    private String name;

    @NotNull
    @ApiModelProperty( value = "The first name",
            name = "firstName",
            dataType = "String",
            required = true,
            position = 2
    )
    private String firstName;

    @ApiModelProperty( value = "The age",
            name = "age",
            dataType = "Integer",
            required = false,
            position = 3
    )
    private int age;

    @Enumerated
    @ApiModelProperty( value = "The coloration",
            name = "coloration",
            dataType = "String",
            required = true,
            position = 4,
            allowableValues = "BACKEND, FRONTEND, CLOUD, MOBILE"
    )
    private Coloration coloration;
    
}
```

Comme vous pouvez le voir, ma classe est annotée avec le **@ApiModel** et ses propriétés avec le **@ApiModelProperty**.  
Le **@ApiModelProperty** nous permet d’ajouter des définitions telles que la description (valeur), le nom, le type de données, des exemples de valeurs et des valeurs autorisées.  
La propriété position permet de définir l'ordre d'affichage du champs dans l'IHM, par défaut les champs seront affichés par ordre alphabétique.

### Avec OpenApi

Avec OpenAPI, si vous examinez attentivement mon annotation `@ApiResponse` avec le code d’état 200 de l'étape précédente, vous verrez que la réponse est maintenant annotée avec `@Content`. Nous avons spécifié dans le champ 'schema' la classe à retourner, comme ceci :

```
@Schema(implementation = MyClass.class)
```

Grâce à cette annotation, OpenAPI sait quelle classe charger. Par conséquent, il n’est pas nécessaire d’annoter ma classe avec `@ApiModel`, mais je peux toujours documenter mes champs individuellement.

```java
public class Sfeirien {

    @Schema(description = "The id",
            name = "id",
            required = true)
    private Long id;

    @NotNull
    @Schema(description = "the name",
            name = "name",
            required = true,
            pattern = "^[a-zA-Z ,.'-]+$")
    private String name;

    @NotNull
    @Schema(description = "the firstname",
            name = "firstName",
            required = true,
            pattern = "^[a-zA-Z ,.'-]+$")
    private String firstName;

    @Schema(description = "The age",
            name = "age",
            example = "32")
    private int age;

    @Enumerated
    @Schema(description = "the coloration",
            name = "coloration",
            type = "String",
            allowableValues = "BACKEND, FRONTEND, CLOUD, MOBILE"
    )
    private Coloration coloration;
}
```

Dans l'IHM le rendu sera le suivant :

[![](https://www.sfeir.dev/content/images/2023/12/image.png)](https://www.sfeir.dev/content/images/2023/12/image.png)

Ceux qui auront été attentifs remarqueront que la propriété **position** n'est plus utilisée, en effet maintenant les champs sont affichés en fonction de leurs ordre dans la classe.

---

Plus haut dans cet article je vous ai parlé de [**Swagger Codegen**](https://swagger.io/swagger-codegen/?ref=sfeir.dev), nous verrons prochainement comment l'implémenter dans un programme java afin de générer rapidement et efficacement des clients pour appeler des API tierces à partir de leur spécification.
