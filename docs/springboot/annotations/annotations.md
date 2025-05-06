---
layout: default
title: Annotations
permalink: /springboot/annotations/
tags: [spring-boot, java, tutoriel, annotations]
---

# Comprendre les annotations dans Spring Boot : guide et exemples

[Spring Boot, en tant que framework basé sur Spring](https://www.sfeir.dev/back/back-spring-boot/), repose lourdement sur les annotations pour [réduire la complexité de la configuration](https://www.sfeir.dev/back/back-pourquoi-utiliser-spring-boot/) et simplifier le développement d'applications [Java](https://www.sfeir.dev/back/le-langage-java-definition/).  
Les annotations permettent de déclarer des comportements, de configurer des composants et de mapper les requêtes HTTP sans besoin d’un lourd fichier de configuration XML.  
Cet article explore les principales annotations de Spring Boot, pourquoi les utiliser, et comment elles facilitent le développement d'applications robustes.

## Pourquoi utiliser les annotations dans Spring Boot ?

### Pourquoi utiliser des annotations ?

Les annotations permettent de simplifier le code en le rendant plus expressif et moins verbeux. Elles facilitent :

1. **La configuration automatique** : Grâce aux annotations, il n'est plus nécessaire de définir chaque paramètre de configuration manuellement.
2. **La lisibilité** : Elles rendent le code plus facile à lire et à maintenir, en indiquant clairement l’intention des développeurs.
3. **La réduction du couplage** : En favorisant une approche déclarative, les annotations permettent de réduire le couplage entre les composants.
4. **La productivité** : Avec des annotations bien conçues, le développeur peut se concentrer sur l’implémentation des fonctionnalités plutôt que sur la configuration de l’infrastructure.

Voyons maintenant comment ces annotations sont organisées et utilisées.

## Annotations de configuration

Ces annotations définissent la manière dont l'application Spring Boot est configurée et s'exécute.

### @SpringBootApplication

L'annotation `@SpringBootApplication` est un raccourci pour combiner trois annotations :

- `@Configuration` : indique que la classe contient des beans configurés via des méthodes.
- `@EnableAutoConfiguration` : demande à Spring Boot de configurer automatiquement l'application en fonction des dépendances trouvées.
- `@ComponentScan` : indique à Spring de scanner les composants (classes annotées avec `@Component`, `@Service`, `@Repository`, etc.).

```java
@SpringBootApplication
public class DemoApplication {
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}
}
```

### @Configuration

Indique qu'une classe définit un ou plusieurs beans Spring.

```java
@Configuration
public class MyConfig {
    @Bean
    public MyService myService() {
        return new MyServiceImpl();
    }
}
```

## @EnableAutoConfiguration

L'annotation `@EnableAutoConfiguration` active la configuration automatique de Spring Boot, qui analyse les dépendances de votre projet et configure automatiquement plus de 200 composants courants (comme bases de données, sécurité, serveurs web).  
Cela vous permet de démarrer rapidement en utilisant des valeurs par défaut adaptées. Vous pouvez personnaliser ces configurations si nécessaire, mais Spring Boot vous fait gagner du temps en fournissant des choix sensés pour la plupart des scénarios.

```java
@RestController
@EnableAutoConfiguration
public class MyApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }

    @GetMapping("/")
    public String home() {
        return "Hello, Spring Boot!";
    }
}
```

## Annotations de définition de composants

Les annotations de définition de composants sont utilisées pour informer Spring Boot des classes qui doivent être gérées par le conteneur Spring.  
Elles permettent à Spring d'initialiser et d’injecter automatiquement des instances de ces classes là où elles sont nécessaires, favorisant ainsi le découplage entre les différentes parties de l’application.

### @Component

`@Component` est l’annotation générique qui permet de marquer une classe comme un bean Spring. Cette annotation indique au conteneur Spring qu’il doit créer une instance de la classe, la gérer et l'injecter automatiquement là où elle est nécessaire.

```java
@Component
public class EmailService {
    public void sendEmail(String to, String message) {
        // Logique d'envoi d'email
    }
}
```

Dans cet exemple, `EmailService` est un composant Spring, et le framework gérera son cycle de vie, notamment son instanciation.

```java
@Autowired
private EmailService emailService;
```

Cette injection est possible grâce à l'annotation `@Autowired` sur un autre composant ou service.

### @Service

`@Service` est une spécialisation de `@Component` destinée aux classes qui contiennent la logique métier. Utiliser cette annotation ne change pas le comportement par rapport à `@Component`, mais elle clarifie que la classe correspondante fait partie de la couche service de l’application.

```java
@Service
public class UserService {
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
```

Le fait d’utiliser `@Service` permet de clarifier l’intention : cette classe contient la logique métier de l'application.

### @Repository

`@Repository` est une autre spécialisation de `@Component`, utilisée pour les classes qui interagissent avec la base de données. Elle est souvent utilisée avec des interfaces qui étendent `JpaRepository` ou `CrudRepository`.

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByAge(int age);
}
```

L'annotation `@Repository` permet également à Spring de gérer les exceptions liées aux accès à la base de données en les encapsulant dans des exceptions Spring non vérifiées.

### @Controller et @RestController

#### @Controller

Spécialisation de `@Component`, cette annotation est utilisée pour définir des classes qui traitent les requêtes HTTP dans une application Web basée sur Spring MVC. Elle est principalement utilisée pour retourner des vues comme des pages HTML.

```java
@Controller
public class WebController {
    
    @GetMapping("/home")
    public String homePage() {
        return "home";  // Renvoie le nom de la vue "home.html"
    }
}
```

#### @RestController

Combine `@Controller` et `@ResponseBody`. Elle est utilisée dans les applications REST pour renvoyer directement des objets (comme des entités ou des DTOs) qui seront automatiquement sérialisés en JSON ou XML.

```java
@RestController
public class ApiController {

    @GetMapping("/api/users")
    public List<User> getAllUsers() {
        return userService.findAllUsers();
    }
}
```

## Annotations de mapping de requêtes

Les annotations de **mapping de requêtes** permettent de définir comment les requêtes HTTP sont traitées par les méthodes des contrôleurs. Elles simplifient la gestion des interactions entre client et serveur en associant des chemins d’URL et des méthodes HTTP (GET, POST, PUT, DELETE) à des méthodes de contrôleur spécifiques.

#### @RequestMapping

L'annotation `@RequestMapping` est la plus polyvalente des annotations de mapping. Elle permet de mapper une URL à une méthode de contrôleur, et de spécifier la méthode HTTP, les paramètres de requête, les en-têtes, et bien plus encore.

```java
@RequestMapping("/users")
public class UserController {

    @RequestMapping("/list")
    public List<User> getUsers() {
        return userService.findAllUsers();
    }
}
```

Dans cet exemple, toute requête vers `/users/list` sera mappée à la méthode `getUsers()`.

```java
@RequestMapping(value = "/users", method = RequestMethod.POST)
public User createUser(@RequestBody User user) {
    return userService.save(user);
}
```

Ici, une requête POST vers `/users` sera traitée par `createUser()`, qui prend un corps de requête JSON et crée un utilisateur.

#### @GetMapping, @PostMapping, @PutMapping, @DeleteMapping

Ces annotations sont des raccourcis pour `@RequestMapping` et sont utilisées pour spécifier directement les méthodes HTTP, améliorant la lisibilité du code.

- **@GetMapping** est utilisé pour gérer les requêtes HTTP **GET**.
- **@PostMapping** est utilisé pour gérer les requêtes HTTP **POST**.
- **@PutMapping** est utilisé pour gérer les requêtes HTTP **PUT**.
- **@DeleteMapping** est utilisé pour les requêtes HTTP **DELETE**.

```java
@GetMapping("/users/{id}")
public User getUserById(@PathVariable Long id) {
    return userService.getUserById(id);
}

@PostMapping("/users")
public User createUser(@RequestBody User user) {
    return userService.save(user);
}

@PutMapping("/users/{id}")
public User updateUser(@PathVariable Long id, @RequestBody User user) {
    return userService.update(id, user);
}

@DeleteMapping("/users/{id}")
public void deleteUser(@PathVariable Long id) {
    userService.delete(id);
}
```

#### @PathVariable, @RequestParam et @RequestBody

Ces annotations permettent de capturer des valeurs de la requête HTTP.

- **@PathVariable** : capture les variables de chemin directement depuis l’URL.
- **@RequestParam** : permet de capturer des paramètres de requête depuis l'URL (souvent après le `?`).
- **@RequestBody** : utilisé pour mapper le corps d’une requête HTTP dans un objet Java. Cette annotation est particulièrement utile pour les requêtes POST et PUT, où le corps de la requête contient des données JSON ou XML que vous souhaitez transformer en un objet Java.

```java
@GetMapping("/users/{id}")
public User getUserById(@PathVariable("id") Long id) {
    return userService.getUserById(id);
}

@GetMapping("/users")
public List<User> getUsersByAge(@RequestParam("age") int age) {
    return userService.getUsersByAge(age);
}

@PostMapping("/users")
public User createUser(@RequestBody User user) {
    return userService.save(user);
}
```

## Annotations de tests

Spring Boot offre un ensemble complet d'annotations pour [faciliter les tests](https://www.sfeir.dev/back/un-test-pour-les-gouverner-tous/). Ces annotations permettent de configurer facilement des environnements de test, de simuler des comportements, et de vérifier que les composants fonctionnent comme prévu.  
Voici les principales annotations utilisées pour les tests dans Spring Boot :

### @SpringBootTest

L'annotation `@SpringBootTest` est utilisée pour écrire des **tests d'intégration**. Elle permet de charger le **contexte d'application complet** de Spring, incluant toutes les configurations et les beans nécessaires pour exécuter les tests. Cela permet de tester l'application dans un environnement proche de celui de la production.

```java
@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    public void testFindAllUsers() {
        List<User> users = userService.findAllUsers();
        assertNotNull(users);
    }
}
```

Dans cet exemple, `@SpringBootTest` charge l'ensemble du contexte Spring, permettant ainsi de tester les services dans un environnement complet.

Il est possible de configurer `@SpringBootTest` pour ne charger que certaines parties du contexte ou utiliser un **port aléatoire** pour simuler des tests sur le web.

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class WebLayerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void testWebEndpoint() {
        String body = this.restTemplate.getForObject("/api/users", String.class);
        assertTrue(body.contains("user"));
    }
}
```

L'option `WebEnvironment.RANDOM_PORT` permet de démarrer un serveur Web sur un port aléatoire, ce qui est utile pour tester des contrôleurs REST dans un environnement d'intégration réel.

### @MockBean

`@MockBean` est utilisé pour créer des **mocks** de vos beans Spring, principalement lors des tests d'intégration. Cela permet de simuler le comportement de certains services ou composants pour isoler le test des dépendances externes.

```java
@SpringBootTest
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    public void testGetUser() throws Exception {
        User mockUser = new User("John", "Doe");
        when(userService.getUserById(1L)).thenReturn(mockUser);

        mockMvc.perform(get("/users/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.firstName").value("John"))
            .andExpect(jsonPath("$.lastName").value("Doe"));
    }
}
```

Dans cet exemple, `@MockBean` crée un mock de `UserService`, permettant de contrôler son comportement pendant le test. Cela est utile pour simuler différentes situations (retourner des résultats, générer des erreurs, etc.).

### @Test

`@Test` est l'annotation la plus basique de **JUnit**. Elle est utilisée pour indiquer qu'une méthode est un **cas de test**. Elle peut être combinée avec d'autres annotations comme `@SpringBootTest` pour tester des composants Spring. Cette annotation permet aussi d'ajouter des assertions pour valider le comportement du code.

```java
@Test
public void testUserCreation() {
    User user = new User("Jane", "Doe");
    assertNotNull(user);
    assertEquals("Jane", user.getFirstName());
}
```

### @BeforeEach et @AfterEach

Ces annotations, venant de JUnit 5, permettent de spécifier des **méthodes à exécuter avant et après chaque test**. Elles sont utiles pour configurer un état initial avant un test (`@BeforeEach`) ou pour effectuer des actions de nettoyage après un test (`@AfterEach`).

```java
@BeforeEach
public void setup() {
    userService.deleteAllUsers();
}

@AfterEach
public void cleanup() {
    userService.deleteAllUsers();
}
```

## Conclusion

Les annotations Spring Boot simplifient grandement le développement d'applications en masquant la complexité de la configuration manuelle.  
Elles permettent d’écrire des applications plus rapidement, de manière plus lisible et maintenable.  
Qu'il s'agisse de gérer la configuration automatique, l'injection de dépendances ou le routage des requêtes HTTP, les annotations Spring Boot sont des outils indispensables pour les développeurs [Java](https://www.sfeir.dev/back/le-langage-java-definition/) modernes.